import { PageFrame, PageFrameProps } from "./types"
import { DefaultFrame } from "./DefaultFrame"
import { Marquee } from "../socratica/Marquee"
import { Landing } from "../socratica/Landing"
import { cardForSlug } from "../socratica/Cards"
import landingStyle from "../styles/landing.scss"
import writersStyle from "../styles/writers.scss"
import { WritersNav } from "../writers/WritersNav"
import { renderWriting } from "../writers/WritersLayouts"
import { isWritingSlug } from "../writers/pieces"
import { WRITING_MARQUEE } from "../writers/writerContent"

// Fonts for the Writing section only (jzhao: DM Serif Display / Bricolage Grotesque / handwriting
// dates, aek: EB Garamond). IBM Plex Mono is already loaded site-wide.
const WRITING_FONTS =
  "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;700&family=Caveat:wght@500&family=DM+Serif+Display&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap"

/**
 * Socratica-style frame: a scrolling marquee above the page, a card-grid
 * landing page at `/`, and an issue "card" under the site title (desktop)
 * or above the article title (mobile). Everything else is the default layout.
 */
export const SocraticaFrame: PageFrame = {
  name: "socratica",
  css: landingStyle + writersStyle,
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
      {isWritingSlug(props.componentData.fileData.slug) && (
        <link rel="stylesheet" href={WRITING_FONTS} />
      )}
      <Marquee
        phrases={isWritingSlug(props.componentData.fileData.slug) ? WRITING_MARQUEE : undefined}
      />
      {isWritingSlug(props.componentData.fileData.slug) && <WritersNav {...props.componentData} />}
    </>
  ),
  render(props: PageFrameProps) {
    const { componentData, left } = props
    const slug = componentData.fileData.slug
    if (slug === "index") {
      return <Landing />
    }
    if (isWritingSlug(slug)) {
      return renderWriting(props)
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
