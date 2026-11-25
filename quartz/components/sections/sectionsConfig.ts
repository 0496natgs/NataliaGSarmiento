// Editable configuration for the site's two spaces and their sections:
//   writer space:     Work, Writing, Photo & Video, Visual Notes, About (home is "/")
//   consulting space: Profile, Experience, Projects, Insights (home is "/consulting")
// plus the Substack and LinkedIn links and the sketchbook strip. Change names, copy and colours
// here. Spanish versions of every label sit next to the English ones.

import { Lang, baseSlug } from "./i18n"
import { galleryFiles } from "./gallery"

export const SITE = {
  name: "Natalia G. Sarmiento",
  initial: "N.",
}

import substackConfig from "../../../substack.config.json"

// Set your publication in substack.config.json (e.g. { "url": "https://yourname.substack.com" }).
// That one setting drives the Substack links here AND the build-time sync of your posts into the
// Writing grid (scripts/sync-substack.mjs). Until it is set, links point to substack.com.
export const SUBSTACK_URL: string = substackConfig.url || "https://substack.com"

/** The address on the Contact page. It is encoded in the HTML so scrapers do not collect it. */
export const CONTACT_EMAIL = "sarmiento.natns@gmail.com"

export const LINKEDIN_URL = "https://www.linkedin.com/in/natalia-garcia-sarmiento/"
export const TLACUILOQUE_URL = "https://tlacuiloque.com/"

/**
 * Photographers whose pictures are kept on the site, one folder each under quartz/static/photos/.
 * Any cover or hero image taken from that folder shows "Photograph: <name>" with a link to their
 * site, on the page, without typing it. To add someone: a new folder and a new line here.
 */
export const PHOTO_CREDITS: { folder: string; name: string; url: string }[] = [
  { folder: "photos/rene-rivas/", name: "René Rivas", url: "https://renerivas.xyz/" },
]

/**
 * Genres, in the order the home page shows them. A piece's genre comes from `genre:` in its front
 * matter, or else from its category or form (Flash, poems, essays/nonfiction, fiction/stories);
 * everything in Visual Notes is "visual-notes". A genre with no pieces is left out.
 */
export const GENRES: { id: string; title: string; title_es: string }[] = [
  { id: "flash", title: "Flash", title_es: "Minificción" },
  { id: "poetry", title: "Poetry", title_es: "Poesía" },
  { id: "essays", title: "Essays", title_es: "Ensayos" },
  { id: "fiction", title: "Fiction", title_es: "Ficción" },
  { id: "visual-notes", title: "Visual notes", title_es: "Notas visuales" },
]

export const photoCreditFor = (src?: string) =>
  src ? PHOTO_CREDITS.find((c) => src.includes(c.folder)) : undefined

// Grounds for the typographic tiles, section frames and newsletter cards: ink, greys and the lime,
// so the writing site is black and white with lime as its only colour. Keep this order in step
// with --tile-1 … --tile-6 in sections.scss.
export const PALETTE = [
  { name: "Ink", color: "#17130f", light: false },
  { name: "Stone", color: "#d9d6cf", light: true },
  { name: "Warm grey", color: "#8a877f", light: true },
  { name: "Graphite", color: "#3a3631", light: false },
  { name: "Lime", color: "#c1e401", light: true },
  { name: "Charcoal", color: "#5f5a52", light: false },
]

/** Your Substack publications, shown on the landing page and linked to their own pages. */
export const SUBSTACK_PUBLICATIONS = [
  {
    name: "Materia prima",
    blurb: "Essays in Spanish: where the body is matter, of memory, of change, of writing.",
    blurb_es: "Ensayos: donde el cuerpo es materia, de memoria, de cambio, de escritura.",
    path: "",
    color: PALETTE[0].color,
    light: PALETTE[0].light,
  },
  {
    name: "The Other Tongue",
    blurb: "Poetry and essays in English, occasional and optional.",
    blurb_es: "Poesía y ensayos en inglés, ocasionales y opcionales.",
    path: "/s/the-other-tongue",
    color: PALETTE[4].color,
    light: PALETTE[4].light,
  },
  {
    name: "Cuartos Propios",
    blurb: "How the work gets made: drafts, process, notebook pages.",
    blurb_es: "Cómo se hace el trabajo: borradores, proceso, páginas de cuaderno.",
    path: "/s/cuartos-propios",
    color: PALETTE[2].color,
    light: PALETTE[2].light,
  },
]

