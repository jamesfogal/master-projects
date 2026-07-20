# Verification — Proof Gathered This Session

## DNS / Vercel Migration
- `nslookup -type=A pingclose.com` → `216.150.1.1` (Vercel) after Namecheap change
- `nslookup -type=CNAME www.pingclose.com` → `ff2461497a9df4a9.vercel-dns-017.com`
- Vercel Domains page: both `pingclose.com` and `www.pingclose.com` show blue checkmark "Valid Configuration"
- `curl -sIL https://pingclose.com` → `308 → https://www.pingclose.com/`, then `200 OK`, `Server: Vercel`

## Supabase Key Root Cause (full elimination chain — do not re-run, just reference)
- Error observed: `TypeError: Cannot convert argument to a ByteString because the character at index 0 has a value of 65279` (= U+FEFF, the UTF-8 BOM)
- Ruled out wrong project: same project id (`xvrhxtnhmnurvxitnijy`) used in both failing and succeeding requests, confirmed via matching `reportId` row in direct SQL query
- Ruled out wrong env var name: Vercel screenshot showed exactly one `SUPABASE_SERVICE_ROLE_KEY` row, matching `lib/supabase.ts:9` exactly
- Ruled out DB permissions: the failing requests never reached Postgres — error thrown inside `_Headers.set` (Node's own fetch/undici header-construction code) before any network call
- Ruled out app code bug: `lib/supabase.ts` does nothing but `createClient(url, key)`, no string manipulation
- Confirmed BOM: error's literal stated character code (65279) IS U+FEFF
- Controlled-variable proof: same code/project/table/RLS, only the key value changed (re-copied directly from Supabase, no intermediate editor) → behavior flipped from failing to succeeding
- Live proof after fix: `reportId: 12fb04ef-d096-4110-841a-e19d5a9f7c14` and later `3fdb5950-39e6-413d-bacb-0b76c1ae1710`, both confirmed via direct SQL query matching the row, plus log lines `DELIVERY OK [0]`, `DELIVERY OK [1]`

## RESEND_FROM_EMAIL Same Bug
- Same BOM signature spotted in logs: `from=﻿jim@pingclose.com` (invisible char before `jim`)
- Fixed via `vercel env rm` + `printf '%s' "jim@pingclose.com" | vercel env add RESEND_FROM_EMAIL production` (no newline, no editor)
- Verified clean after redeploy: `from=jim@pingclose.com` (no invisible char) in log line at `04:13:50`, deployment `dpl_EdCwfsnuKPFvSSvAQngAKtfcQwiD`

## PageSpeed Agent / Task 4 Fallback
- `npx tsc --noEmit` → 0 errors (run repeatedly through the session)
- `npx next build` → succeeds, all 20 routes compile, every time it was run
- Live OK path: `vitalelawstl.com` → `pageSpeedStatus:"OK"`, real scores (e.g. mobile 78, desktop 97)
- Live TIMEOUT path (genuine, not simulated): `www.cnn.com` → `pageSpeedStatus:"TIMEOUT"`, `success:true`, HTTP 200, `reportId: e32caf6b-7600-4e80-9b40-7f2d329461a0`
- DB insert proven for the TIMEOUT case: direct SQL confirmed row exists with `url: www.cnn.com`, `mobile_score: 0`, `cms: Custom/Unknown`, `hosting: Fastly` (other agents' data intact)
- Email delivery proven for the TIMEOUT case: same log block shows `EMAIL: sending...`, `DELIVERY OK [0]`, `DELIVERY OK [1]`

## Twilio/SMS Removal
- `grep -ri "twilio|sms|deliverySms" --exclude="*.md"` across entire repo → 0 matches

## /api/report and Admin Rate Limiting (commit 0f07bb8 — NOT YET DEPLOYED)
**Important caveat: these proofs are DB-level simulations of the exact logic, NOT live HTTP-route tests.** Full HTTP proof requires either a deployment or local access to `SUPABASE_SERVICE_ROLE_KEY`/`ADMIN_PASSWORD`, neither available to the assistant (write-only secrets).

- `/api/report` exact select list confirmed via direct SQL reproduction of the same query string — returns expected shape
- Excluded fields proven to contain real data for the same row (so exclusion is deliberate, not coincidental): `email`, `ip_address`, `agency_signal: true`, `pipeline_stage: "new"` all populated, none in the new select list
- `pingclose_admin_login_attempts` table: `rowsecurity: true`, policy `"Service role only"`, `qual: auth.role() = 'service_role'`, `cmd: ALL` — same pattern as `pingclose_audits`
- Attempt-counting simulation using a reserved test IP (`203.0.113.50`, TEST-NET-3): attempts 1-5 each saw count `0,1,2,3,4` before insert (all allowed); 6th check saw count `5` (`would_be_blocked: true`)
- Fresh IP (`198.51.100.7`) check: count `0`, `would_be_blocked: false` — proves a never-before-seen IP (i.e., first attempt with correct password) is never blocked
- Test rows deleted afterward, confirmed `0` remaining

## Remaining Unknowns
- Whether commit `0f07bb8`'s actual HTTP route handlers behave identically to the DB-level simulation once deployed — should be the very first thing checked next session, per `05_NEXT_SESSION.md`
- Whether `RESEND_API_KEY` (Vercel env var) and `platform_config.resend_api_key` (Supabase row) are the same key or have diverged — never checked
- Whether any other env var besides `SUPABASE_SERVICE_ROLE_KEY` and `RESEND_FROM_EMAIL` still has a BOM character — not exhaustively checked across all ~10 env vars
