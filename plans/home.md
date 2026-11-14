# Plano: Home (Listagem de produtos)

> Spec: [specs/home.md](../specs/home.md) · Status: **decisões definidas, aguardando liberação para executar**
> Orquestração e decisões: [_orquestracao.md](./_orquestracao.md) (D2, D3, D4)

## Objetivo

A home (`/`) lista todos os produtos, sem precisar de login, com **scroll infinito**. Cada produto mostra imagem, nome e uma descrição curta; o nome leva para `/products/[id]`. Um endpoint protegido permite cadastrar produtos manualmente.

## Banco de dados

Migration `supabase/migrations/20261114010000_create_products.sql`:

```sql
create table public.products (
  id              text primary key,              -- nanoid gerado na API
  name            text not null,
  description     text,                          -- opcional
  image_url       text not null,                 -- D3: URL externa
  external_link   text not null,
  score           boolean not null default false, -- D2: mantido como na spec, sem uso na UI por enquanto
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index products_created_at_id_idx on public.products (created_at desc, id desc);
-- trigger updated_at reaproveitando public.set_updated_at()
alter table public.products enable row level security; -- só o servidor (secret key) acessa
```

`score` segue a spec (`boolean`). Nenhuma tela usa essa coluna por enquanto, e ela não guarda a nota média.

## Back-end

### Schemas `src/features/products/schema.ts`
- `listProductsSchema`: `cursor?: string`, `limit: 1–48` (padrão 12).
- `createProductSchema`: `name` (1–120), `description?` (até 500), `externalLink` (URL http/https), `imageUrl` (URL http/https).
- Tipo `ProductSummary = { id, name, description, imageUrl }`.

### Serviço `src/server/products/`
- `listProducts({ cursor, limit })`: **paginação por cursor** (keyset) em `(created_at desc, id desc)`. Busca `limit + 1` linhas para saber se há próxima página. O cursor é `created_at|id` em base64url, opaco para o cliente. Paginação por offset repetiria ou pularia itens quando um produto novo entra durante o scroll.
- `createProduct(data)`: gera `nanoid()`, insere e retorna o produto.
- A primeira página é lida por uma função com `'use cache'` + `cacheTag('products')` + `cacheLife('minutes')`. O POST chama `revalidateTag('products')`, então a home abre instantânea e um produto novo aparece logo.

### tRPC `routers/products.ts`
`list` (query) e `create` (mutation). A checagem de admin fica na rota REST.

### Rotas `src/app/api/v1/products/route.ts`
| Método | Respostas |
|---|---|
| GET `?cursor=&limit=` | **200** `{ items: ProductSummary[], nextCursor: string \| null }`. Sem produtos: `{ items: [], nextCursor: null }`. **400** se o cursor ou limit for inválido. |
| POST (D4) | Header `x-admin-key` obrigatório. **201** produto criado · **400** dados inválidos · **401** chave ausente ou errada (comparação em tempo constante). |

A spec diz `POST /products`; uso `/api/v1/products` para seguir o padrão das outras rotas.

### Script de carga
`scripts/seed-products.ts` (rodado com `bun scripts/seed-products.ts`): cadastra cerca de 30 produtos de exemplo via POST, lendo `ADMIN_API_KEY` do ambiente. Serve para testar o scroll infinito. As imagens de exemplo usam um serviço de placeholder; você pode trocar por URLs reais depois.

## Front-end

### Página `src/app/(platform)/page.tsx`
- Server Component: título da página + primeira página de produtos renderizada no servidor (aparece sem esperar JavaScript, boa para SEO e velocidade).
- `ProductFeed` (client): recebe a primeira página como `initialData` de `useInfiniteQuery` (React Query) e busca as próximas em `GET /api/v1/products?cursor=`.
- Um sentinela observado por `IntersectionObserver` (com `rootMargin` de ~600px, para carregar antes de chegar ao fim) chama `fetchNextPage`. Também há um botão "Carregar mais" como alternativa acessível e para teclado.
- Estados:
  - **carregando**: cartões esqueleto no mesmo formato dos reais (não deslocam o layout);
  - **vazio**: "Ainda não há produtos avaliados." com texto curto;
  - **erro ao carregar mais**: mensagem + "Tentar de novo" (os itens já carregados ficam);
  - **fim da lista**: "Você viu todos os produtos."
- Anúncio para leitor de tela (`aria-live="polite"`) quando novos itens chegam.

### Cartão de produto `src/features/products/components/product-card.tsx`
- Imagem com `next/image`, proporção fixa 4:3, `sizes` corretos e `priority` nos primeiros cartões (carregamento rápido acima da dobra).
- Nome como link para `/products/[id]` (a área clicável cobre o cartão; foco visível).
- Descrição limitada a 2 linhas.
- Sem nota no cartão: `products.score` é boolean (D2), e a nota média aparece só na página do produto.

## Design (seguindo a skill e a identidade Prova)
- **Conceito:** a home é uma pilha de "fichas de teste". Cada produto é uma ficha em papel branco sobre o Sulfite, com o nome escrito como o título de uma prova e uma linha de Pauta embaixo.
- A ousadia fica num lugar só: a **foto do produto** em proporção fixa, com bastante respiro. O resto é sóbrio: tipografia Schibsted, sem gradientes, sem sombras pesadas, sem badges.
- Grid mobile-first: 1 coluna no celular, 2 no tablet, 3 no desktop, dentro de `max-w-6xl`.
- Título da página com escala tipográfica real (não um "hero" de marketing). Ex.: "Produtos avaliados por quem usou".
- Animação: só a entrada sutil dos itens novos ao carregar mais, desligada com `prefers-reduced-motion`.

## Arquivos
**Novos:** migration de products, `src/features/products/{schema.ts,api.ts,use-products.ts,components/product-card.tsx,components/product-feed.tsx,components/product-card-skeleton.tsx}`, `src/server/products/{list.ts,create.ts,cursor.ts}`, `src/server/trpc/routers/products.ts`, `src/app/api/v1/products/route.ts`, `scripts/seed-products.ts`.
**Alterados:** `src/app/(platform)/page.tsx` (stub da Fase 0).

## Fora do escopo
Busca, filtros, categorias, ordenação, tela de admin para cadastrar produtos, upload de imagem.

## Critérios de aceite (como verifico)
- [ ] Migration aplicada cria `products` com RLS e índice.
- [ ] GET `/api/v1/products` responde 200 com lista paginada, e `{ items: [], nextCursor: null }` quando vazio.
- [ ] POST com chave válida responde 201; sem chave, 401; dados inválidos, 400.
- [ ] Home lista os produtos com imagem, nome e descrição; o scroll carrega mais páginas sem duplicar itens.
- [ ] Clicar no nome navega para `/products/[id]`.
- [ ] Acessível sem login.
- [ ] Lint, typecheck e build sem erros; telas conferidas em mobile e desktop, claro e escuro.
