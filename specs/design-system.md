# Design System: "Etiqueta de teste"

## Escopo
Front-End (todas as telas: home, produto, sign-in, sign-up)

## Contexto
A Prova mostra a nota de 0 a 5 que dá quem comprou e usou o produto. A identidade
visual vem de um objeto que todo consumidor brasileiro conhece: a etiqueta de
eficiência dos eletrodomésticos, com barras escalonadas do verde ao vermelho e
uma seta marcando a classificação. Na Prova, essa etiqueta mostra a nota.

Direção aprovada em 2026-11-16. Substitui a "folha corrigida em caneta azul"
(v2) e o layout laranja com Space Grotesk (v3).

## Princípios
1. **A cor só significa nota.** A escala de vermelho a verde aparece apenas em
   notas (etiqueta, selo da avaliação, seletor de nota). O resto da interface é
   neutro, com o verde-selo só em ações e foco.
2. **A cor nunca aparece sozinha.** Toda barra ou selo colorido leva o número
   da nota dentro.
3. **Um elemento ousado por tela.** A etiqueta de nota (`ScoreLabel`) é o
   destaque; cabeçalho, listas e formulários ficam quietos.
4. **Um único movimento.** As barras da etiqueta crescem uma vez ao carregar.
   Com `prefers-reduced-motion`, nada se move.

## Cores
| Token | Claro | Escuro | Uso |
|---|---|---|---|
| `background` (papel) | #F6F7F5 | #101512 | fundo das páginas |
| `card` | #FFFFFF | #171D19 | cartões, cabeçalho |
| `foreground` (tinta) | #17201B | #E8ECE9 | texto, seta da média |
| `muted-foreground` | #56605A | #9AA59F | texto de apoio |
| `border` / `pauta` | #DDE2DE | #2A322D | linhas e bordas |
| `input` | #87918B | #6B766F | borda de campo (3:1) |
| `primary` (verde-selo) | #0E6B3B | #5BC98A | botões, links, foco |
| `destructive` | #B42318 | #FF8A7A | erros |

Escala de notas (`nota-0` a `nota-5`), igual nos dois modos:

| Nota | Cor | Número por cima |
|---|---|---|
| 0 | #C4321F | branco |
| 1 | #E2632A | tinta #17201B |
| 2 | #EFA12A | tinta |
| 3 | #E3C62C | tinta |
| 4 | #86B83C | tinta |
| 5 | #187A3E | branco |

Todo texto tem contraste ≥ 4,5:1 (números grandes ≥ 3:1).

## Tipografia
- **Archivo** (variável, eixo de largura), uma família só.
- Títulos, números e a marca: Archivo **expandida** (`font-wide`, 125%), peso 800.
- Texto e interface: Archivo normal, 400 a 600.
- Médias sempre com uma casa e vírgula ("4,0"); notas inteiras sem casa ("4").
- Sem fonte mono, sem rótulos em caixa alta.

## Forma e espaço
- Raio de 4px em cartões, campos e botões; círculos só nas iniciais da conta.
- Largura máxima de 1180px, margem lateral de 16px no celular e 32px a partir de `sm`.
- Controles com no mínimo 44px de altura (botões principais 48px).

## Componentes
- **Logotipo** (`Wordmark`): "prova" em Archivo expandida, com uma etiqueta em
  miniatura (três barras: verde, amarela e vermelha) à esquerda.
- **Etiqueta de nota** (`ScoreLabel`): título "Nota Prova"; seis barras com ponta
  de seta, do 5 (curta, verde, no topo) ao 0 (longa, vermelha); ao lado de cada
  barra, quantas pessoas deram aquela nota; uma seta preta com a média ("4,0")
  na linha da nota mais próxima, ligada à barra por um pontilhado. Sem
  avaliações, as barras aparecem sem seta. Para leitores de tela, um parágrafo
  descreve a média e a distribuição.
- **Selo de nota** (`Grade`): quadrado na cor da escala com o número em Archivo
  expandida. Usado em cada avaliação e no estado "você já avaliou".
- **Seletor de nota** (`ScorePicker`): seis casas de 0 a 5, cada uma com a cor
  da escala numa faixa embaixo; a escolhida fica toda pintada. Grupo de radios
  nativo (setas do teclado, "Nota 4 de 5" no leitor de tela).
- **Conta no cabeçalho**: círculo com as iniciais; nome e e-mail no menu.

## Você não deve
- Usar a escala de cores para decorar (fundos, ícones, links).
- Usar estrelas, selos de "verificado" ou badges decorativos.
- Usar fundo creme, preto com acento neon, fonte mono para dados ou rótulos em
  caixa alta acima dos títulos.

## Critérios de aceitação
- Modo claro e escuro seguem `prefers-color-scheme`.
- Celular primeiro: nenhuma tela tem rolagem horizontal em 360px.
- Foco visível em todos os controles (anel verde-selo).
