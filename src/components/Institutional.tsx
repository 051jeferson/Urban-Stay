import { useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { CORPORATE, NAV_LINKS, EDITORIAL_LAYOUT, INSTITUTIONAL, JOURNEY, LEGAL_LINKS } from '../design'
import '../institutional.css'

const editorialStyle = Object.fromEntries(Object.entries(EDITORIAL_LAYOUT).map(([name, value]) => [`--${name}`, `${value}px`])) as CSSProperties

export function About() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])
  return <section ref={ref} id="sobre" className="editorial about" style={editorialStyle} aria-labelledby="about-title">
    <div className="about__composition">
      <h2 id="about-title" className="about__title">{INSTITUTIONAL.about.titleLines.map(line => <span key={line}>{line}</span>)}</h2>
      <figure className="about__photo"><motion.img src="/img/memoir-paper.png" alt="Jornal aberto na poltrona, ao lado da janela" loading="lazy" style={{ y: reduced ? 0 : y }} /></figure>
      <div className="about__copy"><p>{INSTITUTIONAL.about.body}</p><p>{INSTITUTIONAL.about.closing}</p></div>
    </div>
  </section>
}

export function Stays() {
  const [active, setActive] = useState(0)
  const room = JOURNEY.rooms[active]
  const reduced = useReducedMotion()
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  return <section id="estadias" className="stay-section" style={editorialStyle} aria-labelledby="stay-title">
    <div className="editorial stay-layout">
      <div className="stay-content">
        <h2 id="stay-title" className="stay-title">{INSTITUTIONAL.stays.title}</h2>
        <div className="stay-caption" id="stay-description" aria-live="polite" aria-atomic="true"><h3>{room.title}</h3><p>{room.text}</p></div>
        <div className="stay-options" aria-label="Escolha uma fotografia" onKeyDown={event => {
          const index = event.key === 'ArrowRight' ? (active + 1) % JOURNEY.rooms.length : event.key === 'ArrowLeft' ? (active + JOURNEY.rooms.length - 1) % JOURNEY.rooms.length : event.key === 'Home' ? 0 : event.key === 'End' ? JOURNEY.rooms.length - 1 : null
          if (index === null) return
          event.preventDefault()
          setActive(index)
          buttons.current[index]?.focus()
        }}>
          {JOURNEY.rooms.map((item, index) => <button key={item.image} ref={node => { buttons.current[index] = node }} type="button" aria-label={item.title} aria-pressed={active === index} aria-controls="stay-photo stay-description" onClick={() => setActive(index)}><img src={item.image} alt="" loading="lazy" /><span>{item.label}</span></button>)}
        </div>
      </div>
      <div className="stay-photo" id="stay-photo">
        <AnimatePresence initial={false}>
          <motion.img key={room.image} src={room.image} alt={room.alt} loading="lazy" initial={reduced ? { opacity: 0 } : { clipPath: 'inset(0 100% 0 0)' }} animate={{ opacity: 1, clipPath: 'inset(0 0% 0 0)' }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }} />
        </AnimatePresence>
      </div>
    </div>
  </section>
}

export function Destination() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const opening = useTransform(scrollYProgress, [0, 0.4, 1], ['inset(0 12% 0 12%)', 'inset(0 0% 0 0%)', 'inset(0 0% 0 0%)'])
  const y = useTransform(scrollYProgress, [0, 1], ['-5%', '5%'])
  return <section id="destino" ref={ref} className="destination" style={editorialStyle} aria-labelledby="destination-title">
    <div className="editorial destination__frame">
      <h2 id="destination-title" className="destination__title"><span>{INSTITUTIONAL.location.titleLines[0]}</span><span>{INSTITUTIONAL.location.titleLines[1]}</span></h2>
      <motion.figure className="destination__photo" style={{ clipPath: reduced ? undefined : opening }}><motion.img src="/img/window.png" alt="Vista do mar e da cidade pela janela" loading="lazy" style={{ y: reduced ? 0 : y }} /></motion.figure>
      <div className="destination__note"><p>{INSTITUTIONAL.location.body}</p><a className="text-link" href="https://www.google.com/maps/search/?api=1&query=Balne%C3%A1rio+Cambori%C3%BA+Santa+Catarina" target="_blank" rel="noreferrer">{INSTITUTIONAL.location.link}<span aria-hidden="true">↗</span></a></div>
    </div>
  </section>
}

export function Questions() {
  const [active, setActive] = useState<number | null>(null)
  const reduced = useReducedMotion()
  return <section id="duvidas" className="editorial questions" aria-labelledby="questions-title">
    <h2 id="questions-title">{INSTITUTIONAL.faqTitle}</h2>
    <div className="questions__list">{INSTITUTIONAL.faq.map((item, index) => {
      const open = active === index
      return <div className="question" data-open={open} key={item.question}>
        <h3><button id={`question-${index}`} type="button" aria-expanded={open} aria-controls={`answer-${index}`} onClick={() => setActive(open ? null : index)}><span>{item.question}</span><span className="faq-plus" aria-hidden="true"><i /><i /></span></button></h3>
        <motion.div id={`answer-${index}`} className="question__answer" role="region" aria-labelledby={`question-${index}`} aria-hidden={!open} inert={!open} initial={false} animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }} transition={{ height: { duration: reduced ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: reduced ? 0 : 0.25, delay: open && !reduced ? 0.1 : 0 } }}>
          <motion.p initial={false} animate={{ y: open || reduced ? 0 : 12 }} transition={{ duration: reduced ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}>{item.answer}</motion.p>
        </motion.div>
      </div>
    })}</div>
  </section>
}

export function Footer() {
  const reduced = useReducedMotion()
  return <footer className="site-footer"><div className="editorial">
    <div className="footer-corporate"><p>{CORPORATE.footerDescription}</p><div><nav aria-label="Navegação do rodapé"><a href="/">{CORPORATE.home}</a>{NAV_LINKS.map(link => <a key={link.href} href={link.href}>{link.label}</a>)}</nav></div><div><address>{CORPORATE.contact.email}<br />{CORPORATE.contact.phone}</address><p className="corporate-note">{CORPORATE.contact.notice}</p></div></div>
    <div className="footer-signature">
      <img className="footer-logo" src="/img/logo.svg" alt="Urban Stay" loading="lazy" />
      <motion.div className="footer-signature__reveal" aria-hidden="true" initial={reduced ? false : 'hidden'} whileInView="visible" viewport={{ once: true, amount: 0.7 }}>
        {Array.from({ length: 7 }, (_, i) => {
          const left = i * 100 / 7
          const right = 100 - (i + 1) * 100 / 7
          return <motion.div key={i} className="footer-signature__slice" variants={{ hidden: { clipPath: `inset(${i % 2 ? 0 : 100}% ${right}% ${i % 2 ? 100 : 0}% ${left}%)` }, visible: { clipPath: `inset(0% ${right}% 0% ${left}%)` } }} transition={{ duration: reduced ? 0 : 1.15, delay: reduced ? 0 : i * 0.07, ease: [0.22, 1, 0.36, 1] }} />
        })}
      </motion.div>
    </div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} Urban Stay®</span><nav aria-label="Informações legais">{LEGAL_LINKS.map(link => <a key={link.href} href={link.href}>{link.label}</a>)}</nav></div>
  </div></footer>
}
