import { PALETTE, sectionOfSlug, textOf } from "./sectionsConfig"
import { filterAttrs, formatPieceDate, Piece } from "./pieces"
import { Lang, categoryLabel, t } from "./i18n"

/**
 * One square tile. With a `cover` it is a photograph (framed with crop marks on hover); without
 * one it is a typographic tile: a flat colour from your Substack icons, a large serif title and a
 * slowly drifting colour field. No artwork images are used, so nothing competes with the words.
 */
export function Tile({
  piece,
  index,
  lang = "en",
  showSection = false,
  caption = true,
}: {
  piece: Piece
  index: number
  lang?: Lang
  showSection?: boolean
  caption?: boolean
}) {
  const tt = t(lang)
  const tile = (index % PALETTE.length) + 1
  const light = PALETTE[index % PALETTE.length].light
  const external = piece.external
    ? { target: "_blank", rel: "noopener noreferrer", "data-router-ignore": true }
    : {}
  const section = sectionOfSlug(piece.slug)
  const kicker =
    showSection && section ? textOf(section, lang).title : categoryLabel(piece.category, lang)
  return (
    <a class="s-tile" href={piece.href} {...filterAttrs(piece, lang)} {...external}>
      <div
        class={`s-tile-media ${piece.cover ? "has-cover" : `is-poster${light ? " tone-light" : ""}`}`}
        style={
          piece.cover
            ? `background-image:url(${piece.cover})`
            : `background-color:var(--tile-${tile})`
        }
      >
        {piece.badge && <span class="s-badge">{piece.badge}</span>}
        {piece.external && (
          <span class="s-badge s-badge-ext">{piece.publication ?? "Substack"} ↗</span>
        )}
        {piece.untranslated && <span class="s-badge s-badge-lang">{tt.notTranslated}</span>}
        {!piece.cover && (
          <>
            <span class="s-field" aria-hidden="true">
              <i />
              <i />
            </span>
            <p class="s-poster-kicker">{kicker}</p>
            <p
              class={`s-poster-title ${piece.title.length > 40 ? "is-xlong" : piece.title.length > 24 ? "is-long" : ""}`}
            >
              {piece.title}
            </p>
          </>
        )}
        {piece.cover && !caption && <span class="s-hover-caption">{piece.title}</span>}
      </div>
      {caption && (
        <div class="s-caption">
          {piece.cover && <h2 class="s-caption-title">{piece.title}</h2>}
          <p class="s-caption-meta">
            {piece.cover ? kicker : ""}
            {piece.cover && (piece.date || piece.year) ? " · " : ""}
            {piece.date ? formatPieceDate(piece.date, lang) : (piece.year ?? "")}
            {!piece.cover && !piece.date && !piece.year ? kicker : ""}
          </p>
          {piece.description && <p class="s-caption-desc">{piece.description}</p>}
        </div>
      )}
    </a>
  )
}
