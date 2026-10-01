import { QuartzComponentProps } from "../types"
import { formatPieceDate, getPieces } from "./pieces"
import { sectionOfSlug, textOf } from "./sectionsConfig"
import { langOf, t, urlFor } from "./i18n"

const SHOWN = 4

/** dappled-light-style "Selected …" list for the left sidebar of a piece. */
export function SelectedPieces({ allFiles, fileData }: QuartzComponentProps) {
  const section = sectionOfSlug(fileData.slug)
  if (!section) return null
  const lang = langOf(fileData.slug)
  const tt = t(lang)
  const pieces = getPieces(allFiles, section.slug, lang)
  const more = pieces.length - SHOWN
  return (
    <div class="s-selected">
      <h3>
        {tt.selected} {textOf(section, lang).title}
      </h3>
      <ul>
        {pieces.slice(0, SHOWN).map((p) => (
          <li class={p.slug === fileData.slug ? "active" : ""}>
            <a
              href={p.href}
              {...(p.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {p.title}
            </a>
            {p.date && <span class="s-script-date">{formatPieceDate(p.date, lang)}</span>}
          </li>
        ))}
      </ul>
      <a class="s-more" href={urlFor(section.slug, lang)}>
        {more > 0 ? tt.seeMore(more) : tt.seeAll}
      </a>
    </div>
  )
}
