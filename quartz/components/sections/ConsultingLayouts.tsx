import { QuartzComponent, QuartzComponentProps } from "../types"
import { Piece, getPieces } from "./pieces"
import { LINKEDIN_URL, SITE } from "./sectionsConfig"
import { Lang, categoryLabel, langOf, t, urlFor } from "./i18n"
import { ListRow } from "./ListRow"
import { Crumbs } from "./Crumbs"
import { GoArrow } from "./GoArrow"
import { PhotoCredit } from "./PhotoCredit"

/**
 * The consulting space's home (K1 with the K2 hero). An indigo band with the headline, one
 * sentence and a photograph by René Rivas under an indigo wash; a "currently" strip taken from the
 * Experience page; the page's own text beside its tagline; three practices; three selected projects;
 * the experience in five lines; and an indigo "Let's talk" band. Everything comes from frontmatter:
 * content/consulting/index.md (headline, intro, hero, tagline, languages, practices, featured) and
 * content/consulting/experience.md (timeline).
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
  const str = (v: unknown) => (v === undefined || v === null ? "" : String(v))
  const list = (v: unknown): string[] => (Array.isArray(v) ? v.map(String) : [])
  const hero = str(fm.hero) || undefined
  const practices = (Array.isArray(fm.practices) ? fm.practices : []) as {
    title?: string
    items?: string[]
  }[]
  const projects = getPieces(componentData.allFiles, "consulting/projects", lang)
  const featuredSlugs = list(fm.featured)
  const featured = featuredSlugs.length
    ? featuredSlugs
        .map((f) => projects.find((p) => p.slug.endsWith(`consulting/projects/${f}`)))
        .filter((p): p is Piece => !!p)
    : projects.slice(0, 3)
  const insights = getPieces(componentData.allFiles, "consulting/insights", lang).slice(0, 4)

  // The roles, from the Experience page in the same language (English if there is no Spanish one).
  const expSlug = lang === "es" ? "es/consulting/experience" : "consulting/experience"
  const expFile =
    componentData.allFiles.find((f) => f.slug === expSlug) ??
    componentData.allFiles.find((f) => f.slug === "consulting/experience")
  const roles = (
    Array.isArray(expFile?.frontmatter?.timeline) ? expFile!.frontmatter!.timeline : []
  ) as Role[]
  const current = roles.find((r) => r.current) ?? roles[0]
  const languages = list(fm.languages)

  return (
    <div class="center cp cpk">
      <section class="cpk-hero">
        {hero && <img class="cpk-hero-img" src={hero} alt="" />}
        <div class="cpk-hero-inner">
          <p class="cpk-tag">{tt.consultingTag}</p>
          <h1 class="cpk-title">{str(fm.headline)}</h1>
          {fm.intro !== undefined && <p class="cpk-lede">{str(fm.intro)}</p>}
          <p class="cpk-actions">
            <a class="cpk-btn is-lime" href="#projects" data-router-ignore>
              {tt.seeProjects}
            </a>
            <a class="cpk-btn is-ghost" href={urlFor("consulting/experience", lang)}>
              {tt.viewExperience}
            </a>
          </p>
        </div>
        <PhotoCredit src={hero} lang={lang} class="cpk-credit" />
      </section>

      {current && (
        <section class="cpk-now">
          <div>
            <span>{tt.currently}</span>
            <strong>
              {current.role}, {current.place}
            </strong>
          </div>
          {current.location && (
            <div>
              <span>{tt.where}</span>
              <strong>{current.location}</strong>
            </div>
          )}
          {languages.length > 0 && (
            <div>
              <span>{tt.languages}</span>
              <strong>{languages.join(" · ")}</strong>
            </div>
          )}
        </section>
      )}

      <section class="cpk-about">
        {fm.tagline !== undefined && <p class="cpk-statement">{str(fm.tagline)}</p>}
        <div class="cpk-about-text">
          <Content {...componentData} />
        </div>
      </section>

      {practices.length > 0 && (
        <section class="cpk-practices">
          {practices.map((p) => (
            <div class="cpk-practice">
              <h2>{p.title}</h2>
              <ul>
                {(p.items ?? []).map((i) => (
                  <li>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {featured.length > 0 && (
        <section class="cpk-projects" id="projects">
          <div class="cpk-head">
            <h2>{tt.featuredProjects}</h2>
            <a href={urlFor("consulting/projects", lang)}>{tt.allProjects} →</a>
          </div>
          <div class="cpk-cards">
            {featured.map((p) => (
              <a class="cpk-card" href={p.href}>
                <span class="cpk-card-media">
                  {p.cover ? (
                    <img src={p.cover} alt="" loading="lazy" />
                  ) : (
                    <span class="cpk-card-blank">{p.title}</span>
                  )}
                </span>
                <span class="cpk-card-kicker">
                  {[categoryLabel(p.category, lang), p.period ?? p.year]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
                <span class="cpk-card-title">{p.title}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      {roles.length > 0 && (
        <section class="cpk-exp">
          <h2>{tt.viewExperience}</h2>
          <div class="cpk-exp-list">
            {roles.slice(0, 5).map((r) => (
              <div class="cpk-exp-row">
                <span class="cpk-exp-when">{r.when}</span>
                <span class="cpk-exp-role" title={r.role}>
                  {r.role}
                </span>
                <span class="cpk-exp-place">{r.place}</span>
              </div>
            ))}
            <a class="cpk-exp-more" href={urlFor("consulting/experience", lang)}>
              {tt.viewExperience} →
            </a>
          </div>
        </section>
      )}

      {insights.length > 0 && (
        <section class="cpk-insights">
          <div class="cpk-head">
            <h2>{tt.latestInsights}</h2>
            <a href={urlFor("consulting/insights", lang)}>{tt.allInsights} →</a>
          </div>
          <div class="s-grid s-grid-list">
            {insights.map((p) => (
              <ListRow piece={p} lang={lang} />
            ))}
          </div>
        </section>
      )}

      <section class="cpk-cta">
        <h2>{tt.letsTalk}</h2>
        <p class="cpk-cta-actions">
          <a class="cpk-btn is-lime" href={urlFor("contact", lang)}>
            {tt.writeToMe}
          </a>
          <a
            class="cpk-btn is-ghost"
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-router-ignore
          >
            {tt.linkedin}
            <span class="ext" aria-hidden="true" />
          </a>
        </p>
      </section>
      {footer.map((F) => (
        <F {...componentData} />
      ))}
    </div>
  )
}

interface Role {
  when: string
  role: string
  place: string
  duration?: string
  location?: string
  summary?: string
  bullets?: string[]
  /** Slugs under consulting/projects that belong to this role. */
  projects?: string[]
  current?: boolean
}

