import { SITE, SOCIAL, spaceOfSlug } from "./sectionsConfig"
import { Lang, langOf, t, urlFor } from "./i18n"

/** Line icons for the footer, drawn on a 24px grid in the text colour. */
function Icon({ name }: { name: string }) {
  const common = {
    viewBox: "0 0 24 24",
    width: 20,
    height: 20,
    "aria-hidden": true,
  } as const
  switch (name) {
    case "linkedin":
      return (
        <svg {...common} fill="currentColor">
          <circle cx="5" cy="5.5" r="2.2" />
          <path d="M3.1 9.2h3.8V21H3.1zM9.4 9.2h3.6v1.6h.05c.5-.95 1.75-1.95 3.6-1.95 3.85 0 4.55 2.5 4.55 5.8V21h-3.75v-5.6c0-1.35-.03-3.05-1.85-3.05-1.86 0-2.15 1.45-2.15 2.95V21H9.4z" />
        </svg>
      )
    case "instagram":
      return (
        <svg {...common} fill="none" stroke="currentColor" stroke-width="1.7">
          <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" />
          <circle cx="12" cy="12" r="4.1" />
          <circle cx="17.3" cy="6.7" r="1.05" fill="currentColor" stroke="none" />
        </svg>
      )
    case "substack":
      return (
        <svg {...common} fill="currentColor">
          <path d="M4.5 3.5h15v2.3h-15zM4.5 7.9h15v2.3h-15zM4.5 12.3h15v8.2L12 16.3l-7.5 4.2z" />
        </svg>
      )
    case "pen":
      return (
        <svg
          {...common}
          fill="none"
          stroke="currentColor"
          stroke-width="1.7"
          stroke-linejoin="round"
        >
          <path d="M4.5 19.5l1-4.6L15.6 4.8a2.2 2.2 0 0 1 3.1 3.1L8.6 18z" />
          <path d="M13.8 6.6l3.1 3.1M4.5 19.5h15" />
        </svg>
      )
    default:
      // envelope
      return (
        <svg
          {...common}
          fill="none"
          stroke="currentColor"
          stroke-width="1.7"
          stroke-linejoin="round"
        >
          <rect x="3" y="5.5" width="18" height="13" rx="2" />
          <path d="M3.8 6.8l8.2 6.4 8.2-6.4" />
        </svg>
      )
  }
}

/**
 * The foot of every page of the site. The writing site (ink) shows the writing accounts (Substack,
 * Materia prima's Instagram, Colectivo Tlacuiloque); the consulting site (indigo) shows LinkedIn and
 * Instagram. Both have an envelope for the Contact page, the AI usage page and a link across to the
 * other site. The accounts are listed in SOCIAL in sectionsConfig.ts.
 *
 * It is a div with role="contentinfo" rather than a <footer>, because the theme styles every
 * <footer> as its own credit line.
 */
export function SiteFooter({ slug }: { slug?: string }) {
  const lang: Lang = langOf(slug)
  const tt = t(lang)
  const space = spaceOfSlug(slug)
  const consulting = space === "consulting"
  const home = consulting ? urlFor("consulting", lang) : urlFor("index", lang)
  const year = new Date().getFullYear()
  return (
    <div class={`site-foot is-${space}`} role="contentinfo">
      <div class="site-foot-inner">
        <div class="site-foot-brand">
          <a class="site-foot-name" href={home}>
            {SITE.name}
          </a>
          <p class="site-foot-tag">{consulting ? tt.consultingTag : tt.writerTag}</p>
        </div>
        <ul class="site-foot-social" aria-label={tt.footerElsewhere}>
          {SOCIAL[space].map((s) => {
            const label = lang === "es" && s.label_es ? s.label_es : s.label
            return (
              <li>
                <a
                  class="site-foot-icon"
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-router-ignore
                  aria-label={label}
                  title={label}
                >
                  <Icon name={s.icon} />
                </a>
              </li>
            )
          })}
          <li>
            <a
              class="site-foot-icon"
              href={urlFor("contact", lang)}
              aria-label={tt.email}
              title={tt.email}
            >
              <Icon name="mail" />
            </a>
          </li>
        </ul>
        <p class="site-foot-links">
          <a href={urlFor("contact", lang)}>{tt.contact}</a>
          <a href={urlFor("ai", lang)}>{tt.aiUsage}</a>
          <a
            class="site-foot-across"
            href={consulting ? urlFor("index", lang) : urlFor("consulting", lang)}
          >
            {consulting ? tt.toWriting : tt.toConsulting} →
          </a>
        </p>
        <p class="site-foot-copy">
          © {year} {SITE.name}
        </p>
      </div>
    </div>
  )
}
