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
- `src/img/`
  - landing artwork, header icons, and store badges
- `src/fonts/`
  - embedded Vazirmatn webfonts
- `src/statics/`
  - active root files such as favicons, manifest, `CNAME`, `chat-config.js`, and `ads-and-verification-config.js`
- `src/statics/ads-and-verification/`
  - source-only optional ad and verification root files, copied to the build only when enabled
- `dist/`
  - generated output for preview and deployment

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
- `npm run deploy`: rebuild, verify, and publish the `dist/` folder to GitHub Pages

## Editing Guide

- Update page metadata, text, support copy, and action links in `pages/landing-data.ejs`
- Update layout partials in `pages/parts/`
- Update all active styling in `src/scss/style.scss`
- Update RayChat behavior in `src/js/chat-widget.js`
- Replace artwork and icons in `src/img/`

## Notes

- `master` is the editable source branch.
- `gh-pages` is the deployment artifact branch.
- `dist/` is disposable build output. Edit source files instead.
- The repo no longer includes a separate support mini-site. Support lives inside the main landing page only.
