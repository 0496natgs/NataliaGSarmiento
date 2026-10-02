import { baseSlug, langOf, t, urlFor } from "./i18n"
import { sectionOfSlug, spaceOfSlug, textOf } from "./sectionsConfig"

/**
 * Breadcrumbs above a page: Home / (Consulting) / Section / this page. The last item is the page
 * itself and is not a link.
 */
export function Crumbs({ slug, title }: { slug?: string; title?: string }) {
  const lang = langOf(slug)
  const tt = t(lang)
  const section = sectionOfSlug(slug)
  const base = baseSlug(slug)
  const items: { label: string; href?: string }[] = [
    { label: tt.crumbHome, href: urlFor("index", lang) },
  ]
  const onSectionPage = !!section && (base === section.slug || base === `${section.slug}/index`)
  if (spaceOfSlug(slug) === "consulting" && section?.slug !== "consulting") {
    items.push({
      label: lang === "es" ? "Consultoría" : "Consulting",
      href: urlFor("consulting", lang),
    })
  }
  if (section && !onSectionPage) {
    items.push({ label: textOf(section, lang).title, href: urlFor(section.slug, lang) })
  }
  items.push({ label: (onSectionPage && section ? textOf(section, lang).title : title) ?? "" })
  return (
    <nav class="crumbs" aria-label="Breadcrumb">
      {items.map((it, i) => (
        <>
          {i > 0 && <span class="crumbs-sep">/</span>}
          {it.href ? <a href={it.href}>{it.label}</a> : <span aria-current="page">{it.label}</span>}
        </>
      ))}
    </nav>
  )
}
