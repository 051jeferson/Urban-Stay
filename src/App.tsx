import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import { Loader, LoaderPreview } from './components/Loader'
import { Nav } from './components/Nav'
import { Stage } from './components/Stage'
import { Footer } from './components/Institutional'
import { CorporateDirectory, CorporateNext } from './components/Corporate'
import { InternalContent } from './components/InternalPages'
import type { CorporatePage } from './components/Corporate'
import { CORPORATE } from './design'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { useDesignScale } from './hooks/useDesignScale'

/**
 * `?loader` troca o site pela vitrine das variantes do loading. E um atalho
 * de desenvolvimento para escolher a animacao — quando a variante estiver
 * decidida, some com esta constante, com o `if` la embaixo e com o
 * `LoaderPreview` do `Loader.tsx`.
 */
const PREVIEW = new URLSearchParams(window.location.search).has('loader')
const pageKey = window.location.pathname.split('/').pop()?.replace('.html', '') ?? ''
const page = Object.hasOwn(CORPORATE.pages, pageKey) ? pageKey as CorporatePage : null

/** A marca cobre a pagina so na primeira carga da sessao; voltar para a
 * home (ou recarregar) nao repete o loading. */
const SEEN_KEY = 'urban-stay:seen'
const seen = sessionStorage.getItem(SEEN_KEY) === '1'

export default function App() {
  useSmoothScroll()
  useDesignScale()

  const [loading, setLoading] = useState(!page && !seen)
  // identidade estavel: o efeito do Loader depende de `onDone`
  const done = useCallback(() => {
    sessionStorage.setItem(SEEN_KEY, '1')
    setLoading(false)
  }, [])
  // mesmo pulando o loader, a sessao ja conta como vista
  useEffect(() => {
    sessionStorage.setItem(SEEN_KEY, '1')
  }, [])

  if (PREVIEW) return <LoaderPreview />

  return (
    // `reducedMotion="user"` acompanha o mesmo respeito que o Lenis ja tem
    // por `prefers-reduced-motion`: as entradas viram corte seco, sem curso.
    <MotionConfig reducedMotion="user">
      {/* a marca cobre a pagina enquanto a fonte assenta; sai subindo */}
      <AnimatePresence>
        {loading && <Loader variant="pulso" onDone={done} />}
      </AnimatePresence>

      <div className={page ? 'internal-backdrop' : 'backdrop'} aria-hidden />
      <Nav />
      <a className="skip-link" href={page ? '#conteudo' : '#institucional'}>{CORPORATE.skip}</a>
      <main id="conteudo" tabIndex={-1}>
        {page ? <InternalContent page={page} /> : <><Stage /><CorporateDirectory /><CorporateNext /></>}
      </main>
      <Footer />
    </MotionConfig>
  )
}
