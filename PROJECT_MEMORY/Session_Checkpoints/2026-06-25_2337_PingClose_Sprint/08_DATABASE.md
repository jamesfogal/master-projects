# Database — Schema Changes, New Tables, Migrations, Env Vars

## Supabase Project
- **Project:** `localseoaeopro`
- **ID:** `xvrhxtnhmnurvxitnijy`
- **URL:** `https://xvrhxtnhmnurvxitnijy.supabase.co`
- **Region:** us-west-2
- Shared between PingClose and LocalSEOAEOPro by permanent architecture decision (see `03_ARCHITECTURE_DECISIONS.md`)

## New Tables Created This Session

### `pingclose_admin_login_attempts`
Created via `apply_migration` (name: `create_pingclose_admin_login_attempts`):
```sql
create table if not exists pingclose_admin_login_attempts (
  id uuid default gen_random_uuid() primary key,
  ip_address text not null,
  created_at timestamp with time zone default timezone('utc', now())
);

create index if not exists pingclose_admin_login_attempts_ip_idx
  on pingclose_admin_login_attempts(ip_address, created_at desc);

alter table pingclose_admin_login_attempts enable row level security;

create policy "Service role only" on pingclose_admin_login_attempts
  using (auth.role() = 'service_role');
```
Verified live: `rowsecurity: true`, policy confirmed via `pg_policies`.

## Existing Tables (no schema changes this session, referenced/queried)
- `pingclose_audits` — full column list confirmed via `information_schema.columns`: `id, created_at, url, email, ip_address, mobile_score, desktop_score, ttfb, lcp, fcp, cls, inp, total_page_size, total_requests, passes_one_second, cms, hosting, cdn, http_version, server_location, images_lazy_loaded, images_webp, largest_image_kb, render_blocking_scripts, top_issues, top_fixes, full_report, contacted, contacted_at, notes, agency_signal, pipeline_stage, phone`. Has RLS policy `"Service role only"` (`auth.role() = 'service_role'`, `cmd: ALL`).
- `email_verifications` — RLS enabled, but advisor flagged **zero policies exist** (not fixed this session, just noted).
- `platform_config` — RLS enabled, same zero-policies note. Contains `resend_api_key` row (set 2026-06-09, 36 chars, `re_...` format).
- `skill_executions` — belongs to LocalSEOAEOPro's AI OS, RLS enabled, zero policies (noted only, not this app's table).

## Environment Variable Changes (Vercel project `pingclose`)

| Variable | Action | Method |
|---|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | Deleted + re-added with clean value | Jim, manually, browser-to-browser (Supabase → Vercel), via dashboard UI |
| `RESEND_FROM_EMAIL` | Deleted + re-added with clean value (`jim@pingclose.com`) | Assistant, via Vercel CLI: `vercel env rm` then `printf '%s' "jim@pingclose.com" \| vercel env add ... production` |

All other env vars (`PAGESPEED_API_KEY`, `RESEND_API_KEY`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`, `NEXT_TELEMETRY_DISABLED`) were NOT touched and not checked for the BOM defect this session — flagged as a remaining unknown in `06_VERIFICATION.md`.

**Important limitation discovered:** Vercel's CLI (`vercel env pull`) returns an EMPTY value for any variable marked "Sensitive," even when authenticated as the project owner. This is a hard platform write-only restriction — not something the assistant can work around. Any future BOM-style corruption on a true secret will require the same browser-to-browser re-entry method; non-secret config values can be fixed directly via CLI using `printf` (never an interactive editor, to avoid reintroducing the exact bug being fixed).
