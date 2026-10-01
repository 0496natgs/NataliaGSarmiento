import { PageFrameProps } from "../frames/types"
import { DefaultFrame } from "../frames/DefaultFrame"
import { QuartzComponent } from "../types"
import { SelectedPieces } from "./SelectedPieces"
import { SectionIndex } from "./SectionIndex"
import { formatPieceDate, getPieces, isPageSection, isSectionIndex } from "./pieces"
import { SITE, sectionOfSlug } from "./sectionsConfig"

/** Title, date, category chip, role/year and tags for a piece (dappled-light header). */
function PieceHeader({ componentData }: Pick<PageFrameProps, "componentData">) {
  const slug = componentData.fileData.slug
  const piece = getPieces(componentData.allFiles).find((p) => p.slug === slug)
  return (
    <div class="s-piece-header">
      <h1 class="s-piece-title">{componentData.fileData.frontmatter?.title}</h1>
      <p class="s-piece-meta">
        {piece?.date && <span class="s-script-date">{formatPieceDate(piece.date)}</span>}
        {piece?.category && <span class="s-category">{piece.category}</span>}
        {piece?.year && <span class="s-fact">{piece.year}</span>}
        {piece?.role && <span class="s-fact">{piece.role}</span>}
      </p>
      {piece && piece.tags.length > 0 && (
        <p class="s-tags">
          {piece.tags.map((t) => (
            <span class="s-tag">#{t}</span>
          ))}
        </p>
      )}
    </div>
  )
}

function PrevNext({ componentData }: Pick<PageFrameProps, "componentData">) {
  const section = sectionOfSlug(componentData.fileData.slug)
  const pieces = getPieces(componentData.allFiles, section?.slug).filter((p) => !p.external)
  const i = pieces.findIndex((p) => p.slug === componentData.fileData.slug)
  const older = i >= 0 ? pieces[i + 1] : undefined
  const newer = i > 0 ? pieces[i - 1] : undefined
  return (
    <div class="s-prevnext">
      {older ? <a href={`/${older.slug}`}>← {older.title}</a> : <span />}
      {newer ? <a href={`/${newer.slug}`}>{newer.title} →</a> : <span />}
    </div>
  )
}

export function renderSection(props: PageFrameProps) {
  const { componentData, pageBody: Content, left, footer } = props
  const slug = componentData.fileData.slug
  const section = sectionOfSlug(slug)
  if (!section) return DefaultFrame.render(props)
  const form = componentData.fileData.frontmatter?.form

  if (isPageSection(slug)) {
    const byName = (name: string) => left.find((c) => c.name === name)
    const toc = byName("DesktopOnly")
    const sidebar = [byName("PageTitle"), byName("Flex")].filter(Boolean) as QuartzComponent[]
    return DefaultFrame.render({
      ...props,
      left: sidebar,
      right: toc ? [toc] : [],
      beforeBody: [
        () => (
          <div class="s-piece-header">
            <h1 class="s-piece-title">{componentData.fileData.frontmatter?.title}</h1>
          </div>
        ),
      ],
      afterBody: props.afterBody,
    })
  }

  if (isSectionIndex(slug) && section.kind === "collection") {
    return (
      <>
        <SectionIndex componentData={componentData} Content={Content} section={section} />
        {footer.map((F) => (
          <F {...componentData} />
        ))}
      </>
    )
  }

  if (form === "poem") {
    const pieces = getPieces(componentData.allFiles, section.slug).filter((p) => !p.external)
    const i = pieces.findIndex((p) => p.slug === slug)
    const older = i >= 0 ? pieces[i + 1] : undefined
    const newer = i > 0 ? pieces[i - 1] : undefined
    return (
      <>
        {older && (
          <a
            class="s-arrow s-arrow-prev"
            href={`/${older.slug}`}
            aria-label={`Previous: ${older.title}`}
          >
            ←
          </a>
        )}
        {newer && (
          <a
            class="s-arrow s-arrow-next"
            href={`/${newer.slug}`}
            aria-label={`Next: ${newer.title}`}
          >
            →
          </a>
        )}
        <div class="center s-poem">
          <p class="s-poem-date">{formatPieceDate(pieces[i]?.date)}</p>
          <p class="s-poem-author">{SITE.name}</p>
          <h1 class="s-poem-title">{componentData.fileData.frontmatter?.title}</h1>
          <div class="s-poem-body">
            <Content {...componentData} />
          </div>
        </div>
        {footer.map((F) => (
          <F {...componentData} />
        ))}
      </>
    )
  }

  // Article / project / note: site title + search + "Selected …" on the left, content in the middle,
  // table of contents on the right (dappled-light).
  const byName = (name: string) => left.find((c) => c.name === name)
  const toc = byName("DesktopOnly")
  const sidebar = [byName("PageTitle"), byName("Flex")].filter(Boolean) as QuartzComponent[]
  return DefaultFrame.render({
    ...props,
    left: [...sidebar, () => <SelectedPieces {...componentData} />],
    right: toc ? [toc] : [],
    beforeBody: [() => <PieceHeader componentData={componentData} />],
    afterBody: [() => <PrevNext componentData={componentData} />, ...props.afterBody],
  })
}
