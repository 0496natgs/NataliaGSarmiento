import { PageFrame, PageFrameProps } from "./types"
import { DefaultFrame } from "./DefaultFrame"
import { Marquee } from "../socratica/Marquee"
import { Landing } from "../socratica/Landing"
import { cardForSlug } from "../socratica/Cards"
import landingStyle from "../styles/landing.scss"

/**
 * Socratica-style frame: a scrolling marquee above the page, a card-grid
 * landing page at `/`, and an issue "card" under the site title (desktop)
 * or above the article title (mobile). Everything else is the default layout.
 */
export const SocraticaFrame: PageFrame = {
  name: "socratica",
  css: landingStyle,
  prelude: () => (
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
      <Marquee />
    </>
  ),
  render(props: PageFrameProps) {
    const { componentData, left } = props
    const slug = componentData.fileData.slug
    if (slug === "index") {
      return <Landing />
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
