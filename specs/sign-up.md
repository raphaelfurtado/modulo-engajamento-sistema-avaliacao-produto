# Sign-up (Criação de Conta)
## Escopo
Front-End, Back-End, Bano de Dados

## Contexto
Precisamos implementar o fluxo para a criação de contas na plataforma, as pessoas precisarão fornecer:
- Primeiro Nome
- Sobrenome
- Email
- Senha
- Confirmação de Senha

## Requisitos Funcionais
1. Precisamos adicionar validação no formulário na camada de cliente
    1. Caso o formulário esteja válido, podemos enviar a requisição para a API
2. Os campos de nome e sobrenome devem ser separados.    
3. Precisamos criar uma nova conta no banco de dados na tabela de `accounts`
    1. `id`: nanoid (gerado com nanoid na camada de API)
    2. `first_name`: text
    3. `last_name`: text
    4. `create_at`: timestamp
    5. `updated_at`: timestamp
    6. `active`: boolean
    7. `email`: text
    8. `password`: text (hashed)
    9. `salt`: text (hashed)
4. A requisição deve ser um `POST` para `/api/v1/sign-up` e receber os dados como JSON no `body`
5. Caso tudo dê certo, retornar `201` ou erros de acordo com a validação:
    1. `400`: Má formatação de dados

## Requisitos Não Funcionais
- Segurança: Precisamos salvar as senhas de forma segura no banco de dados.
    - Precisamos receber os dados dos clientes de forma segura usando HTTPS (para prefinir network sniff)
- UI/UX: segue o design system "Etiqueta de teste" (`specs/design-system.md`).
  - Página `/auth/sign-up`: formulário à esquerda (nome e sobrenome lado a lado, regras da senha visíveis antes do erro, botão verde de 48px); à direita, a etiqueta de nota de um produto de exemplo (air fryer), a mesma que aparece na página de cada produto.
  - Página `/auth/sign-up/success`: marca de "certo" em verde-selo, título "Conta criada" e o botão "Entrar na sua conta".
- Performance: O processo de criação de conta precisa ser rápido

## Você deve
- Criar a base do projeto com um endpoint inicial para a criação de conta
- Criar a base do projeto com uma página inicial para a interface de criação de conta
- Configurar as bibliotecas base

## Você não deve
- Implementar qualquer outra funcionalidade que não esteja relacionada com o sign-up (criação de contas)
- Não vamos realizar nenhum envio de e-mail no momento, apenas processar a requisição, salvar no banco de dados e tornar sucesso.

## Tecnologias (Stack)
React.js, Next.js, React-Hook-Form, Shadcn, TailwindCSS, Supabase, TRCP

## Critérios de Aceitação
- Quando temos uma página para criar a nova conta em `/auth/sign-up`
- A página contém um formulário com validação
- A plataforma consegue se comunicar com a API para enviar os dados e receber uma resposta
- Estamos informando possíveis erros
    - Mostrar um alert em vermelho no formulário
- Estamos informando o sucesso de criação da conta:
    - Navegar para `/auth/sign-up/success`

## Resultado 
- Pessoas conseguem criar uma nova conta na plataforma