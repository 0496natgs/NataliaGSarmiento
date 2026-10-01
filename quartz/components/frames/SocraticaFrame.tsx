import { PageFrame, PageFrameProps } from "./types"
import { DefaultFrame } from "./DefaultFrame"
import { Marquee } from "../socratica/Marquee"
import { Landing } from "../socratica/Landing"
import { cardForSlug } from "../socratica/Cards"
import landingStyle from "../styles/landing.scss"
import sectionsStyle from "../styles/sections.scss"
import siteStyle from "../styles/site.scss"
import { SectionNav } from "../sections/SectionNav"
import { renderSection } from "../sections/SectionLayouts"
import { SITE_MARQUEE, isSectionSlug, sectionOfSlug, textOf } from "../sections/sectionsConfig"
import { baseSlug, langOf } from "../sections/i18n"
import { MARQUEE_PHRASES } from "../socratica/siteContent"

// Fonts for the landing page and the sections: DM Serif Display for titles, EB Garamond and Caveat
// for the manuscript voice (body text, handwritten dates and logo), Spline Sans Mono for the menu,
// captions and small print (olhalazarieva.com, tour-kyrgyzstan.com), Bricolage Grotesque for UI text.
const SITE_FONTS =
  "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;700&family=Caveat:wght@500;600&family=DM+Serif+Display:ital@0;1&family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Instrument+Serif:ital@0;1&family=Spline+Sans+Mono:wght@400;500&display=swap"

const slug = (props: { componentData: { fileData: { slug?: string } } }) =>
  props.componentData.fileData.slug

const isLanding = (slugValue?: string) => baseSlug(slugValue) === "index"
/** Pages that belong to this site (landing, sections, their Spanish twins), as opposed to the Socratica guide. */
const isSitePage = (slugValue?: string) => isLanding(slugValue) || isSectionSlug(slugValue)

/** Marquee text: the site's own phrases on the landing page and sections, Socratica's on guide pages. */
function marqueeFor(slugValue?: string) {
  if (isLanding(slugValue)) return SITE_MARQUEE[langOf(slugValue)]
  const section = sectionOfSlug(slugValue)
  return section ? textOf(section, langOf(slugValue)).marquee : MARQUEE_PHRASES
}

/**
 * Socratica-style frame: a scrolling marquee above the page, a card-grid
 * landing page at `/`, and an issue "card" under the site title (desktop)
 * or above the article title (mobile). Everything else is the default layout.
 */
export const SocraticaFrame: PageFrame = {
  name: "socratica",
  css: landingStyle + sectionsStyle + siteStyle,
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
      {isSitePage(slug(props)) && <link rel="stylesheet" href={SITE_FONTS} />}
      <Marquee phrases={marqueeFor(slug(props))} />
      {isSitePage(slug(props)) && <SectionNav {...props.componentData} />}
    </>
  ),
  render(props: PageFrameProps) {
    const { componentData, left } = props
    const slug = componentData.fileData.slug
    if (isLanding(slug)) {
      return (
        <Landing
          componentData={componentData}
          graph={props.right.find((c) => c.name === "Graph")}
        />
      )
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
