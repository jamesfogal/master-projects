# MASTER_BRAIN — Shared Operations
## Permanent Chronological Memory for Cross-Project Systems & Policies

Created: 2026-07-07 01:05:00 UTC by Viktor (AI COO)
Why this file exists: the JUNE16 pilot left an unresolved question — where do
knowledge objects live that belong to no single project? Decision (VIKTOR-2026-07-07-S001):
Shared Operations knowledge is routed here, inside PROJECT_MEMORY, the
permanent multi-project record. Same rules as every MASTER_BRAIN:
ISO timestamps, word-for-word, append-only, never delete or reorder.


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
## KO-000001
Title: Session notes became invisible when workspace path changed
Description: Notes stored under a user-path workspace were not visible when the next session started from `C:\Projects\pingclose`. This is a cross-project memory persistence failure, not a PingClose product issue.
Primary Project: Shared Operations
Secondary Projects: PingClose; LocalSEOAEOPro; CityWide Alarms
Shared Infrastructure: Session note persistence workflow
Source File: `C:\Projects\pingclose\JUNE16_NOTES.md:7-10`
Confidence: 99%
Status: MIGRATED 2026-07-07 — routed word-for-word into this MASTER_BRAIN (Session VIKTOR-2026-07-07-S001).

### [2026-07-07 01:05:00 UTC] (from JUNE16_NOTES pilot)
## KO-000002
Title: Session notes must live in the active project repo and be committed to git
Description: Future session notes should be updated at the end of each session, stored as Markdown inside the active repo, and committed so later sessions can recover context reliably.
Primary Project: Shared Operations
Secondary Projects: PingClose; LocalSEOAEOPro; CityWide Alarms
Shared Infrastructure: Repo-local Markdown memory policy; Git-based persistence
Source File: `C:\Projects\pingclose\JUNE16_NOTES.md:10,205-207`
Confidence: 99%
Status: MIGRATED 2026-07-07 — routed word-for-word into this MASTER_BRAIN (Session VIKTOR-2026-07-07-S001).

### [2026-07-07 01:05:00 UTC] (from WHY_WE_BUILT_IT_THIS_WAY)
## KO-000028
Title: Master vision — automate local SEO/AEO work agencies overcharge for
Description: Local businesses lose money because they cannot be found online; agencies charge $150/hr for automatable work. Build the system once, run for every client, deliver $15,000–$30,000 agency outcomes at $3,500.
Primary Project: Shared Operations (business strategy)
Secondary Projects: LocalSEOAEOPro; PingClose
Source File: `WHY_WE_BUILT_IT_THIS_WAY.md:10-19`
Confidence: 99%
Status: MIGRATED 2026-07-07 — routed word-for-word into this MASTER_BRAIN (Session VIKTOR-2026-07-07-S001).

### [2026-07-07 01:05:00 UTC] (from WHY_WE_BUILT_IT_THIS_WAY)
## KO-000029
Title: The network — every property feeds every other property
Description: PingClose (free audit, lead intake) → LocalSEOAEOPro (engine, revenue) → CityWide Alarms (first case study) → Networkinators (referral machine) → AlarmInspect (leads for CityWide) → STLPayPro (client project) → BNI Report Generator (internal tool). Deliberate ecosystem, not separate tools.
Primary Project: Shared Operations
Secondary Projects: All
Source File: `WHY_WE_BUILT_IT_THIS_WAY.md:21-37`
Confidence: 99%
Status: MIGRATED 2026-07-07 — routed word-for-word into this MASTER_BRAIN (Session VIKTOR-2026-07-07-S001).

