/**
 * Geometry lifted verbatim from the Figma file
 * "DS Urban Stay®" — frames 9068:838 (hero), 9068:893 (wheel open)
 * and 9068:919 (benefícios).
 *
 * Every number below is expressed in the 1440 x 960 art-board space.
 * At a 1440px-wide viewport the rendered layout is 1:1 with the design.
 */

export const FRAME_W = 1440
export const FRAME_H = 960

/**
 * O grid do arquivo: 1440 de largura, 12 colunas, margem 32, gutter 32.
 * Coluna = (1440 − 2·32 − 11·32) / 12 = 85.3333
 */
export const GRID = {
  width: FRAME_W,
  columns: 12,
  margin: 32,
  gutter: 32,
} as const

export const COLUMN =
  (GRID.width - GRID.margin * 2 - GRID.gutter * (GRID.columns - 1)) / GRID.columns

/** Largura de um bloco de `n` colunas, gutters incluidos. */
export const span = (n: number) => n * COLUMN + (n - 1) * GRID.gutter

/** Borda esquerda da coluna `n` (1-indexada). */
export const columnX = (n: number) => GRID.margin + (n - 1) * (COLUMN + GRID.gutter)

/** Native card size of the wheel photos (Rectangle 568…573). */
export const CARD_W = 344.524
export const CARD_H = 496.611

/** Raio dos cards: 6 na roda, 4.715 na linha de beneficios. */
export const RADIUS_WHEEL = 6
export const RADIUS_ROW = 4.715

export type Photo = {
  id: string
  src: string
  alt: string
  /** object-position, mirrors the Figma image fill alignment */
  fit: string
}

/** A resting slot of the open wheel — centre point relative to the frame centre. */
export type Slot = { x: number; y: number }

export type Benefit = {
  title: string
  lead: string
}

export type CardSpec = {
  photo: Photo
  /** frame 9068:893 — posicao na roda aberta */
  slot: Slot
  /** o beneficio que este card apresenta quando encosta na margem */
  benefit: Benefit
  /** paint order, higher sits on top */
  depth: number
}

/*
 * Wheel slots. As tres colunas encostam nas margens do grid:
 *   left   x = 32 (margem)             → centre −515.738
 *   centre x = (1440 − 344.524)/2       → centre 0
 *   right  x = 1440 − 32 − 344.524      → centre +515.738
 * A largura 344.524 vem da propria arte, nao de uma contagem de colunas.
 */
const COL_L = -515.738
const COL_C = 0
const COL_R = 515.738

/* ------------------------------------------------------------------
   Frame 9068:919 — esteira horizontal
   ------------------------------------------------------------------
   Margem esquerda 32, gutter 32, alinhamento vertical pelo centro.
   Só o primeiro card é grande; os cinco seguintes têm o mesmo tamanho.
   As proporções batem com a arte original (344.524 / 496.611 = 0.6938),
   então cada card continua sendo uma escala uniforme — nada deforma.
*/
export const ROW_TOP = 67.15
export const ROW_GAP = GRID.gutter
export const ROW_LEAD_W = 436.157
export const ROW_LEAD_H = 628.695
export const ROW_W = 321.206
export const ROW_H = 463

/**
 * A esteira e uma fita de 12 posicoes: os 6 cards que vem da roda mais 6
 * ecos das mesmas fotos. Os ecos so existem para que, quando o ultimo card
 * encostar na margem, ainda haja esteira a direita em vez de vazio.
 */
export const ROW_SLOTS = 12

/** Centro vertical da esteira — todo card cresce e encolhe em torno dele. */
export const ROW_CENTER_Y = ROW_TOP + ROW_LEAD_H / 2

/** Topo do bloco de texto, 64 abaixo do card grande. */
export const COPY_TOP = ROW_TOP + ROW_LEAD_H + 64 // 759.845

/**
 * Altura total da composição de benefícios, usada para encolher tudo
 * proporcionalmente quando a janela é mais baixa que o art-board.
 * (título 80 · 0.9 + gap 20 + lead 24 · 1.4 ≈ 125.6)
 */
export const BENEFITS_H = COPY_TOP + 125.6 // 885.4

/*
 * A ORDEM DESTE ARRAY E A ORDEM DA ESTEIRA.
 *
 * Ela segue o sentido de giro da roda, para que a transicao seja um
 * varrimento continuo em vez de seis trajetorias que se cruzam. Angulos dos
 * slots (y positivo para baixo), em sentido horario a partir do topo-esquerda:
 *
 *   −147.4°  topo-esquerda    mala
 *    −90.0°  topo-centro      cama
 *    −32.6°  topo-direita     roupao
 *     33.1°  base-direita     cartas
 *     90.0°  base-centro      camera
 *    147.0°  base-esquerda    janela
 */
