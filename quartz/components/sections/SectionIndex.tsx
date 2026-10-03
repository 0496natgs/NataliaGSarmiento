import { QuartzComponent, QuartzComponentProps } from "../types"
import { getPieces } from "./pieces"
import { SectionDef, SITE, textOf } from "./sectionsConfig"
import { langOf, t } from "./i18n"
import { Filters } from "./Filters"
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
  // Writing and Work: a List view (the default) and a Grid view.
  const hasViews = (section.grid === "tiles" || section.grid === "work") && pieces.length > 0
  return (
    <div class={`center s-index s-index-${section.grid}`}>
      <Crumbs slug={componentData.fileData.slug} />
      <p class="s-eyebrow">{SITE.name}</p>
      <h1 class="s-index-title">
        {componentData.fileData.frontmatter?.title ?? textOf(section, lang).title}
      </h1>
      <div class="s-index-intro">
        <Content {...componentData} />
      </div>
      {section.kind === "collection" && pieces.length > 1 && (
        <Filters pieces={pieces} lang={lang} />
      )}
      {hasViews && (
        <>
          <div class="s-views">
            <button type="button" class="is-on" data-view="list">
              {tt.list}
            </button>
            <button type="button" data-view="grid">
              {tt.grid}
            </button>
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
      <p class="s-empty s-empty-filter" hidden>
        {tt.nothingMatches}
      </p>
    </div>
  )
}
