# Watchtower — Project Handoff

**What it is:** an internal competitive-intelligence tool for Hypefy. It watches
competitors across 26 channels every day, detects what changed, scores each
change by impact, and surfaces it as a feed + Threat Index + battlecards.

**Where it lives:** `~/watchtower-saas` (the current app, Next.js).
`~/watchtower` is the earlier local MVP (Node/TS + SQLite) — kept for reference
and its snapshot history; the SaaS-shaped app supersedes it.

**Status:** working internal tool, running locally. Deployable to Vercel after
one change (chunked cron, see §5).

---

## 1. What has been done

### The journey
1. **Analysed** the original CI tracker (`~/Downloads/CI_TRACKER_OVERVIEW.md`) —
   a Python/Google-Sheets system on a sleeping Mac. Extracted its doctrine.
2. **Built a local MVP** (`~/watchtower`): Node/TypeScript, SQLite, 14 channels,
   real snapshots of 5 competitors.
3. **Ran it live** against Upfluence, CreatorIQ, Grin, Modash, The Cirqle —
   which surfaced four wrong conclusions and the lessons in §3 (the most
   valuable output of the whole exercise).
4. **Produced a day-one competitor report** (team-actionable: sales battlecards,
   marketing gaps, product matrix, momentum, watch-triggers).
   → `~/Downloads/Watchtower_Day-One_Competitor_Brief.html`
5. **Rebuilt as a Next.js app** (`~/watchtower-saas`) with 26 channels, API-first
   collection, Postgres, scoring, and a dashboard.
6. **Stripped the SaaS layer** (marketing site, public funnel, pricing, lead
   capture) → internal tool only. `/` redirects to `/feed`.

### Current app — what works
| Area | State |
|---|---|
| **26 channels** | All built as real collectors. 15 run with **zero API keys**. |
| **Pipeline** | Capture → diff/dedup → persist → score. Deterministic; LLM only judges. |
| **Feed** | Scored signal cards, category filters, click-a-competitor-to-filter. |
| **Threat Index** | Weighted composite, per-dimension, week-over-week deltas. |
| **Launch Radar** | Cross-signal forecast view (flagship differentiator). |
| **Competitors / Compare** | Per-competitor cards; live side-by-side matrix. |
| **Battlecards** | Generated per competitor (positioning, strengths, vulnerabilities, how-to-win, discovery question). Live numbers + authored strategy. |
| **APIs** | `/api/run` (manual crawl), `/api/cron/daily` (scheduled), `/api/inbound` (newsletter inbox webhook). |

### Channels: 26 built
**Live now, no keys (15):** website & pricing · new/changed pages (sitemap diff)
· Google ads · LinkedIn ads · jobs · news · YouTube · podcasts · subdomains ·
tech stack · iOS releases · Android releases · events & webinars · customer
logos · Trustpilot

**Free key unlocks (4):** Meta ads · Reddit · Product Hunt · Funding (Crunchbase)

**Licensed vendor, one Apify account (4):** LinkedIn posts · G2 · Capterra ·
Glassdoor

**Paid market data (2):** Traffic/SEO · Search interest (both DataForSEO)

**Inbox webhook (1):** Newsletters & secret shopper

> Every channel **self-defers** when its credential is missing and reports what
> it needs. Status is computed at runtime from env vars — add a key, the channel
> lights up on the next crawl. **No code change ever needed.**

### Deliberately NOT built (correct for an internal tool)
Auth, billing, multi-tenancy, self-serve onboarding. One shared workspace =
Hypefy's competitor set, which is what an internal tool wants.

---

## 2. Architecture

```
Vercel Cron (daily)
   └─> /api/cron/daily
         └─> orchestrator  →  for each competitor, for each channel:
               CAPTURE  (API first, Firecrawl for walled pages)
               DIFF     (content hash + meaning-level filters)
               PERSIST  (Postgres, transactional)
               SCORE    (Claude when keyed; heuristic fallback)
         └─> Threat Index recompute + history snapshot
```

**Stack:** Next.js 15 · Postgres (Neon in prod / PGlite embedded for local dev)
· Firecrawl (managed browser) · Claude API (scoring, battlecards).

**Key files**
| Path | Role |
|---|---|
| `src/lib/channels.ts` | Channel registry — single source of truth, runtime status |
| `src/lib/orchestrator.ts` | Runs channels across competitors |
| `src/lib/fetchLadder.ts` | plain fetch → challenge detect → Firecrawl |
| `src/lib/score.ts` | Signal Score (Claude or heuristic) |
| `src/lib/threat.ts` | Threat Index + week-over-week history |
| `src/collectors/*.ts` | One file per channel |
| `src/db/client.ts` | Schema + Neon/PGlite switch |
| `DATA_ACQUISITION.md` | Per-channel source audit (API tiers) |

