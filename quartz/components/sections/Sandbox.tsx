import { QuartzComponent, QuartzComponentProps } from "../types"
import { getPieces } from "./pieces"
import { SECTIONS, SITE, textOf } from "./sectionsConfig"
import { Lang, langOf, t, urlFor } from "./i18n"
import { Crumbs } from "./Crumbs"
import { PostsList } from "./PostsList"

/** The strip at the top of a sandbox page, so it is never mistaken for a live one. */
export function SandboxNote({ lang }: { lang: Lang }) {
  const tt = t(lang)
  return (
    <p class="sandbox-note">
      <span>{tt.sandboxNote}</span>
      <a href={urlFor("sandbox", lang)}>{tt.sandboxAll} →</a>
    </p>
  )
}

/**
 * /sandbox: every page with `sandbox: true`, grouped by section, each in its real layout one click
 * away. The page itself is unlisted (content/sandbox.md), so it is not in the menu or in search.
 */
export function SandboxPage({
  componentData,
  Content,
  footer,
}: {
  componentData: QuartzComponentProps
  Content: QuartzComponent
  footer: QuartzComponent[]
}) {
  const slug = componentData.fileData.slug
  const lang = langOf(slug)
  const tt = t(lang)
  const groups = SECTIONS.filter((s) => s.kind === "collection")
    .map((s): [string, ReturnType<typeof getPieces>] => [
      textOf(s, lang).title,
      getPieces(componentData.allFiles, s.slug, lang, true),
    ])
    .filter(([, pieces]) => pieces.length > 0)
  return (
    <div class="center s-index cp-page sandbox-page">
      <Crumbs slug={slug} title={String(componentData.fileData.frontmatter?.title ?? "")} />
      <p class="s-eyebrow">{SITE.name}</p>
      <h1 class="s-index-title">{componentData.fileData.frontmatter?.title}</h1>
      <div class="cp-page-body">
        <Content {...componentData} />
      </div>
      {groups.length > 0 ? (
        <PostsList pieces={groups.flatMap(([, pieces]) => pieces)} lang={lang} groups={groups} />
      ) : (
        <p class="s-empty">{tt.empty}</p>
      )}
      {footer.map((F) => (
        <F {...componentData} />
      ))}
    </div>
  )
}
