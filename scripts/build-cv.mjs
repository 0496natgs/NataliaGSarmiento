// Renders cv/*.html to PDFs in cv/pdf/ using Chromium.
// File names are lowercase on purpose: Quartz lowercases link URLs, and GitHub Pages is case-sensitive.
// Needs playwright-core and a Chromium install (not part of the site build; the PDFs are committed):
//   npm i --no-save playwright-core && CHROMIUM=/path/to/chromium node scripts/build-cv.mjs
import path from "node:path"
import { fileURLToPath } from "node:url"
import { mkdir } from "node:fs/promises"

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..")
const outDir = path.join(root, "cv", "pdf")
const jobs = [
  ["transformation.html", "natalia-g-sarmiento-cv-transformation.pdf"],
  ["writing.html", "natalia-g-sarmiento-cv-writing.pdf"],
]

let chromium
try {
  ;({ chromium } = await import("playwright-core"))
} catch {
  console.error("playwright-core is not installed. Run: npm i --no-save playwright-core")
  process.exit(1)
}

await mkdir(outDir, { recursive: true })
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM || undefined,
  args: ["--no-sandbox"],
})
for (const [html, pdf] of jobs) {
  const page = await browser.newPage()
  await page.goto("file://" + path.join(root, "cv", html), { waitUntil: "networkidle" })
  await page.emulateMedia({ media: "print" })
  await page.pdf({
    path: path.join(outDir, pdf),
    width: "8.5in",
    height: "11in",
    printBackground: true,
    margin: { top: "0", right: "0", bottom: "0", left: "0" },
  })
  console.log("wrote", pdf)
  await page.close()
}
await browser.close()