**Commands**
```bash
npm run dev        # app at localhost:3000
npm run seed       # load competitor registry
npm run populate   # run free channels + score
npm run verify     # run ALL channels once, prove none crash
npm run battlecards# regenerate battlecards
```
> Local only: the embedded DB is single-process — run **either** the dev server
> **or** a script, not both. Stop with Ctrl+C (not `kill -9`).

---

## 3. Hard-won lessons (do not regress these)

These came from real wrong answers during live use. They're encoded in the code
and must survive any refactor.

1. **Advertiser identity ≠ brand name.** Fuzzy name matching fails *both* ways.
   - Google ads: query by **domain** — CreatorIQ's ads run under "SocialEdge,
     Inc.", Grin's under "GRIN TECHNOLOGIES INC.". Name search found nothing.
   - Meta ads: query by **verified page ID** only. A brand keyword search
     returned 0 ads for a page running 40. Also, `facebook.com/<vanity>` often
     resolves to the *wrong* page (Upfluence's vanity page: 0 ads; the real
     advertiser page: 119 ads).
   - LinkedIn ads: match advertiser name by **prefix**. Substring matching
     conflated "Cirql®"/"Cirql.ai" with "The Cirqle".
2. **Never conclude "not present" from one platform.** Meta-only analysis said
   "CreatorIQ and Modash don't advertise." Truth: CreatorIQ runs 100–200 Google
   ads + 17 LinkedIn ads; Modash ~86 Google + 21 LinkedIn.
3. **Read content, not counts.** Count-weighted scoring badly under-rated a small
   competitor making the sharpest strategic move. The insight was one sentence
   on one captured page.
4. **Event time ≠ observation time.** Showing "9m ago" for a job posted months
   ago is a lie. Where a source gives no real date, label it "first seen".
5. **Every zero is suspect until verified twice.** Implausible zeros = suspected
   collector break, never a quiet day.
6. **Never fabricate.** Unfetchable → skip the row. No placeholders, no
   "(403)" meta-commentary in signal text.

---

## 4. What needs to be done

### Required before deploying
1. **Chunk the cron** (§5) — the crawl is ~9 min; serverless functions cap ~300s.
2. **Neon database** — set `DATABASE_URL`.
3. **`CRON_SECRET`** — any random string, protects the crawl endpoint.

### High value, low effort
4. **Add `ANTHROPIC_API_KEY`** — upgrades Signal Scores from heuristic to real
   Claude judgment. Biggest quality jump for one env var.
5. **Add `FIRECRAWL_API_KEY`** — reliable capture of Cloudflare-walled sites.
6. **Free keys** — Meta ads, Reddit, Product Hunt, Crunchbase (+4 channels).
7. **Parallelize the orchestrator** (§5) — ~10× faster crawls.

### Feature gaps (stubs today)
8. **Ask** — RAG chat over the signal corpus. Needs embeddings + retrieval.
9. **Reports** — generate the day-one-style brief live, on demand.
10. **Alerts** — Slack/email digests when high-score signals land (needs Resend
    or a Slack webhook).
11. **Battlecards auto-refresh** — currently generated on command; should
    regenerate when high-score signals land.

### Nice to have
12. **Archive/history view** — you already store daily snapshots; showing
    "pricing over 6 months" is the thing nobody else can reproduce.
13. **Per-competitor detail page** — drill into one competitor's full timeline.

---

## 5. Making it faster — the API migration & parallelism plan

**Today: ~9 minutes** for a full crawl (5 competitors × 15 active channels).
**Target: under 60 seconds.** Three separate problems, biggest first.

### A. The orchestrator is fully sequential (biggest win: ~10×)
`src/lib/orchestrator.ts` is nested `for` loops awaiting each channel one at a
time. Nothing overlaps, so total time = sum of every request.

**Fix:** run channels in parallel per competitor, and competitors in parallel
with a concurrency cap:
```ts
// per competitor: all channels at once
const results = await Promise.allSettled(channels.map(ch => ch.run(comp)));
// across competitors: cap concurrency (be polite to shared endpoints)
```
Total time becomes the **slowest single channel** (~30–60s), not the sum.
The instant-report prototype already proved this: 5 competitors probed in
**67 seconds** using `Promise.all`, versus 240s sequentially for fewer channels.

**Caveat:** keep a small concurrency cap (4–6) and per-host politeness so shared
endpoints (crt.sh, Google) don't rate-limit us — which is itself a speed win,
since rate-limiting triggers the retry backoff below.

