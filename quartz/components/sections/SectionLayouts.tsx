import { PageFrameProps } from "../frames/types"
import { DefaultFrame } from "../frames/DefaultFrame"
import { QuartzComponent } from "../types"
import { SelectedPieces } from "./SelectedPieces"
import { SectionIndex } from "./SectionIndex"
import { formatPieceDate, getPieces, isPageSection, isSandbox, isSectionIndex } from "./pieces"
import { SITE, sectionOfSlug, textOf } from "./sectionsConfig"
import { AboutFacts } from "./AboutFacts"
import { ProjectGallery } from "./ProjectGallery"
import { ConsultingPage, ConsultingProfile } from "./ConsultingLayouts"
import { categoryLabel, langOf, t } from "./i18n"
import { Crumbs } from "./Crumbs"
import { ShareBar } from "./ShareBar"
import { Sidenotes } from "./Sidenotes"
import { SandboxNote, SandboxPage } from "./Sandbox"
import { PhotoCredit } from "./PhotoCredit"

const pageUrl = (baseUrl: string | undefined, slug: string | undefined) =>
  `https://${baseUrl ?? "nataliagsarmiento.com"}/${(slug ?? "").replace(/\/index$/, "").replace(/^index$/, "")}`

/** Title, date, category chip, role/year and tags for a piece (dappled-light header). */
function PieceHeader({ componentData }: Pick<PageFrameProps, "componentData">) {
  const slug = componentData.fileData.slug
  const lang = langOf(slug)
  const sandbox = isSandbox(componentData.fileData)
  const piece = getPieces(componentData.allFiles, undefined, lang, sandbox).find(
    (p) => p.slug === slug,
  )
  return (
    <div class="s-piece-header">
      {sandbox && <SandboxNote lang={lang} />}
      <Crumbs slug={slug} title={String(componentData.fileData.frontmatter?.title ?? "")} />
      <h1 class="s-piece-title">{componentData.fileData.frontmatter?.title}</h1>
      <p class="s-piece-meta">
        {piece?.date && <span class="s-script-date">{formatPieceDate(piece.date, lang)}</span>}
        {piece?.category && <span class="s-category">{categoryLabel(piece.category, lang)}</span>}
        {piece?.year && <span class="s-fact">{piece.year}</span>}
        {piece?.role && <span class="s-fact">{piece.role}</span>}
      </p>
      <PhotoCredit src={piece?.cover} lang={lang} />
      {piece && piece.tags.length > 0 && (
        <p class="s-tags">
          {piece.tags.map((t) => (
            <a class="s-tag" href={`/tags/${encodeURIComponent(t)}`}>
              #{t}
            </a>
          ))}
        </p>
      )}
    </div>
  )
}

function PrevNext({ componentData }: Pick<PageFrameProps, "componentData">) {
  const section = sectionOfSlug(componentData.fileData.slug)
  const lang = langOf(componentData.fileData.slug)
  const pieces = getPieces(
    componentData.allFiles,
    section?.slug,
    lang,
    isSandbox(componentData.fileData),
  ).filter((p) => !p.external)
  const i = pieces.findIndex((p) => p.slug === componentData.fileData.slug)
  const older = i >= 0 ? pieces[i + 1] : undefined
  const newer = i > 0 ? pieces[i - 1] : undefined
  return (
    <div class="s-prevnext">
      {older ? <a href={older.href}>← {older.title}</a> : <span />}
      {newer ? <a href={newer.href}>{newer.title} →</a> : <span />}
    </div>
  )
}

/**
 * A piece with a large image across the top (front matter `layout: hero` and a `cover`), after
 * therumpus.net: the image, then the section and category, a large title and a one-line byline,
 * then the text in one centred column.
 */
function HeroPiece({
  componentData,
  Content,
  footer,
}: Pick<PageFrameProps, "componentData" | "footer"> & {
  Content: QuartzComponent
}) {
  const slug = componentData.fileData.slug
  const lang = langOf(slug)
  const tt = t(lang)
  const section = sectionOfSlug(slug)
  const sandbox = isSandbox(componentData.fileData)
  const piece = getPieces(componentData.allFiles, undefined, lang, sandbox).find(
    (p) => p.slug === slug,
  )
  const title = String(componentData.fileData.frontmatter?.title ?? "")
  const byline = [
    `${tt.by} ${SITE.name}`,
    piece?.date ? formatPieceDate(piece.date, lang) : piece?.year,
    [piece?.publication, piece?.issue].filter(Boolean).join(", "),
  ].filter(Boolean)
  return (
    <>
      <div class="center s-hero-piece">
        {piece?.cover && <img class="s-hero-img" src={piece.cover} alt="" />}
        <PhotoCredit src={piece?.cover} lang={lang} class="s-hero-credit" />
        <div class="s-hero-body">
          {sandbox && <SandboxNote lang={lang} />}
          <Crumbs slug={slug} title={title} />
          <p class="s-hero-kicker">
            {section && <span class="s-hero-section">{textOf(section, lang).title}</span>}
            {piece?.category && <span>{categoryLabel(piece.category, lang)}</span>}
          </p>
          <h1 class="s-hero-title">{title}</h1>
          <p class="s-hero-byline">{byline.join(" • ")}</p>
          <article class="s-hero-text">
            <Content {...componentData} />
          </article>
          <ShareBar url={pageUrl(componentData.cfg.baseUrl, slug)} title={title} lang={lang} />
          <PrevNext componentData={componentData} />
        </div>
      </div>
      {footer.map((F) => (
        <F {...componentData} />
      ))}
    </>
  )
}

