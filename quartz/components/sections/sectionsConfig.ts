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

export type GridKind = "tiles" | "photos"

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
    slug: "design",
    kind: "collection",
    card: true,
    title: "Design",
    blurb: "Branding, websites, systems",
    art: 2,
    grid: "tiles",
    tabs: true,
    marquee: ["design", "projects", "identity", "layout", "typography", "process"],
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
    slug: "experience",
    kind: "page",
    card: true,
    title: "Experience",
    blurb: "Work history and education",
    art: 3,
    grid: "tiles",
    tabs: false,
    marquee: ["experience", "education", "transformation", "behavioral design", "salesforce"],
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

// External links (portfolio, CV, contact form).
export const CV_URL =
  "https://www.dropbox.com/scl/fi/bao3h905bz2xe4ysf2jou/CV-Design-2026.pdf?rlkey=ymvnantxur0738dp2ixtjt9oz&st=yvgoegvn&dl=0"
export const PORTFOLIO_URL = "https://natgsarmiento.myportfolio.com/work"

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
