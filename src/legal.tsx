import { createRoot } from 'react-dom/client'
import { CORPORATE_LAYOUT } from './design'
import { LEGAL_PAGES } from './legalContent'
import { useDesignScale } from './hooks/useDesignScale'
import { Footer } from './components/Institutional'
import './styles.css'
import './corporate.css'
import './legal.css'

for (const [name, value] of Object.entries(CORPORATE_LAYOUT)) {
  document.documentElement.style.setProperty(`--corporate-${name}`, `${value}px`)
}

function LegalPage() {
  useDesignScale()
  const page = LEGAL_PAGES.find(item => item.href === window.location.pathname) ?? LEGAL_PAGES[0]
  return <>
    <a className="legal-skip" href="#conteudo">Ir para o conteúdo</a>
    <header className="legal-header"><a href="/" aria-label="Urban Stay — página inicial"><img src="/img/logo.svg" alt="Urban Stay" width="202" height="20" /></a></header>
    <main id="conteudo" className="legal-main">
      <h1>{page.title}</h1>
      <p className="legal-date">Atualizado em 28 de setembro de 2026</p>
      <p className="legal-intro">{page.intro}</p>
      {page.sections.map(section => <section key={section.title}><h2>{section.title}</h2>{section.paragraphs.map(text => <p key={text}>{text}</p>)}</section>)}
      <p className="legal-source">Referência: <a href="https://www.gov.br/anpd/pt-br/assuntos/titular-de-dados" target="_blank" rel="noreferrer">Autoridade Nacional de Proteção de Dados</a>.</p>
    </main>
    <Footer />
  </>
}

createRoot(document.getElementById('root')!).render(<LegalPage />)
