import { Fragment, useEffect, useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { VOICES, VOICES_TITLE } from '../design'
import { EASE_MASK, sequence, wordRise, words } from '../lib/motion'
import type { Variants } from 'framer-motion'

/**
 * Frame 9111:2336 — "Quem já dormiu aqui".
 *
 * Art-board de 1440 x 778. Titulo ancorado em absoluto dentro de
 * `.voices__frame`, que mede as 1440 unidades e fica centrado; o miolo de
 * cada card e flex normal, como no arquivo.
 *
 * O card mantem as medidas do Figma — 320 x 440.09, canto de 6, padding de
 * 48 — e todos tem exatamente o mesmo tamanho. O que muda entre eles e so
 * a perspectiva.
 *
 * Fundo: nenhum. Quem pinta e o `.backdrop` fixo, como no resto do site.
 * O preenchimento do card e o proprio gradiente do arquivo girado 180° —
 * ja rasterizado em `voices-card.jpg`, porque a rotacao de um fundo nao se
 * escreve em CSS sem uma camada extra so para isso.
 *
 * --- movimento ---------------------------------------------------------
 * A fileira virou um coverflow para caber mais que os quatro depoimentos do
 * arquivo. Um card fica reto no centro da janela; os vizinhos giram para
 * dentro, recuam e apagam, e a fila sai pelas duas bordas da tela — o
 * recorte acontece na borda da janela, nao na margem do art-board, entao
 * nao ha aquele corte reto no meio do fundo.
 *
 * A lista e renderizada duas vezes seguidas e o deslocamento e reduzido
 * modulo a largura de uma copia — nao ha volta ao inicio, so um ponto de
 * costura que cai sempre fora da tela.
 *
 * O 3D e calculado por card a cada quadro, a partir da distancia entre o
 * centro do card e o centro da janela, medida em cards. Isso e escrito
 * direto no DOM em vez de virar estado de React — sao dezesseis nos por
 * quadro, e passar isso pelo reconciliador seria trocar 60fps por nada.
 *
 * Divisao de trabalho com o Framer, a mesma do palco: o loop e dono do
 * transform do `slot`; o Framer so anima a `figure` de dentro (a entrada).
 * Ninguem escreve na propriedade do outro.
 */

/** Quanto tempo um card fica no centro antes de a fila andar sozinha. */
const DWELL = 4.6

/** Constante de tempo da corrida ate o card alvo — chega e assenta. */
const GLIDE = 0.5

/**
 * A parede.
 *
 * O card do centro fica reto, de frente. Os laterais dobram **para o
 * observador**: a borda de fora e a que vem para a frente, a de dentro
 * recua. E o avesso do coverflow classico — e e o que faz a fila abracar
 * quem olha em vez de fugir para o fundo.
 *
 * O giro cresce um degrau por card e satura perto do perfil, entao o card
 * seguinte sempre dobra mais que o anterior, como uma cortina.
 */
const TILT_STEP = 30
const MAX_TILT = 62

/**
 * Vao entre um card e o proximo, ja projetado na tela, em unidades.
 *
 * Medido na face, nao no layout: o card girado ocupa menos largura, e um
 * vao pequeno faz a fila inteira parecer uma coisa so, colada.
 */
const GAP = 56

/**
 * Paralaxe do gradiente sob o cursor, em unidades de design.
 *
 * A camada de fundo e maior que o card (ver `.voices__fill`), entao ela se
 * desloca dentro dele sem nunca descobrir a borda. Anda ao contrario do
 * cursor: o gradiente parece ficar parado no mundo enquanto o card passa
 * por cima dele.
 */
const GLOW_X = 64
const GLOW_Y = 44

/** Constante de tempo com que o gradiente persegue o cursor. */
const GLOW_CHASE = 0.22


/** Apagamento por card de distancia, e ate onde ele conta. */
const FADE = 0.15
const FAR = 3

/** Passo de layout do flex: card de 320 mais gutter de 32. */
const LAYOUT_STEP = 352

const RAD = Math.PI / 180

const clamp = (v: number, min: number, max: number) =>
  v < min ? min : v > max ? max : v

const inView = { once: true, amount: 0.25 } as const

const titleWords = words(VOICES_TITLE)
const titleSequence = sequence(0.07)
const titleWord = wordRise('30%')

/** Os cards escalonam atras do titulo, um atras do outro. */
const cardSequence = sequence(0.09, 0.35)

/**
 * Entrada do card: sobe e acende, e so.
 *
 * Nada de girar na entrada: a dobra da parede ja e o gesto da secao, e um
 * segundo eixo de giro por cima dela vira ruido.
 */
const cardIn: Variants = {
  hidden: { opacity: 0, y: 56 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: EASE_MASK },
  },
}

