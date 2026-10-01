import { PageFrameProps } from "../frames/types"
import { DefaultFrame } from "../frames/DefaultFrame"
import { QuartzComponent } from "../types"
import { SelectedWriting } from "./SelectedWriting"
import { WritingIndex } from "./WritingIndex"
import { formatPieceDate, getPieces, isWritingIndex } from "./pieces"
import { WRITER } from "./writerContent"

/** Titles, date, category badge and tags for a prose piece (dappled-light header). */
function PieceHeader({ componentData }: Pick<PageFrameProps, "componentData">) {
  const fm = componentData.fileData.frontmatter
  const piece = getPieces(componentData.allFiles).find(
    (p) => p.slug === componentData.fileData.slug,
  )
  return (
    <div class="w-piece-header">
      <h1 class="w-piece-title">{fm?.title}</h1>
      <p class="w-piece-meta">
        <span class="w-script-date">{formatPieceDate(piece?.date)}</span>
        {piece?.category && <span class="w-category">{piece.category}</span>}
      </p>
      {piece && piece.tags.length > 0 && (
        <p class="w-tags">
          {piece.tags.map((t) => (
            <span class="w-tag">#{t}</span>
          ))}
        </p>
      )}
    </div>
  )
}

function PrevNext({ componentData }: Pick<PageFrameProps, "componentData">) {
  const pieces = getPieces(componentData.allFiles)
  const i = pieces.findIndex((p) => p.slug === componentData.fileData.slug)
  const older = i >= 0 ? pieces[i + 1] : undefined
  const newer = i > 0 ? pieces[i - 1] : undefined
  return (
    <div class="w-prevnext">
      {older ? <a href={`/${older.slug}`}>← {older.title}</a> : <span />}
      {newer ? <a href={`/${newer.slug}`}>{newer.title} →</a> : <span />}
    </div>
  )
}

export function renderWriting(props: PageFrameProps) {
  const { componentData, pageBody: Content, left, footer } = props
  const slug = componentData.fileData.slug
  const form = componentData.fileData.frontmatter?.form

  if (isWritingIndex(slug)) {
    return (
      <>
        <WritingIndex componentData={componentData} Content={Content} />
        {footer.map((F) => (
          <F {...componentData} />
        ))}
      </>
    )
  }

  if (form === "poem") {
    const pieces = getPieces(componentData.allFiles)
    const i = pieces.findIndex((p) => p.slug === slug)
    const older = i >= 0 ? pieces[i + 1] : undefined
    const newer = i > 0 ? pieces[i - 1] : undefined
    const piece = pieces[i]
    return (
      <>
        {older && (
          <a
            class="w-arrow w-arrow-prev"
            href={`/${older.slug}`}
            aria-label={`Previous: ${older.title}`}
          >
            ←
          </a>
        )}
        {newer && (
          <a
            class="w-arrow w-arrow-next"
            href={`/${newer.slug}`}
            aria-label={`Next: ${newer.title}`}
          >
            →
          </a>
        )}
        <div class="center w-poem">
          <p class="w-poem-date">{formatPieceDate(piece?.date)}</p>
          <p class="w-poem-author">{WRITER.name}</p>
          <h1 class="w-poem-title">{componentData.fileData.frontmatter?.title}</h1>
          <div class="w-poem-body">
            <Content {...componentData} />
          </div>
        </div>
        {footer.map((F) => (
          <F {...componentData} />
        ))}
      </>
    )
  }

  // Prose: dappled-light layout — site title + search + "Selected Writing" on the left,
  // article in the middle, table of contents on the right.
  const byName = (name: string) => left.find((c) => c.name === name)
  const toc = byName("DesktopOnly")
  const sidebar = [byName("PageTitle"), byName("Flex")].filter(Boolean) as QuartzComponent[]
  return DefaultFrame.render({
    ...props,
    left: [...sidebar, () => <SelectedWriting {...componentData} />],
    right: toc ? [toc] : [],
    beforeBody: [() => <PieceHeader componentData={componentData} />],
    afterBody: [() => <PrevNext componentData={componentData} />, ...props.afterBody],
  })
}
