import { QuartzComponent, QuartzComponentProps } from "../types"
import { categoryId, getCategories, getPieces } from "./pieces"
import { SectionDef, SITE, textOf } from "./sectionsConfig"
import { categoryLabel, langOf, t } from "./i18n"
import { Tile } from "./Tile"
import { WorkCard } from "./WorkCard"
import { ListRow } from "./ListRow"
import { PostsList } from "./PostsList"
import { Crumbs } from "./Crumbs"

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
  // Writing and Work: a List view (the default) and a Grid view.
  const hasViews = (section.grid === "tiles" || section.grid === "work") && pieces.length > 0
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
      {hasViews && (
        <>
          <input type="radio" name="view" id="view-list" class="s-view-input" checked />
          <input type="radio" name="view" id="view-grid" class="s-view-input" />
          <div class="s-views">
            <label for="view-list">{tt.list}</label>
            <label for="view-grid">{tt.grid}</label>
          </div>
          <PostsList pieces={pieces} lang={lang} />
        </>
      )}
      <div class={`s-grid s-grid-${section.grid}${hasViews ? " s-grid-alt" : ""}`}>
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
