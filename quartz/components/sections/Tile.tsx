import { ART, sectionOfSlug } from "./sectionsConfig"
import { categoryId, formatPieceDate, Piece } from "./pieces"

/**
 * One square tile. With a `cover` it is a photograph; without one it is a typographic tile —
 * a flat colour from the Substack artwork, a large italic serif title and the artwork's brush
 * strokes (cropped so its own wordmark isn't repeated on every tile).
 */
export function Tile({
  piece,
  index,
  showSection = false,
  caption = true,
}: {
  piece: Piece
  index: number
  showSection?: boolean
  caption?: boolean
}) {
  const art = ART[index % ART.length]
  const href = piece.external ?? `/${piece.slug}`
  const external = piece.external
    ? { target: "_blank", rel: "noopener noreferrer", "data-router-ignore": true }
    : {}
  const section = sectionOfSlug(piece.slug)
  const kicker = showSection ? (section?.title ?? piece.category) : piece.category
  return (
    <a class="s-tile" href={href} data-category={categoryId(piece.category)} {...external}>
      <div
        class={`s-tile-media ${piece.cover ? "has-cover" : "is-poster"}`}
        style={
          piece.cover ? `background-image:url(${piece.cover})` : `background-color:${art.color}`
        }
      >
        {piece.badge && <span class="s-badge">{piece.badge}</span>}
        {piece.external && <span class="s-badge s-badge-ext">Substack ↗</span>}
        {!piece.cover && (
          <>
            <p class="s-poster-kicker">{kicker}</p>
            <p
              class={`s-poster-title ${piece.title.length > 40 ? "is-xlong" : piece.title.length > 24 ? "is-long" : ""}`}
            >
              {piece.title}
            </p>
            <div class="s-poster-art">
              <img src={`/static/art/${art.file}`} alt="" loading="lazy" />
            </div>
          </>
        )}
        {piece.cover && !caption && <span class="s-hover-caption">{piece.title}</span>}
      </div>
      {caption && (
        <div class="s-caption">
          {piece.cover && <h2 class="s-caption-title">{piece.title}</h2>}
          <p class="s-caption-meta">
            {piece.cover ? kicker : ""}
            {piece.cover && piece.date ? " · " : ""}
            {piece.date ? formatPieceDate(piece.date) : ""}
            {!piece.cover && !piece.date ? kicker : ""}
          </p>
          {piece.description && <p class="s-caption-desc">{piece.description}</p>}
        </div>
      )}
    </a>
  )
}
