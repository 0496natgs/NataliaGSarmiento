import { QuartzComponentProps } from "../types"
import { formatPieceDate, getPieces } from "./pieces"
import { sectionOfSlug } from "./sectionsConfig"

const SHOWN = 4

/** dappled-light-style "Selected …" list for the left sidebar of a piece. */
export function SelectedPieces({ allFiles, fileData }: QuartzComponentProps) {
  const section = sectionOfSlug(fileData.slug)
  if (!section) return null
  const pieces = getPieces(allFiles, section.slug)
  const more = pieces.length - SHOWN
  return (
    <div class="s-selected">
      <h3>Selected {section.title}</h3>
      <ul>
        {pieces.slice(0, SHOWN).map((p) => (
          <li class={p.slug === fileData.slug ? "active" : ""}>
            <a
              href={p.external ?? `/${p.slug}`}
              {...(p.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {p.title}
            </a>
            {p.date && <span class="s-script-date">{formatPieceDate(p.date)}</span>}
          </li>
        ))}
      </ul>
      <a class="s-more" href={`/${section.slug}`}>
        {more > 0 ? `See ${more} more →` : "See all →"}
      </a>
    </div>
  )
}
