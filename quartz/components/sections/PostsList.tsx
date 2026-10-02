import { categoryId, formatPieceDate, Piece } from "./pieces"
import { Lang, categoryLabel, t } from "./i18n"

/**
 * The List view of Writing and Work (after ssp.sh/posts): pieces grouped by year, two columns, a
 * small image on the side when the piece has one, the title, and its category and date.
 * Pieces that live elsewhere (Substack) open in the same tab.
 */
export function PostsList({ pieces, lang }: { pieces: Piece[]; lang: Lang }) {
  const tt = t(lang)
  const byYear = new Map<string, Piece[]>()
  for (const p of pieces) {
    const y = p.date
      ? String(p.date.getFullYear())
      : (p.year ?? (lang === "es" ? "Sin fecha" : "Undated"))
    byYear.set(y, [...(byYear.get(y) ?? []), p])
  }
  const years = [...byYear.entries()].sort((a, b) => b[0].localeCompare(a[0]))
  return (
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
                class={`s-post${piece.cover ? " has-thumb" : ""}`}
                href={piece.href}
                data-category={categoryId(piece.category)}
              >
                {piece.cover && (
                  <span
                    class="s-post-thumb"
                    style={`background-image:url(${piece.cover})`}
                    aria-hidden="true"
                  />
                )}
                <span class="s-post-title">{piece.title}</span>
                <span class="s-post-meta">
                  <span class="s-post-cat">
                    {piece.publication ?? categoryLabel(piece.category, lang)}
                  </span>
                  {piece.date && (
                    <time>{formatPieceDate(piece.date, lang).replace(/,?\s*\d{4}$/, "")}</time>
                  )}
                </span>
              </a>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
