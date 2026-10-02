import { QuartzComponentProps } from "../types"
import { galleryFiles } from "./gallery"
import { langOf } from "./i18n"

/**
 * Everything in the page's gallery folder: the images in a tight, centered gallery, and the PDFs as download
 * buttons. The folder is named in the page's front matter (gallery: consulting-design/covid-signage).
 */
export function ProjectGallery({ fileData }: QuartzComponentProps) {
  const folder = fileData.frontmatter?.gallery
  const { images, pdfs } = galleryFiles(folder ? String(folder) : undefined)
  if (images.length === 0 && pdfs.length === 0) return null
  const video = fileData.frontmatter?.video
  const es = langOf(fileData.slug) === "es"
  return (
    <div class="pg">
      {images.length > 0 && (
        <div class={`pg-masonry${images.length === 1 ? " is-single" : ""}`}>
          {images.map((src) => (
            <figure class="pg-fig">
              <img src={src} alt="" loading="lazy" />
            </figure>
          ))}
        </div>
      )}
      {video && (
        <div class="video-frame">
          <iframe
            src={`https://www-ccv.adobe.io/v1/player/ccv/${video}/embed?bgcolor=%23191919&lazyLoading=true&api_key=BehancePro2View`}
            title={String(fileData.frontmatter?.title ?? "")}
            allow="autoplay; fullscreen"
            allowfullscreen
            loading="lazy"
          ></iframe>
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