/** "Salesforce · [Trailblazer profile](https://…)" -> text with a real link. */
function withLinks(text: string) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g)
  return parts.map((part) => {
    const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    return m ? (
      <a href={m[2]} target="_blank" rel="noopener noreferrer" data-router-ignore>
        {m[1]}
      </a>
    ) : (
      part
    )
  })
}

/**
 * Experience as a timeline (after mikes.cv): the year on the left, a dotted line with a dot per
 * role, then the place, the role and what you did. The roles live in the page's front matter.
 */
function Timeline({
  roles,
  current,
  pieces,
  label,
  lang,
}: {
  roles: Role[]
  current: string
  pieces: Piece[]
  label: string
  lang: Lang
}) {
  return (
    <ol class="tl">
      {roles.map((r, i) => (
        <li class="tl-item" style={`--i:${i}`}>
          <span class="tl-year">{r.when.match(/\d{4}/)?.[0]}</span>
          <div class="tl-body">
            <h3 class="tl-place">
              {withLinks(r.place)}
              {r.current && <span class="tl-current">{current}</span>}
            </h3>
            <p class="tl-role">{r.role}</p>
            <p class="tl-when">
              {r.when}
              {r.duration && <span> ({r.duration})</span>}
            </p>
            {r.location && <p class="tl-where">{r.location}</p>}
            {r.summary && <p class="tl-sum">{r.summary}</p>}
            {r.bullets && (
              <ul class="tl-list">
                {r.bullets.map((b) => (
                  <li>{b}</li>
                ))}
              </ul>
            )}
            {r.projects && (
              <div class="tl-projects">
                <p class="tl-projects-head">{label}</p>
                <ul>
                  {r.projects.map((name) => {
                    const piece = pieces.find((p) => p.slug.endsWith(`consulting/projects/${name}`))
                    if (!piece) return null
                    return (
                      <li>
                        <a class="tl-project" href={piece.href}>
                          <span class="tl-project-title">
                            {piece.title}
                            <GoArrow />
                          </span>
                          <span class="tl-project-meta">
                            {[categoryLabel(piece.category, lang), piece.period ?? piece.year]
                              .filter(Boolean)
                              .join(" · ")}
                          </span>
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
          </div>
        </li>
      ))}
    </ol>
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
  const fm = componentData.fileData.frontmatter as Record<string, unknown> | undefined
  const lang = langOf(componentData.fileData.slug)
  const es = lang === "es"
  return (
    <div class="center s-index cp-page">
      <Crumbs
        slug={componentData.fileData.slug}
        title={String(componentData.fileData.frontmatter?.title ?? "")}
      />
      <p class="s-eyebrow">{SITE.name}</p>
      <h1 class="s-index-title">{componentData.fileData.frontmatter?.title}</h1>
      {Array.isArray(fm?.timeline) ? (
        <div class="cp-page-body is-timeline">
          <Timeline
            roles={fm.timeline as Role[]}
            current={es ? "Actual" : "Current"}
            pieces={getPieces(componentData.allFiles, "consulting/projects", lang)}
            label={t(lang).roleProjects}
            lang={lang}
          />
          {Array.isArray(fm.education) && (
            <>
              <h2 class="tl-head">{es ? "Formación" : "Education"}</h2>
              <Timeline
                roles={fm.education as Role[]}
                current=""
                pieces={[]}
                label=""
                lang={lang}
              />
            </>
          )}
          {fm.languages && (
            <>
              <h2 class="tl-head">{es ? "Idiomas" : "Languages"}</h2>
              <p class="tl-sum">{String(fm.languages)}</p>
            </>
          )}
          <p class="tl-back">
            <a href={urlFor("consulting", lang)}>← {es ? "Perfil" : "Profile"}</a>
          </p>
        </div>
      ) : (
        <div class="cp-page-body">
          <Content {...componentData} />
        </div>
      )}
      {footer.map((F) => (
        <F {...componentData} />
      ))}
    </div>
  )
}
