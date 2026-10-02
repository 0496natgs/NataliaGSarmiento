import { QuartzComponentProps } from "../types"
import { langOf, t } from "./i18n"

/**
 * "At a glance": two or three short facts in the About page's left column. They come from the page's
 * frontmatter (content/about.md):  facts: [{ text: "...", href: "https://..." }]
 */
export function AboutFacts({ fileData }: QuartzComponentProps) {
  const raw = fileData.frontmatter?.facts
  const facts: { text: string; href?: string }[] = Array.isArray(raw)
    ? raw.map((f: unknown) =>
        typeof f === "string"
          ? { text: f }
          : { text: String((f as any).text ?? ""), href: (f as any).href },
      )
    : []
  if (facts.length === 0) return null
  const tt = t(langOf(fileData.slug))
  return (
    <div class="about-facts">
      <h3>{tt.aboutFacts}</h3>
      <ul>
        {facts.map((f) => (
          <li>
            {f.href && String(f.href).startsWith("/") ? (
              <a href={String(f.href)}>{f.text}</a>
            ) : f.href ? (
              <a href={String(f.href)} target="_blank" rel="noopener noreferrer" data-router-ignore>
                {f.text}
                <span class="ext" aria-hidden="true" />
              </a>
            ) : (
              f.text
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
