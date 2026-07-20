# LocalSEOAEOPro — Master Todo List

*Last updated: 2026-06-16 (evening)*
*Only work from June 15, 2026 forward counts.*

---

## 🔴 P0 — Fix Before Showing Any Client

### Manifest Fixes (authorityResearch.manifest.ts)
- [ ] Add `layer: 2` — places skill in 7-layer AI OS architecture
- [ ] Add `confidenceThreshold: 0.70` — enables "passed with warning" behavior
- [ ] Change `timeoutMs` from 60000 → 90000 — correct timeout for external API calls

### Fake Data Modules (all use Claude to invent results — not real data)
These cannot be shown to paying clients until wired to real APIs.

| Module | Problem | Real Data Source | Blocker |
|--------|---------|-----------------|---------|
| RankTracker.jsx | 100% Claude-invented rankings | DataForSEO API ✅ connected | Ready to build |
| PageSpeedIntelligence.jsx | 100% Claude-invented scores | Google PageSpeed API (same key as PingClose) | Ready to build |
| KeywordIntelligence.jsx | 100% Claude-invented volumes | DataForSEO API ✅ connected | Ready to build |
| CompetitorIntelligence.jsx | 100% Claude-hallucinated competitor data | DataForSEO API ✅ connected | Ready to build |
| BacklinkFinder.jsx | 100% Claude-invented backlinks | DataForSEO API ✅ connected | Ready to build |
| MultiPlatformReviewMonitor.jsx | 100% Claude-fabricated reviews | Google My Business API | Separate discussion needed |
| HostingIntelligence.jsx | Benchmarks are Claude estimates | Remove fabricated benchmarks | Ready to fix |
| SocialPresenceScanner.jsx | Claude GUESSES social presence — not real | Real social platform scraping or API | Needs design decision |
| NAPConsistencyChecker.jsx | Claude GUESSES NAP issues — not real | BrightLocal API | BrightLocal API key pending |

### Security Fixes — COMPLETED 2026-06-16
- [x] ~~RLS disabled on `platform_config` table — Resend API key was publicly exposed~~ **FIXED: ALTER TABLE public.platform_config ENABLE ROW LEVEL SECURITY — table is now locked**
- [x] ~~RLS disabled on `email_verifications` table — verification codes were publicly exposed~~ **FIXED: ALTER TABLE public.email_verifications ENABLE ROW LEVEL SECURITY — table is now locked**

### Supabase Key Fix — COMPLETED 2026-06-16
- [x] ~~`sb_secret_` format key was breaking Supabase connection in both projects~~ **FIXED: Replaced with legacy `eyJ...` JWT service role key in Vercel (Production + Development) for both LocalSEOAEOPro and PingClose. Also updated `C:\Users\Jim Fogal\.env.local`. Confirmed working — live audit data returned from database.**

### Infrastructure — Blockers
- [x] ~~Confirm DataForSEO login email — log into app.dataforseo.com → API Access → find the exact email shown on screen. Previously tried james.fogal@citywidealarms.com and james.fogal@gmail.com — both returned 401.~~ **RESOLVED: james.fogal@citywidealarms.com / 948f6ae4681cc754 — confirmed working 2026-06-16**
- [ ] Activate BrightLocal API key — 14-day trial active, API key pending

---

## 🟡 P1 — Register Orphaned Modules in Nav

These 8 module files exist on disk but are NOT in registry.js — they are invisible in the dashboard.

- [ ] Add `SocialPresenceScanner` to registry.js (group: Intelligence Agents)
- [ ] Add `NAPConsistencyChecker` to registry.js (group: Intelligence Agents)
- [ ] Add `SSLCertificateMonitor` to registry.js (group: Intelligence Agents)
- [ ] Add `TechStackIdentifier` to registry.js (group: Intelligence Agents)
- [ ] Add `TrackingPixelDetector` to registry.js (group: Intelligence Agents)
- [ ] Add `RedirectChainDetector` to registry.js (group: Intelligence Agents)
- [ ] Add `ProspectQualificationScorer` to registry.js (group: Intelligence Agents)
- [ ] Add `RedditVisibilityScanner` to registry.js (group: Intelligence Agents or Content)
- [ ] Add new "Intelligence Agents" nav group to registry.js

