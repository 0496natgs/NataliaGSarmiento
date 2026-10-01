// Pulls posts from your Substack RSS feed into content/writing/substack-*.md so they appear in the
// Writing grid (as "Substack ↗" cards linking to the post). Run by the deploy workflow before the
// build. It never fails the build: if there is no URL or the fetch fails, it just logs and exits.
//
//   1. Put your publication URL in substack.config.json, e.g. { "url": "https://yourname.substack.com" }
//   2. Set the same URL as SUBSTACK_URL in quartz/components/sections/sectionsConfig.ts
//      (it is read from substack.config.json automatically).
//
// Generated files are git-ignored. You can also override the URL: SUBSTACK_URL=... node scripts/sync-substack.mjs

import { readFile, writeFile, readdir, rm, mkdir } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..")
const outDir = path.join(root, "content", "writing")
const MAX_POSTS = 24

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

  const feedUrl = url.replace(/\/+$/, "") + "/feed"
  const res = await fetch(feedUrl, {
    headers: { "User-Agent": "Mozilla/5.0 (quartz substack sync)" },
  })
  if (!res.ok) throw new Error(`${feedUrl} returned ${res.status}`)
  const xml = await res.text()

  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => m[1]).slice(0, MAX_POSTS)
  const tag = (block, name) => {
    const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`))
    if (!m) return ""
    return m[1]
      .replace(/^<!\[CDATA\[/, "")
      .replace(/\]\]>$/, "")
      .trim()
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

  await mkdir(outDir, { recursive: true })
  for (const f of await readdir(outDir)) {
    if (f.startsWith("substack-") && f.endsWith(".md")) await rm(path.join(outDir, f))
  }

  let written = 0
  for (const item of items) {
    const title = decode(tag(item, "title"))
    const link = tag(item, "link")
    const pub = tag(item, "pubDate")
    if (!title || !link) continue
    const date = pub ? new Date(pub) : undefined
    const iso = date && !Number.isNaN(date.getTime()) ? date.toISOString().slice(0, 10) : undefined
    const cover = (item.match(/<enclosure[^>]*url="([^"]+)"/) ?? [])[1]
    const desc = stripHtml(tag(item, "description")).slice(0, 180)
    const slug = (
      link.split("/p/")[1] ??
      link.split("/").filter(Boolean).pop() ??
      `post-${written}`
    )
      .replace(/[^a-z0-9-]/gi, "-")
      .slice(0, 60)
    const lines = [
      "---",
      `title: ${JSON.stringify(title)}`,
      iso ? `date: ${iso}` : null,
      "category: Substack",
      `external: ${JSON.stringify(link)}`,
      cover ? `cover: ${JSON.stringify(cover)}` : null,
      desc ? `description: ${JSON.stringify(desc)}` : null,
      "---",
      "",
      `[Read this on Substack ↗](${link})`,
      "",
    ].filter((l) => l !== null)
    await writeFile(path.join(outDir, `substack-${slug}.md`), lines.join("\n"))
    written++
  }
  console.log(`[substack] wrote ${written} posts from ${feedUrl}`)
}

main().catch((err) => {
  console.warn("[substack] sync failed, continuing without Substack posts:", err.message)
})
