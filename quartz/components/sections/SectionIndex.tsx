import { QuartzComponent, QuartzComponentProps } from "../types"
import { categoryId, getCategories, getPieces } from "./pieces"
import { SectionDef, SITE } from "./sectionsConfig"
import { Tile } from "./Tile"

/**
 * A section's index page. `tiles` (Writing, Design): category tabs + a grid of tiles with captions.
 * `photos` (Visual Notes): a tight photo grid with hover captions. Filtering is pure CSS (:target),
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
  const pieces = getPieces(componentData.allFiles, section.slug)
  const categories = getCategories(pieces)
  const tabs = section.tabs && categories.length > 1
  const filterCss = tabs
    ? categories
        .map((c) => {
          const id = categoryId(c)
          return `.s-index:has(#${id}:target) .s-tile:not([data-category="${id}"]){display:none}.s-index:has(#${id}:target) .s-tabs a[href="#${id}"]{color:var(--dark);border-bottom-color:var(--dark)}`
        })
        .join("")
    : ""
  return (
    <div class={`center s-index s-index-${section.grid}`}>
      {filterCss && <style dangerouslySetInnerHTML={{ __html: filterCss }} />}
      <p class="s-eyebrow">{SITE.name}</p>
      <h1 class="s-index-title">{componentData.fileData.frontmatter?.title ?? section.title}</h1>
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
              All
            </a>
            {categories.map((c) => (
              <a href={`#${categoryId(c)}`} data-router-ignore>
                {c}
              </a>
            ))}
          </div>
        </>
      )}
      <div class={`s-grid s-grid-${section.grid}`}>
        {section.grid === "photos"
          ? // Photo grid: every image of every piece is its own tile (the piece's page shows them all).
            pieces.flatMap((piece, i) =>
              (piece.images.length > 0 ? piece.images : [piece.cover]).map((image, j) => (
                <Tile piece={{ ...piece, cover: image }} index={i + j} caption={false} />
              )),
            )
          : pieces.map((piece, i) => <Tile piece={piece} index={i} caption />)}
      </div>
      {pieces.length === 0 && <p class="s-empty">Nothing here yet.</p>}
    </div>
  )
}
