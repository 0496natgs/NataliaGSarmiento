// Editable configuration for the site's divisions (Writing, Work, Poems, Visual Notes), the
// Substack link and the sketchbook strip. Change names, copy and colours here. Spanish
// versions of every label sit next to the English ones.

import { Lang, baseSlug } from "./i18n"

export const SITE = {
  name: "Natalia G. Sarmiento",
  initial: "N.",
}

import substackConfig from "../../../substack.config.json"

// Set your publication in substack.config.json (e.g. { "url": "https://yourname.substack.com" }).
// That one setting drives the Substack links here AND the build-time sync of your posts into the
// Writing grid (scripts/sync-substack.mjs). Until it is set, links point to substack.com.
export const SUBSTACK_URL: string = substackConfig.url || "https://substack.com"

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
 * Your own photos and illustrations. They drift past on the landing page ("Sketchbook"). Add files
 * to quartz/static/photos/ and list them here; nothing else needs to change.
 */
export const SKETCHBOOK: { src: string; alt: string; href?: string }[] = [
  {
    src: "/static/notes/gbas-1.jpg",
    alt: "Visual notes: Pure game",
    href: "/visual-notes/gbas-summit",
  },
  {
    src: "/static/notes/gbas-3.jpg",
    alt: "Visual notes: Lessons from the pandemic",
    href: "/visual-notes/gbas-summit",
  },
  {
    src: "/static/notes/gbas-5.jpg",
    alt: "Visual notes: Impro-narratives",
    href: "/visual-notes/gbas-summit",
  },
  {
    src: "/static/notes/gbas-7.jpg",
    alt: "Visual notes: The future is now",
    href: "/visual-notes/gbas-summit",
  },
  { src: "/static/notes/gbas-9.jpg", alt: "Visual notes", href: "/visual-notes/gbas-summit" },
]

// "tiles": square tiles; "photos": tight photo grid; "work": large image cards in two columns
// with category tabs, like a writer's portfolio (aektakhubchandani.com/work).
export type GridKind = "tiles" | "photos" | "work"

// "collection": an index page plus a folder of pieces (Writing, Work, Poems, Visual Notes).
// "page": a single page (CV, About).
export type SectionKind = "collection" | "page"

interface SectionText {
  title: string
  blurb: string
  /** Text for the scrolling marquee while inside this section. */
  marquee: string[]
}

export interface SectionDef extends SectionText {
  slug: string
  kind: SectionKind
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
  /** Photos that cross-fade inside this section's landing card (your own images). */
  images?: string[]
  es: SectionText
}

export const SECTIONS: SectionDef[] = [
  {
    slug: "writing",
    kind: "collection",
    numeral: "I",
    card: true,
    title: "Writing",
    blurb: "Essays, stories and my newsletters",
    art: 0,
    grid: "tiles",
    tabs: true,
    marquee: ["essays", "stories", "newsletters", "notes", "work in progress", "read slowly"],
    es: {
      title: "Escritura",
      blurb: "Ensayos, cuentos y mis boletines",
      marquee: ["ensayos", "cuentos", "boletines", "notas", "obra en proceso", "lee despacio"],
    },
  },
  {
    slug: "work",
    kind: "collection",
    numeral: "II",
    card: true,
    title: "Work",
    blurb: "Published writing",
    art: 1,
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
    slug: "poems",
    kind: "collection",
    numeral: "III",
    card: true,
    title: "Poems",
    blurb: "One poem, one page",
    art: 4,
    grid: "tiles",
    tabs: false,
    marquee: ["poems", "one page each", "read aloud", "slow down"],
    es: {
      title: "Poemas",
      blurb: "Un poema, una página",
      marquee: ["poemas", "una página cada uno", "lee en voz alta", "despacio"],
    },
  },
  {
    slug: "visual-notes",
    kind: "collection",
    numeral: "IV",
    card: true,
    title: "Visual Notes",
    blurb: "Live notes from conferences",
    art: 3,
    grid: "photos",
    tabs: false,
    images: ["/static/notes/gbas-1.jpg", "/static/notes/gbas-3.jpg", "/static/notes/gbas-5.jpg"],
    marquee: ["visual notes", "live drawing", "visual thinking", "conferences", "looking closely"],
    es: {
      title: "Notas visuales",
      blurb: "Notas en vivo de conferencias",
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
    slug: "cv",
    kind: "page",
    numeral: "",
    card: false,
    inNav: false,
    title: "CV",
    blurb: "Two one-page PDFs",
    art: 2,
    grid: "tiles",
    tabs: false,
    marquee: ["curriculum vitae", "transformation", "behavioral design", "writing"],
    es: {
      title: "CV",
      blurb: "Dos PDF de una página",
      marquee: ["currículum", "transformación", "diseño conductual", "escritura"],
    },
  },
  {
    slug: "about",
    kind: "page",
    numeral: "",
    card: false,
    title: "About",
    blurb: "Bio and timeline",
    art: 0,
    grid: "tiles",
    tabs: false,
    marquee: ["about", "learn from others", "learn from yourself", "share what you discover"],
    es: {
      title: "Sobre mí",
      blurb: "Bio y línea del tiempo",
      marquee: ["sobre mí", "aprende de otros", "aprende de ti", "comparte lo que descubras"],
    },
  },
]

export const SITE_MARQUEE: Record<Lang, string[]> = {
  en: ["writing", "work", "poems", "visual notes", "substack", "read slowly"],
  es: ["escritura", "trabajo", "poemas", "notas visuales", "substack", "lee despacio"],
}

/** A section's text in a language. */
export const textOf = (section: SectionDef, lang: Lang): SectionText =>
  lang === "es" ? section.es : section

// Tab / nav order for categories. Any other category is added after these, alphabetically.
export const CATEGORY_ORDER = ["Poems", "Fiction", "Nonfiction", "Substack"]

/** The section a page belongs to. Spanish pages (es/...) belong to the same section as English. */
export const sectionOfSlug = (slug?: string): SectionDef | undefined => {
  const s = baseSlug(slug)
  return SECTIONS.find((x) => s === x.slug || s.startsWith(`${x.slug}/`))
}

export const isSectionSlug = (slug?: string) => !!sectionOfSlug(slug)