### [2026-07-07 01:05:00 UTC] (from WHY_WE_BUILT_IT_THIS_WAY)
## KO-000035
Title: Single shared Supabase project for PingClose + LocalSEOAEOPro
Description: One project (xvrhxtnhmnurvxitnijy) shared: leads captured in PingClose visible immediately in LocalSEOAEOPro; no sync issues. Risk: schema change in one project can break the other — coordinate migrations. Reaffirmed permanent on 2026-06-25 ("PingClose never gets its own project").
Primary Project: Shared Operations
Secondary Projects: PingClose; LocalSEOAEOPro
Shared Infrastructure: Shared Supabase project xvrhxtnhmnurvxitnijy
Source File: `WHY_WE_BUILT_IT_THIS_WAY.md:76-82`
Confidence: 99%
Status: MIGRATED 2026-07-07 — routed word-for-word into this MASTER_BRAIN (Session VIKTOR-2026-07-07-S001).

### [2026-07-07 01:05:00 UTC] (from WHY_WE_BUILT_IT_THIS_WAY)
## KO-000038
Title: June 16 security fixes — RLS enabled, JWT service key restored
Description: platform_config and email_verifications had RLS disabled (Resend key and verification codes publicly readable) — fixed. `sb_secret_` key incompatible with supabase-js v2.107.0 — replaced with legacy `eyJ...` JWT service role key.
Primary Project: Shared Operations
Secondary Projects: PingClose; LocalSEOAEOPro
Shared Infrastructure: Shared Supabase project
Source File: `WHY_WE_BUILT_IT_THIS_WAY.md:111-117`
Confidence: 99%
Status: MIGRATED 2026-07-07 — routed word-for-word into this MASTER_BRAIN (Session VIKTOR-2026-07-07-S001).

### [2026-07-07 01:05:00 UTC] (from WHY_WE_BUILT_IT_THIS_WAY)
## KO-000047
Title: Strategy concealment + staged delivery policy
Description: Never reveal methods to clients — they buy outcomes. Deliver over 4 weeks even if the system finishes overnight (perceived value management). Applies to all client work.
Primary Project: Shared Operations (delivery policy)
Secondary Projects: LocalSEOAEOPro; CityWide Alarms
Shared Infrastructure: Delivery staging and strategy-concealment policy
Source File: `WHY_WE_BUILT_IT_THIS_WAY.md:190-195,358-369 (rule 8)`
Confidence: 99%
Status: MIGRATED 2026-07-07 — routed word-for-word into this MASTER_BRAIN (Session VIKTOR-2026-07-07-S001).

### [2026-07-07 01:05:00 UTC] (from WHY_WE_BUILT_IT_THIS_WAY)
## KO-000062
Title: Eight unresolved decisions as of 2026-06-17
Description: (1) shared library import mechanism; (2) BrightLocal cost after trial; (3) GMB API complexity for review monitoring; (4) CityWide real NAP data; (5) Orchestrator interface design-before-skills; (6) AI OS + page design integration mechanism; (7) STLPayPro data from Mark Buckman (8 items); (8) PingClose DNS switch. NOTE: #8 resolved 2026-06-25 (DNS cutover completed per Session_Checkpoints).
Primary Project: Shared Operations
Secondary Projects: AIOS; LocalSEOAEOPro; CityWide Alarms; STLPayPro; PingClose
Source File: `WHY_WE_BUILT_IT_THIS_WAY.md:338-356`
Confidence: 98%
Status: MIGRATED 2026-07-07 — routed word-for-word into this MASTER_BRAIN (Session VIKTOR-2026-07-07-S001). STALE-FLAG on item 8.

### [2026-07-07 01:05:00 UTC] (from WHY_WE_BUILT_IT_THIS_WAY)
## KO-000063
Title: Eleven never-violate rules
Description: Never ask Jim for API keys (find them); never build/deploy without approval + full diff; strikethrough not delete TODOs; no images above fold; no fonts <16px; PingClose finds only; never reveal strategy; never use Twilio; AI runs PowerShell itself; always load master TODO at session start. AMENDED 2026-06-28 (JUNE28_NOTES): approval requirement broadened to ALL actions, not just deploys. NOTE: Twilio was fully removed from PingClose code 2026-06-25.
Primary Project: Shared Operations (working agreement)
Secondary Projects: All
Source File: `WHY_WE_BUILT_IT_THIS_WAY.md:358-369`
Confidence: 99%
Status: MIGRATED 2026-07-07 — routed word-for-word into this MASTER_BRAIN (Session VIKTOR-2026-07-07-S001).

