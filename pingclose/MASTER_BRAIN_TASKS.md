# MASTER_BRAIN_TASKS — PingClose
## Permanent Task Tracker

=================================================
CRITICAL TIMESTAMP RULES
=================================================

1. Everything must be date and timestamped.
2. Use ISO format: YYYY-MM-DD HH:MM:SS UTC
3. Every task gets Created, Updated, and Status date/time.
4. Never add undated entries.

---

## PROJECT STATUS

Last Updated:      2026-07-04 00:00:00 UTC
Revenue Status:
Estimated Hours To Revenue:
Estimated Hours To MVP:
Estimated Hours To Stable Production:
Probability Of Success:
Next Revenue Task:
Biggest Risk:

---

## OPEN

Task ID:          PC-TASK-003
Created:          2026-07-04 00:00:00 UTC
Updated:          2026-07-04 00:00:00 UTC
Status:           OPEN
Status Date:      2026-07-04 00:00:00 UTC
Priority:         HIGH
Project:          PingClose
Description:      Remove VIP_EMAILS hardcoded list from send-code/route.ts. Rely solely on email_verifications DB table. Jim's emails already exist as verified in the DB.
Reason:           Jim cannot test the real email flow from his own machine. He has never seen the verification screen. Cannot catch broken email delivery.
Dependencies:     PC-TASK-001 must be resolved first (Resend key fixed)
Decision Date:    2026-07-03
Resolution Date:

---

Task ID:          PC-TASK-004
Created:          2026-07-04 00:00:00 UTC
Updated:          2026-07-04 00:00:00 UTC
Status:           OPEN
Status Date:      2026-07-04 00:00:00 UTC
Priority:         MEDIUM
Project:          PingClose
Description:      Fix email timing — email sends before PageSpeed completes, so customer receives link to incomplete report.
Reason:           Customer experience issue — report is incomplete when they first receive it.
Dependencies:     None
Decision Date:    Prior session
Resolution Date:

---

## IN PROGRESS

(none)

---

## BLOCKED

Task ID:          PC-TASK-001
Created:          2026-07-03 22:43:00 UTC
Updated:          2026-07-04 00:00:00 UTC
Status:           BLOCKED
Status Date:      2026-07-04 00:00:00 UTC
Priority:         CRITICAL
Project:          PingClose
Description:      Fix RESEND_API_KEY BOM. Delete and repaste RESEND_API_KEY in Vercel Settings → Environment Variables → pingclose project. Copy key directly from resend.com — not from Notes, email, or any other app.
Reason:           BOM (U+FEFF) at character index 7 causes ByteString conversion error. All /api/send-code calls return 500. All new visitor email verification broken since deployment dpl_EiKHaD9tMRxmoNVmFcX3EbG7WVZ9.
Dependencies:     Requires Jim to access Vercel dashboard manually. Cannot be fixed in code.
Decision Date:    2026-07-03
Resolution Date:

Task ID:          PC-TASK-002
Created:          2026-07-04 00:00:00 UTC
Updated:          2026-07-04 00:00:00 UTC
Status:           BLOCKED
Status Date:      2026-07-04 00:00:00 UTC
Priority:         HIGH
Project:          PingClose
Description:      Build lib/agents/healthAgent — env var validator, Resend connectivity, Supabase connectivity, Google API key validator. Add /api/health endpoint. Add Vercel cron every 15 minutes.
Reason:           No system watches whether PingClose itself is functioning. Every failure discovered by real users.
Dependencies:     PC-TASK-001 must be resolved first. SuperAgent architecture review with ChatGPT pending.
Decision Date:    2026-07-03
Resolution Date:

---

## DEFERRED

Task ID:          PC-TASK-007
Created:          2026-07-04 00:00:00 UTC
Updated:          2026-07-04 00:00:00 UTC
Status:           DEFERRED
Status Date:      2026-07-04 00:00:00 UTC
Priority:         HIGH
Project:          PingClose
Description:      Self-Healing Agent Architecture. Break PingClose into contained agents over time. Each fragile external service (Resend, Supabase, Google PageSpeed, Vercel env vars) lives inside its own agent. Build a Repair Agent / Self-Healing Agent that can diagnose failures, safely retry or repair known issues, and escalate anything requiring Jim approval.
Reason:           Do not implement today. Deferred until Sunday 2026-07-06. Next session: review all open PingClose tasks and knock them out one at a time, starting with highest business-impact issue.
Dependencies:     ChatGPT architecture review (PC-TASK-005). Resend key fix (PC-TASK-001).
Decision Date:    2026-07-04 00:00:00 UTC
Resolution Date:

