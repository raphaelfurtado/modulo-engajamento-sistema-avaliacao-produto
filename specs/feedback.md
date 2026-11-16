# Feedback

## Escopo
Front-End, Back-End, Banco de Dados

## Contexto
Precisamos impementação o fluxo permitindo as pessoas logadas (autenticadas) adicionar novas avaliações aos produtos

## Requisitos funcionais
1. Caso a pessoa não esteja logada precisamos mostrar um bloco exigindo a autenticação
2. Caso ela esteja logada podemos mostrar o formulário e permitir novas avalaições
   1. Cada avaliação deve conter uma nota inteira de 0 a 5 + comentário (10 a 2.000 caracteres)
   2. Uma avaliação por pessoa por produto; quem já avaliou vê a própria nota no lugar do formulário
3. Nova tabela `products_feedbacks`
   1. `id`: nanoid
   2. `score`: int
   3. `comment`: text
   4. `created_at`: timestamp
   5. `created_by` nanoid
   6. `product_id`: nanoid
4. A paginad e detalhes deve listar todos os comentários existentes para o produto e deppis renderizar o form para adicionar novos
5. Resumo das avaliações por IA (agente Mastra com `openai/gpt-4o-mini`), gerado depois de cada nova avaliação a partir de 3 avaliações e salvo em `products.ai_summary`

## Requisitos não funcionais
- UI/UX: segue o design system "Etiqueta de teste" (`specs/design-system.md`). Página `/products/[id]`, de cima para baixo:
  1. **Topo** (duas colunas no desktop, uma no celular): à esquerda, a foto em cartão branco e "Vendido em <loja>"; à direita, o nome do produto em Archivo expandida, a **etiqueta de nota** (média e quantas pessoas deram cada nota) e os botões "Ver na loja" (verde) e "Avaliar este produto" (leva ao bloco de avaliação).
  2. **Resumo das avaliações**: cartão com o selo "Gerado por IA", o texto e o aviso de que pode conter imprecisões. Só aparece quando existe resumo.
  3. **Avaliações**: título com a quantidade e ordenação (mais recentes, maior nota, menor nota); lista em um cartão, cada item com o selo colorido da nota, nome (primeiro nome + inicial), data relativa e comentário. Sem avaliações: um aviso convidando a avaliar.
  4. **Bloco de avaliação** (cartão): sem login, "Usou este produto? Dê sua nota." com "Entrar" e "Criar conta"; com login, formulário com o seletor de nota de 0 a 5 e o comentário; quem já avaliou vê o selo da própria nota e um link para a avaliação.
- Performance: O processo de criação de conta precisa ser rápido

## Você deve
- Criar um endpoint novo para adicionar comentários
- Criar uma nova pagina de detalhes `/products/id`

## Você não deve
- Implementar qualquer outra funcionalidade que não esteja relacionada com sign-up (criação de contas).
- Não vamos realizar nenhum envio de email no momento, apenas processar a requisição, salvar no banco dados e tornar um sucesso.

## Tecnologias (Stack)
React.js, Next.js, React-Hook-Form, Shadcn, Tailwild, Supabase, TRCP, Bunjs.

## Critérios de aceitação
- Pagina de detalhes do produto mostrando as informações do produto + avaliaçÕes + formulário para nova avaliação
- A etiqueta de nota mostra a média com uma casa ("4,0") e a quantidade de pessoas em cada nota de 0 a 5

## Resultado
Pessoas conseguem ver os produtos de forma publica, sem autenticação mas não conseguem adicionar novos comentários
