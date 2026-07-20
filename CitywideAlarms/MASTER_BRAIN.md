# MASTER_BRAIN — CitywideAlarms
## Permanent Chronological Project Memory

=================================================
CRITICAL TIMESTAMP RULES
=================================================

1. Everything must be date and timestamped.
2. Use ISO format: YYYY-MM-DD HH:MM:SS UTC
3. Preserve chronological order.
4. Every session gets a unique Session ID.
5. Every task gets:
   - Created date/time
   - Updated date/time
   - Status date/time
6. MASTER_BRAIN_SUMMARY.md must include:
   - Last Updated
   - Date Added for every major item
   - Last Modified for every major item
7. Never add undated entries.

=================================================
CRITICAL CONTENT RULES
=================================================

1. Copy information WORD FOR WORD.
2. Do NOT summarize.
3. Do NOT compress.
4. Never delete historical entries.
5. Never reorder historical entries.

---

<!-- Sessions imported below in chronological order. -->


=================================================
SESSION: MONSTER MIGRATION — KNOWLEDGE OBJECT ROUTING
Session ID: VIKTOR-2026-07-07-S001
Date: 2026-07-07 01:05:00 UTC
Executed by: Viktor (AI COO), authority granted by Jim Fogal 2026-07-06
Method: knowledge objects copied word-for-word from extraction files
(JUNE16 pilot + 2026-07-07 wave 2). Originals preserved and archived in
MONSTER_MASTER_BRAIN_ARCHIVE. Nothing deleted or reordered.
=================================================

### [2026-07-07 01:05:00 UTC] (from JUNE16_NOTES pilot)
## KO-000022
Title: CityWide Alarms is the first pilot client and future case study, but launch data is incomplete
Description: CityWide Alarms is planned as the first full implementation for site fixes, Knowledge Center, city pages, citations, and GBP work, but the case study is blocked until real phone, address, and pricing are confirmed.
Primary Project: CityWide Alarms
Secondary Projects: LocalSEOAEOPro
Shared Infrastructure: Knowledge Center; Citations; GBP workflow
Source File: `C:\Projects\pingclose\JUNE16_NOTES.md:155-156`
Confidence: 98%
Status: MIGRATED 2026-07-07 — routed word-for-word into this MASTER_BRAIN (Session VIKTOR-2026-07-07-S001).

### [2026-07-07 01:05:00 UTC] (from WHY_WE_BUILT_IT_THIS_WAY)
## KO-000053
Title: CityWide is first client because Jim owns it
Description: No sales cycle, no approval delays, real data, case study proves system before selling. BLOCKED on real phone/address/pricing — wrong NAP schema actively hurts rankings; nothing goes live without these.
Primary Project: CityWide Alarms
Source File: `WHY_WE_BUILT_IT_THIS_WAY.md:272-279`
Confidence: 99%
Status: MIGRATED 2026-07-07 — routed word-for-word into this MASTER_BRAIN (Session VIKTOR-2026-07-07-S001).

### [2026-07-07 01:05:00 UTC] (from WHY_WE_BUILT_IT_THIS_WAY)
## KO-000054
Title: Published-pricing moat strategy for CityWide
Description: Competitors hide prices ("Call for a Quote"). AI Overviews/ChatGPT/Perplexity answer pricing questions directly; PriceSpecification schema + real prices = owning every AI pricing citation in St. Louis.
Primary Project: CityWide Alarms
Secondary Projects: LocalSEOAEOPro (repeatable playbook)
Source File: `WHY_WE_BUILT_IT_THIS_WAY.md:281-284`
Confidence: 99%
Status: MIGRATED 2026-07-07 — routed word-for-word into this MASTER_BRAIN (Session VIKTOR-2026-07-07-S001).

### [2026-07-07 01:05:00 UTC] (from WHY_WE_BUILT_IT_THIS_WAY)
## KO-000055
Title: Alarm takeover content built first — highest conversion intent
Description: "Can I reuse my Honeywell panel?" = already-decided switcher. Real model-level compatibility depth is a moat no St. Louis competitor can match.
Primary Project: CityWide Alarms
Source File: `WHY_WE_BUILT_IT_THIS_WAY.md:286-287`
Confidence: 99%
Status: MIGRATED 2026-07-07 — routed word-for-word into this MASTER_BRAIN (Session VIKTOR-2026-07-07-S001).

