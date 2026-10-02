import { QuartzComponentProps } from "../types"
import {
  LINKEDIN_URL,
  SECTIONS,
  SITE,
  SUBSTACK_URL,
  sectionOfSlug,
  spaceOfSlug,
  textOf,
} from "./sectionsConfig"
import { getPieces } from "./pieces"
import { LOGO } from "./gallery"
import { SiteSearch } from "./SiteSearch"
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
 * hover (olhalazarieva.com), and on the right the language switch and one call-to-action. The
 * writer space and the consulting space each have their own menu. On small screens it folds into
 * a full-screen menu (pure CSS, no framework).
 */
export function SectionNav({ fileData, allFiles }: QuartzComponentProps) {
  const lang = langOf(fileData.slug)
  const tt = t(lang)
  const tag = baseSlug(fileData.slug).match(/^tags\/(.+)$/)?.[1]
  // A tag page belongs to the consulting space when any page with that tag does.
  const space = tag
    ? allFiles.some(
        (f) =>
          baseSlug(f.slug).startsWith("consulting") &&
          ((f.frontmatter?.tags as string[] | undefined) ?? []).includes(decodeURIComponent(tag)),
      )
      ? "consulting"
      : "writer"
    : spaceOfSlug(fileData.slug)
  const current = sectionOfSlug(fileData.slug)
  const other: Lang = lang === "es" ? "en" : "es"
  // Sections that are still empty (e.g. Insights) stay out of the menu until they have a piece.
  const links = SECTIONS.filter(
    (s) =>
      s.space === space &&
      s.inNav !== false &&
      (!s.hideWhenEmpty || getPieces(allFiles, s.slug, lang).length > 0),
  )
  const home = urlFor(space === "consulting" ? "consulting" : "index", lang)
  const switchTo = otherLanguageHref(allFiles, fileData.slug, other)
  const cta =
    space === "consulting"
      ? { href: LINKEDIN_URL, label: `${tt.linkedin} ↗` }
      : { href: SUBSTACK_URL, label: `${tt.substack} ↗` }
  return (
    <header class={`site-nav space-${space}`}>
      <script dangerouslySetInnerHTML={{ __html: CLOSE_ON_NAV }} />
      <input type="checkbox" id="nav-toggle" class="nav-toggle" aria-label={tt.menu} />
      <a class="nav-logo" href={home} aria-label={`${SITE.name} — ${tt.home}`}>
        {LOGO ? <img src={LOGO} alt={SITE.name} /> : SITE.name}
      </a>
      {space === "consulting" && <span class="nav-space">{tt.consultingTag}</span>}
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
        <span class="nav-end">
          <SiteSearch lang={lang} />
          <a class="nav-link" href={urlFor("contact", lang)}>
            <Roll text={tt.contact} />
          </a>
          <a
            class="nav-lang"
            href={switchTo}
            lang={other}
            hreflang={other}
            title={tt.otherLanguageName}
          >
            <Roll text={tt.otherLanguage} />
          </a>
          {space === "consulting" && (
            <a class="nav-link" href={urlFor("index", lang)}>
              <Roll text={`${lang === "es" ? "Escritura" : "Writing"} →`} />
            </a>
          )}
          <a
            class="nav-cta"
            href={cta.href}
            target="_blank"
            rel="noopener noreferrer"
            data-router-ignore
          >
            {cta.label}
          </a>
        </span>
      </nav>
    </header>
  )
}
