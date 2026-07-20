# Next Session — Start Here

## Exact Next Task

1. **Ask Jim whether to push commit `0f07bb8`.** It is committed locally on `main`, NOT pushed, NOT deployed. Contains the `/api/report` PII-leak fix and the admin login rate limiter. This is the single highest-priority open item — two real security fixes are sitting un-deployed.
   - Command once approved: `git push origin main` from `C:\Projects\pingclose`
   - After push, wait for Vercel deployment (`list_deployments` / `get_deployment` via the Vercel MCP tools, project id `prj_ype7bc4ehRWej1NLN6Y3l6LrzUrg`, team id `team_RVAEAhWfvHQTPT8iIDdy5Oa7`)
   - Then run the SAME live verification pattern used all session: `curl -s -L -X POST https://pingclose.com/api/audit ...` plus a real GET to `/api/report?id=<existing-id>` to confirm the new column allow-list is actually being returned over HTTP (this was NOT proven at the HTTP level last session — only proven via direct SQL simulation, see `06_VERIFICATION.md`).

2. **After that's confirmed live**, work through the open blockers in `04_LAUNCH_BLOCKERS.md` in priority order: lint cleanup, then RESEND key ambiguity, then Task 5 design doc (email verification redesign — do NOT implement yet, Jim explicitly said design-only).

## What NOT to Redo

- **Do not re-litigate the Vercel/DNS migration.** It's done and proven live. `pingclose.com` and `www.pingclose.com` both correctly point to Vercel.
- **Do not re-diagnose the Supabase BOM bug.** Root cause is fully proven (see `06_VERIFICATION.md` and `03_ARCHITECTURE_DECISIONS.md`). If a *similar* symptom reappears, check for a BOM character again immediately — don't re-run the whole elimination process from scratch, the playbook is in `07_TRANSCRIPT.md`.
- **Do not propose splitting PingClose into its own Supabase project.** This was explicitly decided against — see `03_ARCHITECTURE_DECISIONS.md`. If this idea resurfaces, flag it back to Jim as contradicting a standing decision rather than acting on it.
- **Do not re-build the PageSpeed Agent from scratch.** It exists at `lib/agents/pagespeedAgent/` and is proven working (both the OK and TIMEOUT paths, live). Extend it, don't replace it.
- **Do not re-add Twilio/SMS.** Explicitly and permanently removed per Jim's instruction.
- **Do not implement the Task 5 email-verification redesign without a design doc first** — Jim was explicit: design only, not implementation, until he reviews it.

## Known Friction Points (read before driving any UI walkthrough)

- Jim wants **one instruction at a time**, no bundled steps, no extra unsolicited context, especially in Vercel/Namecheap/Supabase UI walkthroughs. See persistent memory file `feedback_step_by_step_only.md`.
- Jim wants **every literal value/link in its own copy-paste code block**, every time, no exceptions. See `feedback_copy_paste_values.md`.
- Jim has zero patience for guessing — always read actual logs/errors before proposing a cause (this is also a hard CLAUDE.md rule, not just a preference).
