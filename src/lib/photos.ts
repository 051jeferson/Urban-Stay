/** Variantes locais: nada é buscado no banco de imagens durante a visita. */
export function photoSrcSet(src: string) {
  if (!src.startsWith('/img/editorial/')) return undefined
  return [480, 800, 1000].map(width =>
    `${src.replace('-1000.webp', `-${width}.webp`)} ${width}w`,
  ).join(', ')
}

// Maior largura transformada do card, incluindo o zoom inicial da fotografia.
export const STAGE_PHOTO_SIZES = '(max-width: 1023px) 76vw, (max-width: 1440px) 33vw, 470px'
