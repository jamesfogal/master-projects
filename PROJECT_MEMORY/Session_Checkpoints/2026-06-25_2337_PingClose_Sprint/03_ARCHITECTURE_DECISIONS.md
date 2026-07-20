# Permanent Architecture Decisions

## 1. PingClose shares the `localseoaeopro` Supabase project — permanently

**Decision:** PingClose does NOT get its own Supabase project, ever. It continues using the existing project `localseoaeopro` (id `xvrhxtnhmnurvxitnijy`, `https://xvrhxtnhmnurvxitnijy.supabase.co`).

**Why chosen:** Jim's long-term architecture treats PingClose as the lead-generation front end for LocalSEOAEOPro, not an independent platform. PingClose writes audit/lead data; LocalSEOAEOPro consumes and expands it for paying customers. A separate database would break that pipeline.

**Alternatives rejected:**
- Separate Supabase project per app (rejected — would duplicate data and break the consume/expand pipeline LocalSEOAEOPro relies on).

**How it applies going forward:**
- New tables for either app must be named/scoped for clear separation (schema or naming convention) even though both live in one physical project.
- Design every new table with reuse across both apps in mind; avoid duplicating data.
- A full database architecture review + schema-improvement recommendations is explicitly queued for **after** current launch blockers clear — not done yet, do not do it early unless Jim asks.
- Known tables in this shared project as of this session: `pingclose_audits`, `email_verifications`, `platform_config`, `pingclose_admin_login_attempts` (PingClose); `skill_executions` (LocalSEOAEOPro AI OS). This list will grow — confirm against live `list_tables` before assuming it's complete.

This decision is also saved as a persistent memory file: `feedback_step_by_step_only.md` and `project_shared_supabase_architecture.md` under the Claude Code memory directory for this project.

## 2. PageSpeed Agent built as a standalone, reusable module

**Decision:** Replaced the monolithic `lib/pagespeed.ts` with `lib/agents/pagespeedAgent/` (types, fetch, parse, fallback, orchestrator — each under 200 lines per project's file-size rule).

**Why chosen:** Explicitly requested to be reusable across PingClose, LocalSEOAEOPro, and AIOS. Also fixes a real bug: the old code had no timeout on the Google PageSpeed API calls, causing a silent `FUNCTION_INVOCATION_TIMEOUT` with zero log output.

**Alternatives rejected:**
- Patching the timeout in-place inside the old monolithic file — rejected because the file was already doing too much (violates the project's "max 200 lines, max 2 external API calls per file" rule) and isn't reusable by other apps.

## 3. Audit reliability — degrade gracefully, never abort

**Decision:** When PageSpeed fails or times out, the audit request still returns `200 success:true` with a tagged `pageSpeedStatus: 'TIMEOUT'|'ERROR'` and zeroed PageSpeed fields, instead of aborting the entire request with a 500.

**Why chosen:** The other 4 agents (HTML, hosting, availability, sitemap) usually succeed in seconds; throwing away their results because Google's API was slow wastes a real lead and a real DB row. Proven live against `www.cnn.com` (genuine 50s timeout) — DB insert and email delivery both succeeded despite the PageSpeed failure.

**Alternatives rejected:**
- Retrying PageSpeed automatically on timeout — rejected for this sprint as scope creep; not requested, would add latency.

## 4. Secrets handling protocol

**Decision:** Secrets (API keys, service role keys) are never typed into this chat, never read by this assistant from a saved file, and are copied directly between the source dashboard (e.g. Supabase) and the destination (Vercel) with no intermediate application (e.g. Notepad) in between.

**Why chosen:** The entire session's core bug (Supabase BOM corruption) was very likely caused by exactly this kind of intermediate-app copy/paste. Also a general security principle — secrets in a chat transcript or AI tool log are a permanent exposure risk.

**Exception carved out:** Plain non-secret config strings (e.g. `RESEND_FROM_EMAIL = jim@pingclose.com`) are not credentials and can be set directly by the assistant via Vercel CLI, since there's no actual secret value being relayed.