/**
 * The strip of images that drifts past on the home page: a mix of your work, photographs and visual
 * notes. Photographs are picked by name from quartz/static/writing_photos/ (the list
 * is in PHOTO_ITEMS below); the rest are listed here. Each item links to its page.
 */
export interface Highlight {
  src: string
  alt: string
  label: string
  label_es: string
  href?: string
}

const WORK_ITEMS: Highlight[] = [
  {
    src: "/static/work/khora-discovering-taste-cover.jpg",
    alt: "Discovering Taste, KHÔRA",
    label: "Work",
    label_es: "Trabajo",
    href: "/work",
  },
]

const NOTE_ITEMS: Highlight[] = [
  { src: "/static/notes/uxdx/uxdx-1.jpg", href: "/visual-notes/uxdx" },
  { src: "/static/notes/gbas/gbas-1.jpg", href: "/visual-notes/gbas-summit" },
  {
    src: "/static/notes/meta-manuales/notes.jpg",
    href: "/visual-notes/meta-manuales",
  },
  { src: "/static/notes/gbas/gbas-5.jpg", href: "/visual-notes/gbas-summit" },
].map((n) => ({
  ...n,
  alt: "Visual notes",
  label: "Visual notes",
  label_es: "Notas visuales",
}))

// A hand-picked handful of the photographs in static/writing_photos.
export const PHOTO_ITEMS: Highlight[] = [
  "Prague.JPG",
  "Florencia.JPG",
  "Utah.jpg",
  "Switzerland.JPG",
].map((f) => ({
  src: `/static/writing_photos/${f}`,
  alt: "Photograph",
  label: "Photo",
  label_es: "Foto",
  href: "/photo-video",
}))

export const ILLUSTRATION_ITEMS: Highlight[] = [
  {
    src: "/static/Illustration-art/drawing.jpeg",
    alt: "Illustration",
    label: "Illustration",
    label_es: "Ilustración",
    href: "/photo-video",
  },
]

// Interleave so no two neighbours are the same kind: work, photo, note, photo, note, ...
export const SKETCHBOOK: Highlight[] = (() => {
  const out: Highlight[] = []
  // Photo & Video is in the sandbox, so its photographs and illustration are left out for now:
  // add PHOTO_ITEMS and ILLUSTRATION_ITEMS back to this list when the section returns.
  const lists = [WORK_ITEMS, NOTE_ITEMS]
  for (let i = 0; lists.some((l) => i < l.length); i++) {
    for (const l of lists) if (i < l.length) out.push(l[i])
  }
  return out
})()

// "tiles": square tiles; "photos": tight photo grid; "work": large image cards in two columns
// with category tabs, like a writer's portfolio (aektakhubchandani.com/work); "list": rows with a
// date, title and topic, like aimforbehavior.com/insights.
export type GridKind = "tiles" | "photos" | "work" | "list"

// "collection": an index page plus a folder of pieces (Work, Writing, Photo & Video, Visual Notes,
// Projects, Insights). "page": a single page (About, Profile, Experience).
export type SectionKind = "collection" | "page"

/** The two sites inside this one. Each has its own menu. */
export type Space = "writer" | "consulting"

interface SectionText {
  title: string
  blurb: string
  /** Text for the scrolling marquee while inside this section. */
  marquee: string[]
}

export interface SectionDef extends SectionText {
  slug: string
  kind: SectionKind
  space: Space
  /** Index into PALETTE used for this section's colour. */
  art: number
  grid: GridKind
  /** Show category tabs on the index page. */
  tabs: boolean
  /** Roman numeral shown in the landing index. */
  numeral: string
  /** Show a card for this section on the landing page. */
  card: boolean
  /** Show in the top menu (default true). */
  inNav?: boolean
  /** Leave the menu item out until the section has at least one piece. */
  hideWhenEmpty?: boolean
  /** Photos that cross-fade inside this section's landing card (your own images). */
  images?: string[]
  es: SectionText
}

