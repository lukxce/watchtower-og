# Fortress HQ

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
npm run dev      # marketing site at /, app at /overview — http://localhost:3000
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
- **Subdomain judgment (allowlist + vetos)**: a subdomain only reaches the
  feed when its name hints at something being built or marketed (launch.,
  beta., pricing., …) AND none of three vetos fire: env markers
  (sandbox/prod/dev/api — an existing product's engineering surface is not a
  new buildout), infra tokens (upflow-email.billing.* matched "billing" but
  is mail infra), and stale years (events.sept2024.* is history, not news).
  Everything vetoed is recorded but archived.
- **Radar honesty bar**: forecasts need either a buildout hostname + a real
  hiring cluster (≥4 relevant roles — 2 open dev roles at a 200-person
  company is Tuesday), or a cluster + repeated product-page changes. Ads
  running is context, never evidence on its own. A single new buildout
  hostname earns exactly "worth watching, not yet a pattern".
- **Ads roundup**: the Overview shows one summary card per competitor
  (volume per platform + creative-format mix); the full creative list lives
  behind the Ads filter. Commentary on what the ads *say* honestly requires
  creative text, which only the key-gated Meta channel returns today —
  planned unlock, not faked. Same for founder/company posts: needs the
  LinkedIn-posts channel (Apify), listed as deferred in the coverage map.
- **Industry** (`/industry` + `src/lib/industryNews.ts`): standalone
  market-wide view — Google News headlines cross-tagged when they name a
  tracked competitor, next to the competitor-press column. A slimmed pulse
  module also sits on the Overview. Query is hardcoded per-workspace until
  workspace settings exist.
- **Add competitor**: form on `/competitors` → `POST /api/competitors`
  (org-scoped). New competitors baseline on the next crawl; the UI says so
  rather than pretending anything happens instantly.
- **`/overview` vs `/feed`**: Overview is the dense command center (one
  consolidated Threat Index leaderboard, insight KPIs, top signals,
  battlecards, industry pulse, hiring/ad charts). Feed is every single event,
  day-grouped. The persistent left rail (channel shortcuts) and top nav (all
  pages) are both app-wide, in `app/(app)/layout.tsx`.
- **Battlecards, three angles**: each card now carries `angles.sales`,
  `.marketing`, `.product` alongside the original positioning/strengths/
  vulnerabilities — a rep, a marketer, and a PM read the same intelligence
  differently. Authored in `scripts/battlecards.ts`.
- **Historical backfill** (`npm run backfill`, `scripts/backfill-history.ts`):
  real, sourced events (funding, executive moves, partnerships, launches)
  researched per competitor and ingested with their real dates — not
  synthetic data. Deliberately does NOT fabricate a historical Threat Index
  trend line (would require real point-in-time snapshots we don't have, or
  invented numbers) — trend depth accumulates honestly from real crawls
  instead. Radar's evidence window is 180 days and blends buildout
  hostnames, hiring clusters, and these real "corporate moves" from news.
- **Brand mentions** (`/mentions`, `src/lib/mentions.ts`, `src/lib/brand.ts`):
  a workspace sets its own brand identity (name, domain, aliases — nothing is
  guessed, `org_settings` table) and Fortress HQ searches for it across three
  real, sourced lenses: general news (Google News RSS), a competitor's own
  already-captured page content (the highest-value kind — the workspace's
  brand named on a competitor's site), and any already-ingested signal whose
  title names the brand. Zero results on all three is an honest answer, shown
  as such, not hidden.
- **Cross-referencing signal synthesis** (`src/lib/connect.ts` +
  `synthesizeSignal()` in `src/lib/interpret.ts`): one signal in isolation
  ("Grin looks to be building something new") is a data point; read next to
  what's already known about that competitor — a real pricing/business-model
  move already in the news, the battlecard's authored read — it can become a
  conclusion. `connect.ts` batches each competitor's real corporate-move news
  (270-day window), the narrower subset that reads as a GTM/pricing shift,
  battlecard positioning, and sibling buildout hostnames — one query per
  source per page load, not per row. `synthesizeSignal()` only upgrades a
  headline under two narrow, deterministic rules (a fresh buildout hostname
  next to a real model-shift move, or vice versa) and otherwise falls back to
  the plain per-signal read — no forced connections (BRAND.md law #3). A
  "what else we know" panel is attached only for strategic-signal channels
  (subdomains, news, website, sitemap, appstore, events) with genuinely
  substantive material — a battlecard blurb glued onto a "WordPress detected"
  techstack card isn't earned context, it's decoration (BRAND.md law #2).
- **Competitor reads — where the reasoning lives** (`src/lib/reason.ts`,
  `competitor_reasoning` table, `npm run reads`): ONE whole-picture read per
  competitor — every corporate move, buildout hostname, hiring pattern, and
  the battlecard considered together — rendered on Battlecards ("The read",
  with dated evidence chips) and Competitors. The Feed deliberately stays
  plain signals: per-signal commentary was tried and rejected (it buried the
  feed in text and reasoned about signals in isolation). Reads are authored
  Claude-in-session (`scripts/reads.ts`, no API key needed — same pattern as
  battlecards) or generated live via `llmCompetitorRead` when
  `ANTHROPIC_API_KEY` is set; both are strictly grounded in retrieved facts,
  confident where a competitor's own press confirms the link, honest where
  the link is timing alone.
- **Overview = dashboard, not document**: greeting, one big Market-activity
  chart (real weekly DATED events, last 6 months — plotted on when they
  happened, never on crawl date, so a first-crawl baseline can't fake a
  spike), Threat Index score list, coverage progress bars, and a right rail
  of gradient cards carrying each read's one-line hook into its battlecard,
  plus the top Launch Radar call. No prose modules.
- **Platform-admin cross-tenant console** (`/admin/workspaces`,
  `src/lib/adminAuth.ts`): the platform owner (not a customer) can see every
  workspace, "view as" one to see exactly what that client sees (an
  impersonation cookie that overrides `requireOrgId()`, with a persistent
  banner while active), and leave a correct/wrong verdict + note on any
  synthesized signal. Gated by `PLATFORM_ADMIN_EMAILS` when Clerk is
  configured; always available to the single dev-workspace user locally.
- **Teaching loop** (`interpretation_feedback` table, `POST /api/feedback`):
  admin corrections are stored — deliberately not org-scoped for reads — and
  the most recent 8 "incorrect" ones are pulled into every LLM reasoning call
  as few-shot guidance, across every workspace. Only the admin's own
  generalized judgment crosses workspace boundaries this way, never raw
  customer or competitor data.
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
