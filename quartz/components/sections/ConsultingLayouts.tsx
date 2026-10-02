import { QuartzComponent, QuartzComponentProps } from "../types"
import { getPieces } from "./pieces"
import { LINKEDIN_URL, SITE } from "./sectionsConfig"
import { Lang, langOf, t, urlFor } from "./i18n"
import { WorkCard } from "./WorkCard"
import { ListRow } from "./ListRow"

/**
 * The consulting space's home: a LinkedIn-style profile (robertcmeza on LinkedIn, aimforbehavior.com).
 * A banner with one sentence, your name and headline, About (the page's own text), a row of
 * expertise chips, selected projects, the latest insights and a call to action. The banner
 * sentence, headline and chips come from the page's frontmatter (content/consulting/index.md).
 */
export function ConsultingProfile({
  componentData,
  Content,
  footer,
}: {
  componentData: QuartzComponentProps
  Content: QuartzComponent
  footer: QuartzComponent[]
}) {
  const fm = (componentData.fileData.frontmatter ?? {}) as Record<string, unknown>
  const lang: Lang = langOf(componentData.fileData.slug)
  const tt = t(lang)
  const expertise: string[] = Array.isArray(fm.expertise) ? fm.expertise.map(String) : []
  const projects = getPieces(componentData.allFiles, "consulting/projects", lang)
  const insights = getPieces(componentData.allFiles, "consulting/insights", lang).slice(0, 4)
  return (
    <div class="center cp">
      <section class="cp-banner">
        <span class="s-field" aria-hidden="true">
          <i />
          <i />
        </span>
        <p class="cp-banner-tag">{tt.consultingTag}</p>
        <h1 class="cp-banner-line">{fm.tagline as string}</h1>
      </section>

      <section class="cp-head">
        <h2 class="cp-name">{SITE.name}</h2>
        <p class="cp-headline">{fm.headline as string}</p>
        <p class="cp-actions">
          <a
            class="cp-btn is-solid"
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-router-ignore
          >
            {tt.linkedin} ↗
          </a>
          <a class="cp-btn" href={urlFor("consulting/experience", lang)}>
            {tt.viewExperience}
          </a>
        </p>
      </section>

      <section class="cp-block cp-about">
        <h2>{lang === "es" ? "Acerca de" : "About"}</h2>
        <div class="cp-about-text">
          <Content {...componentData} />
        </div>
      </section>

      {expertise.length > 0 && (
        <section class="cp-block">
          <h2>{tt.expertise}</h2>
          <ul class="cp-chips">
            {expertise.map((e) => (
              <li>{e}</li>
            ))}
          </ul>
        </section>
      )}

      {projects.length > 0 && (
        <section class="cp-block">
          <h2>{tt.featuredProjects}</h2>
          <div class="s-grid s-grid-work">
            {projects.map((p, i) => (
              <WorkCard piece={p} index={i} lang={lang} />
            ))}
          </div>
        </section>
      )}

      {insights.length > 0 && (
        <section class="cp-block">
          <h2>{tt.latestInsights}</h2>
          <div class="s-grid s-grid-list">
            {insights.map((p) => (
              <ListRow piece={p} lang={lang} />
            ))}
          </div>
          <p class="cp-more">
            <a href={urlFor("consulting/insights", lang)}>{tt.allInsights} →</a>
          </p>
        </section>
      )}

      <section class="cp-cta">
        <h2>{tt.letsTalk}</h2>
        <p>{tt.letsTalkNote}</p>
        <a
          class="cp-btn is-solid"
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-router-ignore
        >
          {tt.linkedin} ↗
        </a>
      </section>
      {footer.map((F) => (
        <F {...componentData} />
      ))}
    </div>
  )
}

/** A plain centred page (Experience): title, then the page's own text. */
export function ConsultingPage({
  componentData,
  Content,
  footer,
}: {
  componentData: QuartzComponentProps
  Content: QuartzComponent
  footer: QuartzComponent[]
}) {
  return (
    <div class="center s-index cp-page">
      <p class="s-eyebrow">{SITE.name}</p>
      <h1 class="s-index-title">{componentData.fileData.frontmatter?.title}</h1>
      <div class="cp-page-body">
        <Content {...componentData} />
      </div>
      {footer.map((F) => (
        <F {...componentData} />
      ))}
    </div>
  )
}
