---
name: project-performance-fix-plan
description: "Prioritized fix plan to get citywidealarms.com loading under 1 second — ordered by impact, confirmed June 28, 2026"
metadata:
  type: project
---

All fixes ordered by performance impact. Priorities 1–3 done inside Bricks builder. Priorities 4–7 may need a performance plugin (Perfmatters or Asset CleanUp) or Bricks global settings.

**Why:** Jim's goal is sub-1-second load time ("load like Superman"). Every fix targets a confirmed root cause from [[project-performance-findings]].

**How to apply:** Work through this list in order each session. Do not skip ahead — Priority 1 alone will move the LCP number more than everything else combined.

---

## Priority 1 — Unblock the hero headline (biggest LCP win)
**Where:** Bricks builder → homepage → hero section settings
**Fix:** Disable lazy-render / lazy-load on the hero section specifically
**Why:** `bricks-lazy-hidden` is hiding the H1 headline (the LCP element) until `bricks.min.js` runs. Nothing above the fold should ever be lazy-loaded.

## Priority 2 — Fix the logo image
**Where:** Bricks builder → header → logo element
**Fix:**
- Replace 2560px PNG logo with a WebP version sized to actual display size (~300px wide)
- Remove the duplicate second logo instance loading above fold
- Remove the "powered by" badge image entirely
**Why:** Logo currently loads a 2560px full-res PNG with `loading="eager"` — browser fetches the largest possible version for a small header logo.

## Priority 3 — Kill the icon fonts
**Where:** Bricks Settings → Performance (or similar) → disable unused icon sets
**Fix:**
- Disable Font Awesome 6 Brands
- Disable Themify Icons
- Replace any icons in use above the fold with inline SVGs
**Why:** Both load as render-blocking CSS on every page regardless of use.

## Priority 4 — Cut Google Fonts to the bone
**Where:** Bricks Settings → Fonts or Typography
**Fix:**
- Pick ONE font, max 2 weights (400 regular + 700 bold)
- Self-host it (eliminates external DNS lookup to Google)
- Remove Manrope OR Poppins entirely — using both is redundant
**Why:** Currently loading Manrope (7 weights) + Poppins (18 variants including italic) from Google's servers = 17 font file downloads + external DNS hit.

## Priority 5 — Disable animate.css
**Where:** Bricks Settings → Performance
**Fix:** Disable the animate.css library if nothing on the site requires it
**Why:** Full animation library loading render-blocking on every page.

## Priority 6 — Gravity Forms assets — conditional loading only
**Where:** Perfmatters plugin (or Gravity Forms settings) → asset management
**Fix:** Load Gravity Forms CSS/JS only on pages that actually contain a form
**Why:** 4 CSS + 7 JS files from Gravity Forms load on the homepage where no form may be present above the fold.

## Priority 7 — Remove jQuery if unused
**Where:** Bricks Settings → Performance → Disable jQuery
**Fix:** Confirm whether any plugin/feature actually requires jQuery, then disable if not
**Why:** jQuery + jQuery Migrate load on every page. Bricks itself does not need jQuery.

---

## Access Requirements for Fix Session
- Need authenticated WP backend tab (Jim logs in, Claude drives)
- Login path changed from standard `/wp-admin` — Jim uses new custom login URL
- Claude will NOT navigate to `/wp-admin` directly or enter any credentials
- Once authenticated tab is handed over, open Bricks builder for homepage and start at Priority 1
