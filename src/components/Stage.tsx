import { useEffect, useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  CARDS,
  CARD_W,
  GRID,
  RADIUS_ROW,
  RADIUS_WHEEL,
  ROW_CENTER_Y,
  ROW_LEAD_W,
  ROW_SLOTS,
  ROW_W,
} from '../design'
import {
  DEG,
  clamp01,
  easeInOutCubic,
  easeOutCubic,
  lerp,
  range,
  settle,
  smoothstep,
} from '../lib/math'

gsap.registerPlugin(ScrollTrigger)

/** Altura total do trecho fixado, em viewports. */
const TRACK_VH = 820

/* --- marcos do timeline, em progresso normalizado do trecho fixado ---
   0.00 → 0.35   a roda nasce no centro, gira e cresce ate o frame 9068:893
   0.29 → 0.44   a roda continua girando enquanto se desenrola na esteira
   0.33 → ...    a headline se solta do centro e sobe junto com o scroll
   0.38 → 0.46   o primeiro beneficio sobe em mascara
   0.44 → 1.00   a esteira anda: quem encosta na margem cresce, o resto encolhe

   As janelas se sobrepoem de proposito — nenhum card chega a parar entre
   uma fase e a seguinte. */
const WHEEL_END = 0.35
const BENCH_START = 0.29
const BENCH_END = 0.44
const HERO_RELEASE = 0.33
const COPY_IN_START = 0.38
const COPY_IN_END = 0.46
const CAROUSEL_START = 0.44

/** Graus que a roda gira ate assentar… */
const SPIN = 148
/** …e quantos ela ainda gira enquanto se desenrola na esteira. */
const BENCH_SPIN = 90

/** Atraso de cada card ao se desenrolar: a roda vira fita da esquerda para a direita. */
const BENCH_STAGGER = 0.014

/** Atraso relativo de cada card na emergencia (mantem o final sincronizado). */
const STAGGER = [0, 0.05, 0.1, 0.02, 0.12, 0.07]

/** Cada slot do frame aberto vira um par (angulo, raio) — a roda propriamente dita. */
const GEOMETRY = CARDS.map(({ slot }) => ({
  angle: Math.atan2(slot.y, slot.x),
  radius: Math.hypot(slot.x, slot.y),
}))

/** A fita: os 6 cards da roda seguidos de 6 ecos das mesmas fotos. */
const STRIP = Array.from({ length: ROW_SLOTS }, (_, j) => ({
  card: CARDS[j % CARDS.length],
  /** so as 6 primeiras posicoes vem da roda; o resto nasce na esteira */
  fromWheel: j < CARDS.length,
  key: `${CARDS[j % CARDS.length].photo.id}-${j}`,
}))

/** Peso de "selecionado": 1 na margem, 0 a uma posicao de distancia. */
const weight = (index: number, active: number) =>
  Math.max(0, 1 - Math.abs(index - active))

type RowFrame = { center: number; width: number }

/**
 * Distribui a fita para um indice ativo fracionario.
 *
 * Cada card mede entre `ROW_W` e `ROW_LEAD_W` conforme a proximidade da
 * margem, os gutters de 32 se acumulam a partir dai, e o conjunto desliza
 * para que a borda esquerda do card ativo caia exatamente na margem.
 */
function layoutRow(active: number, out: RowFrame[]) {
  const widths: number[] = []
  for (let j = 0; j < ROW_SLOTS; j++) {
    widths[j] = lerp(ROW_W, ROW_LEAD_W, smoothstep(weight(j, active)))
  }

  const lefts: number[] = []
  let cursor = 0
  for (let j = 0; j < ROW_SLOTS; j++) {
    lefts[j] = cursor
    cursor += widths[j] + GRID.gutter
  }

  const i0 = Math.min(ROW_SLOTS - 1, Math.max(0, Math.floor(active)))
  const i1 = Math.min(ROW_SLOTS - 1, i0 + 1)
  const anchor = lerp(lefts[i0], lefts[i1], active - i0)

  for (let j = 0; j < ROW_SLOTS; j++) {
    out[j] = {
      center: GRID.margin + lefts[j] - anchor + widths[j] / 2,
      width: widths[j],
    }
  }
}

