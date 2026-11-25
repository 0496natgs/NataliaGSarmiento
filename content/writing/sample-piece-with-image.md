---
title: Sample piece with a large image
date: 2026-11-24
category: Nonfiction
layout: hero
cover: /static/photos/rene-rivas/rene-rivas-dji-0063.jpg
badge: Sample
description: A template for a piece page with a large image across the top, after The Rumpus.
tags:
  - writing
sandbox: true
unlisted: true
---

This is a template. The image runs across the top of the page, then the section and category, a large title and a one-line byline, then the text in one column.

## Using it on a piece

Add these lines to the piece's front matter:

```yaml
layout: hero
cover: /static/your-image.jpg
```

The byline shows the date, and the publication and issue when the piece has them (`publication:` and `issue:`).

## Covers by René Rivas

René's photographs are kept in `quartz/static/photos/rene-rivas/`. Use any of them as a cover, for example:

```yaml
cover: /static/photos/rene-rivas/rene-rivas-dji-0063.jpg
```

The page then shows "Photograph: René Rivas" with a link to renerivas.xyz, under the image on a `layout: hero` piece and under the title on any other piece. Nothing to type: the credit comes from the folder (see `PHOTO_CREDITS` in `quartz/components/sections/sectionsConfig.ts`).

[[writing|← Writing]]
