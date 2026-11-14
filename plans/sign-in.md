# Plano: Sign-In (Autenticação)

> Spec: [specs/sign-in.md](../specs/sign-in.md) · Status: **decisões definidas, aguardando liberação para executar**
> Orquestração e decisões: [_orquestracao.md](./_orquestracao.md) (D5, D6, D9)

## Objetivo

Pessoas entram com e-mail e senha em `/auth/sign-in`, recebem uma sessão em cookie e voltam para a home. O cabeçalho da plataforma mostra **"Entrar"** para quem está deslogado e **avatar + nome + e-mail** para quem está logado.

## O que já existe e será reaproveitado

- Tabela `accounts` (e-mail único, `password` com hash bcrypt, `active`).
- `verifyPassword()` em `src/server/auth/password.ts`.
- Padrão REST → tRPC caller (`/api/v1/sign-up` chama `caller.auth.signUp`), `trpcErrorToResponse` (400 automático para erro de zod).
- Layout de auth (`src/app/auth/layout.tsx`), `PasswordInput`, `Alert` vermelho, inputs h-11 e botão h-12 do sign-up.

## Back-end

### Schema (compartilhado cliente/servidor)
`src/features/auth/sign-in/schema.ts`
```ts
signInSchema = z.object({
  email: z.string().trim().toLowerCase().min(1, "Informe seu e-mail.").pipe(z.email("Informe um e-mail válido.")),
  password: z.string().min(1, "Informe sua senha."),
})
```
Sem regra de tamanho mínimo da senha no login: isso revelaria a política e não ajuda quem está entrando.

### Serviço `src/server/auth/sign-in.ts`
1. Busca a conta por e-mail com `active = true` (só as colunas necessárias).
2. Se não existir, compara a senha com um **hash fictício** mesmo assim, para que o tempo de resposta não revele se o e-mail existe.
3. `verifyPassword()`; se falhar, lança `InvalidCredentialsError`.
4. Retorna `{ id, firstName, lastName, email }`.

### Sessão `src/server/auth/session.ts` (implementa o contrato da Fase 0)
- Dependência nova: `jose` (`bun add jose`).
- Cookie `prova_session`: JWT HS256 com `sub = accountId`, expira em 7 dias; `httpOnly`, `secure` em produção, `sameSite: "lax"`, `path: "/"`.
- `createSession(accountId)` e `deleteSession()` (usados nos route handlers).
- `getCurrentUser(): Promise<SessionUser | null>`: lê o cookie, valida o JWT, busca nome e e-mail da conta ativa, monta `avatarUrl`. Usa `cache()` do React para ler uma vez por requisição. Token inválido ou conta inativa → `null`.
- `avatarUrl`: `https://api.dicebear.com/9.x/notionists/svg?seed=<accountId>`. O estilo *notionists* é traço desenhado à mão, combina com a "anotação de caneta" da Prova. A seed é o id, não o e-mail, para não expor dado pessoal a um serviço externo.

### tRPC
`authRouter.signIn` (`publicProcedure.input(signInSchema)`): chama o serviço e converte `InvalidCredentialsError` em `TRPCError UNAUTHORIZED` com a mensagem **"E-mail ou senha inválidos."**

### Rotas
| Método | Rota | Respostas |
|---|---|---|
| POST | `/api/v1/sign-in` | **200** `{ user }` + `Set-Cookie` · **400** JSON malformado ou campos inválidos · **401** "E-mail ou senha inválidos." |
| POST | `/api/v1/sign-out` (D6) | **204** e cookie apagado |

O cookie é gravado no route handler com `(await cookies()).set(...)`, depois que a procedure retorna.

## Front-end

### Página `/auth/sign-in`
- `src/app/auth/sign-in/page.tsx`: usa o layout de auth existente, metadata "Entrar".
- `SignInForm` (react-hook-form + zodResolver, `mode: "onTouched"`): e-mail (`autoComplete="email"`) e senha (`PasswordInput`, `autoComplete="current-password"`).
- Erro da API: **Alert vermelho** no topo do formulário. 401 sempre mostra a mensagem genérica; erro de rede mostra "Sem conexão com o servidor. Verifique sua internet."
- Enquanto envia: botão desabilitado com spinner, rótulo "Entrando…".
- Sucesso: `router.replace(next ?? "/")` + `router.refresh()` para o cabeçalho trocar de estado. `next` só é aceito se começar com `/` e não com `//` (D9).
- Links cruzados: "Ainda não tem conta? Criar conta" → sign-up. No sign-up: "Já tem conta? Entrar". Na página de sucesso do sign-up, o CTA principal leva para o login.

