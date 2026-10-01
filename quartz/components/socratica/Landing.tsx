import { QuartzComponent, QuartzComponentProps } from "../types"
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

export function Landing({
  componentData,
  graph: Graph,
}: {
  componentData: QuartzComponentProps
  graph?: QuartzComponent
}) {
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
        {/* Order matters: Writing and Work lead, Substack beside them, then Design / Visual Notes, CV last. */}
        {["writing", "work"].map((slug) => {
          const sec = SECTIONS.find((x) => x.slug === slug)!
          return (
            <DivisionCard
              href={`/${sec.slug}`}
              title={sec.title}
              blurb={sec.blurb}
              art={sec.art}
              className={`d-${sec.slug}${sec.featured ? " d-featured" : ""}`}
            />
          )
        })}
        <DivisionCard
          href={SUBSTACK_URL}
          title="Substack"
          blurb="Newsletter and longer reads"
          art={4}
          className="d-substack"
          external
        />
        {["design", "visual-notes", "cv"].map((slug) => {
          const sec = SECTIONS.find((x) => x.slug === slug)!
          return (
            <DivisionCard
              href={`/${sec.slug}`}
              title={sec.title}
              blurb={sec.blurb}
              art={sec.art}
              className={`d-${sec.slug}`}
            />
          )
        })}
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

      {Graph && (
        <>
          <h2 class="d-latest-title">Map</h2>
          <p class="d-map-note">
            How everything on this site connects. Drag, zoom, or open the full graph.
          </p>
          <div class="d-graph">
            <Graph {...componentData} />
          </div>
        </>
      )}
    </div>
  )
}
