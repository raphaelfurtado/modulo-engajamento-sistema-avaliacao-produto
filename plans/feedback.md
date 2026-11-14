# Plano: Feedback (Avaliações de produtos)

> Spec: [specs/feedback.md](../specs/feedback.md) · Status: **decisões definidas, aguardando liberação para executar**
> Orquestração e decisões: [_orquestracao.md](./_orquestracao.md) (D1, D7, D9)

## Objetivo

A página `/products/[id]` mostra o produto e todas as avaliações para qualquer pessoa. Quem está logado vê um formulário para dar **nota de 0 a 5** (D1) e um comentário. Quem não está logado vê um bloco pedindo para entrar.

## Dependências (resolvidas pela Fase 0)
- Sessão: `getCurrentUser()` de `src/server/auth/session.ts` (implementado em paralelo pelo agente de Sign-in; o contrato é fixo).
- Tabela `products` e seus tipos (migration da Home, aplicada antes desta).
- Componente `Grade` / `formatGrade()` compartilhado.

## Banco de dados

Migration `supabase/migrations/20261114020000_create_products_feedbacks.sql`:

```sql
create table public.products_feedbacks (
  id          text primary key,                                        -- nanoid
  product_id  text not null references public.products(id) on delete cascade,
  created_by  text not null references public.accounts(id) on delete cascade,
  score       integer not null check (score between 0 and 5),          -- D1
  comment     text not null check (char_length(comment) between 10 and 2000),
  created_at  timestamptz not null default now(),
  constraint products_feedbacks_one_per_account unique (product_id, created_by)  -- D7
);
create index products_feedbacks_product_created_idx
  on public.products_feedbacks (product_id, created_at desc);
alter table public.products_feedbacks enable row level security;
```

Sem trigger: `products.score` é boolean (D2). A nota média e o número de avaliações são calculados na página do produto, a partir das avaliações que ela já carrega.

## Back-end

### Schema `src/features/feedbacks/schema.ts`
```ts
createFeedbackSchema = z.object({
  score: z.number().int().min(0, "Escolha uma nota de 0 a 5.").max(5, "Escolha uma nota de 0 a 5."),
  comment: z.string().trim().min(10, "Conte um pouco mais: pelo menos 10 caracteres.").max(2000, "Use no máximo 2.000 caracteres."),
})
```
Tipo `FeedbackItem = { id, score, comment, createdAt, author: { firstName, lastInitial, avatarUrl } }`. O autor aparece como "Ana S."; o e-mail nunca vai para a página pública.

### Serviço `src/server/feedbacks/`
- `getProductWithFeedbacks(id)`: produto + avaliações (mais recentes primeiro) com join em `accounts` só para `first_name`, `last_name` e `id` (para o avatar). Cache com `'use cache'` + `cacheTag(\`product:${id}\`)`.
- `createFeedback({ productId, accountId, score, comment })`: gera `nanoid()` e insere. Mapeia FK de produto inexistente → `ProductNotFoundError`; unique violation → `AlreadyReviewedError`. Depois chama `revalidateTag(\`product:${id}\`)`.

### tRPC `routers/feedbacks.ts`
`create` recebe `{ productId, ...createFeedbackSchema }`. A autenticação é resolvida na rota (lê a sessão) e passada pelo contexto.

### Rota `src/app/api/v1/products/[id]/feedbacks/route.ts`
| Método | Respostas |
|---|---|
| GET | **200** `FeedbackItem[]` (público) · **404** produto inexistente |
| POST | **201** avaliação criada · **400** dados inválidos · **401** sem sessão ("Entre na sua conta para avaliar.") · **404** produto inexistente · **409** "Você já avaliou este produto." |

## Front-end

