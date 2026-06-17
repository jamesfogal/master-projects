# DECISION LOG
## Every Major Decision, By Date

*Rule: Never delete entries. Add new ones at the top.*

---

## 2026-06-17

### Decision: AI OS Powers Every Page on Every Project
- **What:** The AI OS Skill Manifest system is not just for content generation. It is the backbone of every page design, every audit, every module across all projects.
- **Why:** Consistency, health monitoring, confidence scoring, and validation gates should apply to everything we build — not just LocalSEOAEOPro content pipelines.
- **Implication:** Move AI OS to `C:\Projects\shared\lib\skills\` so all projects can import from it.
- **Status:** Decision made. Implementation scheduled for next session.

### Decision: Shared Library Architecture
- **What:** All shared code (AI OS, agents, utilities) lives at `C:\Projects\shared\` and is imported by every project.
- **Why:** One fix upgrades all projects. No code duplication. No diverging implementations.
- **Status:** Not yet built. Next session.

### Decision: Master TODO at C:\Projects\TODO.md
- **What:** Single master TODO file covering all projects. Never deleted. Completed items get strikethroughs only.
- **Why:** Previous session notes were lost when Claude opened under a different project path. A file committed to git survives everything.
- **Status:** Created 2026-06-16 evening.

### Decision: PROJECT_MEMORY Folder
- **What:** `C:\Projects\PROJECT_MEMORY\` holds permanent decision history, session transcripts, and recovery prompts.
- **Why:** Claude's memory system can fail when sessions open under different project paths. File-based memory in a known location survives.
- **Status:** Created 2026-06-17.

---

## 2026-06-16

### Decision: Supabase Service Role Key Format
- **What:** Replace `sb_secret_` format key with legacy `eyJ...` JWT service role key.
- **Why:** supabase-js v2.107.0 is incompatible with the new `sb_secret_` key format. Database saves were silently failing.
- **Result:** Fixed. New key added to Vercel (Production + Development) for both PingClose and LocalSEOAEOPro. Local `.env.local` updated.
- **Confirmed working:** Live audit data returned from Supabase after fix.

### Decision: Enable RLS on platform_config and email_verifications
- **What:** ALTER TABLE public.platform_config ENABLE ROW LEVEL SECURITY; ALTER TABLE public.email_verifications ENABLE ROW LEVEL SECURITY;
- **Why:** Both tables were publicly readable. platform_config held the Resend API key. email_verifications held live verification codes. Critical security vulnerability.
- **Result:** Fixed 2026-06-16. Supabase Advisor confirmed 2 critical issues resolved.

### Decision: DataForSEO Confirmed as Primary Data Source
- **What:** DataForSEO (james.fogal@citywidealarms.com) confirmed connected and working.
- **Why:** 5 fake-data modules (RankTracker, KeywordIntelligence, CompetitorIntelligence, BacklinkFinder, PageSpeedIntelligence) need real data. DataForSEO unblocks 4 of them.
- **Status:** API confirmed working. Modules still need to be wired up.

### Decision: AI OS Phase 1 Complete
- **What:** skillManifest.ts, skillExecutionReport.ts, healthReporter.ts, authorityResearch.manifest.ts, skill_executions Supabase table.
- **Why:** Foundation must exist before skills can be built.
- **Status:** Done. Phase 2 starts next session.

### Decision: Service Package Pricing Locked
- **What:** $495 fix (loss leader) → $3,500 Knowledge Center → $2,500 City Pages → $500 Pricing Page = $7,000 full engagement + $299/month.
- **Why:** Positions us dramatically below agency rates ($15,000–$30,000 for equivalent work) while still generating strong revenue. 10 clients = $70,000 upfront + $2,990/month recurring.

---

## 2026-06-15

### Decision: Load Time Hero Replaces Score Rings
- **What:** Score rings (0-100) replaced with milestone timeline: TTFB → FCP → LCP. Headline shows actual load time ("Your site took 4.2s to load").
- **Why:** Score rings are misleading — they penalize things we can't measure and give false comfort. A timeline showing actual milliseconds is honest and more alarming.
- **Commit:** fe444c0

### Decision: H1 Check Split Into Two Rows
- **What:** Single H1 row split into "H1 Present" (yes/no) and "H1 Content" (what it says).
- **Why:** Knowing an H1 exists is different from knowing what it says. Two separate checks provide more useful diagnostic information.
- **Commit:** 6a0e9de

### Decision: Remove Pricing Mentions from H1 Content Checks
- **What:** H1 content check no longer flags pricing mentions as a problem.
- **Why:** Many legitimate businesses include prices in their H1. This was a false positive that confused prospects.
- **Commit:** 035175f

---

## 2026-06-14

### Decision: Move PingClose from Netlify to Vercel
- **What:** Deployed PingClose to Vercel. 60-second function timeout configured in vercel.json.
- **Why:** Netlify had a 26-second function timeout. PageSpeed API needs up to 45 seconds. Every audit was failing silently.
- **Status:** Complete. DNS not yet switched from Netlify — pending.

### Decision: All 5 Agents Get AGENT_FAIL Logging
- **What:** Every agent now logs `AGENT_FAIL: [AgentName]` on error with full error details.
- **Why:** Silent failures are the #1 debugging problem. If an agent fails and logs nothing, finding the bug is impossible.
- **Commit:** 6888517

### Decision: Supabase Insert Non-Fatal
- **What:** Audit returns results to user even if Supabase save fails. Logs SUPABASE_INSERT_ERROR.
- **Why:** A database failure should never block the user from seeing their audit results. Degrade gracefully.
- **Commit:** 5d046c5
