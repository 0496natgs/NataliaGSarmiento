import { MARQUEE_PHRASES } from "./siteContent"

// The text is repeated 4x so the -25% translate in custom.scss loops seamlessly.
export function Marquee({ phrases = MARQUEE_PHRASES }: { phrases?: string[] }) {
  const text = phrases.join(" • ") + " • "
  return (
    <div class="marquee">
      <p>{text.repeat(4).trim()}</p>
    </div>
  )
}
