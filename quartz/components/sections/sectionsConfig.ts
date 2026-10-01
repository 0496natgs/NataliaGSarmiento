// Editable configuration for the site's divisions (Writing, Design, Visual Notes) and the
// Substack link. Change names, copy, artwork and colours here.

export const SITE = {
  name: "Natalia G. Sarmiento",
  initial: "N.",
  tagline: "Writer, behavioral change designer, visual notetaker",
}

import substackConfig from "../../../substack.config.json"

// Set your publication in substack.config.json (e.g. { "url": "https://yourname.substack.com" }).
// That one setting drives the Substack links here AND the build-time sync of your posts into the
// Writing grid (scripts/sync-substack.mjs). Until it is set, links point to substack.com.
export const SUBSTACK_URL: string = substackConfig.url || "https://substack.com"

// Artwork (your Substack images). `color` is the image's flat background so a tile or card can
// share it seamlessly. Replace the files in quartz/static/art/ with high-resolution versions.
export interface Art {
  file: string
  color: string
  name: string
}

export const ART: Art[] = [
  { file: "cuartos-propios.png", color: "#c28c2e", name: "Cuartos Propios" },
  { file: "lectura-corporal.png", color: "#402320", name: "Lectura Corporal" },
  { file: "pliegues.png", color: "#90772f", name: "Pliegues" },
  { file: "trazos.png", color: "#a13842", name: "Trazos" },
  { file: "the-other-tongue.png", color: "#095d6a", name: "The Other Tongue" },
]

// "tiles": square tiles; "photos": tight photo grid; "work": large image cards in two columns
// with category tabs, like a writer's portfolio (aektakhubchandani.com/work).
export type GridKind = "tiles" | "photos" | "work"

// "collection": an index page plus a folder of pieces (Writing, Design, Visual Notes).
// "page": a single page (Experience, About).
export type SectionKind = "collection" | "page"

export interface SectionDef {
  slug: string
  kind: SectionKind
  title: string
  blurb: string
  /** Index into ART used for this section's landing card. */
  art: number
  grid: GridKind
  /** Show category tabs on the index page. */
  tabs: boolean
  /** Landing card spans a larger area. */
  featured?: boolean
  /** Show a card for this section on the landing page. */
  card: boolean
  /** Show in the top navigation (default true). */
  inNav?: boolean
  /** Text for the scrolling marquee while inside this section. */
  marquee: string[]
}

export const SECTIONS: SectionDef[] = [
  {
    slug: "writing",
    kind: "collection",
    card: true,
    title: "Writing",
    blurb: "Poems, stories and essays",
    art: 0,
    grid: "tiles",
    tabs: true,
    featured: true,
    marquee: ["poems", "essays", "stories", "notes", "work in progress", "read slowly"],
  },
  {
    slug: "work",
    kind: "collection",
    card: true,
    title: "Work",
    blurb: "Published writing",
    art: 3,
    grid: "work",
    tabs: true,
    marquee: ["published work", "essays", "flash", "in print", "read it there"],
  },
  {
    slug: "design",
    kind: "collection",
    card: true,
    title: "Design",
    blurb: "Identity and systems",
    art: 2,
    grid: "tiles",
    tabs: false,
    marquee: ["design", "identity", "systems", "signage", "logos"],
  },
  {
    slug: "visual-notes",
    kind: "collection",
    card: true,
    title: "Visual Notes",
    blurb: "Live notes from conferences",
    art: 1,
    grid: "photos",
    tabs: false,
    marquee: ["visual notes", "live drawing", "visual thinking", "conferences", "looking closely"],
  },
  {
    slug: "cv",
    kind: "page",
    card: true,
    inNav: false,
    title: "CV",
    blurb: "Download: transformation & behavioral change design · writing",
    art: 0,
    grid: "tiles",
    tabs: false,
    marquee: ["curriculum vitae", "transformation", "behavioral design", "writing"],
  },
  {
    slug: "about",
    kind: "page",
    card: false,
    title: "About",
    blurb: "Bio",
    art: 3,
    grid: "tiles",
    tabs: false,
    marquee: ["about", "learn from others", "learn from yourself", "share what you discover"],
  },
]

export const SITE_MARQUEE = [
  "writing",
  "design",
  "visual notes",
  "experience",
  "substack",
  "read slowly",
]

// Tab / nav order for categories. Any other category is added after these, alphabetically.
export const CATEGORY_ORDER = ["Poetry", "Fiction", "Nonfiction", "Substack"]

export const sectionOfSlug = (slug?: string): SectionDef | undefined =>
  SECTIONS.find((s) => slug === s.slug || slug?.startsWith(`${s.slug}/`))

export const isSectionSlug = (slug?: string) => !!sectionOfSlug(slug)
