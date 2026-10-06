import { useRef, useState } from 'react'
import type { CSSProperties, FormEvent } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { CORPORATE, INTERNAL, INTERNAL_LAYOUT, LEGAL_LINKS, NAV_LINKS } from '../design'
import type { CorporatePage } from './Corporate'
import { photoSrcSet } from '../lib/photos'
import '../internal.css'

const layout = Object.fromEntries(Object.entries(INTERNAL_LAYOUT).map(([name, value]) => [`--i-${name}`, `${value}px`])) as CSSProperties
type Photo = { src: string; alt: string; caption: string }

function Photograph({ photo, className = '', eager = false }: { photo: Photo; className?: string; eager?: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  // parallax lento: a foto sobe enquanto a pagina desce e volta ao
  // centro quando a secao sai; o scale 1.12 cobre o curso de ±6%
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])
  return <figure ref={ref} className={`internal-photo ${className}`}>
    <span className="internal-photo__frame">
      <motion.img src={photo.src} srcSet={photoSrcSet(photo.src)} sizes="(max-width: 1023px) 100vw, 70vw" alt={photo.alt} loading={eager ? 'eager' : 'lazy'} decoding="async" style={{ scale: 1.12, y: reduced ? 0 : y }} />
    </span>
    <figcaption>{photo.caption}</figcaption>
  </figure>
}

function PageLabel({ page }: { page: CorporatePage }) {
  return <div className="internal-label"><span>{CORPORATE.pages[page].label}</span><span>{INTERNAL.location}</span></div>
}

function Company() {
  const content = INTERNAL.company
  return <>
    <header className="internal-frame company-cover">
      <PageLabel page="empresa" />
      <div className="company-cover__spread">
        <h1>{content.title.map(line => <span key={line}>{line}</span>)}</h1>
        <p className="company-cover__lead">{content.lead}</p>
        <Photograph photo={content.photo} className="company-cover__main" eager />
        <Photograph photo={content.inset} className="company-cover__inset" />
      </div>
    </header>
    <section className="internal-frame company-story" aria-labelledby="company-story-title">
      <p className="internal-eyebrow">{content.label}</p>
      <h2 id="company-story-title">{content.statement}</h2>
      <div className="company-story__text">{content.paragraphs.map(text => <p key={text}>{text}</p>)}</div>
    </section>
    <section className="company-city">
      <div className="internal-frame company-city__spread">
        <Photograph photo={content.closingPhoto} />
        <div><h2>{content.closing}</h2><p>{content.closingText}</p><a className="internal-link" href="/destino.html">{content.closingLink}<span aria-hidden="true">↗</span></a></div>
      </div>
    </section>
  </>
}

function Activity() {
  const content = INTERNAL.activity
  // um painel aberto por vez, como o `name` fazia no <details>
  const [open, setOpen] = useState(0)
  const reduced = useReducedMotion()
  return <>
    <header className="internal-frame activity-cover">
      <PageLabel page="atuacao" />
      <h1>{content.title}</h1>
      <p>{content.intro}</p>
    </header>
    <section className="internal-frame activity-index" aria-label={content.label}>
      {content.items.map((item, index) => {
        const isOpen = open === index
        return <div key={item.title} className={isOpen ? 'activity-entry is-open' : 'activity-entry'}>
          <h2 className="activity-entry__heading">
            <button type="button" id={`activity-heading-${index}`} aria-expanded={isOpen} aria-controls={`activity-panel-${index}`} onClick={() => setOpen(isOpen ? -1 : index)}>
              <span>{item.title}</span>
              <span className="activity-entry__tag">{item.tag}</span>
              <span className="activity-entry__toggle" aria-hidden="true" />
            </button>
          </h2>
          {/* o painel desliza na vertical enquanto a foto abre da esquerda */}
          <motion.div id={`activity-panel-${index}`} className="activity-entry__body" role="region" aria-labelledby={`activity-heading-${index}`} inert={!isOpen} initial={false} animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }} transition={{ height: { duration: reduced ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: reduced ? 0 : 0.45 } }}>
            <div className="activity-entry__grid">
              <motion.img src={item.image} srcSet={photoSrcSet(item.image)} sizes="(max-width: 1023px) 100vw, 50vw" alt={item.alt} loading={index === 0 ? 'eager' : 'lazy'} decoding="async" initial={false} animate={{ clipPath: isOpen ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)' }} transition={{ duration: reduced ? 0 : 0.85, ease: [0.22, 1, 0.36, 1] }} />
              <div><p className="activity-entry__lead">{item.text}</p><p>{item.detail}</p><a className="internal-link" href={item.href}>{item.link}<span aria-hidden="true">↗</span></a></div>
            </div>
          </motion.div>
        </div>
      })}
    </section>
  </>
}

