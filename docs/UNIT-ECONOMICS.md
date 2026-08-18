# Watchtower — Unit Economics

*Last revised: 18 August 2026 · Model in `scripts/econ.mjs`*

**Read this before touching pricing.** The GTM doc originally argued about tier
pricing without this underneath it, which was backwards.

---

## 1. The headline

| | |
|---|---|
| **Marginal cost per competitor** | **~$1.01 / month** |
| **Starter** (3 competitors, $99) | $3.02 cost → **96.9% gross margin** |
| **Growth** (10 competitors, $399) | $10.07 cost → **97.5% gross margin** |
| **Fixed platform floor** | **~$179 / month**, before a single customer |
| **Break-even** | **2 Starter** customers, or **1 Growth** |

**The conclusion that matters:** variable cost is almost irrelevant. This is a
near-pure-margin business at the unit level, and the entire real cost is a
fixed subscription floor that two customers cover.

---

## 2. Marginal cost, per competitor per month

Daily crawl = 30 runs/month.

| Line | Cost | Basis |
|---|---|---|
| LLM — competitor read | $0.180 | 1 read/crawl · ~2.5k in + 700 out · Haiku 4.5 |
| LLM — signal scoring | $0.090 | batched, ~20 new signals/day |
| Firecrawl | $0.240 | **only walled pages** · ~8 tracked pages, ~20% walled |
| Apify | $0.480 | 4 actors (G2, Capterra, Glassdoor, LinkedIn), weekly |
| DataForSEO | $0.016 | traffic + trends, weekly |
| Neon storage | $0.001 | measured: 11 MB / 11 competitors |
| **Total** | **$1.01** | |

### Confidence

| Input | Confidence | Note |
|---|---|---|
| Neon storage | **Measured** | 11 MB across 11 competitors, live DB |
| Channel latency | **Measured** | timed against live endpoints 17 Aug |
| LLM token counts | Estimated | from actual `max_tokens` in `claude.ts` / `reason.ts` |
| Anthropic rates | **Verify** | $1/$5 per MTok assumed — confirm current pricing |
| **Apify per-run cost** | **Weakest number** | actor compute varies 5–10× by actor. Largest single unknown |
| Firecrawl walled-rate | Estimated | 20% assumed; **untested — see §5** |

---

## 3. The fixed floor

This, not per-customer cost, is the real number at low volume.

| Service | Monthly | Needed for |
|---|---|---|
| Vercel Pro | $20 | hosting, cron |
| Neon Launch | $19 | Postgres |
| Clerk | $25 | auth (free to 10k MAU, then this) |
| Firecrawl Hobby | $16 | walled pages, Play Store, Google Ads |
| Apify Starter | $49 | G2 / Capterra / Glassdoor / LinkedIn |
| DataForSEO | $50 | minimum deposit — traffic & trends |
| Anthropic | usage | ~$0 at this scale |
| **Total** | **~$179/mo** | |

**You do not need all of this on day one.** Minimum viable floor is
**Vercel + Neon + Clerk + Anthropic ≈ $64/mo**, which runs 15 of 26 channels.
Firecrawl and Apify are additive, and each unlocks specific channels — buy them
when a customer asks for what they unlock, not before.

---

## 4. What this means for pricing

**Cost is not an argument for any price on this list.** At 97% margin, every
tier works. Price purely on value and willingness to pay.

Three consequences:

1. **My earlier "raise Starter to $149" argument stands, but not for cost
   reasons.** It's a *positioning* argument — a tier without reads and
   battlecards is a monitoring tool, and monitoring-tool is the comparison we
   lose to Visualping. Cost gives no reason to raise it.

2. **Competitor count is a weak pricing axis.** A competitor costs ~$1/month,
   so charging by competitor count is charging for something nearly free. It's
   fine as a *value* proxy (more competitors = bigger company = more value),
   but don't defend it on cost, and don't be precious about being generous with
   limits — going from 3 to 5 competitors costs $2.

3. **The dangerous axis is seats, not competitors** — and we don't charge for
   them at all. Worth revisiting: a 40-person sales org getting battlecards for
   $399 is under-monetised, and seats cost us nothing either.

### What would actually change the model

- **Reads regenerating per page view** instead of per crawl. Currently cached
  per crawl — keep it that way. Per-view generation on a busy workspace could
  10–50× the LLM line.
- **Google Ad Transparency via Firecrawl.** It returns a 2.4 MB JS shell, so
  it needs rendering. Daily × every competitor would make Firecrawl the largest
  line by far. Run it **weekly, not daily**, or accept LinkedIn-only ads.
- **Apify actors run daily instead of weekly** — 7× that line.
- **A customer with 100 competitors.** Still only ~$100/month marginal, but it
  would dominate the crawl window. Cap it or price it bespoke.

---

## 5. Open issue found while building this model

The demo workspace has **0 tracked pages and 0 snapshots**:

```
Crayon 0 · Klue 0 · Kompyte 0 · Signal Labs 0 · Visualping 0
snapshots: 0
```

So the **website capture + content-diff channel has never actually run** for
the demo competitors. Consequences:

- Pricing-page change detection — a headline feature — is not producing anything.
- The Firecrawl estimate above is **untested in practice**, because nothing has
  needed a walled fetch yet.

This should be fixed before trusting the Firecrawl line, and it's a product bug
independent of cost.

---

## 6. Sanity check against the incumbents

Klue and Crayon charge $15k–$40k/year. If their marginal cost resembles ours —
and there's no reason it wouldn't — their pricing reflects an enterprise sales
motion, not the cost of watching websites.

That's the whole wedge, and now it's quantified: **we can profitably charge
$99 because the work genuinely costs about a dollar.** We aren't undercutting
them with venture subsidy; we're charging closer to cost-plus because we don't
carry their sales overhead.

That is a defensible position, and it's worth saying out loud on the pricing
page.