### [2026-07-07 01:05:00 UTC] (from WHY_WE_BUILT_IT_THIS_WAY)
## KO-000056
Title: CTA rule — always "Schedule a Free Visit", never phone quotes
Description: CityWide closes in person; the appointment is the close. Phone quotes create shopping numbers; visits create relationship and trust.
Primary Project: CityWide Alarms
Source File: `WHY_WE_BUILT_IT_THIS_WAY.md:289-290`
Confidence: 99%
Status: MIGRATED 2026-07-07 — routed word-for-word into this MASTER_BRAIN (Session VIKTOR-2026-07-07-S001).

### [2026-07-07 01:05:00 UTC] (from WHY_WE_BUILT_IT_THIS_WAY)
## KO-000057
Title: AEO beats traditional SEO for local alarm business
Description: Tiny keyword volumes (10–30/mo) but huge CPCs ($156.96 "home security st louis mo"); one organic ranking pays for the site for a year. Real battle = AI answer citations, won via schema-marked FAQ pages + published prices + Speakable schema.
Primary Project: CityWide Alarms
Secondary Projects: LocalSEOAEOPro (strategy template)
Source File: `WHY_WE_BUILT_IT_THIS_WAY.md:292-297`
Confidence: 99%
Status: MIGRATED 2026-07-07 — routed word-for-word into this MASTER_BRAIN (Session VIKTOR-2026-07-07-S001).

### [2026-07-07 01:05:00 UTC] (from JUNE22/JUNE25/JUNE28 session notes)
## KO-000074
Title: June 28 — Rocket Loader A/B result is a genuine tradeoff, not a clean win
Description: 3 live audit runs via PingClose /api/audit + Supabase comparisons: Desktop/LCP/TBT/unused-JS better with Rocket Loader OFF; Mobile score/FCP worse. Recommendation: revert to ON pending investigation. State at freeze: still OFF, undecided.
Primary Project: CityWide Alarms
Shared Infrastructure: Cloudflare; PingClose audit tool (dogfooding)
Source File: `CitywideAlarms\JUNE28_NOTES.md:5-16`
Confidence: 99%
Status: MIGRATED 2026-07-07 — routed word-for-word into this MASTER_BRAIN (Session VIKTOR-2026-07-07-S001). OPEN DECISION.

### [2026-07-07 01:05:00 UTC] (from JUNE22/JUNE25/JUNE28 session notes)
## KO-000075
Title: June 28 — citywidealarms.com real LCP root cause: Bricks lazy-hides the H1 hero
Description: "Huge image" theory disproven (largest image 71KB WebP; heaviest assets are 172KB GTM script + 115KB FontAwesome font). LCP element is the H1 headline wrapped in `bricks-lazy-hidden` classes — hidden until JS runs. Fix path: check Bricks per-section "Lazy load" toggle first (one-click) before any custom code. Lab-vs-real clarified: 6.6–7.5s figures are Lighthouse mobile-throttle simulation; real trace shows FCP 1.28s / LCP 1.47s.
Primary Project: CityWide Alarms
Source File: `CitywideAlarms\JUNE28_NOTES.md:18-52`
Confidence: 99%
Status: MIGRATED 2026-07-07 — routed word-for-word into this MASTER_BRAIN (Session VIKTOR-2026-07-07-S001). BLOCKED on WP admin login handoff (Jim logs in, hands over authenticated session).

=================================================
SESSION: CHATGPT AUDIT CORRECTIONS
Session ID: VIKTOR-2026-07-07-S002
Date: 2026-07-07 04:10:00 UTC
Executed by: Viktor (AI COO) per Jim Fogal + ChatGPT audit findings
=================================================

### [2026-07-07 04:10:00 UTC] Correction record
- Knowledge-object status lines in this file updated from "Extracted; not
  migrated" to "MIGRATED 2026-07-07 — routed word-for-word into this
  MASTER_BRAIN (Session VIKTOR-2026-07-07-S001)". No KO content changed.
