import fs from "node:fs"
import path from "node:path"

// Image and PDF folders live under quartz/static/. A page lists a folder in its front matter
// (gallery: consulting-design/covid-signage) and every image and PDF in that folder appears on the
// page automatically, in file-name order. Add files to the folder and they show up on the next build.
const STATIC_ROOT = path.join(process.cwd(), "quartz", "static")
const IMAGE = /\.(png|jpe?g|webp|gif|avif)$/i
const PDF = /\.pdf$/i

export interface GalleryFiles {
  images: string[]
  pdfs: { url: string; label: string }[]
}

const natural = (a: string, b: string) => a.localeCompare(b, undefined, { numeric: true })

const labelOf = (file: string) =>
  file
    .replace(/\.[^.]+$/, "")
    .replace(/^\d+[-_ ]*/, "")
    .replace(/[-_]+/g, " ")
    .trim()

export function galleryFiles(folder?: string): GalleryFiles {
  if (!folder) return { images: [], pdfs: [] }
  const clean = folder.replace(/^\/+|\/+$/g, "").replace(/^static\//, "")
  let names: string[] = []
  try {
    names = fs.readdirSync(path.join(STATIC_ROOT, clean))
  } catch {
    return { images: [], pdfs: [] }
  }
  names.sort(natural)
  const url = (n: string) => encodeURI(`/static/${clean}/${n}`)
  return {
    images: names.filter((n) => IMAGE.test(n)).map(url),
    pdfs: names.filter((n) => PDF.test(n)).map((n) => ({ url: url(n), label: labelOf(n) || n })),
  }
}

/** The logo you drop in quartz/static/logo/ (logo.svg, logo.png or logo.webp), if there is one. */
export const LOGO: string | undefined = (() => {
  for (const ext of ["svg", "png", "webp"]) {
    if (fs.existsSync(path.join(STATIC_ROOT, "logo", `logo.${ext}`)))
      return `/static/logo/logo.${ext}`
  }
  return undefined
})()
