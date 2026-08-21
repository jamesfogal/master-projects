# Referral Verified Hub

Referral Verified is the lean front door for the Referral Verified application family.

## Intended domain structure

- `referralverified.com` — this hub
- `goldengoose.referralverified.com` — Golden Goose Machine
- `transition.referralverified.com` — Commercial Transition Sphere

Each application remains an independent Vercel project. The hub stays intentionally light so it can carry the brand without slowing down the app experience.

## Launch rules

- no images above the fold
- noindex until official launch
- WebP only if a below-the-fold raster image is truly needed
- Golden Goose Machine and Commercial Transition Sphere stay on their own deployments

## Local verification

```bash
npm install
npm run lint
npm run typecheck
npm run build
```

No database or environment variables are required for this hub.
