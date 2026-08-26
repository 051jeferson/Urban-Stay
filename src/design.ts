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

export const NAV_LINKS = [
  { label: 'Suítes', href: '#suites' },
  { label: 'A casa', href: '#a-casa' },
  { label: 'Da porta para fora', href: '#da-porta-para-fora' },
  { label: 'Antes de vir', href: '#antes-de-vir' },
]
