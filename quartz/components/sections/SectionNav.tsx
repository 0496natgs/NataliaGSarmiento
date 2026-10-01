import { QuartzComponentProps } from "../types"
import { SECTIONS, SITE, SUBSTACK_URL, sectionOfSlug } from "./sectionsConfig"

/** Floating pill nav shown above every page in a section. */
export function SectionNav({ fileData }: QuartzComponentProps) {
  const current = sectionOfSlug(fileData.slug)
  return (
    <nav class="s-nav" aria-label="Sections">
      <a class="s-logo" href="/" aria-label={`${SITE.name} — home`}>
        {SITE.initial}
      </a>
      {SECTIONS.filter((s) => s.inNav !== false).map((s) => (
        <a class={current?.slug === s.slug ? "active" : ""} href={`/${s.slug}`}>
          {s.title}
        </a>
      ))}
      <a href={SUBSTACK_URL} target="_blank" rel="noopener noreferrer" data-router-ignore>
        Substack ↗
      </a>
      <span class="s-nav-spacer" />
      <a class="s-nav-button" href="/cv">
        CV
      </a>
    </nav>
  )
}
