import { QuartzComponent, QuartzComponentProps } from "../types"
import { Lang, langOf, t, urlFor } from "./i18n"
import { PhotoCredit } from "./PhotoCredit"
import { LetsTalk } from "./LetsTalk"
import { GoArrow } from "./GoArrow"

/**
 * The Services page (content/consulting/services.md) and the pieces of it that other pages reuse:
 * the Services band on the Profile and the kind-of-solution links on the Experience page. All the
 * words live in the page's front matter, so they can be changed there.
 */

export interface Step {
  name: string
  title: string
  lead?: string
  text: string
  tools?: string[]
}

export interface Solution {
  id: string
  title: string
  examples?: string
}

export interface ServicesData {
  headline: string
  subhead: string
  intro?: string
  hero?: string
  steps: Step[]
  method_note?: string
  organizations?: {
    eyebrow?: string
    title: string
    text?: string[]
    levels?: { name: string; items?: string }[]
  }
  wicked?: {
    title: string
    definition?: string
    statement?: string
    tame_title?: string
    tame_caption?: string
    tame_problem?: string
    tame_answer?: string
    wicked_title?: string
    wicked_caption?: string
    map_caption?: string
    quote?: string
  }
  solutions_title?: string
  solutions_lead?: string
  solutions: Solution[]
  talk_photo?: string
}

/** The Services page's front matter in the given language (English if there is no Spanish one). */
export function servicesData(
  allFiles: QuartzComponentProps["allFiles"],
  lang: Lang,
): ServicesData | undefined {
  const file =
    allFiles.find(
      (f) => f.slug === (lang === "es" ? "es/consulting/services" : "consulting/services"),
    ) ?? allFiles.find((f) => f.slug === "consulting/services")
  const fm = file?.frontmatter as unknown as ServicesData | undefined
  if (!fm || !Array.isArray(fm.steps)) return undefined
  return { ...fm, solutions: Array.isArray(fm.solutions) ? fm.solutions : [] }
}

/**
 * Marks the row a visitor arrives at (/consulting/services#brand) in lime. CSS :target does it on a
 * full load; this covers the site's own navigation, which changes pages without reloading.
 */
export const SVC_TARGET_JS = `if(!window.__svcTarget){window.__svcTarget=1;function m(){var h=decodeURIComponent(location.hash.slice(1));document.querySelectorAll(".svc-sol.is-target").forEach(function(e){e.classList.remove("is-target")});if(!h)return;var e=document.getElementById(h);if(e&&e.classList.contains("svc-sol"))e.classList.add("is-target")}
document.addEventListener("nav",m);window.addEventListener("hashchange",m);m()}`

/** Where a kind of solution sits on the Services page. */
export const solutionHref = (id: string, lang: Lang) =>
  `${urlFor("consulting/services", lang)}#${id}`

// The figure-eight the four steps travel along. Learn (top left) → Explore (bottom right) →
// Build (top right) → Measure (bottom left) → back to Learn.
const LOOP_PATH =
  "M230,150 C300,40 430,40 430,150 C430,260 300,260 230,150 C160,40 30,40 30,150 C30,260 160,260 230,150 Z"
// Dot positions in step order (Learn, Explore, Build, Measure).
const DOTS = [
  [110, 70],
  [350, 230],
  [350, 70],
  [110, 230],
]

/**
 * The loop. `interactive` puts the step names on it as labels for the radio buttons that drive the
 * How I work panels (Services page); otherwise it is a still drawing with the names (Profile).
 */
export function MethodLoop({ steps, interactive }: { steps: Step[]; interactive?: boolean }) {
  const names = steps.slice(0, 4).map((s) => s.name)
  return (
    <div class={`svc-loop${interactive ? " is-interactive" : ""}`}>
      <svg viewBox="0 0 460 300" aria-hidden="true" focusable="false">
        <path d={LOOP_PATH} fill="none" />
        {DOTS.map(([x, y], i) => (
          <>
            <circle class={`svc-dot d${i + 1}`} cx={x} cy={y} r="17" />
            <text class={`svc-dot-n n${i + 1}`} x={x} y={y + 5} text-anchor="middle">
              {i + 1}
            </text>
          </>
        ))}
      </svg>
      {names.map((n, i) =>
        interactive ? (
          <label for={`svc-st${i + 1}`} class={`svc-lb l${i + 1}`}>
            {n}
          </label>
        ) : (
          <span class={`svc-lb l${i + 1}`}>{n}</span>
        ),
      )}
    </div>
  )
}

