import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import 'lenis/dist/lenis.css'
import './styles.css'
import { CORPORATE_LAYOUT } from './design'

for (const [name, value] of Object.entries(CORPORATE_LAYOUT)) {
  document.documentElement.style.setProperty(`--corporate-${name}`, `${value}px`)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
