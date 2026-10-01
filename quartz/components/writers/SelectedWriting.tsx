import { formatPieceDate, getPieces } from "./pieces"
import { QuartzComponentProps } from "../types"

const SHOWN = 4

/** dappled-light-style "Selected Writing" list for the left sidebar. */
export function SelectedWriting({ allFiles, fileData }: QuartzComponentProps) {
  const pieces = getPieces(allFiles)
  const more = pieces.length - SHOWN
  return (
    <div class="w-selected">
      <h3>Selected Writing</h3>
      <ul>
        {pieces.slice(0, SHOWN).map((p) => (
          <li class={p.slug === fileData.slug ? "active" : ""}>
            <a href={`/${p.slug}`}>{p.title}</a>
            <span class="w-script-date">{formatPieceDate(p.date)}</span>
          </li>
        ))}
      </ul>
      <a class="w-more" href="/writing">
        {more > 0 ? `See ${more} more →` : "See all →"}
      </a>
    </div>
  )
}
