export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/** Progresso normalizado dentro de uma janela [from, to]. */
export const range = (v: number, from: number, to: number) =>
  clamp01((v - from) / (to - from))

export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

export const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5)

export const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

export const DEG = Math.PI / 180

/** smoothstep classico — acelera e desacelera sem overshoot. */
export const smoothstep = (t: number) => {
  const c = clamp01(t)
  return c * c * (3 - 2 * c)
}

/** Mistura linear e smoothstep: assenta em cada parada sem travar. */
export const settle = (t: number, amount = 0.75) =>
  lerp(t, smoothstep(t), amount)
