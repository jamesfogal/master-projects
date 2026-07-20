# June 28, 2026 — Session Notes (CitywideAlarms.com Performance Diagnosis)

---

## What Was Done This Session

### Started from a ChatGPT-authored test plan
Jim brought a test plan from ChatGPT to check whether Cloudflare Rocket Loader was hurting citywidealarms.com's SEO/performance: disable Rocket Loader → purge cache → re-run PageSpeed → compare.

### Rocket Loader test — executed live
Jim logged into Cloudflare himself; Claude drove the already-authenticated browser session to disable Rocket Loader and purge the Cloudflare cache (no credentials entered by Claude). Ran 3 separate live audits via the PingClose `/api/audit` tool against the deployed production site, pulling structured comparison data directly from Supabase (project `xvrhxtnhmnurvxitnijy`, table `pingclose_audits`).

**Result — mixed, confirmed across 3 runs:**
- Desktop score, LCP, TBT, unused-JS: consistently better with Rocket Loader OFF
- Mobile score, FCP: consistently worse with Rocket Loader OFF

Recommendation given: revert Rocket Loader back to ON pending further investigation — this was a real tradeoff, not a clean win. **Not yet acted on** — Jim said "Run it again" (3rd data point) and the conversation moved on to the next finding before a final decision was made.

### "Huge image" claim — checked against hard data, found false
Jim suspected a huge image was the bottleneck. Queried the audit's `full_report->'speed'` data:
- Largest image on the homepage: **71KB, already WebP**
- Heaviest resources overall are a **172KB Google Tag Manager script** and a **115KB FontAwesome font file** — no image comes close to "huge"

### Found the real LCP element — it's text, not an image
Queried Lighthouse's `lcp-discovery-insight` / `lcp-breakdown-insight` raw audits. The LCP element is the **H1 headline** ("See Why We Are The #1 Top Rated Local Home Security Company In St. Louis, MO"), not an image. Breakdown: TTFB 4ms, Resource load delay 1,275ms, Resource load duration 166ms, Element render delay 28ms. Flags: `requestDiscoverable: false`, `priorityHinted: false` (no `fetchpriority=high`).

### Clarified throttled vs. real timing
Jim pushed back that the LCP delay was only a small fraction of the ~7.5s load time he was seeing. Pulled the full metrics block from the same Lighthouse run:
- **Simulated/throttled (mobile-throttle lab simulation)** — what drives the score: FCP 4.1s, LCP 6.6s, TTI 6.6s, `lcpLoadDelay` 5.75s simulated
- **Actual observed (real trace, no throttling)**: FCP 1.28s, LCP 1.47s, full load 0.88s

So the ~6.6–7.5s figure is Lighthouse's mobile-throttle simulation, not literal real-world load time — but Jim correctly flagged this as "a whole lot of excuses" and pushed to find a real root cause instead of stopping there.

### Root cause found — confirmed via live HTML, not guessed
Downloaded the live homepage HTML directly (`curl https://citywidealarms.com/`) and found the H1 headline (the actual LCP element) is wrapped in Bricks builder's lazy-render classes:

```html
<div class="... bricks-lazy-hidden"><div id="brxe-nnrpta" class="brxe-container bricks-lazy-hidden"><div id="brxe-azvock" class="brxe-block bricks-lazy-hidden"><h1 id="brxe-srewmj" class="brxe-heading">See Why We Are The #1 Top Rated Local Home Security Company In St. Louis, MO</h1>
```

This is a real, fixable cause: Bricks is hiding the hero section (including the main headline) until JavaScript runs to remove the `bricks-lazy-hidden` class — matching Lighthouse's earlier "not discoverable in initial HTML" flag. The hero/headline should never be lazy-loaded since it's the first thing visible on the page.

---

## Decision

Jim asked about replacing Bricks' lazy-loading with custom code. Claude recommended checking the Bricks builder UI first — Bricks has a per-section "Lazy load" toggle, and if the hero section is just misconfigured, flipping that off is a one-click, low-risk config change vs. writing custom replacement code on a live client site.

## BLOCKED — WP Admin Login

Jim changed the WordPress login URL/format recently to reduce attack surface (good security move), so the standard `/wp-admin` path doesn't reach the login screen. Claude will not navigate to `/wp-admin` directly per Jim's instruction. Jim attempted to log in himself but ran out of time (family obligations) before the authenticated tab showed up in Claude's connected browser session.

**Next session must start with:**
1. Jim logs into the WP backend himself (new login path) and hands Claude the authenticated browser tab — Claude will not receive, enter, or ask for the actual credentials.
2. Once in: open the Bricks builder for the homepage, find the hero section, check for a "Lazy load" toggle, and turn it off if present.
3. If no such toggle exists or it doesn't actually control this behavior, only then discuss a custom-code fallback — not before checking the builder setting first.
4. Re-run the audit afterward to confirm the FCP/LCP numbers actually improve, and decide the Rocket Loader question (currently OFF, 3 data points in, recommendation was to revert to ON pending further investigation — not yet decided).

---

## New working agreement (added to memory this session)

Jim explicitly required: before taking *any* action — not just deploys — state exactly what is about to be done and get explicit approval first, every time. This now applies broadly, not just to the existing "never deploy without approval" rule.

---

*File created: June 28, 2026, end of session.*
*Nothing was changed on citywidealarms.com's WordPress/Bricks setup this session — Rocket Loader remains OFF on Cloudflare from earlier testing; no code or settings changes made on the WP/Bricks side.*
