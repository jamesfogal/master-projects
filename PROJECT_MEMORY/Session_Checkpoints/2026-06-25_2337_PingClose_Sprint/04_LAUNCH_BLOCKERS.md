# Current Launch Blockers

## Resolved this session (no longer blockers)
- ~~Vercel account lockout~~ — Jim regained access
- ~~DNS still on Netlify~~ — cut over to Vercel, confirmed live via curl
- ~~Supabase SUPABASE_SERVICE_ROLE_KEY BOM corruption~~ — fixed, proven live (real DB insert + email delivery)
- ~~RESEND_FROM_EMAIL BOM corruption~~ — fixed via CLI, proven live
- ~~PageSpeed silent hang / FUNCTION_INVOCATION_TIMEOUT~~ — fixed (50s AbortController timeout + graceful fallback)
- ~~PingClose aborts entire audit when PageSpeed fails~~ — fixed (Task 4 fallback), proven live against a genuine timeout
- ~~Twilio/SMS dead code~~ — fully removed, confirmed via repo-wide grep
- ~~/api/report exposing email/phone/ip_address/notes/etc. to the public~~ — fixed, committed (`0f07bb8`), **not yet pushed/deployed**
- ~~/api/admin/login had no rate limiting~~ — fixed, committed (`0f07bb8`), **not yet pushed/deployed**

## Open Blockers

### 1. Commit `0f07bb8` is not pushed to GitHub / not deployed
- **Evidence:** `git log origin/main..main` would show this commit ahead of origin; live production is still serving `d58a50c`.
- **Priority:** High — the two fixes in this commit (PII leak, admin brute-force) are real security issues that remain live in production until pushed and deployed.
- **Effort:** ~2 minutes (push + wait for Vercel build) once Jim approves the push.

### 2. Pre-existing lint debt (not touched this sprint, scope explicitly excluded)
- **Evidence:** `npx eslint app lib` — 7 errors, 9 warnings in `HomeClient.tsx`, `admin/page.tsx`, `check/page.tsx`, `FaqClient.tsx`, `pricing/page.tsx`, `report/[id]/page.tsx`, `lib/agents/htmlAgent.ts`, `lib/email.ts`. Mostly `max-lines` (200-line rule violations) and a few real `react/no-unescaped-entities` / `no-html-link-for-pages` errors.
- **Priority:** Medium — doesn't block functionality, but violates the project's own size/quality rules.
- **Effort:** Est. 2-3 hours to split oversized files and fix the handful of real lint errors.

### 3. Task 5 — Email verification redesign (design only, not implemented)
- **Goal discussed:** User enters website → audit starts immediately → while audit runs, collect + verify email (mandatory, not skippable) → show a countdown timer → user receives report after verification completes. Two benefits: kills dead-email submissions, and the verification wait absorbs PageSpeed's latency.
- **Status:** Conceptually agreed with Jim, **no code written**, no architecture doc produced yet (was about to be requested when sprint redirected to Task 1-4/6/7).
- **Priority:** Medium — UX/conversion improvement, not a correctness bug.
- **Effort:** Est. 3-4 hours (new verification-gating flow + countdown UI + backend changes to decouple "audit starts" from "email known").

### 4. RESEND key ambiguity (flagged June 22, never resolved)
- **Evidence:** `JUNE22_NOTES.md` mentions "resolve Resend key ambiguity" as a Phase 2 item — there's both a `RESEND_API_KEY` Vercel env var and a `resend_api_key` row in the `platform_config` Supabase table (`lib/email.ts` checks the DB value first, falls back to env var). Never confirmed which one is actually in use or whether they match.
- **Priority:** Low-medium — email delivery is confirmed working tonight, so whichever key is active works, but the duplication is confusing and should be resolved to one source of truth.
- **Effort:** ~15 minutes to check both values are the same key in Supabase, and document or remove the redundant path.

### 5. Full database architecture review (explicitly deferred, see 03_ARCHITECTURE_DECISIONS.md)
- **Priority:** Low — explicitly scheduled for after launch, not before.
- **Effort:** Not yet scoped.

### 6. `/api/setup` and `/api/setup/test` routes never reviewed
- **Evidence:** Listed in build output, never read or audited this session.
- **Priority:** Unknown — not yet investigated.
- **Effort:** Unknown.
