/**
 * The small lime circle with an arrow that appears beside a title when its row is hovered (the
 * contents-list animation, after southwestreview.com). A chevron for pages on this site, a
 * diagonal arrow for pieces that open elsewhere.
 */
export function GoArrow({ external = false }: { external?: boolean }) {
  return (
    <span class="s-go" aria-hidden="true">
      <svg width="10" height="10" viewBox="0 0 10 10">
        <path
          d={external ? "M2.5 7.5l5-5M3.5 2.5h4v4" : "M3.5 1.5l3.5 3.5-3.5 3.5"}
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        />
      </svg>
    </span>
  )
}
