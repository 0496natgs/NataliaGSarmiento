import { QuartzComponentProps } from "../types"
import { CATEGORY_ORDER, sectionOfSlug } from "./sectionsConfig"
import { Lang, baseSlug, intlLocale, langOf, urlFor } from "./i18n"
import { galleryFiles } from "./gallery"

type Files = QuartzComponentProps["allFiles"]
type FileData = Files[number]

export interface Piece {
  slug: string
  section: string
  title: string
  date?: Date
  category: string
  form: "poem" | "prose"
  badge?: string
  cover?: string
  description?: string
  tags: string[]
  /** Full URL when the piece lives elsewhere (e.g. a Substack post); the card links out. */
  external?: string
  year?: string
  role?: string
  /** For published work: the magazine or outlet, and the issue. */
  publication?: string
  issue?: string
  /** Manual position (1 = first). Pieces with an order come before those sorted by date. */
  order?: number
  /** Extra images (e.g. a gallery of visual notes); each becomes a tile in photo grids. */
  images: string[]
  /** Where the card links on this site (language-aware); `external` takes precedence. */
  href: string
  /** In a Spanish list: this piece has no Spanish version yet, so the English page is shown. */
  untranslated: boolean
}

export const isSectionIndex = (slug?: string) => {
  const section = sectionOfSlug(slug)
  const base = baseSlug(slug)
  return !!section && (base === section.slug || base === `${section.slug}/index`)
}

/** A single-page section such as CV or About. */
export const isPageSection = (slug?: string) => {
  const section = sectionOfSlug(slug)
  const base = baseSlug(slug)
  return section?.kind === "page" && (base === section.slug || base === `${section.slug}/index`)
}

export const categoryId = (category: string) => category.toLowerCase().replace(/[^a-z0-9]+/g, "-")

/** `photo: 2` (nth image) or `photo: Rome.JPG` (by file name) picks a cover from static/writing_photos. */
function photoCover(photo: unknown): string | undefined {
  const images = galleryFiles("writing_photos").images
  if (typeof photo === "number") return images[photo - 1]
  const name = encodeURI(String(photo)).toLowerCase()
  return images.find((src) => src.toLowerCase().endsWith(`/${name}`))
}

export function formatPieceDate(date?: Date, lang: Lang = "en") {
  return date
    ? date.toLocaleDateString(intlLocale(lang), { month: "short", day: "2-digit", year: "numeric" })
    : ""
}

function toDate(file: FileData): Date | undefined {
  // Only an explicit frontmatter date counts; the file-creation fallback would invent dates.
  const raw = file.frontmatter?.date
  if (!raw) return undefined
  const date = new Date(String(raw))
  return Number.isNaN(date.getTime()) ? undefined : date
}

const isPiece = (f: FileData) => {
  const def = sectionOfSlug(f.slug)
  const base = baseSlug(f.slug)
  return (
    !!f.slug && !!def && def.kind === "collection" && base !== def.slug && !base.endsWith("/index")
  )
}

/**
 * Every page under a section folder except its index, newest first. Pass a slug to limit to one
 * section. In Spanish, pieces without a Spanish page fall back to the English page.
 */
export function getPieces(allFiles: Files, section?: string, lang: Lang = "en"): Piece[] {
  const files = allFiles.filter(
    (f) => isPiece(f) && (!section || sectionOfSlug(f.slug)!.slug === section),
  )
  const translated = new Set(
    files.filter((f) => langOf(f.slug) === "es").map((f) => baseSlug(f.slug)),
  )
  const chosen = files.filter((f) =>
    lang === "es"
      ? langOf(f.slug) === "es" || !translated.has(baseSlug(f.slug))
      : langOf(f.slug) === "en",
  )
  return chosen
    .map((f) => {
      const fm = f.frontmatter ?? ({} as NonNullable<FileData["frontmatter"]>)
      const def = sectionOfSlug(f.slug)!
      const external = fm.external ? String(fm.external) : undefined
      const gallery = fm.gallery ? galleryFiles(String(fm.gallery)).images : []
      return {
        slug: f.slug as string,
        section: def.slug,
        title: fm.title ?? f.slug!,
        date: toDate(f),
        category: String(fm.category ?? def.title),
        form: fm.form === "poem" ? ("poem" as const) : ("prose" as const),
        badge: fm.badge ? String(fm.badge) : undefined,
        cover: fm.cover
          ? String(fm.cover)
          : fm.photo !== undefined
            ? photoCover(fm.photo)
            : gallery[0],
        description: fm.description ? String(fm.description) : undefined,
        tags: Array.isArray(fm.tags) ? fm.tags.map(String) : [],
        external,
        year: fm.year ? String(fm.year) : undefined,
        role: fm.role ? String(fm.role) : undefined,
        publication: fm.publication ? String(fm.publication) : undefined,
        issue: fm.issue ? String(fm.issue) : undefined,
        order: typeof fm.order === "number" ? fm.order : undefined,
        images: Array.isArray(fm.images) ? fm.images.map(String) : gallery,
        href: external ?? urlFor(baseSlug(f.slug), langOf(f.slug)),
        untranslated: lang === "es" && !external && langOf(f.slug) === "en",
      }
    })
    .sort((a, b) => {
      if (a.order !== undefined || b.order !== undefined) {
        const diff = (a.order ?? 1e9) - (b.order ?? 1e9)
        if (diff !== 0) return diff
      }
      return (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0)
    })
}

export function getCategories(pieces: Piece[]): string[] {
  const present = [...new Set(pieces.map((p) => p.category))]
  const rank = (c: string) => {
    const i = CATEGORY_ORDER.indexOf(c)
    return i === -1 ? CATEGORY_ORDER.length : i
  }
  return present.sort((a, b) => rank(a) - rank(b) || a.localeCompare(b))
}

// Tags that only say which part of the site a piece is on; they are not useful as filters.
const GENERIC_TAGS = new Set(["writing", "consulting", "visual-notes", "work", "photo-video"])

export const pieceTags = (piece: Piece): string[] =>
  piece.tags.filter((t) => !GENERIC_TAGS.has(t)).map(String)

export const pieceYear = (piece: Piece, lang: Lang = "en"): string =>
  piece.date
    ? String(piece.date.getFullYear())
    : (piece.year ?? (lang === "es" ? "Sin fecha" : "Undated"))

/** The data attributes that let the filter bar (Filters.tsx) show or hide a card, tile or row. */
export function filterAttrs(piece: Piece, lang: Lang = "en") {
  return {
    "data-piece": piece.slug,
    "data-category": categoryId(piece.category),
    "data-tags": pieceTags(piece).join("|"),
    "data-year": pieceYear(piece, lang),
    "data-text": `${piece.title} ${piece.description ?? ""} ${piece.category} ${pieceTags(piece).join(" ")}`.toLowerCase(),
  }
}
