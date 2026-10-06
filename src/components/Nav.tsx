import { motion } from 'framer-motion'
import { useRef } from 'react'
import { CORPORATE, NAV_LINKS } from '../design'
import { ENTER_DELAY, riseIn, sequence } from '../lib/motion'

const NAV_STAGGER = 0.09
const navSequence = sequence(NAV_STAGGER, ENTER_DELAY)
const navItem = riseIn()
const navLogo = riseIn(1, ENTER_DELAY)

export function Nav() {
  const menu = useRef<HTMLDialogElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)
  return (
    <>
      <nav className="nav" aria-label="Principal">
        <motion.a
          className="nav__logo"
          href="/"
          aria-label="Urban Stay"
          variants={navLogo}
          initial="hidden"
          animate="show"
        >
          <img src="/img/logo.svg" alt="Urban Stay" width={202} height={20} />
        </motion.a>

        <motion.div
          className="nav__links"
          variants={navSequence}
          initial="hidden"
          animate="show"
        >
          {[{ label: CORPORATE.home, href: '/' }, ...NAV_LINKS].map((link) => (
            // o wrapper carrega a entrada; a opacidade 0.8 e o hover
            // continuam com o CSS do proprio link
            <motion.span key={link.href} className="nav__link" variants={navItem}>
              <a href={link.href} aria-current={window.location.pathname === link.href ? 'page' : undefined}>{link.label}</a>
            </motion.span>
          ))}
        </motion.div>
        <button className="nav-menu-toggle" ref={toggle} type="button" aria-haspopup="dialog" aria-controls="mobile-menu" onClick={() => menu.current?.showModal()}>{CORPORATE.menu}</button>
      </nav>
      <dialog id="mobile-menu" className="mobile-menu" ref={menu} aria-label="Navegação principal" onClose={() => toggle.current?.focus()}>
        <button type="button" onClick={() => menu.current?.close()}>{CORPORATE.close}</button>
        <nav aria-label="Menu móvel"><a href="/">{CORPORATE.home}</a>{NAV_LINKS.map(link => <a key={link.href} href={link.href} aria-current={window.location.pathname === link.href ? 'page' : undefined}>{link.label}</a>)}</nav>
      </dialog>
    </>
  )
}
