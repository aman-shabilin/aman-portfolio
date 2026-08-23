# Project Guide - Aman Shabilin Portfolio

## Overview

Personal portfolio website for Aman Shabilin — a dark-mode, single-page React app positioning the author as a data governance / backend systems engineer.

**Live stack:** React 19 + Vite 6, vanilla CSS (oklch colors), OGL (WebGL), deployed via Cloudflare Workers / OpenAI Sites.

---

## Architecture

```
src/
  App.jsx              — Main app: all sections, SignalCanvas (liquid ether BG), scroll logic
  SpecularButton.jsx   — WebGL specular highlight button (from reactbits.dev)
  main.jsx             — React root mount
  styles.css           — All styles, single file
public/
  resume.pdf           — Downloadable resume (served at /resume.pdf)
worker/
  index.js             — Cloudflare Workers SPA fallback handler
scripts/
  prepare-sites-build.mjs — Build script for Sites deployment
```

### Key decisions

- **Single file components**: All sections live in `App.jsx`. No component splitting unless the file exceeds ~500 lines.
- **No CSS modules/Tailwind**: Vanilla CSS with CSS custom properties (oklch color space). One stylesheet.
- **WebGL backgrounds**: OGL library for both the liquid ether background and SpecularButton. Shared dependency.
- **No router**: Single-page scroll-based navigation. Side-rail bookmark nav with smooth scroll.

---

## Design Language

| Element | Choice |
|---------|--------|
| Color scheme | Dark only, oklch-based |
| Background | Liquid ether WebGL shader with mouse interaction |
| Display font | Bodoni Moda (serif) |
| Body font | Public Sans (sans-serif) |
| Mono font | Azeret Mono (labels, tags, system text) |
| Accent primary | Teal — `oklch(0.79 0.102 185)` |
| Accent secondary | Amber — `oklch(0.82 0.105 72)` |
| Tone | Editorial/brutalist, metric-driven, concise |

### Color variables

```css
--bg: oklch(0.16 0.01 260);
--bg-deep: oklch(0.12 0.012 260);
--surface: oklch(0.165 0.014 54);
--ink: oklch(0.955 0.014 76);       /* headings, strong text */
--text: oklch(0.765 0.012 76);      /* body text */
--muted: oklch(0.56 0.013 76);      /* labels */
--dim: oklch(0.405 0.012 76);       /* inactive elements */
--teal: oklch(0.79 0.102 185);      /* primary accent */
--amber: oklch(0.82 0.105 72);      /* secondary accent */
```

---

## Sections (scroll order)

1. **Hero** (`data-section="intro"`) — Roles line, name, tagline, SpecularButton contact CTA, amber resume download button
2. **Proof strip** (`data-section="proof"`) — 3 key metrics in columns
3. **Journey** (`data-section="journey"`) — Timeline (chronological: oldest first), sticky intro with scroll-synced progress bar
4. **Projects** (`data-section="work"`) — Tabbed switcher (systems/ai/data)
5. **Skills** (`data-section="stack"`) — 4-column matrix grid
6. **Contact** (`data-section="contact"`) — Header + row of links (email, GitHub, LinkedIn, phone)

---

## Interactions & Animations

### Liquid ether background
- Full-viewport fixed WebGL shader (OGL)
- 3-layer simplex noise for fluid motion
- Mouse interaction: distortion + glow follows cursor (smoothed lerp at 5%/frame)
- Subtle vignette

### Scroll reveal (`data-reveal`)
- IntersectionObserver-based, one-shot (reveals once, never re-hides)
- Elements start `opacity: 0; translateY(28px); blur(4px)`
- Transition: 0.7s cubic-bezier(0.16, 1, 0.3, 1)
- Respects `prefers-reduced-motion`

### Side-rail navigation
- Fixed vertical dot nav on right edge
- Tracks active section via scroll listener (closest section top to 40% viewport)
- Active dot: teal glow + label visible
- Hover: label slides in
- Click: smooth scroll to section
- Hidden on mobile (<900px)

### Timeline progress bar
- Synced to scroll position through the timeline container
- `scaleX` transform with smooth transition
- "foundation" (empty) to "now" (full)

### SpecularButton (hero CTA)
- WebGL specular rim light that follows cursor
- `autoAnimate` enabled for idle shimmer
- Teal accent line color

---

## Practices

### Do

- Keep all styles in `src/styles.css` — single source of truth
- Use oklch for colors — consistent perceptual lightness
- Use `data-reveal` attribute for scroll animations on new elements
- Use `data-section` attribute on sections for nav tracking
- Keep experience array in chronological order (oldest first)
- External links: `target="_blank" rel="noopener noreferrer"`
- Test build (`npx vite build`) after every change
- Keep content metric-driven and concise — no filler text
- Match font assignments: Bodoni for headings, Public Sans for body, Azeret Mono for labels/tags

### Don't

- Don't add a CSS framework (Tailwind, Bootstrap, etc.)
- Don't split into multiple component files unless App.jsx exceeds 500 lines
- Don't add a router — this is a scroll-based single page
- Don't use light mode or add a theme toggle
- Don't add generic portfolio patterns (carousels, testimonials, stock photos)
- Don't use `position: sticky` for the side-rail (it's `fixed`)
- Don't add scroll-based animations via scroll events for per-element reveal — use IntersectionObserver
- Don't use `require()` — this is ESM (Vite)
- Don't add comments explaining what code does — only add comments for non-obvious "why"

---

## Deployment

### Build

```bash
npm run build
# Outputs: dist/client/ (static assets) + dist/server/index.js (worker) + dist/.openai/hosting.json
```

### Dev

```bash
npm run dev
# Vite dev server at localhost:5173 with HMR
```

### Hosting

- Cloudflare Workers / OpenAI Sites
- `worker/index.js` handles SPA fallback (serves index.html for 404 HTML requests)
- `.openai/hosting.json` configures the Sites deployment

---

## Dependencies

| Package | Purpose |
|---------|---------|
| react, react-dom | UI framework |
| vite | Dev server + bundler |
| @vitejs/plugin-react | React Fast Refresh |
| ogl | WebGL (liquid ether BG + SpecularButton) |

---

## Responsive Breakpoints

| Width | Changes |
|-------|---------|
| Default | Full 2-column layouts, side-rail visible |
| < 900px | Single column, side-rail hidden, sticky intro becomes static |
| < 560px | Tighter margins, full-width buttons, stacked grids |
