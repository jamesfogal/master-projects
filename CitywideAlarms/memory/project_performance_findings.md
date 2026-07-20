---
name: project-performance-findings
description: "Citywide Alarms homepage performance root causes — confirmed via live HTML, Lighthouse audit data, and Supabase queries on June 28, 2026"
metadata:
  type: project
---

Confirmed root causes of the slow mobile PageSpeed score (LCP 6.6s simulated mobile, observed 1.47s real). All findings verified against live HTML and Lighthouse raw audit data — nothing guessed.

**Why:** Jim wants sub-1-second load time. Lighthouse mobile simulation shows 6.6s LCP driven by render-blocking resources and Bricks lazy-render on the hero section.

**How to apply:** Every fix session should work from this list in priority order. Do not invent new theories — these are the confirmed causes.

---

## Confirmed Root Causes

### 1. Bricks lazy-render on the hero section (BIGGEST issue)
The H1 headline ("See Why We Are The #1 Top Rated Local Home Security Company In St. Louis, MO") — the actual LCP element — is wrapped in `bricks-lazy-hidden` CSS class. The browser cannot paint it until `bricks.min.js` downloads and executes to remove the class. Lighthouse confirmed: `requestDiscoverable: false`, `priorityHinted: false`. LCP resource load delay: 1,275ms of the total.

### 2. Logo loaded at full 2560px width as PNG
The site logo loads as `Citywide-Alarms_Logo_Horizontal_CMYK-scaled.png` at 2560px wide with `loading="eager"`. No WebP. Browser fetches full-res file for a header logo that displays at ~300px. Two logo instances above the fold.

### 3. Icon font libraries (render-blocking CSS)
- Font Awesome 6 Brands — full CSS file, render-blocking
- Themify Icons — full CSS file, render-blocking
Both load on every page regardless of use.

### 4. Google Fonts — 17 weight variants
Manrope (all weights 200–800) + Poppins (all weights 100–900, italic + normal) loading from Google's servers on every page. External DNS lookup + 17 font file downloads.

### 5. animate.css — full animation library
Loaded on every page, render-blocking, likely unused or minimally used.

### 6. Gravity Forms assets loading on every page
4 CSS files + 7 JS files from Gravity Forms load on the homepage even if no form is present above the fold. Should be conditional — only load on pages with a form.

### 7. jQuery + jQuery Migrate
Both load on every page. Bricks itself does not require jQuery — needs confirmation whether any plugin/feature actually needs it.

---

## Key Metrics (from Lighthouse audit id: 71ef6bad-95e5-4d8b-a9bd-f3471ea73484)
- TTFB: 4ms (server is fast — not the problem)
- Observed FCP (real trace): 1.28s
- Observed LCP (real trace): 1.47s
- Simulated mobile FCP: 4.1s
- Simulated mobile LCP: 6.6s
- TBT: 156ms
- Main thread work: 883ms
- JS bootup: 386ms
- Heaviest resources: GTM script 172KB, FontAwesome font 115KB, largest image 71KB WebP

## Rocket Loader Status
Cloudflare Rocket Loader was turned OFF during this session for testing (Jim drove Cloudflare UI, Claude controlled authenticated tab). Result was mixed: desktop improved, mobile FCP worsened. Recommendation: turn Rocket Loader back ON pending further investigation. **Not yet actioned** — decision deferred.
