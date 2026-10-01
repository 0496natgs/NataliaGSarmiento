import { QuartzComponentProps } from "../types"
import { CATEGORY_ORDER, sectionOfSlug } from "./sectionsConfig"

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
}

export const isSectionIndex = (slug?: string) => {
  const section = sectionOfSlug(slug)
  return !!section && (slug === section.slug || slug === `${section.slug}/index`)
}

/** A single-page section such as Experience or About. */
export const isPageSection = (slug?: string) => {
  const section = sectionOfSlug(slug)
  return section?.kind === "page" && slug === section.slug
}

export const categoryId = (category: string) => category.toLowerCase().replace(/[^a-z0-9]+/g, "-")

export function formatPieceDate(date?: Date) {
  return date
    ? date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
    : ""
}

function toDate(file: FileData): Date | undefined {
  // Only an explicit frontmatter date counts; the file-creation fallback would invent dates.
  const raw = file.frontmatter?.date
  if (!raw) return undefined
  const date = new Date(String(raw))
  return Number.isNaN(date.getTime()) ? undefined : date
}

/** Every page under a section folder except its index, newest first. Pass a slug to limit to one section. */
export function getPieces(allFiles: Files, section?: string): Piece[] {
  return allFiles
    .filter((f) => {
      const def = sectionOfSlug(f.slug)
      return (
        !!f.slug &&
        !!def &&
        f.slug !== def.slug &&
        !f.slug.endsWith("/index") &&
        def.kind === "collection" &&
        (!section || def.slug === section)
      )
    })
    .map((f) => {
      const fm = f.frontmatter ?? ({} as NonNullable<FileData["frontmatter"]>)
      const def = sectionOfSlug(f.slug)!
      return {
        slug: f.slug as string,
        section: def.slug,
        title: fm.title ?? f.slug!,
        date: toDate(f),
        category: String(fm.category ?? def.title),
        form: fm.form === "poem" ? ("poem" as const) : ("prose" as const),
        badge: fm.badge ? String(fm.badge) : undefined,
        cover: fm.cover ? String(fm.cover) : undefined,
        description: fm.description ? String(fm.description) : undefined,
        tags: Array.isArray(fm.tags) ? fm.tags.map(String) : [],
        external: fm.external ? String(fm.external) : undefined,
        year: fm.year ? String(fm.year) : undefined,
        role: fm.role ? String(fm.role) : undefined,
        publication: fm.publication ? String(fm.publication) : undefined,
        issue: fm.issue ? String(fm.issue) : undefined,
        order: typeof fm.order === "number" ? fm.order : undefined,
        images: Array.isArray(fm.images) ? fm.images.map(String) : [],
      }
    })
    .sort((a, b) => {
      if (a.order !== undefined || b.order !== undefined) {
        return (a.order ?? Infinity) - (b.order ?? Infinity)
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