### B. Retry backoff is the single slowest collector
`subdomains.ts` calls crt.sh with a **60s timeout** and up to **3 retries with
4s/8s/12s sleeps** — a worst case of ~3 minutes for one competitor, one channel.

**Fix:** flip the order — **certspotter's API first** (fast, reliable JSON),
crt.sh only as fallback. Or race both with `Promise.any` and take the first
success. Drop timeouts to ~15s. Saves minutes on bad days.

### C. Replace remaining scraping with APIs (faster *and* more reliable)
Scraping is slow because it renders pages and retries walls. Each API swap
removes both.

| Channel | Today | Move to | Speed effect |
|---|---|---|---|
| News | Google News RSS parse | **GNews API** (`GNEWS_API_KEY`) | one JSON call, real dates |
| Trustpilot | parse `__NEXT_DATA__` off the page | **Trustpilot Business API** | no page render |
| Walled pages | fetch → detect challenge → retry | **Firecrawl** (`FIRECRAWL_API_KEY`) | one managed call, no evasion loops |
| Subdomains | crt.sh + backoff | **certspotter first** | seconds instead of minutes |
| Reviews/social | — | **Apify** (LinkedIn, G2, Capterra, Glassdoor) | vendor handles rendering |
| Traffic/Trends | — | **DataForSEO** | structured, instant |

Fully-API channels already fast: jobs (ATS APIs), Meta ads (Graph API), app
stores (iTunes), Reddit (OAuth), Product Hunt (GraphQL), funding (Crunchbase).

### D. Don't re-fetch what hasn't changed
- Send `If-Modified-Since` / `ETag` on sitemaps and watched pages; a `304`
  costs nothing and skips parsing entirely.
- Skip page capture when the sitemap's `lastmod` is unchanged.
- Tier-2 pages already run weekly, not daily — keep that.

### E. Chunked cron (also required for Vercel)
Instead of one 9-minute function:
```
/api/cron/daily          → dispatcher: fires one request per competitor
/api/cron/competitor/[id] → runs all channels for ONE competitor (~60-100s)
```
Each invocation lands well inside the serverless limit, and they run
concurrently — so the whole crawl finishes in the time of the slowest
competitor. This solves the timeout **and** speeds things up.

**Combined effect:** ~9 minutes → **under a minute**, with fewer failures.

---

## 6. Deploy checklist (Vercel + Neon)

1. Do the **chunked cron** change (§5E) — otherwise the daily crawl times out.
2. Create a **Neon** project → copy the connection string.
3. Push the repo → import into **Vercel**.
4. Set env vars in Vercel:
   - Required: `DATABASE_URL`, `CRON_SECRET`
   - Strongly recommended: `ANTHROPIC_API_KEY`, `FIRECRAWL_API_KEY`, `GNEWS_API_KEY`
   - Free extras: `META_ADS_TOKEN`, `REDDIT_CLIENT_ID` + `REDDIT_CLIENT_SECRET`,
     `PRODUCTHUNT_TOKEN`, `CRUNCHBASE_API_KEY`
   - Later/paid: `APIFY_TOKEN` + actor ids, `DATAFORSEO_LOGIN` + `DATAFORSEO_PASSWORD`
   - Inbox: `NEWSLETTER_INBOX`
5. Turn on **Deployment Protection** (password or SSO) — this is how you keep an
   internal tool private without building auth.
6. `vercel.json` already registers the daily 07:00 cron.
7. After first deploy: seed the competitor registry, then trigger `/api/run`
   once to populate the feed.

**Alternative:** Railway / Render / Fly.io run an always-on Node process with
**no function timeout**, so the chunking step becomes optional. ~$5/mo. Simpler
if you'd rather not touch the cron logic.

---

## 7. Reference

### Competitors tracked
Upfluence · CreatorIQ · Grin · Modash · The Cirqle
(registry: `scripts/seed.ts`, incl. verified Meta page IDs, YouTube handle
overrides, and query overrides for generic names like "Grin")

### Verified competitive picture (July 2026 baseline)
| Competitor | Meta ads | Google ads | LinkedIn ads | Open roles |
|---|---|---|---|---|
| Upfluence | 119 | 300–400 | 24+ | 0 |
| CreatorIQ | 0 | 100–200 | 17+ | 34 |
| Modash | 0 | ~86 | 21+ | 31 |
| The Cirqle | 40 | ~4 | 5 | n/a |
| Grin | — | ~12 | 0 | 3 |

### Related documents
- `DATA_ACQUISITION.md` — per-channel source audit and API targets
- `SAAS_BUILD_SPEC.md` — the full SaaS blueprint (reference only; the running
  tool is internal-only now)
- `README.md` — setup and local dev notes
- `~/Downloads/Watchtower_Day-One_Competitor_Brief.html` — the competitor report