export const CARDS: CardSpec[] = [
  {
    photo: {
      id: 'suitcase',
      src: '/img/suitcase.png',
      alt: 'Hóspede saindo da suíte com a mala',
      fit: '50% 50%',
    },
    slot: { x: COL_L, y: -330.0145 },
    benefit: {
      title: 'Checkout até as 14h.',
      lead: 'A gente entende que você dormiu tarde.',
    },
    depth: 6,
  },
  {
    photo: {
      id: 'bed',
      src: '/img/bed.png',
      alt: 'Cama desfeita na luz da manhã',
      fit: '50% 100%',
    },
    slot: { x: COL_C, y: -557.4345 },
    benefit: {
      title: 'Café sem hora marcada.',
      lead: 'A cozinha acorda quando você acorda.',
    },
    depth: 5,
  },
  {
    photo: {
      id: 'robe',
      src: '/img/robe.png',
      alt: 'Hóspede pulando na cama de roupão',
      fit: '50% 50%',
    },
    slot: { x: COL_R, y: -330.0145 },
    benefit: {
      title: 'Roupão é traje social.',
      lead: 'Ninguém aqui liga para o seu look.',
    },
    depth: 4,
  },
  {
    photo: {
      id: 'cards',
      src: '/img/cards.png',
      alt: 'Jogo de cartas no tapete da suíte',
      fit: '50% 50%',
    },
    slot: { x: COL_R, y: 335.7055 },
    benefit: {
      title: 'A noite continua aqui.',
      lead: 'Baralho, vitrola e gelo à disposição.',
    },
    depth: 3,
  },
  {
    photo: {
      id: 'camera',
      src: '/img/camera.png',
      alt: 'Casal fotografando na cama',
      fit: '50% 50%',
    },
    slot: { x: COL_C, y: 539.0155 },
    benefit: {
      title: 'Cada canto é cenário.',
      lead: 'Traz a câmera. A luz trabalha a seu favor.',
    },
    depth: 2,
  },
  {
    photo: {
      id: 'window',
      src: '/img/window.png',
      alt: 'Silhueta em frente à janela ao entardecer',
      // a origem e 16:9; o recorte vertical do Figma centraliza a silhueta
      fit: '68% 50%',
    },
    slot: { x: COL_L, y: 335.7055 },
    benefit: {
      title: 'Vista que segura o dia.',
      lead: 'O mar começa na sua janela.',
    },
    depth: 1,
  },
]

/** Copy do hero — frame 9068:838. */
export const HERO = {
  title: 'Veja a vida pela nossa moldura',
  lead: 'No centro de Balneário. A dois passos da praia, a dois passos da noite.',
} as const

/* ------------------------------------------------------------------
   Frame 9111:4 — "A parte da viagem que ninguém lembra de contar"
   Art-board de 1440 x 1607. Titulo justificado ocupando a largura toda;
   as quatro fotos moram dentro dos vaos que a justificacao abre.
   ------------------------------------------------------------------ */

/**
 * Titulo — node 9111:23.
 *
 * As quebras vem do arquivo e sao fixas: deixar o navegador quebrar sozinho
 * nao garante as mesmas seis linhas, e sao os vaos da justificacao que
 * abrigam as fotos. Posicao, corpo e tracking ficam no CSS, como no resto
 * do projeto.
 */
export const MEMOIR_TITLE = {
  lines: ['A parte', 'da viagem', 'que', 'ninguém', 'lembra', 'de contar'],
} as const

/**
 * Fotos — nodes 9111:22 / :24 / :25 / :26.
 *
 * `crop` e o enquadramento do proprio Figma, ja em porcentagem da moldura:
 * a imagem entra com `width: 100%`, altura `crop.h%` e deslocada `crop.y%`
 * para cima. Como e tudo relativo, sobrevive a escala sem distorcer.
 */
export const MEMOIR_PHOTOS = [
  {
    id: '9111:24',
    src: '/img/memoir-terrace.png',
    alt: 'Casal brindando na varanda ao entardecer',
    x: 261.39,
    y: 29.6,
    w: 365.941,
    h: 178.721,
    crop: { y: -139.62, h: 272.91 },
  },
  {
    id: '9111:22',
    src: '/img/memoir-bath.png',
    alt: 'Pés apoiados na borda da banheira',
    x: 577.47,
    y: 500.76,
    w: 836.354,
    h: 185.533,
    crop: { y: -386.68, h: 676.18 },
  },
  {
    id: '9111:26',
    src: '/img/memoir-sunset.png',
    alt: 'Jantar a dois com o mar ao fundo',
    x: 1178.51,
    y: 746.56,
    w: 235.319,
    h: 178.721,
    crop: { y: -11.3, h: 164.48 },
  },
  {
    id: '9111:25',
    src: '/img/memoir-paper.png',
    alt: 'Jornal aberto na poltrona do quarto',
    x: 1072.65,
    y: 985.55,
    w: 341.181,
    h: 178.721,
    crop: { y: -63.54, h: 285.96 },
  },
]

