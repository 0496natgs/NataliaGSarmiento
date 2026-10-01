import { QuartzComponentProps } from "../types"
import { SECTIONS, SITE, SUBSTACK_URL, sectionOfSlug, textOf } from "./sectionsConfig"
import { Lang, baseSlug, langOf, t, urlFor } from "./i18n"

/** Text split into letters so each one can roll on hover (olhalazarieva.com). */
function Roll({ text }: { text: string }) {
  const letters = [...text]
  const row = (hidden: boolean) => (
    <span class={hidden ? "roll-clone" : "roll-original"} aria-hidden={hidden ? "true" : undefined}>
      {letters.map((ch, i) => (
        <span style={`--i:${i}`}>{ch === " " ? " " : ch}</span>
      ))}
    </span>
  )
  return (
    <>
      {row(false)}
      {row(true)}
    </>
  )
}

/** Where the language switch goes: the same page in the other language if it exists, else its section, else home. */
function otherLanguageHref(
  allFiles: QuartzComponentProps["allFiles"],
  slug: string | undefined,
  to: Lang,
) {
  const base = baseSlug(slug)
  const has = (s: string) => allFiles.some((f) => f.slug === s)
  const candidate = (b: string) => (to === "es" ? `es/${b}` : b)
  if (has(candidate(base))) return urlFor(base, to)
  const section = sectionOfSlug(slug)
  if (section) {
    for (const b of [`${section.slug}/index`, section.slug]) {
      if (has(candidate(b))) return urlFor(section.slug, to)
    }
  }
  return urlFor("index", to)
}

// Closes the mobile menu after a link is followed (the page changes without a reload).
const CLOSE_ON_NAV = `if(!window.__navClose){window.__navClose=1;document.addEventListener("nav",function(){var c=document.getElementById("nav-toggle");if(c)c.checked=false})}`

/**
 * The top menu on every page of the site: logo, a row of mono uppercase links whose letters roll on
 * hover (olhalazarieva.com), and on the right the language switch and the CV. On small screens it
 * folds into a full-screen menu (pure CSS, no framework).
 */
export function SectionNav({ fileData, allFiles }: QuartzComponentProps) {
  const lang = langOf(fileData.slug)
  const tt = t(lang)
  const current = sectionOfSlug(fileData.slug)
  const other: Lang = lang === "es" ? "en" : "es"
  const links = SECTIONS.filter((s) => s.inNav !== false)
  const home = urlFor("index", lang)
  const cv = urlFor("cv", lang)
  const switchTo = otherLanguageHref(allFiles, fileData.slug, other)
  return (
    <header class="site-nav">
      <script dangerouslySetInnerHTML={{ __html: CLOSE_ON_NAV }} />
      <input type="checkbox" id="nav-toggle" class="nav-toggle" aria-label={tt.menu} />
      <a class="nav-logo" href={home} aria-label={`${SITE.name} — ${tt.home}`}>
        {SITE.name}
      </a>
      <label class="nav-burger" for="nav-toggle">
        <span class="nav-burger-open">{tt.menu}</span>
        <span class="nav-burger-close">{tt.close}</span>
      </label>
      <nav class="nav-menu" aria-label={tt.sections}>
        {links.map((s) => (
          <a
            class={`nav-link${current?.slug === s.slug ? " active" : ""}`}
            href={urlFor(s.slug, lang)}
          >
            <Roll text={textOf(s, lang).title} />
          </a>
        ))}
        <a
          class="nav-link"
          href={SUBSTACK_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-router-ignore
        >
          <Roll text={`${tt.substack} ↗`} />
        </a>
        <span class="nav-end">
          <a
            class="nav-lang"
            href={switchTo}
            lang={other}
            hreflang={other}
            title={tt.otherLanguageName}
          >
            <Roll text={tt.otherLanguage} />
          </a>
          <a class={`nav-cv${current?.slug === "cv" ? " active" : ""}`} href={cv}>
            {tt.cv}
          </a>
        </span>
      </nav>
    </header>
  )
}
