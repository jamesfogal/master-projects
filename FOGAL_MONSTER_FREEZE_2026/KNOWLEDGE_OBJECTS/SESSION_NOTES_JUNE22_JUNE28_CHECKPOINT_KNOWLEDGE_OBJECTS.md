# Session Notes Knowledge Objects — JUNE22 / 2026-06-25 Checkpoint / JUNE28

Sources:
- `C:\Projects\pingclose\JUNE22_NOTES.md`
- `C:\Projects\PROJECT_MEMORY\Session_Checkpoints\2026-06-25_2337_PingClose_Sprint\01_SESSION_SUMMARY.md`
- `C:\Projects\CitywideAlarms\JUNE28_NOTES.md`
Extraction date: 2026-07-07 00:55:00 UTC. Originals untouched. Numbering continues from KO-000063.

## KO-000064
Title: June 22 audit method — evidence-based Proven Working / Proven Broken / Not Tested
Description: Launch-readiness audit ran live HTTP tests, MCP-authenticated Vercel fetches, direct Supabase queries, and full source reads. Establishes the evidence-first audit standard for all projects.
Primary Project: Shared Operations (audit methodology)
Secondary Projects: PingClose
Source File: `pingclose\JUNE16... JUNE22_NOTES.md:5-9`
Confidence: 99%
Status: MIGRATED 2026-07-07 — routed word-for-word into C:\Projects\PROJECT_MEMORY\SHARED_OPERATIONS_MASTER_BRAIN.md (Session VIKTOR-2026-07-07-S001).

## KO-000065
Title: June 22 finding — pingclose.com still on Netlify; Vercel Deployment Protection blocking public access
Description: DNS still Namecheap→Netlify (A 75.2.60.5, www CNAME pingclose.netlify.app); live site was a stale 2026-06-15 build. Vercel SSO wall + `x-robots-tag: noindex` on every route. RESOLVED 2026-06-25: DNS cut over (A 216.150.1.1, CNAME ff2461497a9df4a9.vercel-dns-017.com), both domains valid.
Primary Project: PingClose
Shared Infrastructure: Namecheap DNS; Vercel
Source File: `pingclose\JUNE22_NOTES.md:11-18`; resolution `Session_Checkpoints\...\01_SESSION_SUMMARY.md:8-13`
Confidence: 99%
Status: MIGRATED 2026-07-07 — routed word-for-word into C:\Projects\pingclose\MASTER_BRAIN.md (Session VIKTOR-2026-07-07-S001). Resolution captured.

## KO-000066
Title: June 22 corrections — H1 typo claim false; Twilio never configured
Description: The JUNE16 "Websiteon" H1 typo claim is stale/false — current code and even old build render correctly. Twilio env vars never documented; SMS failed silently. (Twilio then fully deleted from code 2026-06-25.)
Primary Project: PingClose
Source File: `pingclose\JUNE22_NOTES.md:22-27`
Confidence: 99%
Status: MIGRATED 2026-07-07 — routed word-for-word into C:\Projects\pingclose\MASTER_BRAIN.md (Session VIKTOR-2026-07-07-S001). TODO.md still lists the typo fix — stale.

## KO-000067
Title: DNS change runbook for pingclose.com — protect MX and TXT
Description: Documented exact record table incl. rollback (revert A to 75.2.60.5). Hard rules: never touch Google Workspace MX (`aspmx.l.google.com`) or the google-site-verification TXT. Lower TTL before cutover.
Primary Project: PingClose
Shared Infrastructure: Namecheap DNS; Google Workspace
Source File: `pingclose\JUNE22_NOTES.md:36-45`
Confidence: 99%
Status: MIGRATED 2026-07-07 — routed word-for-word into C:\Projects\pingclose\MASTER_BRAIN.md (Session VIKTOR-2026-07-07-S001).

## KO-000068
Title: Vercel account lockout episode and recovery
Description: June 22: Jim locked out of Vercel, all 2FA paths dead-ended (authenticator rejected, no recovery code, passkey failures). Resolved by June 25 session (access regained). Lesson: store recovery codes for critical accounts.
Primary Project: Shared Operations (account security)
Secondary Projects: PingClose
Source File: `pingclose\JUNE22_NOTES.md:49-63`; `01_SESSION_SUMMARY.md:8`
Confidence: 99%
Status: MIGRATED 2026-07-07 — routed word-for-word into C:\Projects\PROJECT_MEMORY\SHARED_OPERATIONS_MASTER_BRAIN.md (Session VIKTOR-2026-07-07-S001).

## KO-000069
Title: June 25 — UTF-8 BOM in Vercel env vars caused silent Supabase failures
Description: `SUPABASE_SERVICE_ROLE_KEY` had U+FEFF prepended (likely from Notepad/Word pass-through), failing every insert with "Cannot convert argument to a ByteString". Same on `RESEND_FROM_EMAIL`. Fix: browser-to-browser copy for secrets, Vercel CLI printf for non-secrets. Standing policy: secrets never pass through chat, editors, or AI tools.
Primary Project: PingClose
Secondary Projects: Shared Operations (secrets policy)
Source File: `01_SESSION_SUMMARY.md:15,44-46`
Confidence: 99%
Status: MIGRATED 2026-07-07 — routed word-for-word into C:\Projects\pingclose\MASTER_BRAIN.md (Session VIKTOR-2026-07-07-S001).