---

## 🟡 P1 — AI OS Phase 2 (First Real Skills)

Phase 1 is done. These are next.

- [ ] Build Data Source Gateway — unified wrapper for DataForSEO + BrightLocal API calls. All skills call this, never call APIs directly.
- [ ] Build Authority Research Skill — uses manifest already built, calls Data Source Gateway
- [ ] Build SEO Auditor Skill — port PingClose agents into AI OS skill format

---

## 🟡 P1 — AI OS Executive Dashboard

- [ ] Build Executive Dashboard page with fake data first — completion %, skills passed/warned/failed, SEO score, AEO score, Core Web Vitals prediction, deploy status. Real data wires in as skills are built.

---

## 🟡 P1 — Stripe Integration

- [ ] 4 checkout flows:
  - Fix Package ($495 base + per-page overages)
  - Monthly Managed ($299/month recurring)
  - White Label Partner Access ($199 one-time)
  - Full Engagement ($7,000 bundle)

---

## 🟡 P1 — Partner Portal + White Label System

- [ ] Partner registration flow
- [ ] White label report generator wired to real client data
- [ ] Partner dashboard — shows their clients, reports, billing

---

## 🔵 P2 — AI OS Phase 3 (Money Engine)

- [ ] Build Knowledge Center Skill — generates 100 Q&A pages per client. Each page: FAQPage schema + Speakable schema + branded image + avatar video (HeyGen + ElevenLabs).
- [ ] Build Schema Builder — FAQPage, PriceSpecification, LocalBusiness, Speakable
- [ ] Build Media Generator — HeyGen + ElevenLabs integration
- [ ] Build Publisher — deploys generated pages to client site

---

## 🔵 P2 — AI OS Phase 4 (Automation + Defense)

- [ ] Build GBP Skill — Google Business Profile optimizer as production skill
- [ ] Build Citation Manager Skill — BrightLocal integration, auto-submits to 50+ directories
- [ ] Build Competitor Intelligence Skill — monitors competitors, triggers content responses
- [ ] Build Notification/Alert Skill — immediate failure alerts via email/text
- [ ] Build Client Report Generator — monthly deliverable PDF/page
- [ ] Build Rollback Controller — deployment fingerprint + revert capability

---

## 🔵 P2 — AI OS Master Orchestrator (Built Last)

- [ ] Build Master Orchestrator — the only skill the user launches. Loads project, determines which skills run, manages execution order, collects results, monitors health, retries failures, blocks deployment on critical failure.

---

## 🔵 P2 — New Modules to Build (Not Yet Existing)

- [ ] PhoneNumberValidator — detects cell phones vs business lines, checks against GBP
- [ ] AddressValidator — detects residential/PO Box addresses, checks Google won't show in Maps
- [ ] ConversionTrackingInstaller — installs GA4 + Facebook Pixel + TikTok Pixel, verifies all firing, sets up conversion goals
- [ ] PingLocalCityPageGenerator — different from CityPageGenerator. Outputs full city landing page + city FAQ + city pricing page for [city]-[state].pingclose.com subdomains

---

## 🔵 P2 — Monthly Intelligence Report Module

- [ ] Build module that generates monthly client deliverable: keyword movement, citation fixes made, GBP updates posted, pages built, Core Web Vitals trend

---

## 🔵 P2 — Content Store + Page Ordering

- [ ] Build system where generated pages (FAQ, pricing, city, Q&A) are stored and can be ordered/delivered to client sites in batches

---

## 🔵 P2 — Page Count Crawler + Tiered Pricing

- [ ] Build crawler that counts client site pages and auto-calculates price at checkout based on tier:
  - 1–10 pages: $495 flat
  - 11–50 pages: $495 + $10/page over 10
  - 51–200 pages: $495 + $8/page over 50
  - 201–1,000 pages: $495 + $5/page over 200

---

## 🔵 P3 — Infrastructure

- [ ] Add Sentry error monitoring — free tier 5k errors/month, catches module failures before clients report them

---

## First Target Client

- [ ] CityWide Alarms — BLOCKED: need real phone number, address, and service pricing confirmed before starting. This is the case study that sells every future client.
