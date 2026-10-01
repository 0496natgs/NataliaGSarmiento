import { MARQUEE_PHRASES } from "./siteContent"

// The text is repeated so the -25% translate in custom.scss loops seamlessly.
export function Marquee() {
  const text = MARQUEE_PHRASES.join(" • ") + " • "
  return (
    <div class="marquee">
      <p>{text.repeat(3).trim()}</p>
    </div>
  )
}
