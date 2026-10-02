import { QuartzComponent, QuartzComponentProps } from "../types"
import { categoryId, getCategories, getPieces } from "./pieces"
import { SectionDef, SITE, textOf } from "./sectionsConfig"
import { categoryLabel, langOf, t } from "./i18n"
import { Tile } from "./Tile"
import { WorkCard } from "./WorkCard"
import { ListRow } from "./ListRow"
import { Crumbs } from "./Crumbs"
import { formatPieceDate } from "./pieces"

/**
 * A section's index page. `tiles` (Writing, Design): category tabs + a grid of tiles with captions.
 * `photos` (Visual Notes): a tight photo grid with hover captions. `work` (Work): Aekta-style image
 * cards in two columns with category tabs. Filtering is pure CSS (:target),
 * so it needs no client JS and survives SPA navigation.
 */
export function SectionIndex({
  componentData,
  Content,
  section,
}: {
  componentData: QuartzComponentProps
  Content: QuartzComponent
  section: SectionDef
}) {
  const lang = langOf(componentData.fileData.slug)
  const tt = t(lang)
  const pieces = getPieces(componentData.allFiles, section.slug, lang)
  const categories = getCategories(pieces)
  const tabs = section.tabs && categories.length > 1
  // Newest first, grouped by year (pieces without a date go under "Undated").
  const byYear = new Map<string, typeof pieces>()
  for (const p of pieces) {
    const y = p.date
      ? String(p.date.getFullYear())
      : (p.year ?? (lang === "es" ? "Sin fecha" : "Undated"))
    byYear.set(y, [...(byYear.get(y) ?? []), p])
  }
  const years = [...byYear.entries()].sort((a, b) => b[0].localeCompare(a[0]))
  const filterCss = tabs
    ? categories
        .map((c) => {
          const id = categoryId(c)
          return `.s-index:has(#${id}:target) :is(.s-tile,.s-work,.s-row):not([data-category="${id}"]){display:none}.s-index:has(#${id}:target) .s-year:not(:has([data-category="${id}"])){display:none}.s-index:has(#${id}:target) .s-tabs a[href="#${id}"]{color:var(--dark);border-bottom-color:var(--dark)}`
        })
        .join("")
    : ""
  return (
    <div class={`center s-index s-index-${section.grid}`}>
      <Crumbs slug={componentData.fileData.slug} />
      {filterCss && <style dangerouslySetInnerHTML={{ __html: filterCss }} />}
      <p class="s-eyebrow">{SITE.name}</p>
      <h1 class="s-index-title">
        {componentData.fileData.frontmatter?.title ?? textOf(section, lang).title}
      </h1>
      <div class="s-index-intro">
        <Content {...componentData} />
      </div>
      {tabs && (
        <>
          <span id="all" class="s-anchor" />
          {categories.map((c) => (
            <span id={categoryId(c)} class="s-anchor" />
          ))}
          <div class="s-tabs">
            <a class="s-tab-all" href="#all" data-router-ignore>
              {tt.all}
            </a>
            {categories.map((c) => (
              <a href={`#${categoryId(c)}`} data-router-ignore>
                {categoryLabel(c, lang)}
              </a>
            ))}
          </div>
        </>
      )}
      {section.grid === "tiles" && pieces.length > 0 && (
        <>
          <input type="radio" name="view" id="view-list" class="s-view-input" checked />
          <input type="radio" name="view" id="view-grid" class="s-view-input" />
          <div class="s-views">
            <label for="view-list">{tt.list}</label>
            <label for="view-grid">{tt.grid}</label>
          </div>
          <div class="s-posts">
            {years.map(([year, list]) => (
              <section class="s-year">
                <h2 class="s-year-head">
                  <span>{year}</span>
                  <small>{tt.articles(list.length)}</small>
                </h2>
                <div class="s-year-list">
                  {list.map((piece) => (
                    <a
                      class="s-post"
                      href={piece.href}
                      data-category={categoryId(piece.category)}
                      {...(piece.external
                        ? {
                            target: "_blank",
                            rel: "noopener noreferrer",
                            "data-router-ignore": true,
                          }
                        : {})}
                    >
                      <span class="s-post-title">{piece.title}</span>
                      <span class="s-post-meta">
                        <span class="s-post-cat">{categoryLabel(piece.category, lang)}</span>
                        {piece.date && (
                          <time>
                            {formatPieceDate(piece.date, lang).replace(/,?\s*\d{4}$/, "")}
                          </time>
                        )}
                      </span>
                    </a>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </>
      )}
      <div class={`s-grid s-grid-${section.grid}${section.grid === "tiles" ? " s-grid-alt" : ""}`}>
        {section.grid === "photos"
          ? // Photo grid: every image of every piece is its own tile (the piece's page shows them all).
            pieces.flatMap((piece, i) =>
              (piece.images.length > 0 ? piece.images : [piece.cover]).map((image, j) => (
                <Tile
                  piece={{ ...piece, cover: image }}
                  index={i + j}
                  lang={lang}
                  caption={false}
                />
              )),
            )
          : section.grid === "work"
            ? pieces.map((piece, i) => <WorkCard piece={piece} index={i} lang={lang} />)
            : section.grid === "list"
              ? pieces.map((piece) => <ListRow piece={piece} lang={lang} />)
              : pieces.map((piece, i) => <Tile piece={piece} index={i} lang={lang} caption />)}
      </div>
      {pieces.length === 0 && <p class="s-empty">{tt.empty}</p>}
    </div>
  )
}
