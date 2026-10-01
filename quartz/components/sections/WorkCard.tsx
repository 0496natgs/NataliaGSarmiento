import { ART } from "./sectionsConfig"
import { categoryId, Piece } from "./pieces"

/**
 * A card for the Work page, after aektakhubchandani.com/work: a large image (portrait and landscape
 * alternating), a lime badge, a serif title and an uppercase line such as
 * "KHÔRA MAGAZINE, ISSUE 54 · FLASH SPECIAL ISSUE, 2026". Without a cover it falls back to a
 * typographic card in a colour from your artwork.
 */
export function WorkCard({ piece, index }: { piece: Piece; index: number }) {
  const art = ART[(index + 3) % ART.length]
  const href = piece.external ?? `/${piece.slug}`
  const meta = [piece.publication, piece.issue, piece.date?.getFullYear()]
    .filter((x) => x !== undefined && x !== "")
    .join(", ")
  return (
    <a
      class={`s-work ${index % 2 === 0 ? "is-portrait" : "is-landscape"}`}
      href={href}
      data-category={categoryId(piece.category)}
      {...(piece.external
        ? { target: "_blank", rel: "noopener noreferrer", "data-router-ignore": true }
        : {})}
    >
      <div
        class={`s-work-media ${piece.cover ? "has-cover" : "is-poster"}`}
        style={
          piece.cover ? `background-image:url(${piece.cover})` : `background-color:${art.color}`
        }
      >
        {piece.badge && <span class="s-badge">{piece.badge}</span>}
        {!piece.cover && (
          <>
            <p class="s-poster-kicker">{piece.category}</p>
            <div class="s-poster-art">
              <img src={`/static/art/${art.file}`} alt="" loading="lazy" />
            </div>
          </>
        )}
      </div>
      <h2 class="s-work-title">{piece.title}</h2>
      {meta && <p class="s-work-meta">{meta}</p>}
      {piece.description && <p class="s-work-desc">{piece.description}</p>}
    </a>
  )
}
