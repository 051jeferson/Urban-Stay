import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** Lenis e ScrollTrigger compartilham o mesmo relógio de animação. */
export function useSmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const touch = window.matchMedia('(pointer: coarse)')
    let cleanup: (() => void) | undefined

    const sync = () => {
      cleanup?.()
      cleanup = undefined
      // No toque ou com movimento reduzido, mantém a rolagem nativa.
      if (reduced.matches || touch.matches) return

      const lenis = new Lenis({
        anchors: true,
        duration: 1.15,
        lerp: 0.09,
        wheelMultiplier: 1,
        touchMultiplier: 1.4,
      })
      lenis.on('scroll', ScrollTrigger.update)
      const tick = (time: number) => lenis.raf(time * 1000)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)
      cleanup = () => {
        gsap.ticker.remove(tick)
        lenis.destroy()
      }
    }

    sync()
    reduced.addEventListener('change', sync)
    touch.addEventListener('change', sync)
    return () => {
      reduced.removeEventListener('change', sync)
      touch.removeEventListener('change', sync)
      cleanup?.()
    }
  }, [])
}
