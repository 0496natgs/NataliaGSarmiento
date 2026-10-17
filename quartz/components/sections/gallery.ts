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

/**
 * Pixel size of a local image (PNG, JPEG or GIF), read from its header at build time. Written on
 * the <img> as width and height so the browser knows the aspect ratio before the file has loaded.
 */
export function imageSize(url: string): { width: number; height: number } | undefined {
  try {
    const file = path.join(STATIC_ROOT, decodeURI(url).replace(/^\/static\//, ""))
    const fd = fs.openSync(file, "r")
    const buf = Buffer.alloc(262144)
    const n = fs.readSync(fd, buf, 0, buf.length, 0)
    fs.closeSync(fd)
    if (n > 24 && buf.toString("ascii", 1, 4) === "PNG") {
      return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) }
    }
    if (n > 10 && buf.toString("ascii", 0, 3) === "GIF") {
      return { width: buf.readUInt16LE(6), height: buf.readUInt16LE(8) }
    }
    if (buf[0] === 0xff && buf[1] === 0xd8) {
      let i = 2
      while (i + 9 < n) {
        if (buf[i] !== 0xff) {
          i++
          continue
        }
        const marker = buf[i + 1]
        if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
          return { width: buf.readUInt16BE(i + 7), height: buf.readUInt16BE(i + 5) }
        }
        i += 2 + buf.readUInt16BE(i + 2)
      }
    }
  } catch {
    // an unreadable image simply gets no size
  }
  return undefined
}

/** The logo you drop in quartz/static/logo/ (logo.svg, logo.png or logo.webp), if there is one. */
export const LOGO: string | undefined = (() => {
  for (const ext of ["svg", "png", "webp"]) {
    if (fs.existsSync(path.join(STATIC_ROOT, "logo", `logo.${ext}`)))
      return `/static/logo/logo.${ext}`
  }
  return undefined
})()
