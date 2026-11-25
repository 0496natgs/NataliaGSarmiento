import { photoCreditFor } from "./sectionsConfig"
import { Lang, t } from "./i18n"

/**
 * "Photograph: René Rivas", linked to the photographer's site, for any image that comes from one of
 * the photographers' folders in PHOTO_CREDITS (sectionsConfig.ts). Renders nothing for other images.
 */
export function PhotoCredit({
  src,
  lang,
  class: cls,
}: {
  src?: string
  lang: Lang
  class?: string
}) {
  const credit = photoCreditFor(src)
  if (!credit) return null
  return (
    <p class={`photo-credit${cls ? ` ${cls}` : ""}`}>
      {t(lang).photograph}:{" "}
      <a href={credit.url} target="_blank" rel="noopener noreferrer" data-router-ignore>
        {credit.name}
      </a>
    </p>
  )
}
