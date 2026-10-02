// Pulls your Substack posts into content/writing/substack-*.md so they appear in the Writing grid
// (as "Substack ↗" cards that open the post). Run it from a normal computer or network:
//
//   node scripts/sync-substack.mjs
//
// then commit the generated files. Substack answers GitHub's build servers with HTTP 403, so the
// deploy workflow also tries it but keeps whatever is already committed when that happens.
// It never fails the build, and it never deletes your committed posts unless a fetch succeeds.
//
//   - Your publication URL lives in substack.config.json ({ "url": "https://yourname.substack.com" }).
//   - Posts are read from Substack's archive API (title, subtitle, cover image, section), falling
//     back to the RSS feed. Override the URL with SUBSTACK_URL=... node scripts/sync-substack.mjs

import { readFile, writeFile, readdir, rm, mkdir } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..")
const outDir = path.join(root, "content", "writing")
const MAX_POSTS = 60

// Substack section slug -> label. The label is the post's category on the Writing page (one tab per
// Substack section) and the text of its badge. Posts outside any section are the main newsletter.
// Edit the labels to match your publications.
const SECTION_LABELS = {
  "the-other-tongue": "The Other Tongue",
  "cuartos-propios": "Cuartos Propios",
}
const MAIN_LABEL = "Materia prima"

const UAS = [
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
  "Mozilla/5.0 (quartz substack sync)",
]

async function get(url, accept) {
  let last
  for (const ua of UAS) {
    const res = await fetch(url, { headers: { "User-Agent": ua, Accept: accept } })
    if (res.ok) return res
    last = res.status
  }
  throw new Error(`${url} returned ${last}`)
}

const decode = (s) =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
const stripHtml = (s) =>
  decode(s.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim()

async function fromArchive(base) {
  const posts = []
  for (let offset = 0; offset < MAX_POSTS; offset += 12) {
    const res = await get(
      `${base}/api/v1/archive?sort=new&limit=12&offset=${offset}`,
      "application/json",
    )
    const page = await res.json()
    if (!Array.isArray(page) || page.length === 0) break
    for (const p of page) {
      posts.push({
        title: p.title,
        link: p.canonical_url,
        date: p.post_date,
        cover: p.cover_image,
        desc: p.subtitle || p.description || "",
        section: p.section_slug || "",
        audience: p.audience,
      })
    }
    if (page.length < 12) break
  }
  return posts
}

async function fromFeed(base) {
  const xml = await (await get(`${base}/feed`, "application/rss+xml")).text()
  const tag = (block, name) => {
    const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`))
    return m
      ? m[1]
          .replace(/^<!\[CDATA\[/, "")
          .replace(/\]\]>$/, "")
          .trim()
      : ""
  }
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, item]) => ({
    title: decode(tag(item, "title")),
    link: tag(item, "link"),
    date: tag(item, "pubDate"),
    cover: (item.match(/<enclosure[^>]*url="([^"]+)"/) ?? [])[1],
    desc: stripHtml(tag(item, "description")),
    section: "",
  }))
}

async function main() {
  let url = process.env.SUBSTACK_URL
  if (!url) {
    try {
      url = JSON.parse(await readFile(path.join(root, "substack.config.json"), "utf8")).url
    } catch {}
  }
  if (!url) {
    console.log("[substack] no URL configured (substack.config.json) — skipping")
    return
  }
  const base = url.replace(/\/+$/, "")

  let posts
  try {
    posts = await fromArchive(base)
  } catch (err) {
    console.log(`[substack] archive API failed (${err.message}), trying the RSS feed`)
    posts = await fromFeed(base)
  }
  posts = posts.filter((p) => p.title && p.link).slice(0, MAX_POSTS)
  if (posts.length === 0) throw new Error("no posts found")

  await mkdir(outDir, { recursive: true })
  for (const f of await readdir(outDir)) {
    if (f.startsWith("substack-") && f.endsWith(".md")) await rm(path.join(outDir, f))
  }

  let written = 0
  for (const p of posts) {
    const date = p.date ? new Date(p.date) : undefined
    const iso = date && !Number.isNaN(date.getTime()) ? date.toISOString().slice(0, 10) : undefined
    const slug = (
      p.link.split("/p/")[1] ??
      p.link.split("/").filter(Boolean).pop() ??
      `post-${written}`
    )
      .replace(/[^a-z0-9-]/gi, "-")
      .slice(0, 60)
    const label = SECTION_LABELS[p.section] ?? MAIN_LABEL
    // Paid posts stay on Substack; the card carries a "Paid" badge and links there.
    const paid = p.audience === "only_paid" || p.audience === "founding"
    const desc = stripHtml(p.desc).slice(0, 180)
    const lines = [
      "---",
      `title: ${JSON.stringify(decode(p.title))}`,
      iso ? `date: ${iso}` : null,
      `category: ${JSON.stringify(label)}`,
      `publication: ${JSON.stringify(label)}`,
      paid ? 'badge: "Paid"' : null,
      `external: ${JSON.stringify(p.link)}`,
      p.cover ? `cover: ${JSON.stringify(p.cover)}` : null,
      desc ? `description: ${JSON.stringify(desc)}` : null,
      "---",
      "",
      `[Read this on Substack ↗](${p.link})`,
      "",
    ].filter((l) => l !== null)
    await writeFile(path.join(outDir, `substack-${slug}.md`), lines.join("\n"))
    written++
  }
  console.log(`[substack] wrote ${written} posts from ${base}`)
}

main().catch((err) => {
  console.warn("[substack] sync failed, keeping the posts already in the repo:", err.message)
})
