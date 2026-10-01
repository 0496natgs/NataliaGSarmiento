import { categoryId, getCategories, getPieces } from "./pieces"
import { QuartzComponentProps } from "../types"
import { WRITER } from "./writerContent"

/** Rattle-style floating pill nav, shown above every page in the Writing section. */
export function WritersNav({ allFiles, fileData }: QuartzComponentProps) {
  const categories = getCategories(getPieces(allFiles))
  const slug = fileData.slug ?? ""
  return (
    <nav class="w-nav" aria-label="Writing">
      <a class="w-logo" href="/writing" aria-label={WRITER.name}>
        {WRITER.initial}
      </a>
      <a class={slug.startsWith("writing") ? "active" : ""} href="/writing">
        Writing
      </a>
      {categories.map((c) => (
        <a href={`/writing#${categoryId(c)}`} data-router-ignore>
          {c}
        </a>
      ))}
      <span class="w-nav-spacer" />
      <a class="w-nav-button" href="/">
        Guide
      </a>
    </nav>
  )
}