### Layout base da plataforma e cabeçalho
- `src/app/(platform)/layout.tsx` (stub criado na Fase 0; este agente é dono do visual): cabeçalho + `<main>`.
- `src/components/layout/site-header.tsx`: wordmark **Prova** à esquerda (mesmo estilo do layout de auth) e `<HeaderAccount />` à direita, dentro de `<Suspense>` com um placeholder do mesmo tamanho (evita o layout pular). Com `cacheComponents`, ler cookies fora de Suspense é erro de build.
- `HeaderAccount` (server): chama `getCurrentUser()`.
  - **Deslogado**: botão "Entrar" (link para `/auth/sign-in`, ≥ 44px).
  - **Logado**: avatar Dicebear 36px + nome e sobrenome + e-mail. No desktop aparecem ao lado do avatar; no mobile só o avatar, que abre um menu (Base UI Menu via shadcn) com nome, e-mail e **"Sair"**.

### Home esqueleto
A spec pede "home só com título e esqueleto". Isso fica com o agente da **Home**, que constrói a página real em paralelo. Este agente não toca em `(platform)/page.tsx`.

## Design (seguindo a skill e a identidade Prova)
- Página de login no mesmo sistema do sign-up v2: papel Sulfite, texto Grafite, Caneta azul só em foco/links, Caneta vermelha só no erro. Ancorada no topo para o título não pular quando o erro aparece.
- Título direto: "Entrar na Prova". Subtítulo curto ligado a uso real (ex.: "Suas notas e avaliações ficam na sua conta.").
- Sem painel de marketing nem estrelas. O elemento marcante continua sendo a nota manuscrita; no login, no máximo uma versão menor do `GradedReviewSample` no desktop, ou nenhuma: login precisa ser mais rápido que cadastro.
- Cabeçalho discreto: barra sem sombra, linha inferior na cor Pauta (lembra o caderno), mesma largura máxima (`max-w-6xl`) e gutters do layout de auth.

## Arquivos

**Novos:** `src/features/auth/sign-in/{schema.ts,api.ts,use-sign-in.ts,components/sign-in-form.tsx}`, `src/server/auth/sign-in.ts`, `src/app/auth/sign-in/page.tsx`, `src/app/api/v1/sign-in/route.ts`, `src/app/api/v1/sign-out/route.ts`, `src/components/layout/{site-header.tsx,header-account.tsx,account-menu.tsx}`.
**Alterados:** `src/server/auth/session.ts` (implementa o stub), `src/server/trpc/routers/auth.ts`, `src/app/(platform)/layout.tsx`, links no sign-up e na página de sucesso.

**Ajuste por causa da D1 (escala 0–5):** o `GradedReviewSample` do sign-up hoje mostra "7,5" numa escala de 0 a 10. Este agente, que é dono de `src/features/auth/**`, troca para a escala 0–5 (ex.: "4,5") e corrige o texto que mencionar "de 0 a 10".

## Fora do escopo
Recuperar senha, "lembrar de mim", login social, rate limit, proteção de rotas por proxy.

## Critérios de aceite (como verifico)
- [ ] `/auth/sign-in` com formulário validado no cliente (não envia se inválido).
- [ ] POST `/api/v1/sign-in`: 200 + cookie `httpOnly`; 400 para JSON ruim ou campos inválidos; 401 com **a mesma mensagem** para e-mail inexistente e senha errada.
- [ ] Erro aparece em Alert vermelho no formulário.
- [ ] Sucesso navega para `/` e o cabeçalho mostra avatar + nome + e-mail sem recarregar a página manualmente.
- [ ] Deslogado: cabeçalho mostra "Entrar".
- [ ] "Sair" apaga a sessão e o cabeçalho volta para "Entrar".
- [ ] Lint, typecheck e build sem erros; telas conferidas em mobile e desktop, claro e escuro.
