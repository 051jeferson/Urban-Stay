import { useCallback, useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { Loader, LoaderPreview } from './components/Loader'
import { Memoir } from './components/Memoir'
import { Nav } from './components/Nav'
import { Stage } from './components/Stage'
import { Voices } from './components/Voices'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { useDesignScale } from './hooks/useDesignScale'
import { riseIn } from './lib/motion'

/** O rodape aparece quando entra em cena; 0.7 e a opacidade do CSS. */
const outro = riseIn(0.7)

/**
 * `?loader` troca o site pela vitrine das variantes do loading. E um atalho
 * de desenvolvimento para escolher a animacao — quando a variante estiver
 * decidida, some com esta constante, com o `if` la embaixo e com o
 * `LoaderPreview` do `Loader.tsx`.
 */
const PREVIEW = new URLSearchParams(window.location.search).has('loader')

export default function App() {
  useSmoothScroll()
  useDesignScale()

  const [loading, setLoading] = useState(true)
  // identidade estavel: o efeito do Loader depende de `onDone`
  const done = useCallback(() => setLoading(false), [])

  if (PREVIEW) return <LoaderPreview />

  return (
    // `reducedMotion="user"` acompanha o mesmo respeito que o Lenis ja tem
    // por `prefers-reduced-motion`: as entradas viram corte seco, sem curso.
    <MotionConfig reducedMotion="user">
      {/* a marca cobre a pagina enquanto a fonte assenta; sai subindo */}
      <AnimatePresence>
        {loading && <Loader variant="pulso" onDone={done} />}
      </AnimatePresence>

      <div className="backdrop" aria-hidden />
      <Nav />
      <main>
        <Stage />
        <Memoir />
        <Voices />
      </main>
      <motion.footer
        className="outro"
        variants={outro}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
      >
        <span>Urban Stay® — Balneário Camboriú</span>
        <span>© {new Date().getFullYear()}</span>
      </motion.footer>
    </MotionConfig>
  )
}
