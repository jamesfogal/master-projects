# Golden Goose Machine

Golden Goose Machine is a standalone Referral Verified application.

## Intended domain

- `goldengoose.referralverified.com`

## Current status

- moved into Referral Verified on 2026-08-21
- not launched
- intentionally `noindex`

## Product requirement

- this app must be ultra mobile friendly
- all new UI work should be mobile-first, fast on phones, and easy to use one-handed
- above-the-fold experience should stay lightweight with strong tap targets, readable type, and no horizontal overflow

## Required environment variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ANTHROPIC_API_KEY`
- optional: `NEXT_PUBLIC_SITE_URL`

## Data dependency

This app expects a Supabase table named `golden_goose_submissions` with the fields used by the API routes under `app/api/golden-goose`.

## Local verification

```bash
npm install
npm run lint
npm run typecheck
npm run build
```
