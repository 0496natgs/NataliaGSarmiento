import { PALETTE } from "./sectionsConfig"
import { filterAttrs, Piece } from "./pieces"
import { Lang, categoryLabel, t } from "./i18n"

/**
 * A card for the Work page, after aektakhubchandani.com/work: a large image (portrait and landscape
 * alternating), a lime badge, a serif title and an uppercase line such as
 * "KHÔRA, ISSUE 54 · FLASH, 2026". The image sits in a crop-mark frame with a mono figure caption
 * (tour-kyrgyzstan.com). Without a cover it falls back to a flat colour from your palette.
 */
export function WorkCard({
  piece,
  index,
  lang = "en",
}: {
  piece: Piece
  index: number
  lang?: Lang
}) {
  const tt = t(lang)
  const color = PALETTE[(index + 1) % PALETTE.length].color
  const meta = [piece.publication, piece.issue, piece.year ?? piece.date?.getFullYear()]
    .filter((x) => x !== undefined && x !== "")
    .join(", ")
  return (
    <a
      class={`s-work ${index % 2 === 0 ? "is-portrait" : "is-landscape"}`}
      href={piece.href}
      {...filterAttrs(piece, lang)}
      {...(piece.external
        ? { target: "_blank", rel: "noopener noreferrer", "data-router-ignore": true }
        : {})}
    >
      <div class="s-frame">
        <div
          class={`s-work-media ${piece.cover ? "has-cover" : "is-poster"}`}
          style={piece.cover ? `background-image:url(${piece.cover})` : `background-color:${color}`}
        >
          {piece.badge && <span class="s-badge">{piece.badge}</span>}
          {piece.untranslated && <span class="s-badge s-badge-lang">{tt.notTranslated}</span>}
          {!piece.cover && (
            <>
              <span class="s-field" aria-hidden="true">
                <i />
                <i />
              </span>
              <p class="s-poster-kicker">{categoryLabel(piece.category, lang)}</p>
            </>
          )}
        </div>
        <span class="s-figcap">
          {tt.figure} {String(index + 1).padStart(2, "0")} — {categoryLabel(piece.category, lang)}
        </span>
      </div>
      <h2 class="s-work-title">{piece.title}</h2>
      {meta && <p class="s-work-meta">{meta}</p>}
      {piece.description && <p class="s-work-desc">{piece.description}</p>}
    </a>
  )
}