export const SECTIONS: SectionDef[] = [
  // ---------- writer space ----------
  {
    slug: "work",
    kind: "collection",
    space: "writer",
    numeral: "I",
    card: true,
    title: "Work",
    blurb: "Published writing",
    art: 0,
    grid: "work",
    tabs: true,
    images: ["/static/work/khora-discovering-taste-cover.jpg"],
    marquee: ["published work", "essays", "flash", "in print", "read it there"],
    es: {
      title: "Trabajo",
      blurb: "Escritura publicada",
      marquee: ["obra publicada", "ensayos", "flash", "en revista", "léela allá"],
    },
  },
  {
    slug: "writing",
    kind: "collection",
    space: "writer",
    numeral: "II",
    card: true,
    title: "Writing",
    blurb: "Essays, stories, poems and my newsletters",
    art: 4,
    grid: "tiles",
    tabs: true,
    marquee: ["essays", "stories", "poems", "newsletters", "work in progress", "read slowly"],
    es: {
      title: "Escritura",
      blurb: "Ensayos, cuentos, poemas y mis boletines",
      marquee: ["ensayos", "cuentos", "poemas", "boletines", "obra en proceso", "lee despacio"],
    },
  },
  // In the sandbox for now: out of the menu and the home page, reachable from /sandbox. To bring it
  // back: card: true, delete the inNav line, put it back in SKETCHBOOK below, and remove
  // `sandbox: true` and `unlisted: true` from content/photo-video/index.md.
  {
    slug: "photo-video",
    kind: "collection",
    space: "writer",
    numeral: "",
    card: false,
    inNav: false,
    title: "Photo & Video",
    blurb: "Photography, film and moving image",
    art: 2,
    grid: "work",
    tabs: true,
    marquee: ["photography", "video", "film", "moving image", "looking closely"],
    es: {
      title: "Foto y video",
      blurb: "Fotografía, cine e imagen en movimiento",
      marquee: ["fotografía", "video", "cine", "imagen en movimiento", "mirar de cerca"],
    },
  },
  {
    slug: "visual-notes",
    kind: "collection",
    space: "writer",
    numeral: "III",
    card: true,
    title: "Visual Notes",
    blurb: "Live notes from conferences, one card per event",
    art: 3,
    grid: "tiles",
    tabs: false,
    images: [
      "/static/notes/gbas/gbas-1.jpg",
      "/static/notes/gbas/gbas-3.jpg",
      "/static/notes/gbas/gbas-5.jpg",
    ],
    marquee: ["visual notes", "live drawing", "visual thinking", "conferences", "looking closely"],
    es: {
      title: "Notas visuales",
      blurb: "Notas en vivo de conferencias, una tarjeta por evento",
      marquee: [
        "notas visuales",
        "dibujo en vivo",
        "pensamiento visual",
        "conferencias",
        "mirar de cerca",
      ],
    },
  },
  {
    slug: "about",
    kind: "page",
    space: "writer",
    numeral: "",
    card: false,
    title: "About",
    blurb: "Bio",
    art: 0,
    grid: "tiles",
    tabs: false,
    marquee: ["about", "learn from others", "learn from yourself", "share what you discover"],
    es: {
      title: "Sobre mí",
      blurb: "Bio",
      marquee: ["sobre mí", "aprende de otros", "aprende de ti", "comparte lo que descubras"],
    },
  },

  {
    slug: "contact",
    kind: "page",
    space: "writer",
    numeral: "",
    card: false,
    inNav: false,
    title: "Contact",
    blurb: "Get in touch",
    art: 0,
    grid: "tiles",
    tabs: false,
    marquee: ["contact", "say hello"],
    es: {
      title: "Contacto",
      blurb: "Escríbeme",
      marquee: ["contacto", "di hola"],
    },
  },
  {
    slug: "ai",
    kind: "page",
    space: "writer",
    numeral: "",
    card: false,
    inNav: false,
    title: "AI usage",
    blurb: "How AI is, and is not, used here",
    art: 0,
    grid: "tiles",
    tabs: false,
    marquee: ["written by a person", "no AI writing"],
    es: {
      title: "Uso de IA",
      blurb: "Cómo se usa, y cómo no, la IA aquí",
      marquee: ["escrito por una persona", "sin IA para escribir"],
    },
  },
  // Templates and placeholders, hidden from the live site (pages with `sandbox: true`). Not in the
  // menu; open it at /sandbox.
  {
    slug: "sandbox",
    kind: "page",
    space: "writer",
    numeral: "",
    card: false,
    inNav: false,
    title: "Sandbox",
    blurb: "Templates and placeholders, hidden from the site",
    art: 0,
    grid: "tiles",
    tabs: false,
    marquee: ["sandbox"],
    es: {
      title: "Sandbox",
      blurb: "Plantillas y borradores, ocultos del sitio",
      marquee: ["sandbox"],
    },
  },

  // ---------- consulting space: digital transformation, behavioral science, service design ----------
  {
    slug: "consulting",
    kind: "page",
    space: "consulting",
    numeral: "",
    card: false,
    title: "Profile",
    blurb: "Digital transformation, behavioral science and service design",
    art: 4,
    grid: "tiles",
    tabs: false,
    marquee: [
      "digital transformation",
      "behavioral science",
      "service design",
      "adoption",
      "readiness",
    ],
    es: {
      title: "Perfil",
      blurb: "Transformación digital, ciencia conductual y diseño de servicios",
      marquee: [
        "transformación digital",
        "ciencia conductual",
        "diseño de servicios",
        "adopción",
        "preparación",
      ],
    },
  },
  {
    slug: "consulting/experience",
    kind: "page",
    space: "consulting",
    numeral: "",
    card: false,
    title: "Experience",
    blurb: "Roles and education",
    art: 4,
    grid: "tiles",
    tabs: false,
    marquee: ["experience", "salesforce", "change management", "ux research", "service design"],
    es: {
      title: "Experiencia",
      blurb: "Roles y formación",
      marquee: [
        "experiencia",
        "salesforce",
        "gestión del cambio",
        "investigación ux",
        "diseño de servicios",
      ],
    },
  },
  {
    slug: "consulting/projects",
    kind: "collection",
    space: "consulting",
    numeral: "",
    card: false,
    title: "Projects",
    blurb: "Service design, branding and editorial work",
    art: 4,
    grid: "work",
    tabs: true,
    marquee: ["projects", "service design", "branding", "editorial", "signage"],
    es: {
      title: "Proyectos",
      blurb: "Diseño de servicios, identidad y trabajo editorial",
      marquee: ["proyectos", "diseño de servicios", "identidad", "editorial", "señalética"],
    },
  },
  {
    slug: "consulting/insights",
    kind: "collection",
    space: "consulting",
    numeral: "",
    card: false,
    hideWhenEmpty: true,
    title: "Insights",
    blurb: "Notes on behavior change in practice",
    art: 4,
    grid: "list",
    tabs: true,
    marquee: ["insights", "behavior change", "adoption", "in practice"],
    es: {
      title: "Ideas",
      blurb: "Notas sobre el cambio conductual en la práctica",
      marquee: ["ideas", "cambio conductual", "adopción", "en la práctica"],
    },
  },
]