/** The problem map from UAM Cuajimalpa, redrawn (the labels were in Spanish on the original). */
const MAP_LABELS = {
  en: {
    people: [
      "Siblings",
      "Classmates",
      "Support association",
      "Society",
      "Parents",
      "Beliefs, mental models",
      "Play spaces",
      "Friends",
    ],
    impairment: ["Visual", "impairment"],
    kinds: ["Origin", "Diagnosis", "Low vision", "Blind"],
    child: "Child",
    school: ["School", "space"],
    schoolItems: ["Teachers", "Materials", "Institutions", "Books"],
  },
  es: {
    people: [
      "Hermanos",
      "Compañeros de clase",
      "Asociación de apoyo",
      "Sociedad",
      "Padres",
      "Creencias, modelos mentales",
      "Espacios de juego",
      "Amigos",
    ],
    impairment: ["Discapacidad", "visual"],
    kinds: ["Origen", "Diagnóstico", "Baja visión", "Ceguera"],
    child: "Niño",
    school: ["Espacio", "escolar"],
    schoolItems: ["Maestros", "Materiales", "Instituciones", "Libros"],
  },
}

function WickedMap({ lang, label }: { lang: Lang; label: string }) {
  const L = MAP_LABELS[lang]
  const people: [number, number][] = [
    [120, 48],
    [92, 90],
    [70, 150],
    [62, 205],
    [62, 260],
    [70, 315],
    [92, 370],
    [120, 410],
  ]
  return (
    <svg class="svc-map" viewBox="0 0 520 430" role="img" aria-label={label}>
      <path
        d="M150,20 C40,120 40,310 150,410"
        fill="none"
        stroke="#e9e8f4"
        stroke-width="16"
        stroke-linecap="round"
      />
      <g fill="none" stroke="#a7aed9" stroke-width="1.2">
        <path d="M92,90 C200,120 260,170 318,210" />
        <path d="M70,150 C190,140 250,190 312,218" />
        <path d="M62,205 C180,190 250,215 306,226" />
        <path d="M62,260 C180,250 250,240 306,234" />
        <path d="M70,315 C180,300 250,260 312,242" />
        <path d="M92,370 C200,340 270,280 320,250" />
        <path d="M120,48 C250,40 320,80 360,118" />
        <path d="M62,205 C200,150 330,120 372,128" />
        <path d="M62,260 C220,330 330,350 382,338" />
        <path d="M70,315 C200,380 320,380 392,352" />
        <path d="M378,150 L360,196" />
        <path d="M370,312 L356,262" />
      </g>
      <g class="svc-map-n">
        {[
          [200, 128],
          [170, 160],
          [180, 196],
          [190, 248],
          [200, 292],
          [210, 330],
          [250, 60],
          [250, 150],
          [250, 330],
          [260, 372],
        ].map(([x, y], i) => (
          <text x={x} y={y}>
            {i + 1}
          </text>
        ))}
      </g>
      <g class="svc-map-t">
        {people.map(([x, y], i) => (
          <>
            <circle cx={x} cy={y} r="6" fill="#0a0773" />
            <text x={x + 12} y={y - 4}>
              {L.people[i]}
            </text>
          </>
        ))}
      </g>
      <circle cx="378" cy="118" r="44" fill="#c1e401" />
      <text class="svc-map-c" x="378" y="114" text-anchor="middle">
        {L.impairment[0]}
      </text>
      <text class="svc-map-c" x="378" y="129" text-anchor="middle">
        {L.impairment[1]}
      </text>
      <g class="svc-map-s">
        {(
          [
            [440, 80],
            [446, 120],
            [436, 160],
            [418, 190],
          ] as [number, number][]
        ).map(([x, y], i) => (
          <>
            <circle cx={x} cy={y} r="5" fill="#c1e401" />
            <text x={x + 10} y={y + 4}>
              {L.kinds[i]}
            </text>
          </>
        ))}
      </g>
      <circle cx="340" cy="228" r="40" fill="#0a0773" />
      <text class="svc-map-child" x="340" y="233" text-anchor="middle">
        {L.child}
      </text>
      <circle cx="384" cy="342" r="44" fill="#a7aed9" />
      <text class="svc-map-c" x="384" y="338" text-anchor="middle">
        {L.school[0]}
      </text>
      <text class="svc-map-c" x="384" y="353" text-anchor="middle">
        {L.school[1]}
      </text>
      <g class="svc-map-s">
        {(
          [
            [452, 300],
            [458, 340],
            [450, 380],
            [420, 410],
          ] as [number, number][]
        ).map(([x, y], i) => (
          <>
            <circle cx={x} cy={y} r="5" fill="#a7aed9" />
            <text x={x + 10} y={y + 4}>
              {L.schoolItems[i]}
            </text>
          </>
        ))}
      </g>
    </svg>
  )
}

