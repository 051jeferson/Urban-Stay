import { useEffect, useState } from 'react'
import { FRAME_W, BENEFITS_H } from '../design'

export type DesignScale = {
  /** fator de escala do art-board de 1440 */
  k: number
  vw: number
  vh: number
  compact: boolean
}

const COMPACT_FRAME = 860

function measure(): DesignScale {
  const vw = document.documentElement.clientWidth
  const vh = window.innerHeight
  const compact = vw < 1024
  // Acima de 1440 a arte para de crescer: o frame do Figma fica centrado
  // e o que passa das margens e recortado, como no proprio arquivo.
  const k = compact ? vw / COMPACT_FRAME : Math.min(vw, FRAME_W) / FRAME_W
  return { k, vw, vh, compact }
}

/** Largura do art-board visivel, em unidades de design (1440 ou 860). */
export function frameWidth(s: DesignScale) {
  return s.compact ? COMPACT_FRAME : Math.min(s.vw / s.k, FRAME_W)
}

/**
 * Quanto a composicao de beneficios precisa encolher para caber na altura da
 * janela. Em 960 de altura vale 1 — ou seja, identico ao frame.
 */
export function benefitsFit(s: DesignScale) {
  return Math.min(1, s.vh / s.k / BENEFITS_H)
}

/**
 * Publica `--k` no `:root` e devolve as medidas. Todo o CSS multiplica os
 * valores do Figma por essa variavel, entao de 1440px para cima o render e 1:1.
 */
export function useDesignScale(): DesignScale {
  const [scale, setScale] = useState<DesignScale>(() =>
    typeof window === 'undefined'
      ? { k: 1, vw: FRAME_W, vh: 960, compact: false }
      : measure(),
  )

  useEffect(() => {
    const apply = () => {
      const next = measure()
      setScale(next)

      const root = document.documentElement
      const frame = frameWidth(next)
      const fb = benefitsFit(next)

      root.style.setProperty('--k', String(next.k))
      // escala do bloco de beneficios: k, encolhido se a janela for baixa
      root.style.setProperty('--kb', String(next.k * fb))
      // meia largura do art-board visivel, em px
      root.style.setProperty('--frame-half', `${(frame * next.k) / 2}px`)
      // sobra lateral quando a janela passa de 1440 (alinhamento, nao recorte)
      root.style.setProperty(
        '--side-clip',
        `${Math.max(0, (next.vw - frame * next.k) / 2)}px`,
      )
    }

    apply()
    window.addEventListener('resize', apply)
    window.addEventListener('orientationchange', apply)
    return () => {
      window.removeEventListener('resize', apply)
      window.removeEventListener('orientationchange', apply)
    }
  }, [])

  return scale
}
