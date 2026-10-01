// Editable site copy for the Socratica-style layout. Change the text here;
// the markup lives in the sibling components.

export const MARQUEE_PHRASES = [
  "the tactic toolbox",
  "the scheme suite",
  "the manuever manual",
  "the blueprint bundle",
  "the playbook pack",
  "the approach arsenal",
  "the strategy suitcase",
  "the resource repository",
]

export interface Issue {
  slug: string
  title: string
  issue: string
}

// One card per issue, in landing-page order. Card styling/illustrations are
// keyed by position (card-1 ... card-6) in landing.scss and quartz/static/N-illo.png.
export const ISSUES: Issue[] = [
  { slug: "basics", title: "The Basics", issue: "Issue 001" },
  { slug: "getting-started", title: "Getting Started", issue: "Issue 002" },
  { slug: "growing-people", title: "Growing People", issue: "Issue 003" },
  { slug: "superboosting-ideas", title: "Super- boosting Ideas", issue: "Issue 004" },
  { slug: "maintenance", title: "Maintenance", issue: "Issue 005" },
  { slug: "demo-days", title: "Demo Days", issue: "Issue 006" },
]