### Página `src/app/(platform)/products/[id]/page.tsx`
- Server Component. `notFound()` para id inexistente (com `not-found.tsx` simples e link para a home).
- `generateMetadata`: título com o nome do produto.
- Ordem da página, como a spec pede:
  1. **Produto**: imagem grande, nome, descrição, link "Ver na loja" (nova aba, `rel="noopener noreferrer"`), nota média manuscrita (ex.: "4,5", calculada das avaliações) + número de avaliações.
  2. **Avaliações**: todas, mais recentes primeiro. Cada uma com avatar Dicebear, "Ana S.", data relativa em pt-BR (`date-fns`, ex.: "há 3 dias", com a data completa em `<time dateTime>`), nota manuscrita e comentário. Vazio: "Ninguém avaliou este produto ainda. Se você já usou, conte como foi."
  3. **Nova avaliação**: dentro de `<Suspense>` (lê a sessão; com `cacheComponents` isso é obrigatório). O produto e as avaliações aparecem logo; só esse bloco espera a sessão.
     - **Deslogado**: bloco "Entre para avaliar este produto", com botões "Entrar" (`/auth/sign-in?next=/products/<id>`, D9) e "Criar conta".
     - **Logado e já avaliou**: "Você já avaliou este produto" mostrando a própria nota.
     - **Logado**: formulário.

### Formulário `FeedbackForm` (react-hook-form + zod)
- **Seletor de nota 0–5**: uma linha de 6 números como um gabarito de prova, cabendo numa linha só mesmo no celular. Na prática é um radio group nativo (setas do teclado funcionam, leitor de tela anuncia "Nota 4 de 5"), com alvos ≥ 44px. A nota escolhida ganha um **círculo de caneta azul** desenhado, ligando o formulário ao `GradedReviewSample`.
- Comentário: `textarea` com contador "120 / 2.000" e dica do que ajuda ("Há quanto tempo você usa? O que surpreendeu? O que incomodou?").
- Botão "Publicar avaliação"; enquanto envia: desabilitado + spinner.
- Erros: Alert vermelho no topo do formulário + erros de campo vindos da API.
- Sucesso: `router.refresh()` faz a avaliação nova aparecer no topo da lista, o formulário vira o estado "Você já avaliou" e o foco vai para a avaliação publicada.

## Design (seguindo a skill e a identidade Prova)
- **Conceito:** a página do produto é a "folha de correção". O produto em cima, como o enunciado; as avaliações como respostas corrigidas, cada uma com a nota à mão na margem; o formulário no fim, como a folha em branco esperando a sua prova.
- Linhas de Pauta separando avaliações (caderno), não cartões com sombra.
- Coluna de leitura com menos de 80 caracteres por linha nos comentários. No desktop, imagem e informações do produto lado a lado; no mobile, empilhados.
- Caneta vermelha só para erros, caneta azul só para notas, foco e links.

## Arquivos
**Novos:** migration de products_feedbacks, `src/features/feedbacks/{schema.ts,api.ts,use-create-feedback.ts,components/feedback-form.tsx,components/score-picker.tsx,components/feedback-list.tsx,components/feedback-item.tsx,components/sign-in-to-review.tsx}`, `src/server/feedbacks/{get-product.ts,create.ts}`, `src/server/trpc/routers/feedbacks.ts`, `src/app/api/v1/products/[id]/feedbacks/route.ts`, `src/app/(platform)/products/[id]/{page.tsx,not-found.tsx,loading.tsx}`.

## Fora do escopo
Editar ou apagar avaliação, curtir avaliações, denunciar, paginação das avaliações (a spec pede todas), moderação.

## Critérios de aceite (como verifico)
- [ ] Migration aplicada cria a tabela com FKs, checks (nota 0–5) e unique.
- [ ] `/products/[id]` mostra produto + avaliações + bloco de login para quem está deslogado.
- [ ] Logado: formulário com nota 0–5 e comentário validados no cliente.
- [ ] POST: 201 com sessão; 401 sem sessão; 400 inválido; 404 produto inexistente; 409 segunda avaliação.
- [ ] Depois de publicar, a avaliação aparece na lista e a nota média da página do produto é atualizada.
- [ ] Id inexistente mostra a página 404.
- [ ] Lint, typecheck e build sem erros; telas conferidas em mobile e desktop, claro e escuro.
