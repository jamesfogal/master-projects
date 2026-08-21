# Commercial Transition Sphere

Commercial Transition Sphere is a standalone Referral Verified application focused on commercial transition intelligence.

## Current status

- copied from a local Codex workspace on 2026-08-21
- not launched
- intentionally `noindex`

## Search protection

- `app/layout.tsx` sets `robots.index` and `robots.follow` to `false`
- `app/robots.ts` disallows all crawlers

## Access control

- the homepage now renders a private CSS/SVG access gate before any app data loads
- `CTS_ACCESS_CODE` unlocks the private member workspace
- `CTS_SUPER_ADMIN_CODE` unlocks the full operational console, including agents, evidence review, and write actions
- `CTS_SESSION_SECRET` signs the session cookie

### Required Vercel environment variables

```bash
CTS_ACCESS_CODE=replace-with-shared-access-code
CTS_SUPER_ADMIN_CODE=replace-with-super-admin-code
CTS_SESSION_SECRET=replace-with-a-long-random-secret
```

### Local preview defaults

- in non-production previews, the app falls back to:
  - member code: `cts-preview-member`
  - super admin code: `cts-preview-super-admin`
- set the three env vars above before deploying to production

## Local verification

```bash
npm run build
npm run lint
```
