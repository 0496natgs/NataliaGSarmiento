import { filterAttrs, formatPieceDate, Piece } from "./pieces"
import { Lang, categoryLabel, t } from "./i18n"

/**
 * One row of an "every post" list, after aimforbehavior.com/insights: date, title, topic. Used by the
 * Insights page; click anywhere on the row.
 */
export function ListRow({ piece, lang = "en" }: { piece: Piece; lang?: Lang }) {
  const tt = t(lang)
  return (
    <a
      class="s-row"
      href={piece.href}
      {...filterAttrs(piece, lang)}
      {...(piece.external
        ? { target: "_blank", rel: "noopener noreferrer", "data-router-ignore": true }
        : {})}
    >
      {piece.cover && (
        <span
          class="s-post-thumb"
          style={`background-image:url(${piece.cover})`}
          aria-hidden="true"
        />
      )}
      <time class="s-row-date">{piece.date ? formatPieceDate(piece.date, lang) : ""}</time>
      <span class="s-row-main">
        <span class="s-row-title">
          {piece.title}
          {piece.external ? " ↗" : ""}
        </span>
        {piece.description && <span class="s-row-desc">{piece.description}</span>}
      </span>
      <span class="s-row-topic">
        {categoryLabel(piece.category, lang)}
        {piece.badge ? ` · ${piece.badge}` : ""}
        {piece.untranslated ? ` · ${tt.notTranslated}` : ""}
      </span>
    </a>
  )
}
