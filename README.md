# Watchtower SaaS

Competitive-intelligence tracker — the Node/Next.js/Vercel implementation of
`SAAS_BUILD_SPEC.md` (in the sibling `~/watchtower` repo). Tracks a competitor
set across 14 channels, detects changes, and scores a per-competitor Threat
Index.

## Run locally (zero config)

```sh
export PATH="$HOME/.local/node/bin:$PATH"
npm install
npm run seed     # load the competitor registry (verified IDs from the MVP)
npm run smoke    # end-to-end pipeline test (one competitor, free channels)
npm run dev      # dashboard at http://localhost:3000
```

With no `DATABASE_URL`, it uses an embedded Postgres (PGlite) in `./data` — no
database to install. Set `DATABASE_URL` to a Neon connection string for
production; the schema is identical.

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
- **Dashboard** (`app/page.tsx`): signal feed + threat index.
- **Cron + manual run** API routes, `CRON_SECRET`-guarded.

## Not yet wired (next phases, per spec §9)

- LLM interpret/enrich layer (Claude) — turn changes into scored signals + the
  written digest. Routes and schema are ready; needs `ANTHROPIC_API_KEY` + the
  prompt wiring.
- Multi-tenancy (Clerk/Stripe), onboarding auto-discovery, battlecards, Ask/RAG.
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
