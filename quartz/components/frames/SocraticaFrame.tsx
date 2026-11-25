import { PageFrame, PageFrameProps } from "./types"
import { DefaultFrame } from "./DefaultFrame"
import { Landing } from "../socratica/Landing"
import { cardForSlug } from "../socratica/Cards"
import landingStyle from "../styles/landing.scss"
import sectionsStyle from "../styles/sections.scss"
import siteStyle from "../styles/site.scss"
import { SectionNav } from "../sections/SectionNav"
import { renderSection } from "../sections/SectionLayouts"
import { SITE_MARQUEE, isSectionSlug, sectionOfSlug, textOf } from "../sections/sectionsConfig"
import { baseSlug, langOf } from "../sections/i18n"
import { SpaceLink } from "../sections/SpaceLink"
import { MARQUEE_PHRASES } from "../socratica/siteContent"

// Fonts. Writing site (F2): Cormorant Garamond for titles and the logo, EB Garamond for reading and
// the menu, Jost for labels and dates (sentence case). Consulting site (F3): Spectral Light for titles,
// Hanken Grotesk for text and UI. Spectral is loaded at 300 only, so every title there is light.
const SITE_FONTS =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Hanken+Grotesk:wght@300;400;500;600&family=Jost:wght@400;500&family=Spectral:ital,wght@0,300;1,300&display=swap"

const slug = (props: { componentData: { fileData: { slug?: string } } }) =>
  props.componentData.fileData.slug

const isLanding = (slugValue?: string) => baseSlug(slugValue) === "index"
/** Pages that belong to this site (landing, sections, their Spanish twins), as opposed to the Socratica guide. */
const isTagPage = (slugValue?: string) => baseSlug(slugValue).startsWith("tags/")
const isSitePage = (slugValue?: string) =>
  isLanding(slugValue) || isSectionSlug(slugValue) || isTagPage(slugValue)

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
      {isSitePage(slug(props)) && <SectionNav {...props.componentData} />}
    </>
  ),
  render(props: PageFrameProps) {
    const { componentData, left } = props
    const slug = componentData.fileData.slug
    if (isLanding(slug)) {
      return (
        <>
          <Landing
            componentData={componentData}
            graph={props.right.find((c) => c.name === "Graph")}
          />
          <SpaceLink slug={slug} />
        </>
      )
    }
    if (isSectionSlug(slug)) {
      return (
        <>
          {renderSection(props)}
          <SpaceLink slug={slug} />
        </>
      )
    }

    // Tag pages (the chips on every project): the site menu, without the guide's sidebar.
    if (isTagPage(slug)) {
      return DefaultFrame.render({ ...props, left: [], right: [] })
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
