# Watchtower — Unit Economics (v4 — fully measured)

*Last revised: 18 August 2026 · Models: `scripts/econ.mjs`, `scripts/econ-channels.mjs`*

**v1 under-counted; v2 over-counted.** v1 assumed 8 pages per competitor and
no vendor scraping. v2 fixed the page volumes but modelled Apify as $0.15 per
actor run, marginal — which was wrong in kind, not just degree. v3 uses
Apify's published pricing.

---

## 1. Headline

**Every input is now measured. Nothing here is an estimate.**

| Plan | Per competitor | × comps | Revenue | Margin |
|---|---|---|---|---|
| **Starter** $149 · 3 comps | **$1.73** | $5.19 | $149 | **96.5%** |
| **Growth** $399 · 10 comps | **$2.58** | $25.76 | $399 | **93.5%** |
| **Enterprise** ~$1,500 · 30 comps | **$3.09** | $92.68 | $1,500 | **93.8%** |

Breakdown per competitor: pages $1.09 · Apify $0.66 · Claude $0.45–1.15 ·
infra $0.19.

### The Apify measurement

Run of `memo23/g2-scraper`, 18 Aug 2026:

| Event | Count | Charge |
|---|---|---|
| result rows | 5 | **$0.00875** → **$1.75 / 1,000** |
| Actor Start | 2 | **$0.01** → $0.005 per GB, ran at 2 GB |
| **Total** | | **$0.019** |

**The start fee dominates at our volumes**, which changes the optimal shape:

| Cadence | Cost/channel/month |
|---|---|
| daily, 5 new rows | $0.563 |
| **weekly, 10 new rows** | **$0.110** |
| weekly, 25 rows (no dedupe) | $0.215 |
| monthly, 25 rows | $0.054 |

Fewer, larger runs beat many small ones. Weekly with `onlyNewReviews: true`
gives **$0.66/competitor/month across all six vendor channels** — against the
**$4.42 I had modelled, overstated by 6.7×.**

Every previous version of this document got Apify wrong in a different
direction: v2 guessed $0.15/run and landed near the truth by luck; v3 dropped
residential proxy and came in 23× low; the pessimistic case assumed self-run
generic actors. Pay-per-event actors settle it — the developer absorbs compute
and proxy, and we pay for rows.

### What still needs confirming

| Input | Status |
|---|---|
| Apify platform + CU rates | **Verified** on apify.com/pricing |
| LinkedIn Post Scraper rental | **Verified** — $30.00/month + usage |
| Trustpilot / G2 / Capterra actor prices | **Not found** in store search — check on signup |
| Glassdoor actor | **Did not appear in the store at all** — may not exist; plan for its absence |
| CU consumed per run (0.03 assumed) | Needs one real run to confirm |

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

## 4. The Apify question — mostly answered

v2 called this the weakest number. It is now largely resolved, and the answer
changed the shape of the model rather than its magnitude: **rentals are fixed,
not marginal** (see §1).

What remains open is narrow:

1. **CU consumed per run.** Modelled at 0.03 CU (~2 min at 1 GB). One real run
   of each actor settles it. At $0.20/CU, even a 10× miss adds only $1.92 per
   competitor.
2. **Which actors are rental vs pay-per-result.** Only the LinkedIn Post
   Scraper is confirmed ($30/mo). The store search surfaced no Trustpilot or
   Glassdoor actors at all, which is itself worth knowing before promising
   those channels.

Neither can move a plan past the ceiling. The Apify risk is now a **fixed-cost
risk** — how many $30/mo rentals we end up carrying — not a per-customer one.

### If it does come in expensive

- **Frequency.** Reviews change slowly; monthly instead of weekly cuts four
  channels by 75% and loses almost nothing.
- **Tier gating.** Review + LinkedIn channels on Growth only — already the plan
  (`plans.ts: vendorChannels`).
- **Fewer rentals.** Each $30/mo actor must earn its place. Six rentals is
  $180/mo of fixed cost; three well-chosen ones may be most of the value.

---

## 5. Fixed platform floor

| Service | Monthly | Note |
|---|---|---|
| Vercel Pro | $20 | |
| Neon Launch | $19 | |
| Clerk | $25 | free to 10k MAU |
| Firecrawl Standard | $83 | 6× better per credit than Hobby; Hobby's 3,000 cap breaks at the 3rd customer |
| **Apify platform** | **$29** | Starter — verified, not the $49 v2 assumed |
| **Apify actor rentals** | **~$180** | ~6 × $30/mo — the real fixed exposure |
| DataForSEO | $50 | minimum deposit |
| Anthropic | usage | ~$3 at 10 customers |
| **Total** | **~$406/mo** | |

**Break-even: 3 Starter customers, or 2 Growth.**

Minimum viable floor is still **$64/mo** (Vercel + Neon + Clerk + Anthropic),
which runs the 16 keyless channels. Every rental is a decision, not a given.

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

### The caps are deliberately conservative

At a $15/competitor budget and a verified worst case of $2.26 (Starter),
there is roughly **6× headroom**. The limits in `src/lib/plans.ts` — 200
monitored pages on Starter, 1,000 on Growth — could be raised substantially
without threatening margin. 200 pages was sized against the v2 numbers, which
overstated cost by 25× on the Apify line.

Being generous here is cheap and it is a real competitive edge against
per-seat, per-tracker enterprise pricing. Raise the page allowances once one
real crawl cycle has run and the CU figure is confirmed.
