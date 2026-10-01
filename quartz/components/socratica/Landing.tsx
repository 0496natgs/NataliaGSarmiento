import { QuartzComponentProps } from "../types"
import { getPieces } from "../sections/pieces"
import { ART, SECTIONS, SITE, SUBSTACK_URL } from "../sections/sectionsConfig"
import { Tile } from "../sections/Tile"

interface DivisionCardProps {
  href: string
  title: string
  blurb: string
  art: number
  className: string
  external?: boolean
}

/** Socratica-style card (title + kicker, artwork bottom-right) in the colour of its artwork. */
function DivisionCard({ href, title, blurb, art, className, external }: DivisionCardProps) {
  const a = ART[art % ART.length]
  return (
    <a
      class={`d-card ${className}`}
      href={href}
      style={`background-color:${a.color}`}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer", "data-router-ignore": true }
        : {})}
    >
      <p class="d-title">
        {title}
        {external ? " ↗" : ""}
      </p>
      <p class="d-blurb">{blurb}</p>
      <img class="d-art" src={`/static/art/${a.file}`} alt="" />
    </a>
  )
}

export function Landing({ componentData }: { componentData: QuartzComponentProps }) {
  // Mix the sections: take one from each in turn until there are eight.
  const bySection = SECTIONS.filter((s) => s.kind === "collection").map((s) =>
    getPieces(componentData.allFiles, s.slug),
  )
  const latest = []
  for (let i = 0; latest.length < 8 && bySection.some((list) => i < list.length); i++) {
    for (const list of bySection) {
      if (i < list.length && latest.length < 8) latest.push(list[i])
    }
  }
  return (
    <div class="center content-container">
      <p class="landing-header">{SITE.name}</p>
      <p class="d-tagline">{SITE.tagline}</p>
      <p class="page-subhead">
        {SECTIONS.map((s, i) => (
          <>
            {i > 0 ? " • " : ""}
            <a href={`/${s.slug}`}>{s.title}</a>
          </>
        ))}{" "}
        •{" "}
        <a href={SUBSTACK_URL} target="_blank" rel="noopener noreferrer" data-router-ignore>
          Substack ↗
        </a>{" "}
        • <a href="/basics">Guide</a>
      </p>

      <div class="d-grid">
        {SECTIONS.filter((s) => s.card).map((s) => (
          <DivisionCard
            href={`/${s.slug}`}
            title={s.title}
            blurb={s.blurb}
            art={s.art}
            className={`d-${s.slug}${s.featured ? " d-featured" : ""}`}
          />
        ))}
        <DivisionCard
          href={SUBSTACK_URL}
          title="Substack"
          blurb="Newsletter and longer reads"
          art={4}
          className="d-substack"
          external
        />
      </div>

      {latest.length > 0 && (
        <>
          <h2 class="d-latest-title">Latest</h2>
          <div class="s-grid s-grid-tiles d-latest">
            {latest.map((p, i) => (
              <Tile piece={p} index={i} showSection />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
