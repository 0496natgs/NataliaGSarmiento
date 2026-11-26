import { LINKEDIN_URL, TALK_PHOTO } from "./sectionsConfig"
import { Lang, t, urlFor } from "./i18n"
import { PhotoCredit } from "./PhotoCredit"

/**
 * "Let's talk", the last band of the consulting pages: full width, a photograph by René Rivas in
 * black and white under a coloured wash, the title large on the left and the two buttons on the
 * right. `tone` picks the wash: lime (Profile, Experience) or ink (Services).
 */
export function LetsTalk({
  lang,
  tone,
  photo,
}: {
  lang: Lang
  tone: "lime" | "ink"
  photo?: string
}) {
  const tt = t(lang)
  const src = photo || TALK_PHOTO
  return (
    <section class={`talk is-${tone} is-bleed`} id="talk">
      <img class="talk-img" src={src} alt="" loading="lazy" />
      <div class="talk-inner">
        <h2 class="talk-title">{tt.letsTalk}</h2>
        <p class="talk-actions">
          <a class="talk-btn is-solid" href={urlFor("contact", lang)}>
            {tt.writeToMe}
          </a>
          <a
            class="talk-btn is-ghost"
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-router-ignore
          >
            {tt.linkedin}
            <span class="ext" aria-hidden="true" />
          </a>
        </p>
      </div>
      <PhotoCredit src={src} lang={lang} class="talk-credit" />
    </section>
  )
}