function Destination() {
  const content = INTERNAL.destination
  return <>
    <header className="internal-frame destination-cover">
      <PageLabel page="destino" />
      <div className="destination-cover__spread">
        <div className="destination-cover__title"><p className="internal-eyebrow">{content.region}</p><h1>{content.title.map(line => <span key={line}>{line}</span>)}</h1></div>
        <Photograph photo={content.photo} eager />
      </div>
    </header>
    <section className="internal-frame destination-story" aria-labelledby="destination-story-title">
      <div className="destination-story__spread">
        <Photograph photo={content.detailPhoto} />
        <div><h2 id="destination-story-title">{content.statement}</h2>{content.paragraphs.map(text => <p key={text}>{text}</p>)}<a className="internal-link" href={content.mapHref} target="_blank" rel="noreferrer">{content.mapLabel}<span aria-hidden="true">↗</span></a><p className="internal-note">{content.note}</p></div>
      </div>
    </section>
  </>
}

function Contact() {
  const content = INTERNAL.contact
  const details = CORPORATE.contact
  const [summary, setSummary] = useState('')
  const [status, setStatus] = useState('')
  const result = useRef<HTMLDivElement>(null)
  const requested = new URLSearchParams(window.location.search).get('assunto')
  const subject = details.subjects.find(item => item === requested) ?? details.subjects[0]
  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setSummary([`${content.name}: ${data.get('nome')}`, `${content.organization}: ${data.get('empresa')}`, `${content.email}: ${data.get('email')}`, `${content.subject}: ${data.get('assunto')}`, '', data.get('mensagem')].join('\n'))
    setStatus(content.ready)
    requestAnimationFrame(() => result.current?.focus())
  }
  return <>
    <header className="internal-frame contact-cover"><PageLabel page="contato" /><div><h1>{content.title}</h1><p>{content.lead}</p></div></header>
    <section className="internal-frame contact-desk" aria-labelledby="contact-form-title">
      <aside className="contact-address">
        <dl><dt>{content.emailLabel}</dt><dd className="contact-address__email">{details.email}</dd><dt>{content.phoneLabel}</dt><dd>{details.phone}</dd><dt>{content.addressLabel}</dt><dd>{details.address}</dd></dl>
        <p className="internal-note">{content.note}</p>
        <details className="contact-company"><summary>{content.companyLabel}</summary><p>{details.company}<br />{details.registration}</p></details>
      </aside>
      <form className="contact-form" onSubmit={prepare} onChange={() => { setSummary(''); setStatus('') }}>
        <h2 id="contact-form-title">{content.formTitle}</h2>
        <label>{content.name}<input name="nome" autoComplete="name" required maxLength={120} /></label>
        <label>{content.organization}<input name="empresa" autoComplete="organization" required maxLength={160} /></label>
        <label>{content.email}<input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
        <label>{content.subject}<select name="assunto" defaultValue={subject}>{details.subjects.map(item => <option key={item}>{item}</option>)}</select></label>
        <label className="contact-form__wide">{content.message}<textarea name="mensagem" rows={4} required maxLength={5000} /></label>
        <div className="contact-form__submit"><p className="internal-note">{content.formNote}</p><button type="submit">{content.submit}<span aria-hidden="true">↗</span></button></div>
        <p className="internal-note contact-form__wide">{content.privacy} <a href="/privacidade.html">{content.privacyLink}</a></p>
        <p className="contact-form__wide" role="status">{status}</p>
        {summary && <div className="contact-result contact-form__wide" ref={result} tabIndex={-1} aria-label={content.summaryTitle}><h3>{content.summaryTitle}</h3><pre>{summary}</pre><button className="internal-link" type="button" onClick={async () => { try { await navigator.clipboard.writeText(summary); setStatus(content.copied) } catch { setStatus(content.copyError) } }}>{content.copy}</button></div>}
      </form>
    </section>
  </>
}

export function InternalContent({ page }: { page: CorporatePage }) {
  return <div className={`internal-page internal-page--${page}`} style={layout}>
    {page === 'empresa' && <Company />}
    {page === 'atuacao' && <Activity />}
    {page === 'destino' && <Destination />}
    {page === 'contato' && <Contact />}
  </div>
}

export function InternalFooter() {
  return <footer className="internal-footer" style={layout}>
    <div className="internal-frame">
      <div className="internal-footer__body"><div><a href="/" aria-label="Urban Stay — início"><img src="/img/logo.svg" alt="Urban Stay" /></a><p>{INTERNAL.footer.signature}</p></div><nav aria-label={INTERNAL.footer.linksLabel}>{NAV_LINKS.map(link => <a href={link.href} key={link.href}>{link.label}</a>)}</nav></div>
      <div className="internal-footer__bottom"><span>© {new Date().getFullYear()} Urban Stay®</span><nav aria-label={INTERNAL.footer.legalLabel}>{LEGAL_LINKS.map(link => <a href={link.href} key={link.href}>{link.label}</a>)}</nav></div>
    </div>
  </footer>
}
