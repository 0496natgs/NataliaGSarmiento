import { QuartzComponentProps } from "../types"
import { galleryFiles } from "./gallery"
import { langOf } from "./i18n"

// One click handler for every slider on every page (the page changes without a reload).
const SLIDER_JS = `if(!window.__pgSlider){window.__pgSlider=1;document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest(".pg-btn");if(!b)return;var t=b.closest(".pg-slider").querySelector(".pg-track");t.scrollBy({left:b.getAttribute("data-dir")*t.clientWidth*0.8,behavior:"smooth"})})}`

/**
 * Everything in the page's gallery folder: the images in a swipeable slider, and the PDFs as download
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
        <div class="pg-slider">
          <script dangerouslySetInnerHTML={{ __html: SLIDER_JS }} />
          <div class="pg-track" tabindex={0}>
            {images.map((src, i) => (
              <figure class="s-frame pg-fig">
                <img src={src} alt="" loading="lazy" />
                <figcaption class="s-figcap">
                  {"Fig."} {String(i + 1).padStart(2, "0")} /{" "}
                  {String(images.length).padStart(2, "0")}
                </figcaption>
              </figure>
            ))}
          </div>
          {images.length > 1 && (
            <div class="pg-nav">
              <button
                type="button"
                class="pg-btn"
                data-dir="-1"
                aria-label={es ? "Anterior" : "Previous"}
              >
                ←
              </button>
              <button
                type="button"
                class="pg-btn"
                data-dir="1"
                aria-label={es ? "Siguiente" : "Next"}
              >
                →
              </button>
            </div>
          )}
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