### [2026-07-07 01:05:00 UTC] (from JUNE22/JUNE25/JUNE28 session notes)
## KO-000064
Title: June 22 audit method — evidence-based Proven Working / Proven Broken / Not Tested
Description: Launch-readiness audit ran live HTTP tests, MCP-authenticated Vercel fetches, direct Supabase queries, and full source reads. Establishes the evidence-first audit standard for all projects.
Primary Project: Shared Operations (audit methodology)
Secondary Projects: PingClose
Source File: `pingclose\JUNE16... JUNE22_NOTES.md:5-9`
Confidence: 99%
Status: MIGRATED 2026-07-07 — routed word-for-word into this MASTER_BRAIN (Session VIKTOR-2026-07-07-S001).

### [2026-07-07 01:05:00 UTC] (from JUNE22/JUNE25/JUNE28 session notes)
## KO-000068
Title: Vercel account lockout episode and recovery
Description: June 22: Jim locked out of Vercel, all 2FA paths dead-ended (authenticator rejected, no recovery code, passkey failures). Resolved by June 25 session (access regained). Lesson: store recovery codes for critical accounts.
Primary Project: Shared Operations (account security)
Secondary Projects: PingClose
Source File: `pingclose\JUNE22_NOTES.md:49-63`; `01_SESSION_SUMMARY.md:8`
Confidence: 99%
Status: MIGRATED 2026-07-07 — routed word-for-word into this MASTER_BRAIN (Session VIKTOR-2026-07-07-S001).

### [2026-07-07 01:05:00 UTC] (from JUNE22/JUNE25/JUNE28 session notes)
## KO-000072
Title: Decision — PingClose permanently stays on the shared localseoaeopro Supabase project
Description: PingClose is the lead-gen front end, not an independent platform; splitting databases would break the pipeline. Architecture review deferred until after launch blockers clear.
Primary Project: Shared Operations
Secondary Projects: PingClose; LocalSEOAEOPro
Source File: `01_SESSION_SUMMARY.md:41`
Confidence: 99%
Status: MIGRATED 2026-07-07 — routed word-for-word into this MASTER_BRAIN (Session VIKTOR-2026-07-07-S001).

### [2026-07-07 01:05:00 UTC] (from JUNE22/JUNE25/JUNE28 session notes)
## KO-000073
Title: fogal.net email host migration resolved (June 25)
Description: Two server-migration emails diagnosed (s15096.usc1.stableserver.net / SuperCP); DNS confirmed already correct; jim@fogal.net mailbox working.
Primary Project: Shared Operations (personal/infra)
Source File: `01_SESSION_SUMMARY.md:6`
Confidence: 98%
Status: MIGRATED 2026-07-07 — routed word-for-word into this MASTER_BRAIN (Session VIKTOR-2026-07-07-S001).

### [2026-07-07 01:05:00 UTC] (from JUNE22/JUNE25/JUNE28 session notes)
## KO-000076
Title: June 28 working agreement — explicit approval before ANY action
Description: Jim broadened the approval rule: before any action (not just deploys), state exactly what will be done and get explicit approval. NOTE: partially superseded 2026-07-06 by Jim's Viktor Operating Authority (autonomous execution, approval only for deletions/spend/credentials/business decisions) — both records preserved; the 2026-07-06 charter governs Viktor.
Primary Project: Shared Operations (working agreement)
Source File: `CitywideAlarms\JUNE28_NOTES.md:60-62`
Confidence: 99%
Status: MIGRATED 2026-07-07 — routed word-for-word into this MASTER_BRAIN (Session VIKTOR-2026-07-07-S001).

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
