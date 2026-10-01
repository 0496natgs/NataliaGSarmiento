import { QuartzComponent, QuartzComponentProps } from "../types"
import { categoryId, formatPieceDate, getCategories, getPieces, Piece } from "./pieces"
import { WRITER } from "./writerContent"

const POSTERS = 6 // poster-1 ... poster-6 reuse the Socratica card colours/illustrations

function Card({ piece, index }: { piece: Piece; index: number }) {
  const n = (index % POSTERS) + 1
  return (
    <a class="w-card" href={`/${piece.slug}`} data-category={categoryId(piece.category)}>
      <div
        class={`w-card-media ${piece.cover ? "has-cover" : `poster poster-${n}`}`}
        style={piece.cover ? `background-image:url(${piece.cover})` : undefined}
      >
        {piece.badge && <span class="w-badge">{piece.badge}</span>}
        {!piece.cover && (
          <>
            <p class="w-poster-title">{piece.title}</p>
            <img src={`/static/${n}-illo.png`} class={`w-poster-illo illo-${n}`} alt="" />
          </>
        )}
      </div>
      <h2 class="w-card-title">{piece.title}</h2>
      <p class="w-card-meta">
        {piece.category}
        {piece.date ? ` · ${formatPieceDate(piece.date)}` : ""}
      </p>
      {piece.description && <p class="w-card-desc">{piece.description}</p>}
    </a>
  )
}

/**
 * Portfolio grid: aek-style category tabs, errr-style card grid, Socratica poster cards.
 * Filtering is pure CSS (:target), so it needs no client JS and survives SPA navigation.
 */
export function WritingIndex({
  componentData,
  Content,
}: {
  componentData: QuartzComponentProps
  Content: QuartzComponent
}) {
  const pieces = getPieces(componentData.allFiles)
  const categories = getCategories(pieces)
  const filterCss = categories
    .map((c) => {
      const id = categoryId(c)
      return `.w-index:has(#${id}:target) .w-card:not([data-category="${id}"]){display:none}.w-index:has(#${id}:target) .w-tabs a[href="#${id}"]{color:var(--dark);border-bottom-color:var(--dark)}`
    })
    .join("")
  return (
    <div class="center w-index">
      <style dangerouslySetInnerHTML={{ __html: filterCss }} />
      <p class="w-eyebrow">{WRITER.name}</p>
      <h1 class="w-index-title">{componentData.fileData.frontmatter?.title ?? "Writing"}</h1>
      <div class="w-index-intro">
        <Content {...componentData} />
      </div>
      <span id="all" class="w-anchor" />
      {categories.map((c) => (
        <span id={categoryId(c)} class="w-anchor" />
      ))}
      <div class="w-tabs">
        <a class="w-tab-all" href="#all" data-router-ignore>
          All
        </a>
        {categories.map((c) => (
          <a href={`#${categoryId(c)}`} data-router-ignore>
            {c}
          </a>
        ))}
      </div>
      <div class="w-grid">
        {pieces.map((piece, i) => (
          <Card piece={piece} index={i} />
        ))}
      </div>
    </div>
  )
}
