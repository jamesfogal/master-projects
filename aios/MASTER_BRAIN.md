# MASTER_BRAIN — AIOS
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
# DECISION RECORD AIOS-2026-07-05-D001
=================================================

Date:       2026-07-05 00:00:00 UTC
Topic:      Master Brain Daily Workflow
Status:     ACTIVE — effective immediately
Entered by: Jim Fogal

-------------------------------------------------
USER — EXACT TEXT
-------------------------------------------------

"MASTER BRAIN DAILY WORKFLOW

Claude's role:

1. During work, append raw project history to the correct project's MASTER_BRAIN.md.
2. Do not decide final priorities.
3. Do not create final task strategy.
4. Do not summarize away details.
5. Keep entries timestamped and project-specific.

At end of day, Claude must ensure each project worked on has updated:

- MASTER_BRAIN.md

Then ChatGPT + Codex will review that day's additions and update:

- MASTER_BRAIN_SUMMARY.md
- MASTER_BRAIN_TASKS.md

Important:
Claude records.
ChatGPT + Codex reviews, summarizes, and creates/updates tasks.
Jim approves direction.

Do not mix project histories.
Do not put PingClose work into AIOS unless it is a cross-project rule.
Do not put AIOS operating rules only inside PingClose."

-------------------------------------------------
RULE SUMMARY
-------------------------------------------------

Claude's responsibilities:
- Append raw history to the correct project's MASTER_BRAIN.md during work
- Keep entries timestamped and project-specific
- At end of day: confirm MASTER_BRAIN.md is updated for every project touched
- Do NOT decide final priorities
- Do NOT create final task strategy
- Do NOT summarize away details

ChatGPT + Codex responsibilities:
- Review each day's MASTER_BRAIN.md additions
- Update MASTER_BRAIN_SUMMARY.md
- Update MASTER_BRAIN_TASKS.md

Jim's responsibilities:
- Approve direction

Separation rules:
- Do not mix project histories
- PingClose work stays in PingClose MASTER_BRAIN.md
- AIOS operating rules stay in AIOS MASTER_BRAIN.md
- Cross-project rules go into AIOS only

=================================================
END DECISION RECORD AIOS-2026-07-05-D001
=================================================
<!--
=================================================
# SESSION
=================================================

Session ID:
Date:
Start Time:
End Time:
Project: AIOS
Participants:
Current Commit:
Current Deployment:

-------------------------------------------------
USER
-------------------------------------------------


-------------------------------------------------
CLAUDE
-------------------------------------------------


-------------------------------------------------
CHATGPT
-------------------------------------------------


-------------------------------------------------
RESULT
-------------------------------------------------


-------------------------------------------------
COMMITS
-------------------------------------------------


-------------------------------------------------
DEPLOYMENTS
-------------------------------------------------


-------------------------------------------------
DATABASE
-------------------------------------------------


-------------------------------------------------
LESSONS LEARNED
-------------------------------------------------

-->


=================================================
SESSION: MONSTER MIGRATION — KNOWLEDGE OBJECT ROUTING
Session ID: VIKTOR-2026-07-07-S001
Date: 2026-07-07 01:05:00 UTC
Executed by: Viktor (AI COO), authority granted by Jim Fogal 2026-07-06
Method: knowledge objects copied word-for-word from extraction files
(JUNE16 pilot + 2026-07-07 wave 2). Originals preserved and archived in
MONSTER_MASTER_BRAIN_ARCHIVE. Nothing deleted or reordered.
=================================================

### [2026-07-07 01:05:00 UTC] (from WHY_WE_BUILT_IT_THIS_WAY)
## KO-000048
Title: AI OS exists to prevent silent AI failures
Description: Every skill reports health to Supabase, has confidence scores and defined success/warning/failure conditions; nothing advances unless the previous gate passed; every failure logged with context.
Primary Project: AIOS
Secondary Projects: LocalSEOAEOPro (first host)
Source File: `WHY_WE_BUILT_IT_THIS_WAY.md:199-207`
Confidence: 99%
Status: MIGRATED 2026-07-07 — routed word-for-word into this MASTER_BRAIN (Session VIKTOR-2026-07-07-S001).

### [2026-07-07 01:05:00 UTC] (from WHY_WE_BUILT_IT_THIS_WAY)
## KO-000049
Title: The 7-layer AI OS structure and build order
Description: L1 Master Orchestrator (built LAST), L2 Production Skills, L3 Support Skills, L4 Health & Monitoring (SkillExecutionReport to Supabase), L5 Validation Gates (non-negotiable), L6 Deployment Controller (5 statuses; system decides, human approves), L7 Executive Dashboard (built FIRST with fake data to validate the vision before the engine).
Primary Project: AIOS
Source File: `WHY_WE_BUILT_IT_THIS_WAY.md:209-235`
Confidence: 99%
Status: MIGRATED 2026-07-07 — routed word-for-word into this MASTER_BRAIN (Session VIKTOR-2026-07-07-S001).

### [2026-07-07 01:05:00 UTC] (from WHY_WE_BUILT_IT_THIS_WAY)
## KO-000050
Title: SkillManifest contract — uniform interface for every skill
Description: skillId/name/version/layer/category, required+optional I/O, dependencies, success/warning/failure criteria, confidenceThreshold, retryPolicy, timeoutMs, blocksDeployment, requiresHumanReview, healthReportRequired, auditChecklist. Orchestrator only talks to conforming skills.
Primary Project: AIOS
Source File: `WHY_WE_BUILT_IT_THIS_WAY.md:237-250`
Confidence: 99%
Status: MIGRATED 2026-07-07 — routed word-for-word into this MASTER_BRAIN (Session VIKTOR-2026-07-07-S001).

### [2026-07-07 01:05:00 UTC] (from WHY_WE_BUILT_IT_THIS_WAY)
## KO-000051
Title: Three-type error classification — transient / recoverable / critical
Description: Transient → auto-retry w/ exponential backoff; Recoverable → attempt correction and rerun; Critical → stop pipeline, require human. Retrying critical errors rejected as wasteful/harmful.
Primary Project: AIOS
Source File: `WHY_WE_BUILT_IT_THIS_WAY.md:252-257`
Confidence: 99%
Status: MIGRATED 2026-07-07 — routed word-for-word into this MASTER_BRAIN (Session VIKTOR-2026-07-07-S001).

### [2026-07-07 01:05:00 UTC] (from WHY_WE_BUILT_IT_THIS_WAY)
## KO-000052
Title: Shared library architecture decision (2026-06-17) — AI OS moves to C:\Projects\shared\lib\skills\
Description: AI OS currently in localseoaeopro/lib/skills is wrong long-term; every project imports from shared; one fix upgrades all. AI OS powers EVERY page of EVERY project — the architecture, not optional. Status at freeze: not yet built.
Primary Project: AIOS
Secondary Projects: All projects
Shared Infrastructure: Shared library C:\Projects\shared\
Source File: `WHY_WE_BUILT_IT_THIS_WAY.md:259-268`
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
- Spelling normalized: project name corrected to "AIOS" throughout this file
  (previous text had the letters transposed)
  (incl. decision/task IDs, e.g. AIOS-2026-07-05-D001). Wording otherwise
  unchanged.
