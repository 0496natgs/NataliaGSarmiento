import { spaceOfSlug } from "./sectionsConfig"
import { langOf, t, urlFor } from "./i18n"

/**
 * A quiet line at the foot of every page that points to the other space (writer <-> consulting).
 * The two spaces have separate menus, so this is how a visitor finds the other one.
 */
export function SpaceLink({ slug }: { slug?: string }) {
  const lang = langOf(slug)
  const tt = t(lang)
  const toConsulting = spaceOfSlug(slug) === "writer"
  return (
    <p class="space-link">
      {toConsulting ? tt.spaceToConsulting : tt.spaceToWriter}{" "}
      <a href={toConsulting ? urlFor("consulting", lang) : urlFor("index", lang)}>
        {lang === "es" ? "Ir" : "Go"} →
      </a>
      <span class="space-link-more">
        <a href={urlFor("contact", lang)}>{tt.contact}</a> ·{" "}
        <a href={urlFor("ai", lang)}>{tt.aiUsage}</a>
      </span>
    </p>
  )
}
