# Urban Stay®

Landing em React + Vite reproduzindo o grid do Figma
[DS Urban Stay®](https://www.figma.com/design/DtBJMg8yBdK0gejCUnFApu/DS-Urban-Stay%C2%AE)
— frames `9068:838` (hero), `9068:893` (roda aberta) e `9068:919` (benefícios).

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

## O grid

**1440 de largura, 12 colunas, margem 32, gutter 32** — logo a coluna vale
`(1440 − 2·32 − 11·32) / 12 = 85.3333`. `src/design.ts` expõe isso como
`COLUMN`, `span(n)` e `columnX(n)`.

As margens e o gutter de 32 valem em toda a página: a navbar encosta nos 32
laterais e nos 32 do topo, as três colunas da roda encostam nas margens, e a
esteira de benefícios empilha os cards com 32 de gutter a partir da margem
esquerda. Larguras de foto (344.524 na roda; 436.157 e 321.206 na esteira) vêm
da própria arte, não de uma contagem de colunas.

## Escala

`useDesignScale` publica `--k` no `:root` e cada medida do CSS é
`calc(<valor do Figma> * var(--k))`.

- **até 1440px** → `k = innerWidth / 1440`, a arte encolhe junto
- **acima de 1440px** → `k = 1`. A arte para de crescer e o frame fica
  centrado, mas nada é recortado: as fotos sangram livremente até a borda da
  janela. `--side-clip` sobrou só para alinhar o texto em fluxo à margem do
  art-board.
- **abaixo de 1024px** → o art-board vira um recorte de 860

A seção de benefícios tem uma segunda escala, `--kb`: se a janela for mais
baixa que o art-board, a composição inteira (esteira + texto) encolhe junto em
vez de estourar. Em 960 de altura `--kb` é igual a `--k`, ou seja, 1:1.

As coordenadas das fotos ficam isoladas em `src/design.ts`, cada uma anotada com
o nó de origem.

## A roda

`src/components/Stage.tsx` fixa um palco de `100svh` por 620vh de scroll e
desenha os seis cards a cada frame a partir de um único progresso:

| progresso | o que acontece |
| --- | --- |
| `0 → 0.35` | os cards nascem no centro em escala 0,05, giram 148° e crescem até as posições exatas do frame `9068:893` |
| `0.29 → 0.44` | o anel **continua girando mais 90°** enquanto se desenrola na esteira — os cards chegam em arco, não em reta, e um de cada vez, da esquerda para a direita |
| `0.33 → …` | a headline se solta do centro e sobe **na velocidade exata do scroll**, como se nunca tivesse sido fixada |
| `0.38 → 0.46` | o primeiro benefício sobe em máscara |
| `0.44 → 1.00` | a esteira anda de card em card |

As janelas se sobrepõem de propósito: a roda ainda está assentando quando a
esteira começa a puxar, então nenhum card chega a parar — não há pausa entre as
duas seções.

Cada slot da roda vira um par *(ângulo, raio)* calculado a partir da própria
posição final — é por isso que o giro assenta exatamente no grid, sem correção
manual. O `border-radius` é contra-escalado a cada frame para continuar valendo
6px mesmo quando o card é ampliado 1,61×.

A transição para a esteira é uma interpolação pura: `436.157 / 344.524` e
`321.206 / 344.524` são escalas uniformes — as proporções da esteira batem com
as da arte original, então nenhuma foto se deforma. O raio interpola junto,
de 6 na roda para 4.715 na esteira.

## A esteira

A segunda seção é um **menu de seleção horizontal** preso ao scroll vertical.
Um índice ativo fracionário anda de 0 a 5 e, a cada quadro, a fita é
redistribuída do zero:

- a largura de cada card interpola entre `321.206` e `436.157` conforme a
  proximidade da posição ativa — quem encosta na margem cresce, o resto encolhe;
- os gutters de 32 se acumulam sobre essas larguras;
- o conjunto desliza para que a **borda esquerda do card ativo** caia exatamente
  na margem de 32.

Como a altura sai da largura (escala uniforme), nenhuma foto se deforma. Todos
os cards crescem e encolhem em torno da mesma linha de centro, então o card
grande sempre começa em `ROW_TOP` e o texto abaixo nunca se mexe.

A fita tem **12 posições**: os 6 cards da roda mais 6 ecos das mesmas fotos. Os
ecos só existem para que, quando o último card encostar na margem, ainda haja
esteira à direita em vez de vazio.

### A ordem das fotos

A ordem do array `CARDS` **é** a ordem da esteira, e ela segue o sentido de giro
da roda para que a transição seja um varrimento contínuo em vez de seis
trajetórias que se cruzam. No sentido horário a partir do topo-esquerda:
mala → cama → roupão → cartas → câmera → janela.

### Os textos

Um benefício por card, seis blocos empilhados no mesmo ponto. Quem ainda não
chegou espera abaixo da máscara; quem já passou sai por cima. A troca acontece
no meio do caminho entre duas paradas (`|d|` entre 0,25 e 0,5), então nunca há
dois textos visíveis ao mesmo tempo nem um vão sem texto.

O índice ativo passa por `settle` — uma mistura de linear com smoothstep — que
dá uma acomodada em cada parada, tempo de ler, sem chegar a travar entre elas.

## A navbar

Sem fundo e sem padding: 32 do topo, 32 dos lados. O logo e os links usam
`mix-blend-mode: difference` com fonte branca, então leem como o negativo do
que estiver embaixo — gradiente ou foto — sem precisar de um scrim.

São duas camadas fixas na mesma grade porque `mix-blend-mode` só alcança o
fundo da página quando está no elemento de topo: qualquer stacking context no
caminho isola o grupo e a mesclagem morre. `.nav` leva a mesclagem; `.nav-cta`
fica de fora, senão o `difference` transformaria a pílula preta em duas cores
invertidas ilegíveis. Um fantasma invisível no fim da primeira camada reserva a
largura do botão para que os links caiam onde caem no Figma.

Ressalva: sobre o cinza-azulado do topo do gradiente o negativo dá um marrom de
contraste modesto (~2,5:1) — `difference` é forte sobre extremos e fraco sobre
meios-tons. Sobre as fotos e sobre o amarelo ele resolve muito bem.

## Stack

- `gsap` + `ScrollTrigger` — progresso do scroll (nenhuma tween por card: os
  transforms são escritos direto no estilo, num único loop)
- `lenis` — inércia, acoplada ao ticker do GSAP para dividir o mesmo frame
- Clash Grotesk via Fontshare, a mesma família do arquivo

`prefers-reduced-motion` desliga o Lenis e o indicador de scroll.

## Assets

`public/img/` — exportados do Figma. `bg-gradient.png` é o fill de fundo comum
aos três frames, aplicado como camada fixa.
