# Orquestração: Sign-In + Home + Feedback em paralelo

> Status: **decisões definidas, aguardando liberação para executar**
> Planos: [sign-in.md](./sign-in.md) · [home.md](./home.md) · [feedback.md](./feedback.md)

## Por que existe este arquivo

As três specs não são independentes:

- **Feedback** precisa da **sessão** (sign-in) para saber quem avalia e da tabela **`products`** (home) para a FK `product_id`.
- **Sign-in** pede "layout base + home esqueleto"; **Home** pede "enriquecer a home". Os dois mexeriam em `src/app/page.tsx`.
- Todas mexeriam em `src/server/db/types.ts`, `src/server/trpc/root.ts`, `next.config.ts` e `.env.example`.

Para rodar em paralelo sem um agente sobrescrever o outro, eu (orquestrador) faço uma **Fase 0** curta que congela os contratos compartilhados. Depois cada agente só edita os arquivos que são dele.

## Fases

| Fase | Quem | O quê |
|---|---|---|
| 0. Fundação | Orquestrador | Contratos, stubs, tipos do banco, rotas reservadas (abaixo) |
| 1. Execução | 3 subagentes em paralelo | Cada um implementa seu plano dentro da sua área |
| 2. Integração | Orquestrador | Aplicar migrations (você), lint, typecheck, build, testes de API e de tela, revisão de design, ajustes |

### Fase 0: o que eu crio antes dos agentes

1. **`git init` + commit inicial** (ponto de restauração). Ver decisão D8.
2. **Erros de API compartilhados**: mover `ApiErrorBody` e `ApiError` de `features/auth/sign-up` para `src/lib/api/errors.ts` (sign-up passa a importar de lá).
3. **`PasswordInput`** movido para `src/features/auth/components/password-input.tsx` (sign-up e sign-in usam).
4. **Tipos do banco completos** em `src/server/db/types.ts` com as 3 tabelas já no formato acordado (`accounts`, `products`, `products_feedbacks`). Nenhum agente edita esse arquivo.
5. **Contrato de sessão** `src/server/auth/session.ts`:
   ```ts
   export type SessionUser = { id: string; firstName: string; lastName: string; email: string; avatarUrl: string };
   export async function getCurrentUser(): Promise<SessionUser | null>; // stub retorna null; sign-in implementa
   ```
6. **Routers tRPC vazios** registrados em `root.ts`: `products` (home) e `feedbacks` (feedback).
7. **Layout da plataforma**: route group `src/app/(platform)/layout.tsx` com cabeçalho e um slot `<HeaderAccount />` (stub). `src/app/page.tsx` (hoje redireciona para sign-up) vira `src/app/(platform)/page.tsx` com placeholder.
8. **Componente de nota** `src/components/prova/grade.tsx` + `formatGrade()` (escala 0–5, pt-BR, vírgula decimal, fonte de caneta), extraído do estilo do `GradedReviewSample`. Usado pelo Feedback (e disponível para a Home no futuro).
9. **Variáveis de ambiente**: `SESSION_SECRET` e `ADMIN_API_KEY` no schema de `env.ts` e no `.env.example`. **Você preenche o `.env.local`.**
10. **`next.config.ts`**: `images.remotePatterns` para `api.dicebear.com` e para as imagens dos produtos.
11. **Escala 0–5 (D1)**: corrigir a descrição em `src/app/layout.tsx` ("nota de 0 a 10" → "de 0 a 5"). O `GradedReviewSample` e a página de sucesso do sign-up ficam com o agente de Sign-in.
12. **Nomes de migration reservados**:
    - `20261114010000_create_products.sql` (home)
    - `20261114020000_create_products_feedbacks.sql` (feedback)

## Dono de cada arquivo (Fase 1)

