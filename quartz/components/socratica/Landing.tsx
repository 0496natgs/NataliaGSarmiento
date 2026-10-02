import { QuartzComponent, QuartzComponentProps } from "../types"
import { getPieces } from "../sections/pieces"
import {
  PALETTE,
  SECTIONS,
  SITE,
  SKETCHBOOK,
  SUBSTACK_PUBLICATIONS,
  SUBSTACK_URL,
  SectionDef,
  textOf,
} from "../sections/sectionsConfig"
import { Lang, langOf, t, urlFor } from "../sections/i18n"
import { Tile } from "../sections/Tile"
import { LOGO } from "../sections/gallery"

/** A framed card: crop marks around a photo (cross-fading if there are several) or a drifting colour field. */
function FrameCard({
  href,
  numeral,
  title,
  blurb,
  color,
  images = [],
  external,
}: {
  href: string
  numeral: string
  title: string
  blurb: string
  color: string
  images?: string[]
  external?: boolean
}) {
  return (
    <a
      class="d-frame"
      href={href}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer", "data-router-ignore": true }
        : {})}
    >
      <span class="s-frame">
        <span class="d-frame-media" style={`background-color:${color}`}>
          {images.length > 0 ? (
            <span class={`d-slides n${Math.min(images.length, 4)}`}>
              {images.slice(0, 4).map((src, i) => (
                <img style={`--i:${i}`} src={src} alt="" loading="lazy" />
              ))}
            </span>
          ) : (
            <>
              <span class="s-field" aria-hidden="true">
                <i />
                <i />
              </span>
              <span class="d-numeral">{numeral}</span>
            </>
          )}
        </span>
        <span class="s-figcap">
          {numeral} — {title}
          {external ? " ↗" : ""}
        </span>
      </span>
      <span class="d-frame-title">{title}</span>
      <span class="d-frame-blurb">{blurb}</span>
    </a>
  )
}

export function Landing({
  componentData,
  graph: Graph,
}: {
  componentData: QuartzComponentProps
  graph?: QuartzComponent
}) {
  const lang: Lang = langOf(componentData.fileData.slug)
  const tt = t(lang)
  const cards = SECTIONS.filter((s) => s.card && s.space === "writer")
  const substackRow: { n: string; title: string; href: string }[] = [
    { n: "V", title: tt.substack, href: SUBSTACK_URL },
  ]

  // Mix the sections: take one from each in turn until there are eight.
  const bySection = SECTIONS.filter((s) => s.kind === "collection" && s.space === "writer").map(
    (s) => getPieces(componentData.allFiles, s.slug, lang),
  )
  const latest = []
  for (let i = 0; latest.length < 8 && bySection.some((list) => i < list.length); i++) {
    for (const list of bySection) {
      if (i < list.length && latest.length < 8) latest.push(list[i])
    }
  }

  return (
    <div class="center content-container d-home">
      <section class="d-hero">
        <p class="d-kicker">{tt.heroKicker}</p>
        <h1 class="d-hero-title">{tt.heroTitle}</h1>
      </section>

      {/* offporter-style chapter index: numeral over the word */}
      <nav class="d-index" aria-label={tt.index}>
        {cards.map((s) => (
          <a href={urlFor(s.slug, lang)}>
            <span class="d-index-n">{s.numeral}.</span>
            <span class="d-index-w">{textOf(s, lang).title}</span>
          </a>
        ))}
        {substackRow.map((r) => (
          <a href={r.href} target="_blank" rel="noopener noreferrer" data-router-ignore>
            <span class="d-index-n">{r.n}.</span>
            <span class="d-index-w">{r.title} ↗</span>
          </a>
        ))}
      </nav>

      <div class="d-frames">
        {cards.map((s: SectionDef) => (
          <FrameCard
            href={urlFor(s.slug, lang)}
            numeral={s.numeral}
            title={textOf(s, lang).title}
            blurb={textOf(s, lang).blurb}
            color={PALETTE[s.art % PALETTE.length].color}
            images={s.images}
          />
        ))}
      </div>

      {latest.length > 0 && (
        <>
          <h2 class="d-section-title">{tt.latest}</h2>
          <div class="s-grid s-grid-tiles d-latest">
            {latest.map((p, i) => (
              <Tile piece={p} index={i} lang={lang} showSection />
            ))}
          </div>
        </>
      )}

      {SKETCHBOOK.length > 0 && (
        <>
          <h2 class="d-section-title">{tt.sketchbook}</h2>
          <p class="d-section-note">{tt.sketchbookNote}</p>
          <div class="d-strip">
            <div class="d-strip-track">
              {/* The row is repeated so the loop is seamless. */}
              {[...SKETCHBOOK, ...SKETCHBOOK].map((p, i) => (
                <a
                  class="d-strip-item"
                  href={p.href ? urlFor(p.href.replace(/^\//, ""), lang) : undefined}
                  aria-hidden={i >= SKETCHBOOK.length ? "true" : undefined}
                  tabindex={i >= SKETCHBOOK.length ? -1 : undefined}
                >
                  <span class="s-frame">
                    <img src={p.src} alt={i < SKETCHBOOK.length ? p.alt : ""} loading="lazy" />
                    <span class="s-figcap">
                      {String((i % SKETCHBOOK.length) + 1).padStart(2, "0")} —{" "}
                      {lang === "es" ? p.label_es : p.label}
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </>
      )}

      <h2 class="d-section-title">{tt.newsletters}</h2>
      <p class="d-section-note">{tt.newslettersNote}</p>
      <div class="d-frames d-frames-3">
        {SUBSTACK_PUBLICATIONS.map((p, i) => (
          <FrameCard
            href={`${SUBSTACK_URL.replace(/\/+$/, "")}${p.path}`}
            numeral={["a", "b", "c"][i]}
            title={p.name}
            blurb={lang === "es" ? p.blurb_es : p.blurb}
            color={p.color}
            external
          />
        ))}
      </div>

      {Graph && lang === "en" && (
        <>
          <h2 class="d-section-title">{tt.map}</h2>
          <p class="d-section-note">{tt.mapNote}</p>
          <div class="d-graph">
            <Graph {...componentData} />
          </div>
        </>
      )}
      <p class="d-signoff">{LOGO ? <img src={LOGO} alt={SITE.name} /> : SITE.name}</p>
    </div>
  )
}
