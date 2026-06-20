# Make it visible

**▶ Live demo — https://yiiyaaa.github.io/make-it-visible/**

A dreamy vision-board & wallpaper studio — collage your photos, lay down affirmations, and export a high-res image. Pure front-end, no build step.

愿景板工作室:拼贴照片、写下心愿文案、一键导出高清壁纸。纯前端,无需构建。

## Run locally

It's a static site. Either open `index.html` directly, or serve the folder:

```bash
python -m http.server 8000
# then open http://localhost:8000
```

## Features

- **Immersive landing** with an animated, hand-drawn "vision eye" mark
- **Auto-collage** with three edge styles — overlap / flush / gutter — plus a lock-layout mode
- **Text stickers** (50+ fonts, outline / shadow / glow / background) and image stickers
- **Decor** — thin lines & dots with adjustable weight
- **Glass color picker** — HEX / RGB / HSL, remembers your last mode
- **Drag-align guides** and overlap-aware layer ordering
- **Local autosave** (IndexedDB) — your board survives a refresh or reload
- **High-res PNG export** (auto 2× when safe)

## Tech

Single-page app built on [Fabric.js](http://fabricjs.com/). Three files do the work: `index.html`, `style.css`, `script.js`, with the landing-page eye in `vision-mark.js`.
