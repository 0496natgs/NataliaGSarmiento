import { QuartzComponent, QuartzComponentProps } from "../types"
import { Piece, getPieces } from "../sections/pieces"
import {
  GENRES,
  SECTIONS,
  SITE,
  SUBSTACK_PUBLICATIONS,
  SUBSTACK_URL,
} from "../sections/sectionsConfig"
import { Lang, intlLocale, langOf, t, urlFor } from "../sections/i18n"
import { Tile } from "../sections/Tile"
import { GoArrow } from "../sections/GoArrow"
import { PhotoCredit } from "../sections/PhotoCredit"
import { LOGO } from "../sections/gallery"

/**
 * The writing site's home (W5): your line, the newest piece large, then one row per genre
 * (Flash, Poetry, Essays, Fiction, Visual notes) with up to three pieces each and an "All …" link
 * that opens the section filtered to that genre; then the three newsletters and the map. Genres come from GENRES in sectionsConfig.ts.
 */
export function Landing({
  componentData,
  graph: Graph,
}: {
  componentData: QuartzComponentProps
  graph?: QuartzComponent
}) {
  const lang: Lang = langOf(componentData.fileData.slug)
  const tt = t(lang)
  // Every published piece on the writing side, newest first (one copy per piece). A piece with
  // only a year counts as the start of that year.
  const when = (p: Piece) => p.date?.getTime() ?? (p.year ? Date.UTC(Number(p.year), 0, 1) : 0)
  const seen = new Set<string>()
  const all = SECTIONS.filter((s) => s.kind === "collection" && s.space === "writer")
    .flatMap((s) => getPieces(componentData.allFiles, s.slug, lang))
    .filter((p) => (seen.has(p.slug) ? false : (seen.add(p.slug), true)))
    .sort((a, b) => when(b) - when(a))
  const writing = all.filter((p) => p.genre !== "visual-notes")
  // The feature: the newest piece with an image (W5's "Latest").
  const feature = writing.find((p) => p.cover) ?? writing[0]
  const monthYear = (d?: Date) =>
    d ? d.toLocaleDateString(intlLocale(lang), { month: "short", year: "numeric" }) : ""
  const whereWhen = (p: Piece) =>
    [[p.publication, p.issue?.split(" · ")[0]].filter(Boolean).join(", "), monthYear(p.date)]
      .filter(Boolean)
      .join(" · ")
  // One row per genre that has pieces; "All …" opens the section that holds most of them,
  // already filtered to the genre (?genre=…), with its list/grid switch and filters.
  const genres = GENRES.map((g) => {
    const pieces = all.filter((p) => p.genre === g.id)
    const bySection = new Map<string, number>()
    for (const p of pieces) bySection.set(p.section, (bySection.get(p.section) ?? 0) + 1)
    const section = [...bySection.entries()].sort((a, b) => b[1] - a[1])[0]?.[0]
    const title = lang === "es" ? g.title_es : g.title
    // A genre that is a whole section (Visual notes) opens it as it is.
    const filter = section === g.id ? "" : `?genre=${g.id}`
    return { ...g, title, pieces, href: section ? `${urlFor(section, lang)}${filter}` : "" }
  }).filter((g) => g.pieces.length > 0)

  return (
    <div class="center content-container d-home w5">
      <section class="w5-intro">
        <h1 class="w5-line">{tt.heroTitle}</h1>
      </section>

      {feature && (
        <a
          class={`w5-feature${feature.cover ? "" : " is-blank"}`}
          href={feature.href}
          {...(feature.external
            ? { target: "_blank", rel: "noopener noreferrer", "data-router-ignore": true }
            : {})}
        >
          {feature.cover && <img src={feature.cover} alt="" />}
          <span class="w5-feature-text">
            <span class="w5-feature-kicker">
              {[
                tt.latest,
                genres.find((g) => g.id === feature.genre)?.title,
                [feature.publication, feature.issue?.split(" · ")[0]].filter(Boolean).join(", "),
              ]
                .filter(Boolean)
                .join(" · ")}
            </span>
            <span class="w5-feature-title">
              {feature.title}
              {feature.external && <span class="ext" aria-hidden="true" />}
            </span>
          </span>
        </a>
      )}
      <PhotoCredit src={feature?.cover} lang={lang} class="w5-credit" />

      <section class="w5-genres">
        {genres.map((g) => (
          <div class={`w5-genre${g.id === "visual-notes" ? " is-notes" : ""}`}>
            <div class="w5-genre-head">
              <h2>{g.title}</h2>
              <a href={g.href}>
                {tt.articles(g.pieces.length)} · {tt.allOf(g.title)} →
              </a>
            </div>
            {g.id === "visual-notes" ? (
              <div class="s-grid s-grid-tiles w5-notes">
                {g.pieces.slice(0, 3).map((p, i) => (
                  <Tile piece={p} index={i} lang={lang} />
                ))}
              </div>
            ) : (
              <div class="w5-rows">
                {g.pieces.slice(0, 3).map((p, i) => (
                  <a
                    class="w5-row"
                    href={p.href}
                    {...(p.external
                      ? { target: "_blank", rel: "noopener noreferrer", "data-router-ignore": true }
                      : {})}
                  >
                    <span
                      class={`w5-thumb${p.cover ? "" : " is-blank"}`}
                      style={p.cover ? undefined : `background-color:var(--tile-${(i % 2) + 1})`}
                    >
                      {p.cover ? (
                        <img src={p.cover} alt="" loading="lazy" />
                      ) : (
                        <span class="w5-thumb-title">{p.title}</span>
                      )}
                    </span>
                    <span class="w5-row-text">
                      <span class="w5-row-title">
                        {p.title}
                        {p.external && <span class="ext" aria-hidden="true" />}
                        <GoArrow external={!!p.external} />
                      </span>
                      {p.description && <span class="w5-row-quote">{p.description}</span>}
                    </span>
                    <span class="w5-row-meta">{whereWhen(p)}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </section>

      <section class="w5-news" aria-label={tt.newsletters}>
        {SUBSTACK_PUBLICATIONS.map((p) => (
          <a
            class="w5-news-item"
            href={`${SUBSTACK_URL.replace(/\/+$/, "")}${p.path}`}
            target="_blank"
            rel="noopener noreferrer"
            data-router-ignore
          >
            <span class="w5-news-kicker">
              {tt.newsletter}
              <span class="ext" aria-hidden="true" />
            </span>
            <span class="w5-news-name">{p.name}</span>
            <span class="w5-news-blurb">{lang === "es" ? p.blurb_es : p.blurb}</span>
          </a>
        ))}
      </section>

      {Graph && lang === "en" && (
        <>
          <h2 class="d-section-title">{tt.map}</h2>
          <p class="d-section-note">{tt.mapNote}</p>
          <div class="d-graph">
            <Graph {...componentData} />
          </div>
        </>
      )}
      <p class="d-signoff">
        {LOGO ? (
          <img src={LOGO} alt={SITE.name} />
        ) : (
          <>
            {SITE.name.split(". ")[0]}
            <span class="logo-dot">.</span> {SITE.name.split(". ")[1]}
          </>
        )}
      </p>
    </div>
  )
}