## KO-000070
Title: June 25 — PageSpeed Agent rebuilt with 50s AbortController timeout
Description: Standalone reusable `lib/agents/pagespeedAgent/` replaced monolithic lib/pagespeed.ts. 50s (not 60s) leaves ~10s headroom for scoring, DB insert, and two Resend calls before Vercel's hard kill. Standard `{ok, data}/{ok:false, error, quotaExceeded}` envelope. Plus `buildFallbackResult()`: PageSpeed timeout no longer aborts the whole audit — other 4 agents' data still saves/delivers.
Primary Project: PingClose
Source File: `01_SESSION_SUMMARY.md:17,22,42-43`
Confidence: 99%
Status: MIGRATED 2026-07-07 — routed word-for-word into C:\Projects\pingclose\MASTER_BRAIN.md (Session VIKTOR-2026-07-07-S001).

## KO-000071
Title: June 25 — PII leak fixed in /api/report; admin login rate-limited
Description: /api/report was select(*)-ing pingclose_audits to an unauthenticated endpoint (exposing email, phone, IP, private sales notes, pipeline stage) — replaced with explicit field allow-list. New `pingclose_admin_login_attempts` table + adminRateLimiter: 5 failed attempts/15 min per IP; successful logins never throttled.
Primary Project: PingClose
Source File: `01_SESSION_SUMMARY.md:24-26`
Confidence: 99%
Status: MIGRATED 2026-07-07 — routed word-for-word into C:\Projects\pingclose\MASTER_BRAIN.md (Session VIKTOR-2026-07-07-S001).

## KO-000072
Title: Decision — PingClose permanently stays on the shared localseoaeopro Supabase project
Description: PingClose is the lead-gen front end, not an independent platform; splitting databases would break the pipeline. Architecture review deferred until after launch blockers clear.
Primary Project: Shared Operations
Secondary Projects: PingClose; LocalSEOAEOPro
Source File: `01_SESSION_SUMMARY.md:41`
Confidence: 99%
Status: MIGRATED 2026-07-07 — routed word-for-word into C:\Projects\PROJECT_MEMORY\SHARED_OPERATIONS_MASTER_BRAIN.md (Session VIKTOR-2026-07-07-S001).

## KO-000073
Title: fogal.net email host migration resolved (June 25)
Description: Two server-migration emails diagnosed (s15096.usc1.stableserver.net / SuperCP); DNS confirmed already correct; jim@fogal.net mailbox working.
Primary Project: Shared Operations (personal/infra)
Source File: `01_SESSION_SUMMARY.md:6`
Confidence: 98%
Status: MIGRATED 2026-07-07 — routed word-for-word into C:\Projects\PROJECT_MEMORY\SHARED_OPERATIONS_MASTER_BRAIN.md (Session VIKTOR-2026-07-07-S001).

## KO-000074
Title: June 28 — Rocket Loader A/B result is a genuine tradeoff, not a clean win
Description: 3 live audit runs via PingClose /api/audit + Supabase comparisons: Desktop/LCP/TBT/unused-JS better with Rocket Loader OFF; Mobile score/FCP worse. Recommendation: revert to ON pending investigation. State at freeze: still OFF, undecided.
Primary Project: CityWide Alarms
Shared Infrastructure: Cloudflare; PingClose audit tool (dogfooding)
Source File: `CitywideAlarms\JUNE28_NOTES.md:5-16`
Confidence: 99%
Status: MIGRATED 2026-07-07 — routed word-for-word into C:\Projects\CitywideAlarms\MASTER_BRAIN.md (Session VIKTOR-2026-07-07-S001). OPEN DECISION.

## KO-000075
Title: June 28 — citywidealarms.com real LCP root cause: Bricks lazy-hides the H1 hero
Description: "Huge image" theory disproven (largest image 71KB WebP; heaviest assets are 172KB GTM script + 115KB FontAwesome font). LCP element is the H1 headline wrapped in `bricks-lazy-hidden` classes — hidden until JS runs. Fix path: check Bricks per-section "Lazy load" toggle first (one-click) before any custom code. Lab-vs-real clarified: 6.6–7.5s figures are Lighthouse mobile-throttle simulation; real trace shows FCP 1.28s / LCP 1.47s.
Primary Project: CityWide Alarms
Source File: `CitywideAlarms\JUNE28_NOTES.md:18-52`
Confidence: 99%
Status: MIGRATED 2026-07-07 — routed word-for-word into C:\Projects\CitywideAlarms\MASTER_BRAIN.md (Session VIKTOR-2026-07-07-S001). BLOCKED on WP admin login handoff (Jim logs in, hands over authenticated session).

## KO-000076
Title: June 28 working agreement — explicit approval before ANY action
Description: Jim broadened the approval rule: before any action (not just deploys), state exactly what will be done and get explicit approval. NOTE: partially superseded 2026-07-06 by Jim's Viktor Operating Authority (autonomous execution, approval only for deletions/spend/credentials/business decisions) — both records preserved; the 2026-07-06 charter governs Viktor.
Primary Project: Shared Operations (working agreement)
Source File: `CitywideAlarms\JUNE28_NOTES.md:60-62`
Confidence: 99%
Status: MIGRATED 2026-07-07 — routed word-for-word into C:\Projects\PROJECT_MEMORY\SHARED_OPERATIONS_MASTER_BRAIN.md (Session VIKTOR-2026-07-07-S001).

## Extraction statistics
- Knowledge objects: 13 (KO-000064 … KO-000076)
- All DECOMPOSE targets currently present in the upload are now decomposed (JUNE16 pilot + WHY + these 3). Remaining DECOMPOSE item (Golden Goose docx) requires upload.
