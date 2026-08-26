import { Nav } from './components/Nav'
import { Stage } from './components/Stage'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { useDesignScale } from './hooks/useDesignScale'

export default function App() {
  useSmoothScroll()
  useDesignScale()

  return (
    <>
      <div className="backdrop" aria-hidden />
      <Nav />
      <main>
        <Stage />
      </main>
      <footer className="outro">
        <span>Urban Stay® — Balneário Camboriú</span>
        <span>© {new Date().getFullYear()}</span>
      </footer>
    </>
  )
}
