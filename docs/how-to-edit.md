# How to edit the site

The site has two spaces on one domain:

- **Writer space** (home, `/`): Work, Writing, Photo & Video, Visual Notes, About. Menu ends with a Substack button.
- **Consulting space** (`/consulting`): Profile, Experience, Projects, Insights. Menu ends with a LinkedIn button. It is not in the writer menu; each space has a quiet link to the other at the foot of every page.

Every piece is a Markdown file in `content/`. English files live in `content/<section>/`, Spanish files in `content/es/<section>/` with the same file name.

## Add a piece

Copy an existing file in the same folder and change it. The front matter (between the `---` lines) sets the card:

```
title: Name of the piece
date: 2026-10-02          # optional
category: Photo           # becomes a tab on the section page
cover: /static/photos/x.jpg   # image on the card (upload to quartz/static/photos/)
description: One line under the title
```

- **Photo & Video:** add images with `![caption](/static/photos/x.jpg)`. For a video, put a YouTube or Vimeo link on its own line as `![](https://www.youtube.com/watch?v=...)`.
- **Visual Notes:** one file per event. List its images in `images:` and in the page body. The first image (or `cover:`) is the card.
- **Insights:** add files to `content/consulting/insights/`. The Insights menu item appears once there is one. Use `category:` for the topic.
- **Projects:** add files to `content/consulting/projects/`; `order: 1` sets the position.

## Spanish

Copy the English file to `content/es/...`, translate it, keep the same file name and add `unlisted: true` to the front matter. (`unlisted` keeps Spanish pages out of the graph, search and sitemap so each page shows once.) Pieces with no Spanish file show in the Spanish lists with an "EN" badge.

## Substack posts

Run `node scripts/sync-substack.mjs` on your computer (GitHub's servers are blocked by Substack), then commit the new `content/writing/substack-*.md` files. Each post gets the tab of its Substack section; paid posts get a "Paid" badge and open on Substack.

## Photos and illustrations on the home page

List them in `SKETCHBOOK` in `quartz/components/sections/sectionsConfig.ts`.

## CV PDFs

The two PDFs are in `cv/pdf/` (not published on the site, for uploading to LinkedIn). Rebuild them with `scripts/build-cv.mjs` after editing `cv/*.html`.
