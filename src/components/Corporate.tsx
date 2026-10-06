import { useState } from 'react'
import type { FormEvent } from 'react'
import { CORPORATE } from '../design'
import '../corporate.css'

export type CorporatePage = keyof typeof CORPORATE.pages

export function CorporateDirectory() {
  return <section id="institucional" className="editorial corporate-directory">
    <p className="corporate-kicker">{CORPORATE.eyebrow}</p>
    <div className="corporate-intro"><h2>{CORPORATE.homeTitle}</h2><p>{CORPORATE.homeBody}</p></div>
    <div className="corporate-links">{Object.entries(CORPORATE.pages).map(([key, page], index) => <a href={`/${key}.html`} key={key}><span className="corporate-number">0{index + 1}</span><h3>{page.label}</h3><p>{page.description}</p><span aria-hidden="true">↗</span></a>)}</div>
  </section>
}

export function CorporateNext() {
  return <section className="editorial corporate-next"><h2>{CORPORATE.nextTitle}</h2><div><p>{CORPORATE.nextBody}</p><a className="internal-link" href="/contato.html">{CORPORATE.contactLabel}<span aria-hidden="true">↗</span></a></div></section>
}

function ContactForm() {
  const [summary, setSummary] = useState('')
  const [status, setStatus] = useState('')
  const content = CORPORATE.contact
  const requested = new URLSearchParams(window.location.search).get('assunto')
  const subject = content.subjects.find(item => item === requested) ?? content.subjects[0]
  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setSummary([`${content.name}: ${data.get('nome')}`, `${content.organization}: ${data.get('empresa')}`, `${content.reply}: ${data.get('email')}`, `${content.subject}: ${data.get('assunto')}`, '', data.get('mensagem')].join('\n'))
    setStatus(content.prepared)
  }
  return <div className="editorial corporate-contact">
    <aside><p className="corporate-kicker">{CORPORATE.footerContact}</p><h2>{content.formTitle}</h2><p>{content.formBody}</p><dl><dt>E-mail</dt><dd>{content.email}</dd><dt>Telefone</dt><dd>{content.phone}</dd><dt>Empresa</dt><dd>{content.company}<br />{content.registration}</dd><dt>Endereço</dt><dd>{content.address}</dd></dl><p className="corporate-note">{content.notice}</p></aside>
    <form onSubmit={prepare} onChange={() => { setSummary(''); setStatus('') }}>
      <label>{content.name}<input name="nome" autoComplete="name" required maxLength={120} /></label>
      <label>{content.organization}<input name="empresa" autoComplete="organization" required maxLength={160} /></label>
      <label>{content.reply}<input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
      <label>{content.subject}<select name="assunto" defaultValue={subject}>{content.subjects.map(item => <option key={item}>{item}</option>)}</select></label>
      <label className="corporate-form-wide">{content.message}<textarea name="mensagem" rows={5} required maxLength={5000} /></label>
      <p className="corporate-form-wide corporate-note">{content.privacy} <a href="/privacidade.html">Privacidade</a></p>
      <button className="btn btn--solid corporate-form-wide" type="submit">{content.submit} <span aria-hidden="true">↗</span></button>
      <p className="corporate-form-wide" role="status">{status}</p>
      {summary && <div className="corporate-form-wide corporate-summary"><pre>{summary}</pre><button className="text-link" type="button" onClick={async () => { try { await navigator.clipboard.writeText(summary); setStatus(content.copied) } catch { setStatus(content.copyError) } }}>{content.copy}</button></div>}
    </form>
  </div>
}

export function CorporateContent({ page }: { page: CorporatePage }) {
  const content = CORPORATE.pages[page]
  return <>
    <header className="editorial corporate-header">
      <nav className="corporate-breadcrumb" aria-label="Localização"><a href="/">{CORPORATE.home}</a><span aria-hidden="true">/</span><span aria-current="page">{content.label}</span></nav>
      <p className="corporate-kicker">Urban Stay® · {content.label}</p><h1>{content.title}</h1><p className="corporate-description">{content.description}</p>
      {page !== 'contato' && <figure><img src={content.image} alt={content.alt} fetchPriority="high" /></figure>}
    </header>
    {page === 'empresa' && <section className="editorial corporate-story"><p className="corporate-lead">{CORPORATE.intro}</p><h2>{CORPORATE.principlesTitle}</h2><div className="corporate-columns">{CORPORATE.principles.map((item, index) => <article key={item.title}><span className="corporate-number">0{index + 1}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></section>}
    {page === 'atuacao' && <section className="editorial corporate-story"><h2>{CORPORATE.areasTitle}</h2><div className="corporate-services">{CORPORATE.areas.map((item, index) => <article key={item.title}><span className="corporate-number">0{index + 1}</span><h3>{item.title}</h3><div><p>{item.text}</p><a className="text-link" href={item.href}>{item.link}<span aria-hidden="true">↗</span></a></div></article>)}</div></section>}
    {page === 'destino' && <section className="editorial corporate-story"><div className="corporate-columns corporate-columns--two">{CORPORATE.destination.map(item => <article key={item.title}><h2>{item.title}</h2><p>{item.text}</p></article>)}</div><a className="text-link" href="https://www.google.com/maps/search/?api=1&query=Balne%C3%A1rio+Cambori%C3%BA+Santa+Catarina" target="_blank" rel="noreferrer">Ver Balneário Camboriú no mapa<span aria-hidden="true">↗</span></a></section>}
    {page === 'contato' ? <ContactForm /> : <CorporateNext />}
  </>
}
