# Watchtower — Unit Economics (v2)

*Last revised: 18 August 2026 · Model: `node scripts/econ.mjs`*

**v1 was wrong and too optimistic.** It assumed 8 tracked pages per competitor
and priced in no review or LinkedIn scraping at all. This version is built on
measured page volumes and the channels we actually intend to run.

---

## 1. Headline

| Scenario | Per competitor | Starter (3) | Growth (10) |
|---|---|---|---|
| Optimistic | $1.02 | $3.07 · **96.9%** | $10.22 · **97.4%** |
| **Expected** | **$1.98** | **$5.95 · 94.0%** | **$19.82 · 95.0%** |
| Pessimistic | $5.68 | $17.03 · **82.8%** | $56.77 · **85.8%** |

**The conclusion survives the correction: margins hold in every scenario.**
Even the pessimistic case — expensive Apify actors and the wrong Firecrawl
plan — leaves 83–86%. The answer to "can we afford to scrape Trustpilot,
Glassdoor, G2, Capterra and LinkedIn?" is **yes, comfortably.**

### What dominates (expected case)

| | Cost | Share |
|---|---|---|
| **Apify** — 6 scraped channels | $1.60 | **81%** |
| Claude — reads + scoring | $0.27 | 14% |
| Firecrawl — page rendering | $0.09 | 5% |
| Neon — snapshots | $0.02 | 1% |

**Claude is 14% and not the problem.** Keep it for reading and writing. The
cost question is entirely an Apify question.

---

## 2. Measured inputs

Taken against the five live demo competitors, 17–18 August 2026.

| Input | Value | Note |
|---|---|---|
| Sitemap URLs / competitor | **478 avg** | range 50 (Signal Labs) → 1,278 (Klue) |
| Page fetches / competitor / month | **550** | tier-1 daily, tier-2 weekly, new pages |
| Firecrawl credits / month | 110 | 20% of fetches need JS rendering |
| Apify actor runs / month | **32** | across 6 channels |

### The `<lastmod>` problem — this drives the whole page-fetch number

| Site | Dated URLs | Changed 1d / 7d / 30d |
|---|---|---|
| klue.com | 1,001 | 3 / 7 / 23 |
| www.crayon.co | 625 | **0 / 0 / 0** |
| kompyte.com | 230 | **0 / 0 / 0** |

**Only one of three sites publishes trustworthy `lastmod`.** Zero changes in
30 days is not credible for an active marketing site — Crayon and Kompyte
both publish content. So sitemap `lastmod` **cannot be the change-detection
mechanism**; edits have to be caught by re-fetching and hashing content.

That is why the model carries 550 page fetches rather than the ~90 a
lastmod-only approach would suggest. It's also why tiering matters: fetching
all 478 URLs daily would be 14,340 fetches/month and blow the model up. The
tiering already exists in `sitemap.ts` (TIER1 / TIER2) and should stay.

---

## 3. Cost per channel group

| Channel | Vendor | Runs/mo | Why not an API |
|---|---|---|---|
| Trustpilot | Apify | 4 | public page returns **403**; official API is gated |
| Glassdoor | Apify | 4 | no public API |
| G2 | Apify | 4 | partner API only, gated |
| Capterra | Apify | 4 | no public API |
| LinkedIn company posts | Apify | 8 | no public API |
| **LinkedIn founder posts** | Apify | 8 | no public API · **channel does not exist yet** |
| Sitemap + page diff | Firecrawl / plain | 550 | inherent — page diffing *is* the feature |
| Reads + scoring | Claude | 30 | the differentiator; keep |

**`LinkedIn founder posts` is not built.** It's in the model because it's
wanted, but there is no collector for it today. Founder posts are arguably
higher-signal than company posts — that's where launches get teased and
strategy gets stated out loud — so it's worth building, but it's net-new work.

---

## 4. The Apify question

81% of marginal cost sits in one vendor whose per-run price I **cannot
verify without an account**. The model spans $0.02–$0.15 per run, a 7.5×
range, and that range is the difference between 97% and 83% margin.

**Before committing to the Apify-heavy design, do this:**
1. Open a trial account and run each of the 6 actors **once** against a real
   competitor.
2. Record actual compute units consumed per run.
3. Re-run `scripts/econ.mjs` with the real rate.

Everything else in this model is measured. This is the one number that isn't,
and it's the one that matters most.

### Levers if Apify comes in expensive

- **Frequency.** Reviews change slowly. Monthly instead of weekly cuts those
  four channels by 75% and loses almost nothing.
- **Tier gating.** Put review + LinkedIn channels on Growth only. They're
  worth more to a bigger company anyway, and it protects Starter's margin.
- **Self-host the cheap ones.** Trustpilot and Glassdoor are simple pages; the
  403 is a fingerprinting problem, not a hard block. But this trades vendor
  cost for maintenance burden and reliability risk — see §6.

---

## 5. Fixed platform floor

| Service | Monthly |
|---|---|
| Vercel Pro | $20 |
| Neon Launch | $19 |
| Clerk | $25 |
| **Firecrawl Standard** | **$83** |
| **Apify** | **$49+** |
| DataForSEO | $50 |
| Anthropic | usage (~$3 at 10 customers) |
| **Total** | **~$246/mo** |

Up from $179 in v1, because Firecrawl Standard replaces Hobby — at 110
credits × 10 competitors × 10 customers, Hobby's 3,000-credit cap is breached
by the third customer. **Firecrawl's per-credit price is 6× better on
Standard**, so upgrading early is a saving, not a cost.

**Break-even: 3 Starter customers, or 1 Growth.**

Minimum viable floor is still **$64/mo** (Vercel + Neon + Clerk + Anthropic),
which runs the 15 keyless channels. Firecrawl and Apify are additive.

---

## 6. Strategy: buy scraping, don't build it

Confirmed direction — scraping goes through third parties wherever one exists.
The reasoning holds up on the numbers:

- **Cost is not the constraint.** Even pessimistic Apify leaves 83% margin.
- **Maintenance is.** Every self-hosted scraper is a thing that silently
  breaks when a competitor redesigns. We already hit **crt.sh 429** and
  **Trustpilot 403** in a single evening. A vendor absorbs that maintenance.
- **"No false fires" is the brand.** A silently-broken scraper reporting
  "no reviews found" is exactly the failure the product promises not to make.
  Paying a vendor to keep selectors current is buying insurance on the brand
  law.

**Keep in-house:** anything with a real API (ATS boards, cert logs, iTunes,
RSS, Graph API) and the page-diff engine, which is the product itself.

**Buy:** review sites, LinkedIn, JS-rendered pages, anything requiring
fingerprint evasion.

---

## 7. Open issues

1. **Apify per-run cost unverified** — §4. Blocks confident pricing.
2. **`website` channel has never run.** Demo workspace shows 0 pages, 0
   snapshots. The 550-fetch figure is therefore modelled, not observed.
   Pricing-page change detection — a headline feature — is producing nothing.
3. **LinkedIn founder posts channel doesn't exist.** Net-new build.
4. **Anthropic rates** should be confirmed before quoting margins externally.

---

## 8. What this means for pricing

Unchanged from v1, and now on firmer ground: **cost is not an argument for
any price on the sheet.** At 94–95% expected margin, every tier works.

Two refinements the v2 numbers support:

- **Put review + LinkedIn channels behind Growth.** Not because Starter
  can't absorb them (it can) but because they're the channels a larger
  company values most, and it gives Growth a concrete reason to exist beyond
  a competitor count.
- **Seats remain the unpriced axis.** A 40-person sales org on Growth costs
  the same as a 3-person one. Still the clearest money left on the table.
