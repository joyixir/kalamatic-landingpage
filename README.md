# Kalamatic Landing Page

This repository contains one active product surface: the Kalamatic landing page.

The site is built from EJS templates, SCSS, plain JavaScript, and copied static assets, then compiled into `dist/`.

## Active Structure

- `pages/`
  - page templates and shared partials
- `pages/landing-data.ejs`
  - main editable content and links
- `pages/parts/support.ejs`
  - support section inside the landing page
- `src/scss/style.scss`
  - all active landing styles
- `src/js/chat-widget.js`
  - optional RayChat behavior
- `src/js/screenshot-gallery.js`
  - screenshot lightbox behavior
- `src/img/`
  - landing artwork, screenshots, header icons, and store badges
- `src/fonts/`
  - embedded Vazirmatn webfonts
- `src/statics/`
  - active root files such as favicons, manifest, `CNAME`, `chat-config.js`, `robots.txt`, `sitemap.xml`, `llms.txt`, and `ads-and-verification-config.js`
- `src/statics/ads-and-verification/`
  - source-only optional ad and verification root files, copied to the build only when enabled
- `dist/`
  - generated output for preview and the GitHub Pages build artifact

## Optional Features

- RayChat:
  - config: `src/statics/chat-config.js`
  - set `chat.enabled` to `true` or `false`

- Ads and verification root files:
  - config: `src/statics/ads-and-verification-config.js`
  - set `adsAndVerification.enabled` to `true` only when you intentionally want to publish those files

## Local Development

Install dependencies once:

```bash
npm install
```

Start the dev server with live reload:

```bash
npm start
```

Then open [http://127.0.0.1:12345](http://127.0.0.1:12345).

## Common Tasks

- `npm start`: build, watch, and run the local dev server
- `npm run build`: create a fresh production build in `dist/`
- `npm run clean`: remove the generated `dist/` folder
- `npm run verify:dist`: confirm the build still contains the files production depends on
- `npm run pages:build`: rebuild and verify the exact output GitHub Pages will publish
- `npm run deploy`: compatibility alias for `npm run pages:build`

## Deployment

GitHub Pages now deploys automatically through GitHub Actions.

- Commit day-to-day work on `develop`
- Merge `develop` into `master` when the landing is ready for production
- GitHub Actions runs `npm ci`, `npm run build`, and `npm run verify:dist`
- Every push to `master` triggers the production deploy workflow
- If the workflow passes, GitHub publishes the `dist/` artifact to GitHub Pages

There is no need to run a local publish command anymore.

## Editing Guide

- Update page metadata in `pages/landing-data.ejs`
- Update crawl/discovery files in `src/statics/robots.txt`, `src/statics/sitemap.xml`, and `src/statics/llms.txt`
- Edit landing sections in `pages/landing-data.ejs` by section object:
  - `HEADER_SECTION`
  - `HERO_SECTION`
  - `DESCRIPTION_SECTION`
  - `DOWNLOAD_SECTION`
  - `SCREENSHOTS_SECTION`
  - `FAQ_SECTION`
  - `SUPPORT_SECTION`
  - `LANDING_FOOTER`
- Update layout partials in `pages/parts/`
- Update all active styling in `src/scss/style.scss`
- Update RayChat behavior in `src/js/chat-widget.js`
- Update screenshot lightbox behavior in `src/js/screenshot-gallery.js`
- Replace artwork and icons in `src/img/`

## Notes

- `develop` is the working branch for ongoing landing changes.
- `master` is the production branch.
- GitHub Actions is now the deployment path for GitHub Pages.
- `dist/` is disposable build output. Edit source files instead.
- The repo no longer includes a separate support mini-site. Support lives inside the main landing page only.
