# Watchtower — Unit Economics (v3)

*Last revised: 18 August 2026 · Models: `scripts/econ.mjs`, `scripts/econ-channels.mjs`*

**v1 under-counted; v2 over-counted.** v1 assumed 8 pages per competitor and
no vendor scraping. v2 fixed the page volumes but modelled Apify as $0.15 per
actor run, marginal — which was wrong in kind, not just degree. v3 uses
Apify's published pricing.

---

## 1. Headline

| Plan | Per competitor (marginal) | Total | Margin |
|---|---|---|---|
| **Starter** $149, 3 comps, 200 pages | $0.86 – $2.26 | $2.58 – $6.78 | **98.3% – 95.5%** |
| **Growth** $399, 10 comps, 1,000 pages | $1.48 – $2.88 | $14.76 – $28.76 | **96.3% – 92.8%** |
| **Enterprise** $1,500, 30 comps, 5,000 pages | $4.56 – $5.96 | $136.91 – $178.91 | **90.9% – 88.1%** |

**Fixed floor $406/mo. Break-even: 3 Starter or 2 Growth customers.**

Every plan sits far below the $12 planning ceiling, and below $15. The range
in each row is rental-priced Apify actors (low) versus pay-per-result actors
at the top of their band (high).

### The correction that matters: Apify is mostly a FIXED cost

Checked against apify.com/pricing, 18 Aug 2026:

| | |
|---|---|
| Platform plans | Free $0 ($5 credit) · **Starter $29** · Scale $199 · Business $999 |
| Compute | 1 CU = 1 GB-RAM-hour · **$0.20/CU** (Starter), $0.16 (Scale), $0.13 (Business) |
| Actors | **either** a monthly rental — LinkedIn Post Scraper is **"$30.00/month + usage"** — **or** pay-per-result, typically $1–10 per 1,000 |

**A rental covers every competitor and every customer.** It does not scale per
competitor at all. So the bulk of what v2 booked as marginal cost is actually
fixed:

| | v2 assumed | v3 verified |
|---|---|---|
| Apify marginal / competitor | $4.80 | **$0.19 – $1.59** |
| Apify fixed / month | (none) | **$209** ($29 platform + ~6 rentals) |

v2 was wrong by up to 25× on the marginal line. The practical consequence:
**Apify gets cheaper per competitor as you grow**, and the $12 ceiling is not
close to being threatened.

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