| Área | Sign-in | Home | Feedback |
|---|---|---|---|
| `src/app/(platform)/layout.tsx` + `src/components/layout/*` | ✅ | | |
| `src/app/(platform)/page.tsx` | | ✅ | |
| `src/app/(platform)/products/[id]/*` | | | ✅ |
| `src/app/auth/*` (inclui links no sign-up) | ✅ | | |
| `src/app/api/v1/sign-in`, `sign-out` | ✅ | | |
| `src/app/api/v1/products/route.ts` | | ✅ | |
| `src/app/api/v1/products/[id]/feedbacks/route.ts` | | | ✅ |
| `src/features/auth/**`, `src/server/auth/**` | ✅ | | |
| `src/features/products/**`, `src/server/products/**`, `routers/products.ts` | | ✅ | |
| `src/features/feedbacks/**`, `src/server/feedbacks/**`, `routers/feedbacks.ts` | | | ✅ |
| Migration `..._create_products.sql` | | ✅ | |
| Migration `..._create_products_feedbacks.sql` | | | ✅ |
| Arquivos da Fase 0 (`types.ts`, `root.ts`, `env.ts`, `next.config.ts`, `globals.css`, `grade.tsx`) | somente leitura | somente leitura | somente leitura |

Se um agente precisar mudar um arquivo de outro ou da Fase 0, ele **não edita**: registra o pedido no relatório final e eu aplico na Fase 2.

## Regras para os subagentes

- Ler `AGENTS.md` e o guia do Next.js em `node_modules/next/dist/docs/` antes de codar (Next 16.4, `cacheComponents: true`).
- Ler `.agents/skills/frontend-design/SKILL.md` e seguir a identidade **Prova** (paleta Sulfite/Grafite/Caneta azul/Caneta vermelha/Pauta, Schibsted Grotesk + Nanum Pen Script só nas notas, mobile-first, alvos ≥ 44px, foco visível, modo escuro).
- Copy em pt-BR.
- **Não rodar `next dev` nem `next build`** (três agentes na mesma pasta disputariam a `.next`). Validar com `bunx tsc --noEmit` e `bunx biome check <arquivos do agente>`, ignorando erros de arquivos de outros agentes.
- Não acessar o banco nem aplicar migrations.
- Entregar um relatório: arquivos criados/alterados, decisões tomadas, pedidos de mudança fora da sua área, o que ficou pendente.

## Fase 2: como eu verifico o resultado final

1. Você aplica as 2 migrations no Supabase (na ordem) e preenche `SESSION_SECRET` e `ADMIN_API_KEY`.
2. `bun run lint`, `bunx tsc --noEmit`, `bun run build`.
3. `bun run dev` e testes de API com `curl`:
   - sign-in: 200 + `Set-Cookie`, 400, 401 (e-mail errado e senha errada com a mesma mensagem)
   - products: GET paginado, GET vazio, POST 201 / 400 / 401 sem chave
   - feedbacks: POST sem sessão 401, com sessão 201, 400, 404 produto inexistente
4. Fluxo completo no navegador (desktop e mobile, claro e escuro), com capturas: cabeçalho deslogado, login com erro, login ok, avatar no cabeçalho, home com scroll infinito, detalhe do produto deslogado (bloco de login), avaliação enviada.
5. Revisão de design contra a skill e correções.
6. Relatório final para você.

## Decisões (definidas por você em 2026-11-14)

| # | Ponto | Decisão |
|---|---|---|
| D1 | Escala da nota da avaliação | **0 a 5, inteiro** (`products_feedbacks.score int`). A média na página do produto mostra decimal ("4,5"). |
| D2 | `products.score` | **Mantido como `boolean`**, como na spec. Fica só no banco (`not null default false`), sem uso na interface por enquanto. Sem trigger de média. |
| D3 | Imagem do produto | Coluna `image_url text` com URL externa (sem upload). |
| D4 | Proteção do `POST /products` | Header `x-admin-key` igual a `ADMIN_API_KEY`; rota em `/api/v1/products`. |
| D5 | Formato da sessão | JWT assinado (lib `jose`) em cookie `httpOnly`, `sameSite=lax`, 7 dias, segredo `SESSION_SECRET`. |
| D6 | Logout | "Sair" mínimo no menu do avatar (`POST /api/v1/sign-out`). |
| D7 | Avaliações repetidas | Uma avaliação por pessoa por produto (unique + 409). |
| D8 | Git | `git init` + commit inicial antes da execução. |
| D9 | Voltar ao produto após login | Sign-in aceita `?next=/caminho` (só caminhos internos); sem `next`, vai para `/`. |