export const SITE_MARQUEE: Record<Lang, string[]> = {
  en: ["work", "writing", "photo & video", "visual notes", "substack", "read slowly"],
  es: ["trabajo", "escritura", "foto y video", "notas visuales", "substack", "lee despacio"],
}

/** A section's text in a language. */
export const textOf = (section: SectionDef, lang: Lang): SectionText =>
  lang === "es" ? section.es : section

// Tab order for categories (writing: your own pieces first, then one tab per Substack section).
// Any other category is added after these, alphabetically.
export const CATEGORY_ORDER = [
  "Nonfiction",
  "Fiction",
  "Poems",
  "Materia prima",
  "The Other Tongue",
  "Cuartos Propios",
]

/** The section a page belongs to (the most specific match). Spanish pages (es/...) belong to the same section as English. */
export const sectionOfSlug = (slug?: string): SectionDef | undefined => {
  const s = baseSlug(slug)
  let best: SectionDef | undefined
  for (const x of SECTIONS) {
    if (
      (s === x.slug || s.startsWith(`${x.slug}/`)) &&
      (!best || x.slug.length > best.slug.length)
    ) {
      best = x
    }
  }
  return best
}

export const isSectionSlug = (slug?: string) => !!sectionOfSlug(slug)

/** Which of the two sites a page belongs to. The landing page and anything unknown is the writer space. */
export const spaceOfSlug = (slug?: string): Space => sectionOfSlug(slug)?.space ?? "writer"
