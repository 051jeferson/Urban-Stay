import { NAV_LINKS } from '../design'

/**
 * A navbar vem em duas camadas sobrepostas, alinhadas na mesma grade:
 *
 *  .nav      logo e links, mesclados em `difference` — leem como negativo
 *            do que estiver embaixo, sem precisar de fundo proprio.
 *  .nav-cta  o botao, fora da mesclagem. `difference` transformaria a
 *            pilula preta em duas cores invertidas e ilegiveis.
 *
 * O fantasma no fim da primeira camada so reserva a largura do botao, para
 * que os links caiam exatamente onde caem no Figma.
 */
export function Nav() {
  return (
    <>
      <nav className="nav" aria-label="Principal">
        <a className="nav__logo" href="#top" aria-label="Urban Stay">
          <img src="/img/logo.svg" alt="Urban Stay" width={202} height={20} />
        </a>

        <div className="nav__links">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>

        <span className="btn btn--solid nav__ghost" aria-hidden="true">
          Reservar
        </span>
      </nav>

      <div className="nav-cta">
        <button type="button" className="btn btn--solid">
          Reservar
        </button>
      </div>
    </>
  )
}
