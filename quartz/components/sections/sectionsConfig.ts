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

export const LINKEDIN_URL = "https://www.linkedin.com/in/natalia-garcia-sarmiento/"
export const TLACUILOQUE_URL = "https://tlacuiloque.com/"

// Colours taken from your Substack publication icons. They tint the typographic tiles and the
// section frames; the icons' brush strokes are no longer used anywhere on the site.
export const PALETTE = [
  { name: "Materia prima", color: "#a13842" }, // burgundy
  { name: "Lectura Corporal", color: "#402320" }, // brown
  { name: "Cuartos Propios", color: "#c28c2e" }, // mustard
  { name: "Pliegues", color: "#90772f" }, // olive
  { name: "The Other Tongue", color: "#095d6a" }, // teal
]

/** Your Substack publications, shown on the landing page and linked to their own pages. */
export const SUBSTACK_PUBLICATIONS = [
  {
    name: "Materia prima",
    blurb: "Essays in Spanish: where the body is matter, of memory, of change, of writing.",
    blurb_es: "Ensayos: donde el cuerpo es materia, de memoria, de cambio, de escritura.",
    path: "",
    color: PALETTE[0].color,
  },
  {
    name: "The Other Tongue",
    blurb: "Poetry and essays in English, occasional and optional.",
    blurb_es: "Poesía y ensayos en inglés, ocasionales y opcionales.",
    path: "/s/the-other-tongue",
    color: PALETTE[4].color,
  },
  {
    name: "Cuartos Propios",
    blurb: "How the work gets made: drafts, process, notebook pages.",
    blurb_es: "Cómo se hace el trabajo: borradores, proceso, páginas de cuaderno.",
    path: "/s/cuartos-propios",
    color: PALETTE[2].color,
  },
]

/**
 * The strip of images that drifts past on the home page: a mix of your work, photographs and visual
 * notes. Photographs come from the folder quartz/static/writing_photos/ automatically (the first
 * six, in file-name order); the rest are listed here. Each item links to its page.
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
    src: "/static/work/khora-discovering-taste.jpg",
    alt: "Discovering Taste, KHÔRA",
    label: "Work",
    label_es: "Trabajo",
    href: "/work",
  },
]

const NOTE_ITEMS: Highlight[] = ["gbas-1", "gbas-3", "gbas-5", "gbas-7"].map((f) => ({
  src: `/static/notes/${f}.jpg`,
  alt: "Visual notes",
  label: "Visual notes",
  label_es: "Notas visuales",
  href: "/visual-notes/gbas-summit",
}))

const PHOTO_ITEMS: Highlight[] = galleryFiles("writing_photos")
  .images.slice(0, 6)
  .map((src) => ({
    src,
    alt: "Photograph",
    label: "Photo",
    label_es: "Foto",
    href: "/writing",
  }))

// Interleave so no two neighbours are the same kind: work, photo, note, photo, note, ...
export const SKETCHBOOK: Highlight[] = (() => {
  const out: Highlight[] = []
  const lists = [WORK_ITEMS, PHOTO_ITEMS, NOTE_ITEMS]
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
    images: ["/static/work/khora-discovering-taste.jpg"],
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
  {
    slug: "photo-video",
    kind: "collection",
    space: "writer",
    numeral: "III",
    card: true,
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
    numeral: "IV",
    card: true,
    title: "Visual Notes",
    blurb: "Live notes from conferences, one card per event",
    art: 3,
    grid: "tiles",
    tabs: false,
    images: ["/static/notes/gbas-1.jpg", "/static/notes/gbas-3.jpg", "/static/notes/gbas-5.jpg"],
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
