import { allCards } from "./Cards"
import { ISSUES, LANDING, TOTAL_CARDS } from "./siteContent"

export function Landing() {
  return (
    // .center keeps plugins that query ".center" (e.g. mermaid) working on this page.
    <div class="center content-container">
      <p class="landing-header">{LANDING.header}</p>
      <p class="page-subhead">
        {LANDING.subhead}
        {LANDING.links.map((link) => (
          <>
            {" "}
            •{" "}
            <a href={link.href} target={link.external ? "_blank" : "_self"}>
              {link.text}
            </a>
          </>
        ))}
      </p>
      <div class="issue-container">
        {allCards()}
        {Array(Math.max(TOTAL_CARDS - ISSUES.length, 0))
          .fill(0)
          .map(() => (
            <div class="card card-coming">
              <p class="card-title">Coming Soon</p>
              <p class="card-subhead">Issue XXX</p>
            </div>
          ))}
      </div>
    </div>
  )
}
