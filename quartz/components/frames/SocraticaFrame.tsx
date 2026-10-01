import { PageFrame, PageFrameProps } from "./types"
import { DefaultFrame } from "./DefaultFrame"
import { Marquee } from "../socratica/Marquee"
import { Landing } from "../socratica/Landing"
import { cardForSlug } from "../socratica/Cards"
import landingStyle from "../styles/landing.scss"
import sectionsStyle from "../styles/sections.scss"
import { SectionNav } from "../sections/SectionNav"
import { renderSection } from "../sections/SectionLayouts"
import { SITE_MARQUEE, isSectionSlug, sectionOfSlug } from "../sections/sectionsConfig"
import { MARQUEE_PHRASES } from "../socratica/siteContent"

// Fonts for the landing page and the sections (jzhao: DM Serif Display / Bricolage Grotesque / handwriting
// dates, aek: EB Garamond). IBM Plex Mono is already loaded site-wide.
const SITE_FONTS =
  "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;700&family=Caveat:wght@500&family=DM+Serif+Display&family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Instrument+Serif:ital@0;1&display=swap"

const slug = (props: { componentData: { fileData: { slug?: string } } }) =>
  props.componentData.fileData.slug

/** Marquee text: the site's own phrases on the landing page and sections, Socratica's on guide pages. */
function marqueeFor(slugValue?: string) {
  if (slugValue === "index") return SITE_MARQUEE
  return sectionOfSlug(slugValue)?.marquee ?? MARQUEE_PHRASES
}

/**
 * Socratica-style frame: a scrolling marquee above the page, a card-grid
 * landing page at `/`, and an issue "card" under the site title (desktop)
 * or above the article title (mobile). Everything else is the default layout.
 */
export const SocraticaFrame: PageFrame = {
  name: "socratica",
  css: landingStyle + sectionsStyle,
  prelude: (props) => (
    <>
      {/*
        The explorer plugin calls scrollIntoView() on the active item at first load when it has no
        saved scroll position, which scrolls the whole page down. Seeding its key avoids that.
      */}
      <script
        dangerouslySetInnerHTML={{
          __html: `try{if(sessionStorage.getItem("explorerScrollTop")===null)sessionStorage.setItem("explorerScrollTop","0")}catch(e){}`,
        }}
      />
      {(slug(props) === "index" || isSectionSlug(slug(props))) && (
        <link rel="stylesheet" href={SITE_FONTS} />
      )}
      <Marquee phrases={marqueeFor(slug(props))} />
      {isSectionSlug(slug(props)) && <SectionNav {...props.componentData} />}
    </>
  ),
  render(props: PageFrameProps) {
    const { componentData, left } = props
    const slug = componentData.fileData.slug
    if (slug === "index") {
      return <Landing componentData={componentData} />
    }
    if (isSectionSlug(slug)) {
      return renderSection(props)
    }

    const card = cardForSlug(slug)
    // Put the card right after the page title (first left-sidebar component).
    const [pageTitle, ...restLeft] = left
    return DefaultFrame.render({
      ...props,
      left: [
        ...(pageTitle ? [pageTitle] : []),
        ...(card ? [() => <div class="header-card desktop-only">{card}</div>] : []),
        ...restLeft,
      ],
      beforeBody: [
        ...(card ? [() => <div class="header-card mobile-only">{card}</div>] : []),
        ...props.beforeBody,
      ],
    })
  },
}
