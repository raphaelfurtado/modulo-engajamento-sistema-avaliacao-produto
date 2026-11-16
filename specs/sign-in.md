# Sign-In (Autenticação)

## Escopo
Front-End, Back-End

## Contexto
Precisamos impementação o fluxo para permitir pessoas acessar a plataforma:
- Email
- Senha

## Requisitos funcionais
1. Precisamos adicionar validação no formulário na camada de cliente
   1. Caso o formulário esteja válida podemos enviar a requisição para a API
2. Caso recebemos algum erro de autenticação queremos mostrar uma mensagem genérica e não especifica sobre o email ou a senha, por exemplo: Email ou senha inválidos.
3. Ler o email e password na tabela `accounts`
4. A requisição deve ser um `POST` para `/api/v1/sign-in` e receber os dados como JSON no `body`
5. Caso tudo dê certo retornar `200` ou erros de acordo com a validação:
   1. Crie uma nova sessão do Next.js com cookies
   2. `400`: Má formatação de dados
   3. `401`: Falha de credenciais
6. Se a pessoa não está logada precisamos mostrar um botào de login no cabeçalho
7. Se a pessoa está logada mostramos um círculo com as iniciais (nome + sobrenome); ao abrir, o menu mostra nome completo, e-mail e "Sair"

## Requisitos não funcionais
- UI/UX: segue o design system "Etiqueta de teste" (`specs/design-system.md`), feito com a skill de front-end design.
  - Cabeçalho da plataforma: faixa branca com o logotipo à esquerda e "Entrar" (ou a conta) à direita.
  - Página `/auth/sign-in`: só o formulário, sem painel ao lado (entrar precisa ser mais rápido que se cadastrar): título em Archivo expandida, campos de 44px, botão verde de 48px. Layout ancorado no topo, para mensagens de erro não fazerem o título pular.
- Performance: O processo de criação de conta precisa ser rápido

## Você deve
- Criar um layout base para a paltaforma
- Criar uma home sem nada por enquanto, apenas um titulo e esqueleto
- Criar um endpoint novo para autenticação
- Cria uma página nova para autenticação

## Você não deve
- Implementar qualquer outra funcionalidade que não esteja relacionada com sign-up (criação de contas).
- Não vamos realizar nenhum envio de email no momento, apenas processar a requisição, salvar no banco dados e tornar um sucesso.

## Tecnologias (Stack)
React.js, Next.js, React-Hook-Form, Shadcn, Tailwild, Supabase, TRCP, Bunjs.

## Critérios de aceitação
- Temos uma página para criar a nova conta em `/auth/sign-in`
- A página contém um formulário com validação
- A plataforma consegue se comunicar com a API para enviar os dados e receber uma resposta
- Estamos informando possíveis erros
  - Mostrar um alert em vermelho no formulário
- Navegar (`/`) para a home em caso de sucesso

## Resultado
Pessoas conseguem acessar suas contas.
