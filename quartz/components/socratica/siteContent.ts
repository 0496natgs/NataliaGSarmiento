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

export const LANDING = {
  header: "Welcome to Socratica",
  subhead: "This is a guide",
  links: [
    { text: "Back to main site", href: "https://www.socratica.info/", external: true },
    { text: "Writing", href: "/writing", external: false },
    { text: "Contribute", href: "https://github.com/Socratica-Org/toolbox", external: true },
    { text: "Credits", href: "/credits", external: false },
  ],
}

// Number of card slots on the landing page; unused slots render "Coming Soon".
export const TOTAL_CARDS = 8

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
