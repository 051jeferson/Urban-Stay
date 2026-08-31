import { useRef } from 'react'
import {
  cubicBezier,
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { MEMOIR_COPY, MEMOIR_PHOTOS, MEMOIR_TITLE } from '../design'
import { EASE_MASK, riseIn } from '../lib/motion'

/**
 * Frame 9111:4 — "A parte da viagem que ninguém lembra de contar".
 *
 * Art-board de 1440 x 1607. Tudo aqui e posicionado em absoluto dentro de
 * `.memoir__frame`, que tem exatamente 1440 unidades de design de largura e
 * fica centrado — do mesmo jeito que a navbar e o bloco de beneficios.
 *
 * O titulo e justificado (`text-align-last: justify` inclusive), e sao os
 * vaos que a justificacao abre entre as palavras que abrigam as fotos. Por
 * isso as quebras de linha nao podem ficar por conta do navegador: elas vem
 * fixas do arquivo, uma linha por elemento.
 *
 * A secao nao pinta fundo nenhum: quem aparece por tras e o `.backdrop`,
 * a mesma camada fixa que serve o hero e os beneficios. Por isso o
 * gradiente atravessa o site inteiro sem emenda entre as secoes.
 *
 * --- movimento ---------------------------------------------------------
 * Nada aqui dispara de uma vez: linha e foto sao amarradas ao scroll, como
 * o palco. Cada uma tem a propria janela, entao a secao se monta enquanto
 * sobe — linha por linha, foto por foto — e desmonta se o scroll voltar.
 *
 * O `target` do `useScroll` e sempre um elemento que **nao** e transformado.
 * Medir o proprio elemento que se move realimentaria a conta: o transform
 * entra no `getBoundingClientRect`, o retangulo muda o progresso e o
 * progresso muda o transform. Por isso a linha mede a moldura e anima o
 * filho; a foto pode medir a si mesma porque `clip-path` nao mexe na caixa.
 */

const ease = cubicBezier(...EASE_MASK)

/** Janela da linha: do pe da janela ate um pouco acima do meio. */
const LINE_WINDOW: ['start 0.92', 'start 0.48'] = ['start 0.92', 'start 0.48']

/** A foto abre um pouco depois do texto, e num trecho mais curto. */
const PHOTO_WINDOW: ['start 0.95', 'start 0.55'] = ['start 0.95', 'start 0.55']

const copyIn = riseIn(0.8, 0.35)

function TitleLine({ text }: { text: string }) {
  const frame = useRef<HTMLSpanElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: frame, offset: LINE_WINDOW })

  // 266px de corpo: o curso relativo tem que ser curto, senao vira salto
  const y = useTransform(scrollYProgress, [0, 1], ['16%', '0%'], { ease })
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1], { ease })

  return (
    <span className="memoir__line" ref={frame}>
      <motion.span style={reduce ? undefined : { y, opacity }}>{text}</motion.span>
    </span>
  )
}

function Photo({ photo }: { photo: (typeof MEMOIR_PHOTOS)[number] }) {
  const figure = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: figure, offset: PHOTO_WINDOW })

  // A mascara abre da direita para a esquerda: a sobra da esquerda cai de
  // 100% (nada visivel) a 0, entao a parte revelada cresce a partir da borda
  // direita. `inset` intersecta com o `overflow` da moldura, entao o raio
  // de 6px do Figma continua valendo durante a abertura.
  const covered = useTransform(scrollYProgress, [0, 1], [100, 0], { ease })
  const clipPath = useMotionTemplate`inset(0% 0% 0% ${covered}%)`

  // a foto assenta enquanto a mascara passa, para nao parecer adesivo
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 1], { ease })

  return (
    <motion.figure
      ref={figure}
      className="memoir__photo"
      data-node-id={photo.id}
      style={{
        left: `calc(${photo.x}px * var(--km))`,
        top: `calc(${photo.y}px * var(--km))`,
        width: `calc(${photo.w}px * var(--km))`,
        height: `calc(${photo.h}px * var(--km))`,
        ...(reduce ? null : { clipPath }),
      }}
    >
      {/* enquadramento do Figma, em % da moldura */}
      <motion.img
        src={photo.src}
        alt={photo.alt}
        loading="lazy"
        decoding="async"
        style={{
          top: `${photo.crop.y}%`,
          height: `${photo.crop.h}%`,
          ...(reduce ? null : { scale }),
        }}
      />
    </motion.figure>
  )
}

export function Memoir() {
  return (
    <section className="memoir" id="da-porta-para-fora">
      <div className="memoir__frame">
        <h2 className="memoir__title">
          {MEMOIR_TITLE.lines.map((line) => (
            <TitleLine key={line} text={line} />
          ))}
        </h2>

        {MEMOIR_PHOTOS.map((photo) => (
          <Photo key={photo.id} photo={photo} />
        ))}

        {MEMOIR_COPY.map((block) => (
          <motion.p
            key={block.id}
            className="memoir__copy"
            data-node-id={block.id}
            variants={copyIn}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            style={{
              left: `calc(${block.x}px * var(--km))`,
              width: `calc(${block.w}px * var(--km))`,
            }}
          >
            {block.text}
          </motion.p>
        ))}
      </div>
    </section>
  )
}
