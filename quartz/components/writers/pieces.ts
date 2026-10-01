import { QuartzComponentProps } from "../types"
import { CATEGORY_ORDER } from "./writerContent"

type Files = QuartzComponentProps["allFiles"]
type FileData = Files[number]

export interface Piece {
  slug: string
  title: string
  date?: Date
  category: string
  form: "poem" | "prose"
  badge?: string
  cover?: string
  description?: string
  tags: string[]
}

export const isWritingSlug = (slug?: string) =>
  !!slug && (slug === "writing" || slug.startsWith("writing/"))

export const isWritingIndex = (slug?: string) => slug === "writing" || slug === "writing/index"

export const categoryId = (category: string) => category.toLowerCase().replace(/[^a-z0-9]+/g, "-")

export function formatPieceDate(date?: Date) {
  return date
    ? date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
    : ""
}

function toDate(file: FileData): Date | undefined {
  const raw = file.frontmatter?.date ?? file.dates?.created
  if (!raw) return undefined
  const date = new Date(String(raw))
  return Number.isNaN(date.getTime()) ? undefined : date
}

/** Every page under content/writing/ except the index, newest first. */
export function getPieces(allFiles: Files): Piece[] {
  return allFiles
    .filter((f) => f.slug && f.slug.startsWith("writing/") && !f.slug.endsWith("/index"))
    .map((f) => {
      const fm = f.frontmatter ?? ({} as NonNullable<FileData["frontmatter"]>)
      return {
        slug: f.slug as string,
        title: fm.title ?? f.slug!,
        date: toDate(f),
        category: String(fm.category ?? "Writing"),
        form: fm.form === "poem" ? ("poem" as const) : ("prose" as const),
        badge: fm.badge ? String(fm.badge) : undefined,
        cover: fm.cover ? String(fm.cover) : undefined,
        description: fm.description ? String(fm.description) : undefined,
        tags: Array.isArray(fm.tags) ? fm.tags.map(String) : [],
      }
    })
    .sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0))
}

export function getCategories(pieces: Piece[]): string[] {
  const present = [...new Set(pieces.map((p) => p.category))]
  const rank = (c: string) => {
    const i = CATEGORY_ORDER.indexOf(c)
    return i === -1 ? CATEGORY_ORDER.length : i
  }
  return present.sort((a, b) => rank(a) - rank(b) || a.localeCompare(b))
}
