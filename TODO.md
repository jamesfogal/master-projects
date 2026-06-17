# Master Todo List — All Projects
*Last updated: 2026-06-17*
*Rule: Never delete a completed item — strikethrough it instead.*
*Rule: Nothing before June 15, 2026 counts.*
*Rule: AI OS runs on EVERY page of EVERY project. No exceptions.*

---

## AGENTS THAT RUN ON EVERY PROJECT
*These are not standalone sites — they power everything below.*

- **AI OS (7-Layer Skill System)** — powers every page design, every audit, every module. Lives at `C:\Projects\shared\lib\skills\` (not yet built — scheduled next session)
- **City Page Builder Agent** — `C:\Agents\city-page-builder\` — builds city pages for any project on demand

---

## 🔴 PINGCLOSE.COM
**Folder:** `C:\Projects\pingclose` | **Live:** pingclose.com | **Deploys:** Vercel (auto from GitHub)
**Purpose:** Free audit tool. Finds problems. Feeds leads into LocalSEOAEOPro. Never fixes anything.

### Security — FIXED 2026-06-16
- [x] ~~RLS disabled on `platform_config` table~~ **FIXED 2026-06-16 — table locked**
- [x] ~~RLS disabled on `email_verifications` table~~ **FIXED 2026-06-16 — table locked**
- [x] ~~Supabase `sb_secret_` key breaking database connection~~ **FIXED 2026-06-16 — `eyJ...` JWT key added to Vercel Production + Development**

### Infrastructure
- [ ] Confirm PAGESPEED_API_KEY is set in Vercel → Settings → Environment Variables → Production (currently returning zeros)
- [ ] Switch DNS on Namecheap from Netlify to Vercel — do AFTER PageSpeed confirmed working
- [ ] Add Sentry error monitoring — free tier 5k errors/month

### Bug Fixes
- [ ] Fix H1 typo on home page: "Want the Fastest Websiteon Your Block?" — missing space between "Website" and "on"

### PingClose Local Network — City Pages
*City pages live under pingclose.com/[city]-[state] — NOT a separate domain*
- [ ] Design city page template — same stack, same design standards
- [ ] Build first city page: pingclose.com/st-louis-mo
- [ ] Build city page generator — input city/state, output full landing page + FAQ + pricing
- [ ] Identify top 10 cities to target first

### Report Enhancements
- [ ] Wire real keyword visibility data into report section (currently placeholder)
- [ ] Add "Fix My Site" CTA to report — forwards full audit to LocalSEOAEOPro with real calculated price based on page count

### Future Features
- [ ] Soft IP flagging — 3+ domains from same IP = Agency Signal
- [ ] Phone number extraction from site — check if cell phone
- [ ] Address extraction — check if residential/PO Box
- [ ] NAP consistency check against Google Business Profile

---

## 🔴 LOCALSEOAEOPRO.COM
**Folder:** `C:\Projects\localseoaeopro` | **Live:** localseoaeopro.com | **Deploys:** Vercel (auto from GitHub)
**Purpose:** The engine. AI-powered Local SEO + AEO platform. Fixes everything PingClose finds.

### Security — FIXED 2026-06-16
- [x] ~~RLS disabled on `platform_config` table~~ **FIXED 2026-06-16 — table locked**
- [x] ~~RLS disabled on `email_verifications` table~~ **FIXED 2026-06-16 — table locked**
- [x] ~~Supabase `sb_secret_` key breaking database connection~~ **FIXED 2026-06-16 — `eyJ...` JWT key added to Vercel Production + Development**

### Infrastructure
- [x] ~~Confirm DataForSEO login email~~ **RESOLVED: james.fogal@citywidealarms.com — confirmed working 2026-06-16**
- [ ] Activate BrightLocal API key — 14-day trial active, API key pending
- [ ] Add Sentry error monitoring — free tier 5k errors/month

### AI OS Manifest Fixes (authorityResearch.manifest.ts)
- [ ] Add `layer: 2` — places skill correctly in 7-layer AI OS architecture
- [ ] Add `confidenceThreshold: 0.70` — enables "passed with warning" at 70%
- [ ] Change `timeoutMs` from 60000 → 90000 — correct timeout for DataForSEO + BrightLocal calls

### Fake Data Modules — Fix Before Showing Any Client
| Module | Fix Needed | Data Source |
|--------|-----------|-------------|
| RankTracker.jsx | Replace Claude-invented rankings | DataForSEO ✅ connected |
| PageSpeedIntelligence.jsx | Replace Claude-invented scores | Google PageSpeed API ✅ same key as PingClose |
| KeywordIntelligence.jsx | Replace Claude-invented volumes | DataForSEO ✅ connected |
| CompetitorIntelligence.jsx | Replace Claude-hallucinated data | DataForSEO ✅ connected |
| BacklinkFinder.jsx | Replace Claude-invented backlinks | DataForSEO ✅ connected |
| HostingIntelligence.jsx | Remove fabricated benchmarks | Ready to fix now |
| MultiPlatformReviewMonitor.jsx | Replace Claude-fabricated reviews | Google My Business API — needs discussion |
| SocialPresenceScanner.jsx | Claude guesses social presence — not real | Needs design decision |
| NAPConsistencyChecker.jsx | Claude guesses NAP issues — not real | BrightLocal API — key pending |

### Register Orphaned Modules (exist on disk — invisible in dashboard)
- [ ] Add `SocialPresenceScanner` to registry.js
- [ ] Add `NAPConsistencyChecker` to registry.js
- [ ] Add `SSLCertificateMonitor` to registry.js
- [ ] Add `TechStackIdentifier` to registry.js
- [ ] Add `TrackingPixelDetector` to registry.js
- [ ] Add `RedirectChainDetector` to registry.js
- [ ] Add `ProspectQualificationScorer` to registry.js
- [ ] Add `RedditVisibilityScanner` to registry.js
- [ ] Add new "Intelligence Agents" nav group to registry.js

### AI OS — Shared Library (Next Session)
- [ ] Create `C:\Projects\shared\lib\skills\` — move AI OS out of LocalSEOAEOPro so all projects can import it
- [ ] Update LocalSEOAEOPro imports to use shared library
- [ ] Update PingClose imports to use shared library

### AI OS — Phase 2 (First Real Skills)
- [ ] Build Data Source Gateway — unified wrapper for DataForSEO + BrightLocal
- [ ] Build Authority Research Skill — uses manifest already built
- [ ] Build SEO Auditor Skill — port PingClose agents into AI OS format
- [ ] Build Executive Dashboard — fake data first, real data wires in as skills are built

### AI OS — Phase 3 (Money Engine)
- [ ] Build Knowledge Center Skill — 100 Q&A pages per client with FAQPage schema + Speakable schema + HeyGen video + ElevenLabs audio
- [ ] Build Schema Builder — FAQPage, PriceSpecification, LocalBusiness, Speakable
- [ ] Build Media Generator — HeyGen + ElevenLabs integration
- [ ] Build Publisher — deploys generated pages to client site

### AI OS — Phase 4 (Automation + Defense)
- [ ] Build GBP Skill — Google Business Profile optimizer
- [ ] Build Citation Manager Skill — BrightLocal, auto-submits to 50+ directories
- [ ] Build Competitor Intelligence Skill — monitors competitors, triggers content
- [ ] Build Notification/Alert Skill — immediate failure alerts
- [ ] Build Client Report Generator — monthly deliverable
- [ ] Build Rollback Controller — deployment fingerprint + revert capability
- [ ] Build Master Orchestrator — built LAST after all skills working

### New Modules to Build
- [ ] PhoneNumberValidator — detects cell phones vs business lines, checks GBP
- [ ] AddressValidator — detects residential/PO Box, flags Google Maps issues
- [ ] ConversionTrackingInstaller — installs GA4 + Facebook Pixel + TikTok Pixel
- [ ] PingCloseLocalCityPageGenerator — city landing page + FAQ + pricing for pingclose.com/[city]-[state]

### Platform Features
- [ ] Stripe integration — 4 checkout flows: Fix Package ($495), Monthly Managed ($299/mo), White Label ($199), Full Engagement ($7,000)
- [ ] Partner portal + white label system — registration, dashboard, billing
- [ ] Monthly Intelligence Report module — keyword movement, citation fixes, GBP updates, pages built
- [ ] Content Store + page ordering system
- [ ] Page Count Crawler + tiered pricing calculator

---

## 🟡 CITYWIDEALARMS.COM
**Site:** citywidealarms.com (WordPress) | **Owner:** Jim Fogal | **Market:** St. Louis, MO
**Purpose:** Jim's alarm company. First case study client. Proves the system before selling it.

### BLOCKED — Must Resolve Before Anything Goes Live
- [ ] Get real CityWide business phone number — (314) 517-2533 is Jim's personal cell, NOT the business line
- [ ] Get real business address — required for LocalBusiness schema, Google Maps, NAP consistency
- [ ] Confirm real pricing numbers — all prices are placeholders until confirmed

### SEO & Content (after blockers resolved — in this order)
- [ ] Week 1: Home Security St. Louis MO landing page — /home-security-st-louis-mo ($156.96 CPC keyword)
- [ ] Week 2: Master FAQ hub + Alarm Takeover section + 6 question pages (highest conversion intent)
- [ ] Week 3: Residential Pricing section + 3 question pages
- [ ] Week 4: Commercial Pricing + Water Leak Detection sections
- [ ] Ongoing: 2 new question pages per week
- [ ] Pricing Hub — publish real prices (competitors hide theirs — this is the moat)
- [ ] Water Leak Detection hub — standalone section, different buyer, different search terms
- [ ] 5 city pages: O'Fallon, St. Charles, Wentzville, Lake St. Louis, Chesterfield

### Technical (WordPress)
- [ ] Speed optimization — currently Mobile 64, Desktop 91 (27 point gap)
- [ ] Fix LCP: 7.5 seconds on mobile (catastrophic)
- [ ] Disable Cloudflare Rocket Loader — adding 58ms, backfiring
- [ ] Remove unused JS: 111KB wasted (750ms savings)
- [ ] Remove unused CSS: 38KB wasted (150ms savings)
- [ ] Add browser caching: 28KB re-downloaded every visit
- [ ] Convert images to WebP

### LocalSEOAEOPro Full Engagement ($7,000 + $299/mo)
- [ ] BLOCKED: Get real phone, address, pricing first
- [ ] Fix Package ($495) — speed, images, H1/title/meta, schema, Core Web Vitals
- [ ] Knowledge Center — 100 Q&A pages with schema + video + audio
- [ ] City Pages — 50 location pages
- [ ] Authority Pricing Page — PriceSpecification schema
- [ ] Citations audit + fix (BrightLocal)
- [ ] GBP optimization

---

## 🟡 NETWORKINATORS.COM
**Folder:** `C:\Networkinators\app` | **Live:** networkinators.netlify.app | **Deploys:** Netlify Pro
**Purpose:** Professional networking group. Fridays 8:30am. Members are called Networkinators.

### Verify Current State
- [ ] Confirm Netlify deploy completed at networkinators.netlify.app
- [ ] Run responsive tests: `node C:\Networkinators\app\responsive-test.js`
- [ ] Review screenshots in `C:\Networkinators\screenshots\`

### Infrastructure
- [ ] DNS cutover — point Networkinators.com from Hosting.com to Netlify
- [ ] GoDaddy email forwarding: jim@, linda@, info@, admin@networkinators.com

### Features to Build (approval required before each)
- [ ] Wire visitor registration form to Supabase visitors table
- [ ] Send calendar invite (.ics) on visitor registration
- [ ] Send Golden Geese Guide PDF on registration
- [ ] QR code signup system — tracks which Networkinator referred the visitor
- [ ] Live Visitor Board — auto-refreshing screen for Friday meetings
- [ ] Member auth (Supabase) — roles: super_admin, master_admin, leader, networkinator, visitor
- [ ] Member billing — GoDaddy Payments, $30/month dues
- [ ] Member directory
- [ ] Meeting hub — agenda, RSVP, Zoom link, archive
- [ ] Referral board — post/claim/leaderboard
- [ ] Resources + community — library, pitches, spotlights, shoutouts
- [ ] Golden Goose launchpad page + waitlist

---

## 🟡 STLPAYPRO.COM
**Folder:** `C:\Projects\stlpaypro` | **Owner:** Mark Buckman (client) | **Status:** NOT launched — noindex ON
**Performance:** 0.218 second load time — must be protected at all costs

### BLOCKED — Mark Buckman Must Provide
- [ ] Phone number for St. Louis location
- [ ] Phone number for St. Charles location
- [ ] Address for St. Louis location
- [ ] Address for St. Charles location
- [ ] 13 Midjourney WebP images
- [ ] Real portrait photo (no AI face for named individual)
- [ ] Email address for contact forms

### Build Tasks (after Mark provides info)
- [ ] Convert single index.html to proper Next.js multi-page structure (~4 hours)
- [ ] Build /qa page with proper FAQ schema
- [ ] Build /pricing page
- [ ] Build /services page
- [ ] Build /cities page
- [ ] Build /st-louis-mo location page with LocalBusiness schema
- [ ] Build /st-charles-mo location page with LocalBusiness schema
- [ ] Remove noindex when ready to launch
- [ ] Confirm GTmetrix still under 1 second after conversion (currently 0.218s — protect this)

---

## 🔵 ALARMINSPECT.COM
**Domain:** AlarmInspect.com ✅ owned | **Folder:** TBD | **Status:** Planned — build after PingClose + LocalSEOAEOPro complete
**Purpose:** Photo-based alarm inspection. 3 verdicts: Works / Might Work / Does Not Work.

### Landing Page (Build First)
- [ ] Build coming soon landing page — Next.js, Vercel, Supabase, Tailwind
- [ ] CSS Sherlock Holmes hero — deerstalker hat, magnifying glass, alarm panel — NO image file above fold
- [ ] Email capture form — "Get notified when we launch" — store in Supabase
- [ ] 3 verdict cards — ✅ Works / ⚠️ Might Work / ❌ Does Not Work
- [ ] "What we inspect" section — all alarm panels + fire panels
- [ ] Fire panel assessment callout — model ID, install year, code compliance
- [ ] Single channel security warning section
- [ ] CityWide Alarms footer tie-in

### App (After Landing Page)
- [ ] Claude Vision API integration — photo upload → 3-state verdict
- [ ] Alarm panel identification — Honeywell, 2Gig, Qolsys, all brands
- [ ] Fire panel assessment — model identification, install year, compliance check
- [ ] Single-channel communicator detection + warning
- [ ] PDF report export
- [ ] Business model: Free (X inspections/month) → Pro (unlimited + PDF) → Enterprise (multi-property, team accounts)

---

## 🔵 GOLDEN GOOSE PLATFORM
**Folder:** `C:\GoldenGoose` | **Status:** BLOCKED — do not build until Networkinators is launched
**Purpose:** Networking reputation engine. 90k directory. GTD tracking. Referral scoring.

- [ ] BLOCKED until Networkinators.com is fully launched
- [ ] Design referral scoring system
- [ ] Build 90k business directory
- [ ] Build GTD tracking system
- [ ] Build reputation scoring
- [ ] Wire into Networkinators as the backend engine

---

## 🔵 BNI REPORT GENERATOR
**Folder:** `C:\BNI\ReportGenerator` | **Status:** Built as Claude Artifact — needs saving locally
**Purpose:** 10 AI-powered report agents for Jim's BNI Navigators chapter leadership role.

- [ ] Save HTML from claude.ai artifact to `C:\BNI\ReportGenerator\bni-report-agents.html`
- [ ] Test all 10 agents locally (Attendance, Referrals, TYFCB, Visitors, 1-2-1, CEU, Roster, New Members, Chapter Health, Renewals)
- [ ] Deploy to Vercel or Netlify for Saturday morning Green/Yellow/Black status notifications

---

## 🔵 PROJECT_MEMORY — Permanent Record System
**Folder:** `C:\Projects\PROJECT_MEMORY\`
**Purpose:** Permanent decision history that survives every session and every Claude path switch.

- [ ] Commit PROJECT_MEMORY folder to GitHub
- [ ] Add PROJECT_MEMORY to each project's .gitignore exclusion list (so it doesn't get overwritten)
- [ ] Add per-project memory file inside each project repo: `PROJECT_MEMORY.md`
- [ ] Add rule to CLAUDE.md: read `C:\Projects\TODO.md` and `C:\Projects\PROJECT_MEMORY\RECOVERY_PROMPT.md` at the start of every session
- [ ] Update WHY_WE_BUILT_IT_THIS_WAY.md to state at the very top: AI OS runs on every page of every project — no exceptions
