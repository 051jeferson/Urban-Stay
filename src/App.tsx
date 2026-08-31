import { MotionConfig, motion } from 'framer-motion'
import { Memoir } from './components/Memoir'
import { Nav } from './components/Nav'
import { Stage } from './components/Stage'
import { Voices } from './components/Voices'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { useDesignScale } from './hooks/useDesignScale'
import { riseIn } from './lib/motion'

/** O rodape aparece quando entra em cena; 0.7 e a opacidade do CSS. */
const outro = riseIn(0.7)

export default function App() {
  useSmoothScroll()
  useDesignScale()

  return (
    // `reducedMotion="user"` acompanha o mesmo respeito que o Lenis ja tem
    // por `prefers-reduced-motion`: as entradas viram corte seco, sem curso.
    <MotionConfig reducedMotion="user">
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