export function renderSection(props: PageFrameProps) {
  const { componentData, pageBody: Content, left, footer } = props
  const slug = componentData.fileData.slug
  const section = sectionOfSlug(slug)
  if (!section) return DefaultFrame.render(props)
  const form = componentData.fileData.frontmatter?.form

  if (isPageSection(slug) && section.slug === "consulting") {
    return <ConsultingProfile componentData={componentData} Content={Content} footer={footer} />
  }

  if (isPageSection(slug) && section.slug === "sandbox") {
    return <SandboxPage componentData={componentData} Content={Content} footer={footer} />
  }

  if (isPageSection(slug) && (section.space === "consulting" || section.slug === "contact")) {
    return <ConsultingPage componentData={componentData} Content={Content} footer={footer} />
  }

  // Spanish pages are not in the graph (they are unlisted so each page shows once), so no graph there.
  const showGraph = langOf(slug) === "en"

  if (isPageSection(slug)) {
    const byName = (name: string) => left.find((c) => c.name === name)
    const toc = byName("DesktopOnly")
    const graph = showGraph ? props.right.find((c) => c.name === "Graph") : undefined
    const sidebar = [byName("PageTitle"), byName("Flex")].filter(Boolean) as QuartzComponent[]
    return DefaultFrame.render({
      ...props,
      left: [...sidebar, AboutFacts],
      right: [graph, toc].filter(Boolean) as QuartzComponent[],
      beforeBody: [
        () => (
          <div class="s-piece-header">
            <Crumbs slug={slug} title={String(componentData.fileData.frontmatter?.title ?? "")} />
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

  if (componentData.fileData.frontmatter?.layout === "hero") {
    return <HeroPiece componentData={componentData} Content={Content} footer={footer} />
  }

  if (form === "poem" && !componentData.fileData.frontmatter?.collection) {
    const lang = langOf(slug)
    const tt = t(lang)
    const sandbox = isSandbox(componentData.fileData)
    const pieces = getPieces(componentData.allFiles, section.slug, lang, sandbox).filter(
      (p) => !p.external && p.form === "poem",
    )
    const i = pieces.findIndex((p) => p.slug === slug)
    const older = i >= 0 ? pieces[i + 1] : undefined
    const newer = i > 0 ? pieces[i - 1] : undefined
    return (
      <>
        {older && (
          <a
            class="s-arrow s-arrow-prev"
            href={older.href}
            aria-label={`${tt.previous}: ${older.title}`}
          >
            ←
          </a>
        )}
        {newer && (
          <a
            class="s-arrow s-arrow-next"
            href={newer.href}
            aria-label={`${tt.next}: ${newer.title}`}
          >
            →
          </a>
        )}
        <div class="center s-poem">
          {sandbox && <SandboxNote lang={lang} />}
          <Crumbs slug={slug} title={String(componentData.fileData.frontmatter?.title ?? "")} />
          <p class="s-poem-date">{formatPieceDate(pieces[i]?.date, lang)}</p>
          <p class="s-poem-author">{SITE.name}</p>
          <h1 class="s-poem-title">{componentData.fileData.frontmatter?.title}</h1>
          <div class="s-poem-body">
            <Content {...componentData} />
          </div>
          <ShareBar
            url={pageUrl(componentData.cfg.baseUrl, slug)}
            title={String(componentData.fileData.frontmatter?.title ?? "")}
            lang={lang}
          />
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
    // The contents sit on the left so the right margin is free for footnotes (see Sidenotes).
    left: [...sidebar, toc, () => <SelectedPieces {...componentData} />].filter(
      Boolean,
    ) as QuartzComponent[],
    right: [],
    beforeBody: [() => <PieceHeader componentData={componentData} />],
    afterBody: [
      ProjectGallery,
      () => (
        <ShareBar
          url={pageUrl(componentData.cfg.baseUrl, slug)}
          title={String(componentData.fileData.frontmatter?.title ?? "")}
          lang={langOf(slug)}
        />
      ),
      Sidenotes,
      () => <PrevNext componentData={componentData} />,
      ...props.afterBody,
    ],
  })
}
