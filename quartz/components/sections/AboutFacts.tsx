import { QuartzComponentProps } from "../types"
import { langOf, t } from "./i18n"

interface Fact {
  year?: string
  text: string
  href?: string
}

/**
 * "At a glance": a few short facts in the About page's left column, set as a small timeline (the
 * years on the left, a dotted line, a dot per year). They come from the page's frontmatter
 * (content/about.md):  facts: [{ year: "2026", text: "...", href: "https://..." }]
 * Facts that follow each other with the same year share one dot.
 */
export function AboutFacts({ fileData }: QuartzComponentProps) {
  const raw = fileData.frontmatter?.facts
  const facts: Fact[] = Array.isArray(raw)
    ? raw.map((f: unknown) =>
        typeof f === "string"
          ? { text: f }
          : {
              year: (f as any).year ? String((f as any).year) : undefined,
              text: String((f as any).text ?? ""),
              href: (f as any).href,
            },
      )
    : []
  if (facts.length === 0) return null
  const tt = t(langOf(fileData.slug))

  const groups: { year?: string; items: Fact[] }[] = []
  for (const f of facts) {
    const last = groups[groups.length - 1]
    if (last && last.year === f.year) last.items.push(f)
    else groups.push({ year: f.year, items: [f] })
  }

  return (
    <div class="about-facts">
      <h3>{tt.aboutFacts}</h3>
      <ol class="at-list">
        {groups.map((g, i) => (
          <li class="at-item" style={`--i:${i}`}>
            {g.year && <span class="at-year">{g.year}</span>}
            <div class="at-body">
              {g.items.map((f) => (
                <p>
                  {f.href && String(f.href).startsWith("/") ? (
                    <a href={String(f.href)}>{f.text}</a>
                  ) : f.href ? (
                    <a
                      href={String(f.href)}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-router-ignore
                    >
                      {f.text}
                      <span class="ext" aria-hidden="true" />
                    </a>
                  ) : (
                    f.text
                  )}
                </p>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
