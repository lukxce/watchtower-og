# Watchtower

Verifiable competitive-intelligence SaaS — Next.js/Vercel, multi-tenant. Every
workspace tracks its own competitor set across 22 channels, turns captured
pages into cited claims (not just diffs), and scores a per-competitor Threat
Index. Marketing site (home/pricing/blog/contact) lives alongside the product
app in the same repo; see `field-report` context in `HANDOFF.md` for the full
positioning rationale.

## Run locally (zero config)

```sh
export PATH="$HOME/.local/node/bin:$PATH"
npm install
npm run seed     # load the competitor registry into the dev workspace
npm run smoke    # end-to-end pipeline test (one competitor, free channels)
npm run dev      # marketing site at /, app at /feed — http://localhost:3000
```

With no `DATABASE_URL`, it uses an embedded Postgres (PGlite) in `./data` — no
database to install. Set `DATABASE_URL` to a Neon connection string for
production; the schema is identical.

**Multi-tenancy (Clerk):** without `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` +
`CLERK_SECRET_KEY` set, auth is skipped entirely and everything runs as one
`dev-workspace` — no sign-in needed locally. Set both (free at
dashboard.clerk.com, enable Organizations) to get real multi-tenant auth, an
org switcher, and `/sign-in` `/sign-up` `/select-org`. See `.env.example`.

Trigger a collection run manually:
```sh
curl -X POST localhost:3000/api/run -H 'content-type: application/json' \
  -d '{"channels":["news","ads_google","ads_linkedin","jobs"]}'
# omit "channels" to run all 14; add "tier2":true for the weekly website sweep
```

## Deploy to Vercel

1. Push to a git repo, import into Vercel.
2. Set env vars (see `.env.example`): `DATABASE_URL` (Neon), `CRON_SECRET`,
   and optionally `META_ADS_TOKEN`, `FIRECRAWL_API_KEY`, `ANTHROPIC_API_KEY`,
   `REDDIT_CLIENT_ID/SECRET`.
3. `vercel.json` already registers the daily 07:00 cron → `/api/cron/daily`.

## What's wired (Phase 1 + ads triad)

- **14 collectors** (`src/collectors/`): website capture + sitemap watch, news,
  youtube, jobs, subdomains, techstack, podcasts, appstore, **Meta / Google /
  LinkedIn ads**, logos, events. Every collection lesson from the MVP is encoded
  (identity-by-domain/page-id, prefix-match advertisers, crt.sh retries,
  bootstrap-archiving, honest failures).
- **Fetch ladder** (`src/lib/fetchLadder.ts`): plain fetch → challenge detect →
  Firecrawl fallback. Degrades honestly without a Firecrawl key.
- **Threat Index** (`src/lib/threat.ts`): auditable per-dimension composite.
  Day-one uses transparent count proxies; Phase 2 swaps in LLM-scored dims.
- **App** (`app/(app)/`): signal feed + threat index, gated behind Clerk auth
  once configured. **Marketing site** (`app/(marketing)/`): home, pricing,
  contact, blog — served at `/`.
- **Cron + manual run** API routes, `CRON_SECRET`-guarded, now iterate every
  workspace.

## Not yet wired (next)

- **Billing (Stripe)** — pricing tiers exist on the marketing site; checkout
  isn't wired to Clerk org creation yet.
- **Claim ledger execution** — the `claims`, `comparison_pages`, and
  `our_claims` tables exist (field-report §03 architecture); the
  extract → dedupe → contradict pipeline that fills them isn't implemented.
- **Comparison-page & campaign-landing-page collectors** — the Wayback CDX +
  sitemap + pattern-match discovery method is designed, not yet a collector.
- LLM interpret/enrich layer (Claude) — turn changes into scored signals + the
  written digest. Routes and schema are ready; needs `ANTHROPIC_API_KEY` + the
  prompt wiring.
- Onboarding auto-discovery, Ask/RAG.
- Deferred channels: LinkedIn posts, reviews cluster, Glassdoor, traffic/SEO.

## Local dev note (PGlite is single-process)

The embedded dev database (PGlite) can be opened by **one process at a time**.
So locally, run *either* the dev server *or* a script (`seed`/`smoke`), not both
at once, and stop the server with Ctrl+C (not `kill -9`, which can corrupt the
dev file — if that happens, `rm -rf data/pglite && npm run seed`). This
constraint is dev-only: production uses Neon (`DATABASE_URL`), which is
multi-process and crash-safe.

## Channel coverage (all 22)

The dashboard shows the full 22-channel roster with live status. **14 run today
with no setup**; the rest are wired but gated:
- **Meta ads** → set `META_ADS_TOKEN` (free) · **Reddit** → set `REDDIT_CLIENT_ID/SECRET` (free)
- **LinkedIn posts, newsletters/secret-shopper** → need an account/inbox
- **G2, Capterra, Glassdoor, Traffic/SEO** → paid data sources
- **Trustpilot** runs free (public review page).

Deferred channels record their status each run so the coverage map stays honest;
they light up automatically once configured.

## Note on the first run

Bootstrap-archiving means the first collection per competitor+channel is a
silent baseline (no feed flood). The feed fills with *changes* from the second
run onward — that's the intended design, matching the MVP.
