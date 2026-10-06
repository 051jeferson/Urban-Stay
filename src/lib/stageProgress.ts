/** Ritmo mobile derivado do timeline 9068:838 → 9068:919.
 * Desktop: 820svh de track, 720svh de percurso; mobile: 620/520.
 * Os 403,2svh da esteira são preservados. Só a abertura perde 200svh.
 */
const CAROUSEL_START = 0.44
const MOBILE_INTRO_END = (520 - 720 * (1 - CAROUSEL_START)) / 520

export function stageProgress(progress: number, compact: boolean) {
  if (!compact) return progress
  if (progress <= MOBILE_INTRO_END) {
    return progress / MOBILE_INTRO_END * CAROUSEL_START
  }
  return CAROUSEL_START + (progress - MOBILE_INTRO_END) /
    (1 - MOBILE_INTRO_END) * (1 - CAROUSEL_START)
}

export function heroReleaseProgress(release: number, compact: boolean) {
  return compact ? release / CAROUSEL_START * MOBILE_INTRO_END : release
}
