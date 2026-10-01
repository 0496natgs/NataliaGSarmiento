// English / Spanish (Mexico). Spanish pages live under content/es/ and mirror the English ones
// (content/es/work/..., content/es/about.md). Everything the site itself says (menu, labels,
// buttons) is listed here; edit the Spanish freely.

export type Lang = "en" | "es"

export const langOf = (slug?: string): Lang =>
  slug === "es" || slug?.startsWith("es/") ? "es" : "en"

/** "es/work/foo" -> "work/foo", "es/index" -> "index". English slugs are returned as they are. */
export const baseSlug = (slug?: string): string => (slug ?? "").replace(/^es(\/|$)/, "")

/** Site-relative URL for a base slug (no "es/" prefix) in a language. */
export const urlFor = (slug: string, lang: Lang): string => {
  const path = slug === "index" || slug === "" ? "" : slug.replace(/\/index$/, "")
  if (lang === "es") return path ? `/es/${path}` : "/es/"
  return path ? `/${path}` : "/"
}

export const intlLocale = (lang: Lang) => (lang === "es" ? "es-MX" : "en-US")

export const UI = {
  en: {
    menu: "Menu",
    close: "Close",
    home: "home",
    cv: "CV",
    substack: "Substack",
    guide: "Guide",
    otherLanguage: "ES",
    otherLanguageName: "Español",
    heroKicker: "Writer · behavioral change designer · visual notetaker",
    heroTitle: "Where the body is matter: of memory, of change, of writing.",
    index: "Index",
    sections: "Sections",
    newsletters: "Newsletters",
    newslettersNote: "Three places to read me on Substack.",
    readOnSubstack: "Read on Substack",
    sketchbook: "Sketchbook",
    sketchbookNote: "Visual notes and drawings. Hover to pause.",
    latest: "Latest",
    map: "Map",
    mapNote: "How everything on this site connects. Drag, zoom, or open the full graph.",
    all: "All",
    empty: "Nothing here yet.",
    selected: "Selected",
    seeMore: (n: number) => `See ${n} more →`,
    seeAll: "See all →",
    previous: "Previous",
    next: "Next",
    notTranslated: "EN",
    download: "Download",
    pdfPage: "PDF · 1 page",
    chapters: (n: number) => `${n} chapters`,
    figure: "Fig.",
    photoCredit: "Photo",
  },
  es: {
    menu: "Menú",
    close: "Cerrar",
    home: "inicio",
    cv: "CV",
    substack: "Substack",
    guide: "Guía",
    otherLanguage: "EN",
    otherLanguageName: "English",
    heroKicker: "Escritura · diseño de cambio conductual · notas visuales",
    heroTitle: "Donde el cuerpo es materia: de memoria, de cambio, de escritura.",
    index: "Índice",
    sections: "Secciones",
    newsletters: "Boletines",
    newslettersNote: "Tres lugares para leerme en Substack.",
    readOnSubstack: "Leer en Substack",
    sketchbook: "Cuaderno",
    sketchbookNote: "Notas visuales y dibujos. Pasa el cursor para pausar.",
    latest: "Reciente",
    map: "Mapa",
    mapNote: "Cómo se conecta todo en este sitio. Arrastra, haz zoom o abre el gráfico completo.",
    all: "Todo",
    empty: "Todavía no hay nada aquí.",
    selected: "Selección de",
    seeMore: (n: number) => `Ver ${n} más →`,
    seeAll: "Ver todo →",
    previous: "Anterior",
    next: "Siguiente",
    notTranslated: "EN",
    download: "Descargar",
    pdfPage: "PDF · 1 página",
    chapters: (n: number) => `${n} capítulos`,
    figure: "Fig.",
    photoCredit: "Foto",
  },
}

export const t = (lang: Lang) => UI[lang]

// Category labels. Pages keep the English category in their frontmatter; this only changes what is shown.
const CATEGORY_ES: Record<string, string> = {
  Poems: "Poemas",
  Fiction: "Ficción",
  Nonfiction: "No ficción",
  Flash: "Flash",
  Conference: "Conferencia",
  Substack: "Substack",
}
export const categoryLabel = (category: string, lang: Lang) =>
  lang === "es" ? (CATEGORY_ES[category] ?? category) : category
