import { motion } from 'framer-motion'
import { NAV_LINKS } from '../design'
import { ENTER_DELAY, riseIn, sequence } from '../lib/motion'

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
 *
 * A animacao de entrada nunca toca `.nav` nem `.nav-cta`: as duas camadas
 * ja carregam o `translateX(-50%)` do CSS e, no caso de `.nav`, qualquer
 * transform ou opacidade animada no proprio elemento isolaria o grupo e
 * mataria o `mix-blend-mode`. Anima-se so o que esta dentro delas.
 */

/** Cascata da navbar: logo, links um a um, botao por ultimo. */
const NAV_STAGGER = 0.09
const navSequence = sequence(NAV_STAGGER, ENTER_DELAY)
const navItem = riseIn()
const navLogo = riseIn(1, ENTER_DELAY)
/** o botao fecha a cascata, depois do ultimo link */
const navCta = riseIn(1, ENTER_DELAY + NAV_STAGGER * NAV_LINKS.length)

export function Nav() {
  return (
    <>
      <nav className="nav" aria-label="Principal">
        <motion.a
          className="nav__logo"
          href="#top"
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
          {NAV_LINKS.map((link) => (
            // o wrapper carrega a entrada; a opacidade 0.8 e o hover
            // continuam com o CSS do proprio link
            <motion.span key={link.href} className="nav__link" variants={navItem}>
              <a href={link.href}>{link.label}</a>
            </motion.span>
          ))}
        </motion.div>

        <span className="btn btn--solid nav__ghost" aria-hidden="true">
          Reservar
        </span>
      </nav>

      <div className="nav-cta">
        {/* o wrapper anima; o botao guarda o translateY(-2px) do :hover */}
        <motion.div
          variants={navCta}
          initial="hidden"
          animate="show"
        >
          <button type="button" className="btn btn--solid">
            Reservar
          </button>
        </motion.div>
      </div>
    </>
  )
}
