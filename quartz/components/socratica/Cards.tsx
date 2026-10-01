import { ISSUES, Issue } from "./siteContent"

function Card({ issue, index }: { issue: Issue; index: number }) {
  const n = index + 1
  return (
    <a href={`/${issue.slug}`}>
      <div class={`card card-${n}`}>
        <p class="card-title">{issue.title}</p>
        <p class="card-subhead">{issue.issue}</p>
        <img src={`/static/${n}-illo.png`} class={`card-illustration-${n}`} alt="" />
      </div>
    </a>
  )
}

/** The card for a given page slug, or null when the page isn't an issue. */
export function cardForSlug(slug: string | undefined) {
  const index = ISSUES.findIndex((i) => i.slug === slug)
  return index === -1 ? null : <Card issue={ISSUES[index]} index={index} />
}