/**
 * A lista repetida tres vezes.
 *
 * Duas copias nao bastam: o deslocamento precisa caber numa volta inteira,
 * e nas pontas dessa volta o card do centro ficava a menos de tres slots do
 * fim da lista — faltava fila de um dos lados e o ultimo depoimento sumia
 * antes da hora. Com tres, a costura sempre sobra dos dois lados.
 */
const LOOP = [...VOICES, ...VOICES, ...VOICES]

export function Voices() {
  const section = useRef<HTMLElement>(null)
  const viewport = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const slots = useRef<(HTMLDivElement | null)[]>([])
  const fills = useRef<(HTMLSpanElement | null)[]>([])
  /** Deslocamento atual do gradiente de cada card, em px. */
  const glow = useRef<{ x: number; y: number }[]>([])
  const reduce = useReducedMotion()

  // um so gatilho para titulo e cards, para a entrada ler como uma coisa so
  const shown = useInView(section, inView)

  /**
   * Estado do carrossel — fora do React, ver o cabecalho.
   *
   * `x` e o deslocamento aplicado; `target` e onde ele quer chegar (o card
   * alvo centrado). `step` e a distancia de um card ao proximo e `base` e o
   * deslocamento que centra o primeiro deles.
   */
  const ride = useRef({
    x: 0,
    target: 0,
    vel: 0,
    wait: 0,
    step: 0,
    base: 0,
    loop: 0,
    dragging: false,
    hover: false,
    last: 0,
    pointerX: 0,
    pointerY: 0,
  })

  /** Centra o card de indice `i` — a conta e a mesma no snap e no relogio. */
  const offsetFor = (i: number) => ride.current.base - i * ride.current.step

  useEffect(() => {
    const viewportEl = viewport.current
    const trackEl = track.current
    if (!viewportEl || !trackEl) return

    const state = ride.current

    /** Remede o passo e recentra: `--km` muda com a largura da janela. */
    const measure = () => {
      const [first, second] = slots.current
      if (!first || !second) return
      const previous = state.step
      state.step = second.offsetLeft - first.offsetLeft
      state.loop = state.step * VOICES.length
      state.base = (viewportEl.clientWidth - first.offsetWidth) / 2

      if (!previous) {
        // primeira medida: comeca com o primeiro depoimento no centro
        state.x = state.base
        state.target = state.base
      } else {
        // reescala o que ja andou, para o card do centro continuar no centro
        const ratio = state.step / previous
        state.x *= ratio
        state.target *= ratio
      }
    }

    /** Escreve o quadro: a trilha anda, cada card recebe a sua perspectiva. */
    const paint = (dt = 1 / 60) => {
      const half = viewportEl.clientWidth / 2

      // Modulo com sinal, aplicado tambem ao alvo para nao quebrar a corrida.
      // A volta nao e reduzida para (-loop, 0] e sim para uma janela ancorada
      // no meio da lista: assim o card centrado fica sempre com uma copia
      // inteira sobrando de cada lado, e nenhuma ponta fica sem fila.
      const anchor =
        half - (LOOP.length / 2) * state.step + state.loop / 2
      while (state.loop && state.x <= anchor - state.loop) {
        state.x += state.loop
        state.target += state.loop
      }
      while (state.loop && state.x > anchor) {
        state.x -= state.loop
        state.target -= state.loop
      }

      trackEl.style.transform = `translate3d(${state.x}px, 0, 0)`
      // 1 unidade de design em px — o passo do flex vale 352 delas
      const unit = state.step / LAYOUT_STEP
      const gap = GAP * unit
      const width = slots.current[0]?.offsetWidth ?? 0
      if (!width) return

      // um retangulo por quadro (a pagina rola, o topo muda); a posicao de
      // cada card sai da conta que ja fazemos, sem medir no o DOM
      const box = viewportEl.getBoundingClientRect()
      const midY = box.top + box.height / 2
      const chase = 1 - Math.exp(-dt / GLOW_CHASE)

      /** Giro do card que esta a `n` cards do centro. */
      const tiltAt = (n: number) => Math.min(n * TILT_STEP, MAX_TILT)

      /** Largura que esse card ocupa na tela depois de dobrado. */
      const faceAt = (n: number) => width * Math.cos(tiltAt(n) * RAD)

      // Distancia do centro da janela ate o centro de cada card, somada card
      // a card: cada um encosta no anterior pela largura ja projetada. E o
      // que mantem a parede fechada — o giro encolhe a face, e uma fila de
      // passo fixo abriria um buraco crescente entre os cards.
      const reach = [0]
      for (let n = 1; n <= slots.current.length; n++) {
        reach[n] = reach[n - 1] + (faceAt(n - 1) + faceAt(n)) / 2 + gap
      }

      for (let i = 0; i < slots.current.length; i++) {
        const slot = slots.current[i]
        if (!slot) continue
        // `offsetLeft` e posicao de layout dentro da janela do carrossel (o
        // slot tem a janela como `offsetParent`, que e o unico ancestral
        // posicionado) e nao inclui o transform da trilha — entao somar `x`
        // da a posicao real sem realimentar a conta
        const center = slot.offsetLeft + width / 2 + state.x
        // distancia ao centro da janela, contada em cards
        const d = (center - half) / state.step
        const away = Math.min(Math.abs(d), reach.length - 1)
        const side = Math.sign(d)

        // a fila e continua: entre dois cards a posicao interpola
        const step = Math.floor(away)
        const frac = away - step
        const out = reach[step] + (reach[step + 1] - reach[step]) * frac

        // giro negativo do lado direito = borda de fora vindo para a frente
        const tilt = -side * tiltAt(away)
        // o transform corrige a posicao de layout para a posicao da parede
        const tx = half + side * out - center

        slot.style.transform = `translate3d(${tx}px, 0, 0) rotateY(${tilt}deg)`
        slot.style.opacity = String(clamp(1 - Math.min(away, FAR) * FADE, 0, 1))

        const fill = fills.current[i]
        if (!fill) continue

        const now = (glow.current[i] ??= { x: 0, y: 0 })
        // o card esta girado: o cursor anda mais rapido na tela do que na
        // face dele, entao a distancia horizontal e desfeita pelo cosseno
        const face = Math.max(Math.cos(tilt * RAD), 0.2)
        const toCursor = (state.pointerX - (box.left + half + side * out)) / face
        const fromMid = state.pointerY - midY

        let wantX = 0
        let wantY = 0
        if (state.hover) {
          // distancia do cursor ao centro do card, em medidas do card
          const dx = clamp(toCursor / width, -1, 1)
          const dy = clamp(fromMid / slot.offsetHeight, -1, 1)
          // ao contrario do cursor: o gradiente parece parado no mundo
          wantX = -dx * GLOW_X * unit
          wantY = -dy * GLOW_Y * unit
        }

        now.x += (wantX - now.x) * chase
        now.y += (wantY - now.y) * chase
        fill.style.transform = `translate3d(${now.x}px, ${now.y}px, 0)`
      }
    }

    measure()
    paint()

    const observer = new ResizeObserver(() => {
      measure()
      paint()
    })
    observer.observe(viewportEl)

    let raf = 0
    let prev = performance.now()

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      // um quadro perdido (aba em segundo plano) nao pode virar um salto
      const dt = Math.min((now - prev) / 1000, 0.05)
      prev = now
      if (!state.step) {
        measure()
        return
      }

      if (!state.dragging) {
        if (!state.hover) {
          state.wait += dt
          if (state.wait >= DWELL) {
            state.wait = 0
            state.target -= state.step
          }
        }
        // exponencial em vez de fracao fixa: independe da taxa de quadros
        state.x += (state.target - state.x) * (1 - Math.exp(-dt / GLIDE))
      }

      paint(dt)
    }

    // sem movimento automatico: a fila fica parada, so com a perspectiva
    if (!reduce) raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
    }
  }, [reduce])

  /* --- arrasto ---------------------------------------------------------
     Ponteiro cru em vez do `drag` do Framer: quem escreve o transform da
     trilha e o loop, e duas maos na mesma propriedade brigam. */

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    const state = ride.current
    state.dragging = true
    state.vel = 0
    state.wait = 0
    state.last = event.clientX
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = ride.current
    // guardado cru: quem consome e o loop, uma vez por quadro
    state.pointerX = event.clientX
    state.pointerY = event.clientY
    if (!state.dragging) return
    const dx = event.clientX - state.last
    state.last = event.clientX
    state.x += dx
    state.target = state.x
    // so serve para saber com que forca o dedo saiu
    state.vel = dx
  }

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = ride.current
    if (!state.dragging) return
    state.dragging = false
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    if (!state.step) return

    // solta no card mais proximo; um empurrao mais forte pula ate dois
    const flick = clamp(Math.round(-state.vel / 12), -2, 2)
    const index = Math.round((state.base - state.x) / state.step) + flick
    state.target = offsetFor(index)
    state.wait = 0
  }

  return (
    <section className="voices" ref={section}>
      <div className="voices__frame">
        <motion.h2
          className="voices__title"
          variants={titleSequence}
          initial="hidden"
          animate={shown ? 'show' : 'hidden'}
        >
          {titleWords.map((word, i) => (
            <Fragment key={`${word}-${i}`}>
              <span className="voices__word">
                <motion.span variants={titleWord}>{word}</motion.span>
              </span>
              {/* o espaco fica fora do span animado, para nao subir junto */}
              {i < titleWords.length - 1 ? ' ' : null}
            </Fragment>
          ))}
        </motion.h2>
      </div>

      <div
        className="voices__viewport"
        ref={viewport}
        role="group"
        aria-label="Depoimentos de quem já ficou aqui — arraste para ver mais"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerEnter={() => {
          ride.current.hover = true
        }}
        onPointerLeave={(event) => {
          ride.current.hover = false
          endDrag(event)
        }}
      >
        <motion.div
          className="voices__track"
          ref={track}
          data-node-id="9114:2483"
          variants={cardSequence}
          initial="hidden"
          animate={shown ? 'show' : 'hidden'}
        >
          {LOOP.map((card, i) => {
            // a segunda copia e so costura: nao entra na leitura de tela
            const clone = i >= VOICES.length
            return (
              <div
                className="voices__slot"
                key={`${card.id}-${i}`}
                ref={(el) => {
                  slots.current[i] = el
                }}
                aria-hidden={clone || undefined}
              >
                <motion.figure
                  className="voices__card"
                  data-node-id={clone ? undefined : card.id}
                  variants={cardIn}
                >
                  {/* o fundo do card, maior que ele, seguindo o cursor */}
                  <span
                    className="voices__fill"
                    aria-hidden
                    ref={(el) => {
                      fills.current[i] = el
                    }}
                  />
                  <div className="voices__head">
                    <img
                      className="voices__stars"
                      src="/img/voices-stars.svg"
                      alt="Cinco de cinco estrelas"
                      width={103}
                      height={18}
                    />
                    <blockquote className="voices__quote">{card.quote}</blockquote>
                  </div>

                  <figcaption className="voices__who">
                    <img
                      className="voices__avatar"
                      src={card.avatar}
                      alt=""
                      width={44}
                      height={44}
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                    />
                    <span className="voices__id">
                      <span className="voices__name">{card.name}</span>
                      <span className="voices__stay">{card.stay}</span>
                    </span>
                  </figcaption>
                </motion.figure>
              </div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