export function Stage() {
  const trackRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const copyRefs = useRef<(HTMLDivElement | null)[]>([])
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const imgRefs = useRef<(HTMLImageElement | null)[]>([])

  useLayoutEffect(() => {
    const track = trackRef.current
    if (!track) return

    const root = document.documentElement
    const readVar = (name: string, fallback: number) =>
      parseFloat(getComputedStyle(root).getPropertyValue(name)) || fallback

    let k = 1
    let fb = 1
    let frameW = 1440
    let pinDistance = 1

    const readScale = () => {
      k = readVar('--k', 1)
      // --kb ja e k multiplicado pelo encolhimento da secao de beneficios
      fb = readVar('--kb', k) / k
      frameW = (readVar('--frame-half', 720) * 2) / k
    }

    const row: RowFrame[] = new Array(ROW_SLOTS)

    const draw = (p: number) => {
      // usado pelos ecos, que nao tem origem na roda
      const benchP = easeInOutCubic(range(p, BENCH_START, BENCH_END))

      // Indice ativo: 0 no primeiro card, 5 no ultimo. `settle` da uma
      // acomodada em cada parada sem chegar a travar entre elas.
      const steps = CARDS.length - 1
      const rawActive = range(p, CAROUSEL_START, 1) * steps
      const step = Math.min(steps - 1, Math.floor(rawActive))
      const active = steps === 0 ? 0 : step + settle(rawActive - step)

      layoutRow(active, row)

      const halfViewport = window.innerHeight / k / 2
      const rowY = ROW_CENTER_Y * fb - halfViewport

      for (let j = 0; j < ROW_SLOTS; j++) {
        const el = cardRefs.current[j]
        if (!el) continue

        const slot = STRIP[j]
        const target = row[j]
        const targetX = target.center * fb - frameW / 2
        const targetScale = (target.width / CARD_W) * fb

        let x = targetX
        let y = rowY
        let scale = targetScale
        let rot = 0
        let radiusPx: number = RADIUS_ROW
        let imgScale = 1
        let opacity = clamp01(benchP * 4)

        if (slot.fromWheel) {
          const geo = GEOMETRY[j]

          // --- fase roda -------------------------------------------------
          const stag = STAGGER[j]
          const raw = clamp01((clamp01(p / WHEEL_END) - stag) / (1 - stag))
          const e = easeOutCubic(raw)

          // --- fase desenrolar --------------------------------------------
          // Cada card sai da roda um pouco depois do anterior, na ordem da
          // esteira: o anel se desenrola da esquerda para a direita.
          const unroll = easeInOutCubic(
            range(p, BENCH_START + j * BENCH_STAGGER, BENCH_END),
          )

          // A roda nao para de girar quando a esteira comeca a puxar: o
          // giro extra e o que faz os cards chegarem em arco, nao em reta.
          const spin = ((1 - e) * SPIN - unroll * BENCH_SPIN) * DEG
          const angle = geo.angle + spin
          const radius = geo.radius * e * (1 + unroll * 0.08)

          const wheelX = Math.cos(angle) * radius
          const wheelY = Math.sin(angle) * radius
          const wheelScale = lerp(0.05, 1, e)

          x = lerp(wheelX, targetX, unroll)
          y = lerp(wheelY, rowY, unroll)
          scale = lerp(wheelScale, targetScale, unroll)
          rot = lerp(-(1 - e) * SPIN * 0.22, 0, unroll)
          // um leve caimento no meio do arco, que se resolve na chegada
          rot -= Math.sin(unroll * Math.PI) * 5
          radiusPx = lerp(RADIUS_WHEEL, RADIUS_ROW, unroll)
          imgScale = lerp(lerp(1.35, 1, e), 1, unroll)
          opacity = clamp01(raw * 5)
        }

        el.style.opacity = String(opacity)
        el.style.transform =
          `translate3d(${x * k}px, ${y * k}px, 0) rotate(${rot}deg) scale(${scale})`
        // o raio do Figma nao pode crescer junto com o scale
        el.style.borderRadius = `${(radiusPx * k) / Math.max(scale, 0.001)}px`
        el.style.zIndex = String(10 - j)

        const img = imgRefs.current[j]
        if (img) img.style.transform = `scale(${imgScale})`
      }

      // --- headline do hero --------------------------------------------
      // Ate HERO_RELEASE ela fica travada no centro; depois se solta e sobe
      // exatamente na velocidade do scroll, como se nunca tivesse sido fixada.
      const hero = heroRef.current
      if (hero) {
        const travel = Math.max(0, p - HERO_RELEASE) * pinDistance
        const limit = window.innerHeight / 2 + hero.offsetHeight / 2 + 40
        const yHero = -Math.min(travel, limit)
        hero.style.transform = `translate3d(-50%, calc(-50% + ${yHero}px), 0)`
        hero.style.pointerEvents = travel > 0 ? 'none' : 'auto'
      }

      // --- beneficios ---------------------------------------------------
      // Um bloco por card, empilhados no mesmo ponto. Quem ainda nao chegou
      // espera abaixo da mascara; quem ja passou sai por cima. A troca
      // acontece no meio do caminho entre duas paradas, entao nunca ha dois
      // textos visiveis ao mesmo tempo.
      const gate = (1 - smoothstep(range(p, COPY_IN_START, COPY_IN_END))) * 130
      for (let i = 0; i < CARDS.length; i++) {
        const block = copyRefs.current[i]
        if (!block) continue

        const d = active - i
        const away = smoothstep(range(Math.abs(d), 0.25, 0.5))
        const base = -Math.sign(d) * away * 130
        // o portao so empurra para baixo na entrada; depois dele o bloco que
        // ja passou precisa poder sair por cima, com deslocamento negativo
        const offset = gate > 0 ? Math.max(base, gate) : base

        const lines = block.querySelectorAll<HTMLElement>('.reveal-line > span')
        lines.forEach((line, n) => {
          line.style.transform = `translateY(${offset * (1 + n * 0.12)}%)`
        })
      }
    }

    readScale()

    const st = ScrollTrigger.create({
      trigger: track,
      start: 'top top',
      end: 'bottom bottom',
      invalidateOnRefresh: true,
      onRefresh: (self) => {
        readScale()
        pinDistance = Math.max(1, self.end - self.start)
        draw(self.progress)
      },
      onUpdate: (self) => draw(self.progress),
    })

    pinDistance = Math.max(1, st.end - st.start)
    draw(st.progress)

    return () => st.kill()
  }, [])

  // Depois que as fontes carregam as medidas mudam — recalcula os gatilhos.
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
  }, [])

  return (
    <div className="stage-track" ref={trackRef} style={{ height: `${TRACK_VH}svh` }}>
      <div className="stage">
        {STRIP.map((slot, j) => (
          <div
            key={slot.key}
            className="card"
            ref={(el) => {
              cardRefs.current[j] = el
            }}
          >
            <img
              className="card__img"
              src={slot.card.photo.src}
              alt={j < CARDS.length ? slot.card.photo.alt : ''}
              aria-hidden={j >= CARDS.length}
              style={{ objectPosition: slot.card.photo.fit }}
              loading={j < 3 ? 'eager' : 'lazy'}
              decoding="async"
              ref={(el) => {
                imgRefs.current[j] = el
              }}
            />
          </div>
        ))}

        <div className="hero" ref={heroRef} id="top">
          <div className="hero__copy">
            <h1 className="hero__title">Veja a vida pela nossa moldura</h1>
            <p className="hero__lead">
              No centro de Balneário. A dois passos da praia, a dois passos da noite.
            </p>
          </div>
          <div className="hero__actions">
            <button type="button" className="btn btn--solid">
              Reservar
            </button>
            <button type="button" className="btn btn--ghost">
              Ver suítes
            </button>
          </div>
        </div>

        <div className="benefits" id="a-casa">
          {CARDS.map((card, i) => (
            <div
              key={card.photo.id}
              className="benefit"
              ref={(el) => {
                copyRefs.current[i] = el
              }}
            >
              <h2 className="benefits__title">
                <span className="reveal-line">
                  <span>{card.benefit.title}</span>
                </span>
              </h2>
              <p className="benefits__lead">
                <span className="reveal-line">
                  <span>{card.benefit.lead}</span>
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
