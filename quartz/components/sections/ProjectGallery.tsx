import { QuartzComponentProps } from "../types"
import { galleryFiles } from "./gallery"
import { langOf } from "./i18n"

/**
 * Everything in the page's gallery folder: the images in a framed grid, and the PDFs as download
 * buttons. The folder is named in the page's front matter (gallery: consulting-design/covid-signage).
 */
export function ProjectGallery({ fileData }: QuartzComponentProps) {
  const folder = fileData.frontmatter?.gallery
  const { images, pdfs } = galleryFiles(folder ? String(folder) : undefined)
  if (images.length === 0 && pdfs.length === 0) return null
  const es = langOf(fileData.slug) === "es"
  return (
    <div class="pg">
      {images.length > 0 && (
        <div class="pg-grid">
          {images.map((src, i) => (
            <figure class="s-frame pg-fig">
              <img src={src} alt="" loading="lazy" />
              <figcaption class="s-figcap">
                {es ? "Fig." : "Fig."} {String(i + 1).padStart(2, "0")}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
      {pdfs.length > 0 && (
        <div class="pg-pdfs">
          {pdfs.map((p) => (
            <a
              class="cp-btn is-solid"
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              data-router-ignore
            >
              PDF · {p.label} ↗
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
