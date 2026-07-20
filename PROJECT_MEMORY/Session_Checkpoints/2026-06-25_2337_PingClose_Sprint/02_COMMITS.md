# Commits, Pushes, Deployments

## Commits (chronological)

| Hash | Message | Pushed? |
|---|---|---|
| `a34009b` | Build standalone PageSpeed Agent, fix silent timeout, remove Twilio | Yes |
| `d58a50c` | Make audit reliable when PageSpeed times out (Task 4) | Yes |
| `0f07bb8` | Fix /api/report PII leak and add admin login rate limiting | **NOT pushed — staged locally only, approved for commit but push not yet authorized** |

Repo: `https://github.com/jamesfogal/pingclose.git` (GitHub shows a redirect notice to `https://github.com/jamesfogal/Pingclose.git` — same repo, case-changed).

## Pushes
- `a34009b` pushed to `origin/main` — triggered Vercel deployment `dpl_7Y5cackuSkHfSTN6tMcY5UbZX79g`
- `d58a50c` pushed to `origin/main` — triggered Vercel deployment `dpl_94QqyuWTBbPU92AKGNKDrsGMkVJm`
- `0f07bb8` — committed locally, **push explicitly deferred** ("Do not push yet" — last instruction of the session)

## Deployments (Vercel project `pingclose`, prj_ype7bc4ehRWej1NLN6Y3l6LrzUrg)

| Deployment ID | Commit | State | Notes |
|---|---|---|---|
| `dpl_7Y5cackuSkHfSTN6tMcY5UbZX79g` | a34009b | READY | First PageSpeed Agent deploy |
| `dpl_HbTSMKBaFsiWq1GGNSwEP5Xy4RNB` | a34009b (redeploy) | READY | Manual redeploy after Supabase key re-entered |
| `dpl_94QqyuWTBbPU92AKGNKDrsGMkVJm` | d58a50c | READY | Task 4 fallback live |
| `dpl_EdCwfsnuKPFvSSvAQngAKtfcQwiD` | d58a50c (redeploy via CLI) | READY | Redeployed after RESEND_FROM_EMAIL BOM fix |

Current live production alias (`pingclose.com`, `www.pingclose.com`) is serving commit `d58a50c`. Commit `0f07bb8` (the /api/report and admin-login fixes) is **not yet deployed**.

## Other Vercel/CLI actions this session
- `vercel env rm SUPABASE_SERVICE_ROLE_KEY production` + manual re-add via browser (Jim, not CLI) after BOM fix
- `vercel env rm RESEND_FROM_EMAIL production` + `printf '%s' "jim@pingclose.com" | vercel env add RESEND_FROM_EMAIL production` (clean, no BOM)
- `vercel redeploy <url> --target=production` used twice to pick up env var changes without a new git commit