Task ID:          PC-TASK-005
Created:          2026-07-04 00:00:00 UTC
Updated:          2026-07-04 00:00:00 UTC
Status:           DEFERRED
Status Date:      2026-07-04 00:00:00 UTC
Priority:         HIGH
Project:          PingClose
Description:      SuperAgent architecture — design and build a master health agent that orchestrates sub-agents watching all infrastructure. Includes scheduled monitoring, alerting, and self-healing where possible.
Reason:           Jim is consulting ChatGPT on the correct architecture before implementation. Do not build until architecture is agreed upon.
Dependencies:     ChatGPT architecture review
Decision Date:    2026-07-03
Resolution Date:

Task ID:          PC-TASK-006
Created:          2026-07-04 00:00:00 UTC
Updated:          2026-07-04 00:00:00 UTC
Status:           DEFERRED
Status Date:      2026-07-04 00:00:00 UTC
Priority:         LOW
Project:          PingClose
Description:      Preflight diagnostic system — lib/agents/pagespeedAgent/preflightCheck.ts written locally, not committed. 11 DB columns exist inert.
Reason:           PAUSED — do not touch without explicit approval from Jim.
Dependencies:     Explicit approval required
Decision Date:    Prior session
Resolution Date:

---

## COMPLETED

Task ID:          PC-TASK-C001
Created:          2026-07-03 (estimated)
Updated:          2026-07-03
Status:           COMPLETED
Status Date:      2026-07-03
Priority:         HIGH
Project:          PingClose
Description:      Fix check page blinking — after PageSpeed completes, page kept blinking forever.
Reason:           No mechanism to detect PageSpeed completion in the browser.
Dependencies:     None
Decision Date:    2026-07-03
Resolution Date:  2026-07-03
Commit:           5b49c0a

Task ID:          PC-TASK-C002
Created:          2026-07-03 (estimated)
Updated:          2026-07-03
Status:           COMPLETED
Status Date:      2026-07-03
Priority:         CRITICAL
Project:          PingClose
Description:      Fix pagespeed-agent Vercel timeout — agent killed at 60s instead of 90s. Added export const maxDuration = 90. Unified vercel.json to 90s.
Reason:           vercel.json glob app/api/** at 60s overrode specific pagespeed-agent entry.
Dependencies:     None
Decision Date:    2026-07-03
Resolution Date:  2026-07-03
Commits:          b61e313, e825fdd

Task ID:          PC-TASK-C003
Created:          2026-07-03 (estimated)
Updated:          2026-07-03
Status:           COMPLETED
Status Date:      2026-07-03
Priority:         HIGH
Project:          PingClose
Description:      Add 90s hard stop to PageSpeed polling — polling ran forever when agent died without updating DB.
Reason:           vitalelawstl.com polled for 30+ minutes with no timeout.
Dependencies:     None
Decision Date:    2026-07-03
Resolution Date:  2026-07-03
Commit:           ed18a07

Task ID:          PC-TASK-C004
Created:          2026-07-03 (estimated)
Updated:          2026-07-03
Status:           COMPLETED
Status Date:      2026-07-03
Priority:         MEDIUM
Project:          PingClose
Description:      Redesign report page — Emil Kowalski / Linear / Vercel aesthetic. Two-column layouts, section dividers, Card variants by severity.
Reason:           Jim: "Its way too boxy and all in one column"
Dependencies:     None
Decision Date:    2026-07-03
Resolution Date:  2026-07-03
Commit:           35459df

Task ID:          PC-TASK-C005
Created:          2026-07-04 00:00:00 UTC
Updated:          2026-07-04 00:00:00 UTC
Status:           COMPLETED
Status Date:      2026-07-04 00:00:00 UTC
Priority:         HIGH
Project:          PingClose (and all projects)
Description:      Create Master Brain system — MASTER_BRAIN.md, MASTER_BRAIN_SUMMARY.md, MASTER_BRAIN_TASKS.md for all 7 projects. Create folders for AuthoritySystems, Sloopzap, GoldenGoose.
Reason:           Jim: "The MASTER_BRAIN files are now the permanent source of truth, not chat history."
Dependencies:     None
Decision Date:    2026-07-03
Resolution Date:  2026-07-04 00:00:00 UTC
