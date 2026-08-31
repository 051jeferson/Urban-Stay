import type { Variants } from 'framer-motion'

/**
 * Vocabulario de entrada — Framer Motion.
 *
 * Regra de convivencia com o palco: o `draw` de `Stage.tsx` continua dono
 * dos transforms dos cards, do `.hero` e das linhas de beneficio. O que
 * entra aqui sao apenas as aparicoes de carregamento (navbar, copy do hero,
 * rodape), sempre em elementos que o loop nao toca.
 *
 * O tom e de luxo: percurso curto, duracao longa, saida rapida que assenta
 * devagar. Nada salta; tudo chega.
 */

/** Mesma curva do token `--ease-out` do styles.css. */
export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1]

/** Expo-out — o gesto caro das mascaras: arranca e assenta quase parando. */
export const EASE_MASK: [number, number, number, number] = [0.16, 1, 0.3, 1]

/** Respiro antes da primeira aparicao, para as fontes ja terem assentado. */
export const ENTER_DELAY = 0.2

/**
 * Container: nao anima nada por conta propria, so escalona os filhos.
 * `delayChildren` conta a partir da montagem.
 */
export const sequence = (stagger: number, delay = 0): Variants => ({
  hidden: {},
  show: {
    transition: { delayChildren: delay, staggerChildren: stagger },
  },
})

/**
 * Palavra (ou linha) de titulo: sobe e acende.
 *
 * `from` e relativo a altura do proprio elemento, entao precisa encolher
 * quando o corpo cresce — 38% de uma linha de 266px seria um salto.
 *
 * De proposito sem `overflow: hidden` na palavra. Um inline-block recortado
 * passa a ter a borda inferior como baseline (regra do CSS), o que moveria
 * o titulo em relacao ao Figma — e `line-height: 0.9` deixa esse desvio
 * visivel. Sem recorte, a palavra continua assentando na baseline do texto
 * e a geometria fica intacta.
 */
export const wordRise = (from = '38%'): Variants => ({
  hidden: { opacity: 0, y: from },
  show: {
    opacity: 1,
    y: '0%',
    transition: { duration: 1.15, ease: EASE_MASK },
  },
})

/**
 * Aparicao discreta: 18px de percurso e nada mais.
 *
 * `to` permite parar numa opacidade que ja existe no CSS (0.8 dos links,
 * 0.7 do rodape) em vez de estourar para 1. `delay` vai dentro da variante
 * de proposito — transicao declarada em variante ganha da prop `transition`,
 * entao um atraso passado por fora seria ignorado.
 */
export const riseIn = (to = 1, delay = 0): Variants => ({
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: to,
    y: 0,
    transition: { duration: 0.95, delay, ease: EASE_OUT },
  },
})

/** Divide a frase em palavras preservando a ordem — uma mascara por palavra. */
export const words = (text: string) => text.split(' ')
