# Urban Stay®

Single-page React + Vite landing. Pixel-faithful recreation of the Figma file
[DS Urban Stay®](https://www.figma.com/design/DtBJMg8yBdK0gejCUnFApu/DS-Urban-Stay%C2%AE)
— frames `9068:838` (hero), `9068:893` (open wheel), `9068:919` (benefits).

Copy, UI, and comments are in Brazilian Portuguese. Keep new copy in PT-BR.

## Commands

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build
npm run preview
```

No test or lint scripts. TypeScript is strict (`noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`). `npm run build` is the typecheck.

## Layout

```
src/
  App.tsx                 # Nav + Stage + footer; mounts scale + Lenis
  design.ts               # ALL Figma numbers, grid, CARDS, copy, nav links
  styles.css              # tokens + layout; every px is calc(figma * var(--k|--kb))
  main.tsx
  components/
    Nav.tsx               # two-layer navbar (blend vs. CTA)
    Stage.tsx             # the whole scroll show: wheel → strip → copy
  hooks/
    useDesignScale.ts     # publishes --k, --kb, --frame-half, --side-clip
    useSmoothScroll.ts    # Lenis driven by the GSAP ticker
  lib/math.ts             # lerp, range, ease, smoothstep, settle
public/img/               # Figma exports (do not recompress or rename)
```

There is no router, no state library, no component library. Do not add any of those unless asked.

## Geometry is law

`src/design.ts` is the single source of truth for sizes, slots, and copy. Numbers come from the Figma art-board of **1440 × 960**.

- Grid: 12 columns, margin 32, gutter 32 → column = 85.3333. Use `COLUMN`, `span(n)`, `columnX(n)`.
- Photo widths (`344.524` on the wheel, `436.157` / `321.206` on the strip) come from the art, **not** from a column count. Do not round them to the grid.
- Annotate every new coordinate with its Figma node id.

CSS never hard-codes a viewport size. Write `calc(<figma px> * var(--k))`. The benefits block uses `--kb` (same as `--k`, then shrunk if the window is shorter than the composition).

`useDesignScale` publishes:

| viewport | `--k` |
|---|---|
| ≤ 1440, ≥ 1024 | `innerWidth / 1440` |
| > 1440 | `1` — art stops growing, frame stays centered, photos bleed to the window edge |
| < 1024 | `innerWidth / 860` (compact art-board) |

`--side-clip` only aligns in-flow text to the art-board margin. Do not use it to clip photos.

Trust the **code** over README / CSS comments when they disagree. Known stale notes: README says track height 620vh (code is `TRACK_VH = 820`); a CSS comment says compact frame 820 (code is 860).

## The scroll show (`Stage.tsx`)

One sticky `100svh` stage inside an `820svh` track. One `ScrollTrigger` (`start: top top`, `end: bottom bottom`). **No per-card tweens.** Every frame, `draw(progress)` writes `transform` / `opacity` / `border-radius` onto the 12 card nodes.

Progress windows (they overlap on purpose so no card ever rests between phases):

| progress | what happens |
|---|---|
| `0 → 0.35` | cards born at scale 0.05, spin 148°, grow into frame `9068:893` |
| `0.29 → 0.44` | wheel keeps spinning +90° while unrolling onto the strip (arc, not a straight lerp) |
| `0.33 → …` | hero unpins and rises at exact scroll speed |
| `0.38 → 0.46` | first benefit copy rises through a mask |
| `0.44 → 1.00` | strip walks card to card |

If you change a window, re-check the overlaps. A gap between wheel and strip is a regression.

### Wheel

Each open-wheel slot is stored as a cartesian offset from frame center, then converted once to `(angle, radius)` via `atan2` / `hypot`. That is why the spin lands on the grid with no manual correction.

`border-radius` is counter-scaled every frame (`radiusPx * k / scale`) so the Figma radius (6 on the wheel, 4.715 on the strip) stays visually constant while the card is scaled up to ~1.61×.

Strip sizes are uniform scales of the wheel photo (`436.157 / 344.524`, `321.206 / 344.524`). **Never change width and height independently** — photos must not distort.

### Strip (benefits)

A 12-slot tape: 6 wheel cards + 6 echoes of the same photos (echoes exist so the last real card still has tape to its right).

`layoutRow(active)` rebuilds the tape from scratch every frame:

1. each card width lerps `321.206 → 436.157` by proximity to the active index
2. gutters of 32 accumulate
3. the tape slides so the **left edge of the active card** sits on the 32px margin

Cards grow/shrink around `ROW_CENTER_Y`, so the lead card always starts at `ROW_TOP` and the copy below never moves.

`CARDS` array order **is** the strip order **and** the clockwise wheel order (from top-left): suitcase → bed → robe → cards → camera → window. Reordering the array breaks the unroll (trajectories cross). To change sequence, change the array and re-derive slots from Figma.

Copy: one benefit per card, all stacked at the same point. Incoming waits below the mask, outgoing leaves through the top. Swap happens mid-travel (`|d|` between 0.25 and 0.5) so two texts are never visible at once and the slot is never empty. The active index goes through `settle` (linear mixed with smoothstep).

## Navbar

No background, no padding of its own: 32 from the top, 32 from the sides.

Two fixed layers on the same grid, because `mix-blend-mode: difference` only composites against the page backdrop if it sits on a top-level element. Any new stacking context (filter, opacity < 1, transform on a wrapper, `isolation`, `will-change` on an ancestor) kills the blend.

- `.nav` — logo + links, white type, `mix-blend-mode: difference`
- `.nav-cta` — the black “Reservar” pill, **outside** the blend (difference would invert it into two unreadable colors)
- `.nav__ghost` — invisible twin of the pill, keeps the links where they sit in Figma

Do not wrap `.nav` in a new parent. Do not put `mix-blend-mode` on `.nav-cta`.

## Motion stack

- **gsap + ScrollTrigger** — scroll progress only. Transforms are written in the `draw` loop.
- **lenis** — inertia, ticked by `gsap.ticker` so Lenis and ScrollTrigger share the frame. `lagSmoothing(0)`.
- Font: Clash Grotesk (Fontshare), weights 400/500/600.
- `prefers-reduced-motion: reduce` skips Lenis. Do not add a reduced-motion path that still drives Lenis.

After font load, call `ScrollTrigger.refresh()` (already done in `Stage`). If you change type sizes or the track height, trigger a refresh.

## Assets

`public/img/` — exported from Figma. `bg-gradient.png` is the shared fill of the three frames, painted as one `position: fixed` `.backdrop`. Do not replace with a CSS gradient; the grain and stops are in the PNG.

## Do not

- Introduce CSS modules, Tailwind, styled-components, or a UI kit.
- Animate cards with GSAP tweens, React state, or CSS keyframes. The `draw` loop owns transforms.
- Recenter / round Figma fractional pixels.
- Clip the stage (`overflow: hidden` on `.stage` would crop the bleeding photos).
- Add a background, scrim, or blur to the navbar to “fix” contrast. The blend is the design.
- Translate the Portuguese copy.
- Edit `dist/` — it is a build output.

## Verify UI in the browser

This is a visual, scroll-driven page. After any layout, style, or motion change:

1. `npm run dev` and walk the full 820vh pin: birth → spin → unroll → strip walk → footer.
2. Check 1440-wide (1:1 with Figma), >1440 (art capped, photos bleed), and <1024 (compact 860, nav links hidden).
3. Confirm the active strip card’s left edge sits on the 32px margin, copy never dual-appears, and `mix-blend-mode` still inverts the nav over both the gradient and the photos.