/**
 * /consulting/services (S4 on the design canvas): an indigo band over René Rivas's crowd with the
 * loop; How I work, whose text follows the loop (it turns by itself every four seconds, stops while
 * the pointer is on it, and a click on a step or a tab stays on that step); behavior change in
 * organizations; wicked problems with the problem map; what the solution can be; Let's talk in ink.
 */
export function ConsultingServices({
  componentData,
  footer,
}: {
  componentData: QuartzComponentProps
  Content: QuartzComponent
  footer: QuartzComponent[]
}) {
  const lang = langOf(componentData.fileData.slug)
  const tt = t(lang)
  const d = servicesData(componentData.allFiles, lang)
  const fm = (componentData.fileData.frontmatter ?? {}) as Record<string, unknown>
  if (!d) return null
  const steps = d.steps.slice(0, 4)
  const org = d.organizations
  const w = d.wicked
  return (
    <div class="center cp cpk svc">
      <div class="svc-proc">
        {steps.map((_, i) => (
          <input
            type="radio"
            name="svc-step"
            id={`svc-st${i + 1}`}
            class="svc-st"
            aria-label={steps[i].name}
          />
        ))}

        <section class="svc-hero is-bleed">
          {d.hero && <img class="svc-hero-img" src={d.hero} alt="" />}
          <div class="svc-hero-inner">
            <div class="svc-hero-text">
              <p class="svc-eyebrow">{tt.services}</p>
              <h1 class="svc-title">{d.headline}</h1>
              <p class="svc-sub">{d.subhead}</p>
              {d.intro && <p class="svc-intro">{d.intro}</p>}
              <p class="svc-actions">
                <a class="cpk-btn is-lime" href="#talk" data-router-ignore>
                  {tt.letsTalk}
                </a>
                <a class="cpk-btn is-ghost" href="#how" data-router-ignore>
                  {tt.howIWork} ↓
                </a>
              </p>
            </div>
            <div class="svc-hero-loop">
              <MethodLoop steps={steps} interactive />
              <p class="svc-hint">{tt.pressAStep}</p>
            </div>
          </div>
          <PhotoCredit src={d.hero} lang={lang} class="svc-credit" />
        </section>

        <section class="svc-how" id="how">
          <div class="svc-how-head">
            <h2>{tt.howIWork}</h2>
            <div class="svc-tabs">
              {steps.map((s, i) => (
                <label for={`svc-st${i + 1}`} class={`svc-tab t${i + 1}`}>
                  {String(i + 1).padStart(2, "0")} {s.name}
                </label>
              ))}
            </div>
          </div>
          <div class="svc-panels">
            {steps.map((s, i) => (
              <div class={`svc-panel p${i + 1}`}>
                <div class="svc-panel-num">
                  <span class="svc-n">{i + 1}</span>
                  <span class="svc-panel-name">{s.name}</span>
                </div>
                <div class="svc-panel-body">
                  <p class="svc-panel-title">{s.title}</p>
                  <p class="svc-panel-text">
                    {s.lead && <strong>{s.lead}</strong>} {s.text}
                  </p>
                  {s.tools && s.tools.length > 0 && (
                    <p class="svc-panel-tools">{s.tools.join(" · ")}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          {d.method_note && <p class="svc-note">{d.method_note}</p>}
        </section>
      </div>

      {org && (
        <section class="svc-org" id="organizations-section">
          <div class="svc-org-text">
            {org.eyebrow && <p class="svc-kicker">{org.eyebrow}</p>}
            <h2>{org.title}</h2>
            {(org.text ?? []).map((p) => (
              <p>{p}</p>
            ))}
          </div>
          {org.levels && org.levels.length > 0 && <Levels levels={org.levels} />}
        </section>
      )}

      {w && (
        <section class="svc-wicked">
          <div class="svc-wicked-head">
            <div>
              <h2>{w.title}</h2>
              {w.definition && <p class="svc-def">{w.definition}</p>}
            </div>
            {w.statement && <p class="svc-statement">{w.statement}</p>}
          </div>
          <div class="svc-compare">
            <div class="svc-tame">
              <p class="svc-compare-title">{w.tame_title}</p>
              <svg viewBox="0 0 260 120" role="img" aria-label={w.tame_caption ?? ""}>
                <circle cx="50" cy="60" r="34" fill="#e9e8f4" stroke="#a7aed9" />
                <text class="svc-map-c" x="50" y="64" text-anchor="middle">
                  {w.tame_problem}
                </text>
                <path d="M88,60 L168,60" stroke="#17130f" stroke-width="1.5" />
                <path d="M162,54 L170,60 L162,66" fill="none" stroke="#17130f" stroke-width="1.5" />
                <circle cx="210" cy="60" r="34" fill="#c1e401" />
                <text class="svc-map-c" x="210" y="64" text-anchor="middle">
                  {w.tame_answer}
                </text>
              </svg>
              <p class="svc-compare-cap">{w.tame_caption}</p>
            </div>
            <div class="svc-rule" aria-hidden="true" />
            <div class="svc-wild">
              <p class="svc-compare-title">{w.wicked_title}</p>
              <p class="svc-compare-cap">{w.wicked_caption}</p>
              <WickedMap lang={lang} label={w.wicked_caption ?? ""} />
            </div>
          </div>
          <div class="svc-map-foot">
            {w.map_caption && <p class="svc-map-cap">{w.map_caption}</p>}
            {w.quote && (
              <blockquote class="svc-quote" lang="es">
                “{w.quote}”
              </blockquote>
            )}
          </div>
        </section>
      )}

      {d.solutions.length > 0 && (
        <section class="svc-sols">
          {d.solutions_title && <h2>{d.solutions_title}</h2>}
          <ul class="svc-sol-list">
            {d.solutions.map((s) => (
              <li class="svc-sol" id={s.id}>
                <span class="svc-sol-title">
                  {s.title}
                  <GoArrow />
                </span>
                {s.examples && <span class="svc-sol-ex">{s.examples}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      <LetsTalk lang={lang} tone="ink" photo={fm.talk_photo ? String(fm.talk_photo) : undefined} />
      {footer.map((F) => (
        <F {...componentData} />
      ))}
    </div>
  )
}

/** Behavior inside the person, the team and the organization: nested hairline brackets. */
function Levels({ levels }: { levels: { name: string; items?: string }[] }) {
  const [first, ...rest] = levels
  if (!first) return null
  const last = rest.length === 0
  return (
    <div class={`svc-level${last ? " is-core" : ""}`}>
      {last && <span class="svc-core-dot" aria-hidden="true" />}
      <span class="svc-level-name">{first.name}</span>
      {first.items && <span class="svc-level-items">{first.items}</span>}
      {!last && <Levels levels={rest} />}
    </div>
  )
}

/**
 * The Services band on the Profile (C1): full width over a photograph, the headline and the still
 * loop on the left, the kinds of solution on the right, each one a link to its place on Services.
 */
export function ServicesBand({
  data,
  lang,
  photo,
}: {
  data: ServicesData
  lang: Lang
  photo?: string
}) {
  const tt = t(lang)
  const page = urlFor("consulting/services", lang)
  return (
    <section class="cpk-svc is-bleed" id="services">
      {photo && <img class="cpk-svc-img" src={photo} alt="" loading="lazy" />}
      <div class="cpk-svc-inner">
        <div class="cpk-svc-left">
          <p class="cpk-svc-eyebrow">{tt.services}</p>
          <h2 class="cpk-svc-title">{data.headline}</h2>
          <p class="cpk-svc-sub">{data.subhead}</p>
          <MethodLoop steps={data.steps} />
          <a class="cpk-svc-more" href={`${page}#how`}>
            {tt.howIWork} →
          </a>
        </div>
        <div class="cpk-svc-right">
          {data.solutions_lead && <p class="cpk-svc-lead">{data.solutions_lead}</p>}
          <ul class="cpk-svc-list">
            {data.solutions.map((s) => (
              <li>
                <a class="cpk-svc-row" href={solutionHref(s.id, lang)}>
                  {s.title}
                  <GoArrow />
                </a>
              </li>
            ))}
          </ul>
          <a class="cpk-svc-more" href={page}>
            {tt.allServices} →
          </a>
        </div>
      </div>
      <PhotoCredit src={photo} lang={lang} class="cpk-svc-credit" />
    </section>
  )
}