/**
 * Os dois paragrafos do rodape do frame — nodes 9111:19 e 9111:20.
 * O `y` e o topo da caixa de texto aparada (cap-height), nao o topo da
 * linha: os dois blocos comecam na mesma altura no arquivo.
 */
export const MEMOIR_COPY = [
  {
    id: '9111:19',
    x: 32,
    w: 672.219,
    text: 'Você volta lembrando do bar cheio, da praia lotada, da fila do posto às três da manhã. Do quarto, nunca. Aqui a gente cuidou de tudo.',
  },
  {
    id: '9111:20',
    x: 736,
    w: 672,
    text: 'O ar frio quando a porta abre e o cheiro chega antes de você, o banho depois da areia, a cama depois das cinco.',
  },
]

/* ------------------------------------------------------------------
   Frame 9111:2336 — "Quem já dormiu aqui"
   Art-board de 1440 x 778. Titulo centrado e uma fileira de quatro
   depoimentos de 320, com gutter de 32, ancorada na margem de 32.
   ------------------------------------------------------------------ */

export const VOICES_TITLE = 'Quem já dormiu aqui'

/**
 * Os depoimentos — nodes 9111:2388 / 9114:2440 / :2454 / :2468 sao os
 * quatro primeiros; o resto e a mesma ficha repetida na fileira.
 *
 * No arquivo os quatro cards trazem o mesmo texto e a mesma pessoa. Aqui
 * cada um recebe um placeholder proprio — nome, procedencia, foto e
 * citacao ficticios — so para a fila ler como fila de verdade enquanto os
 * depoimentos reais nao chegam. Nada de layout depende do conteudo, e o
 * carrossel aceita qualquer quantidade: e so acrescentar itens na lista.
 *
 * A segunda linha e cidade e mes da estadia, nao cargo e empresa: isto e
 * suite de casal, nao hotel de convencao. E o que hospedagem usa para dar
 * lastro ao depoimento — e some sem tocar no layout se nao interessar.
 *
 * As fotos sao avatares de demonstracao (i.pravatar.cc) ja baixados para
 * `public/img`, entao nada e buscado em runtime.
 */
export const VOICES = [
  {
    id: '9111:2388',
    quote:
      '“Chegamos tarde da estrada e o quarto já estava pronto. Dormimos como não dormíamos há meses.”',
    name: 'Marina Duarte',
    stay: 'Curitiba · mar 2026',
    avatar: '/img/voices-avatar-1.jpg',
  },
  {
    id: '9114:2440',
    quote:
      '“A dois quarteirões de tudo, mas quando a porta fecha parece outro mundo. Já reservamos a próxima.”',
    name: 'Rafael Menezes',
    stay: 'Porto Alegre · jan 2026',
    avatar: '/img/voices-avatar-2.jpg',
  },
  {
    id: '9114:2454',
    quote:
      '“Café às sete, mar pela janela, e ninguém para incomodar. Não saímos do prédio no primeiro dia.”',
    name: 'Camila Sato',
    stay: 'São Paulo · fev 2026',
    avatar: '/img/voices-avatar-3.jpg',
  },
  {
    id: '9114:2468',
    quote:
      '“Cada detalhe pensado — da luz da manhã à louça. Difícil achar isso em Balneário.”',
    name: 'Thiago Albuquerque',
    stay: 'Belo Horizonte · jul 2026',
    avatar: '/img/voices-avatar-4.jpg',
  },
  {
    id: 'voice-5',
    quote:
      '“Eram quatro noites e viraram seis. Nenhum de nós dois quis ir embora no domingo.”',
    name: 'Letícia Prado',
    stay: 'Florianópolis · jun 2026',
    avatar: '/img/voices-avatar-5.jpg',
  },
  {
    id: 'voice-6',
    quote:
      '“Voltamos do mar, subimos de elevador e o banho quente esperando. É esse o luxo, no fim.”',
    name: 'Bruno Tavares',
    stay: 'Rio de Janeiro · abr 2026',
    avatar: '/img/voices-avatar-6.jpg',
  },
  {
    id: 'voice-7',
    quote:
      '“Reservei em cima da hora e responderam em minutos. Chegar foi a parte fácil.”',
    name: 'Juliana Reis',
    stay: 'Londrina · mai 2026',
    avatar: '/img/voices-avatar-7.jpg',
  },
  {
    id: 'voice-8',
    quote:
      '“A vista da varanda às seis da manhã paga a viagem sozinha. Voltamos no aniversário.”',
    name: 'André Kowalski',
    stay: 'Joinville · fev 2026',
    avatar: '/img/voices-avatar-8.jpg',
  },
]

export const NAV_LINKS = [
  { label: 'Suítes', href: '#suites' },
  { label: 'A casa', href: '#a-casa' },
  { label: 'Da porta para fora', href: '#da-porta-para-fora' },
  { label: 'Antes de vir', href: '#antes-de-vir' },
]
