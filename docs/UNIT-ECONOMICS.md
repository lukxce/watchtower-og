# Watchtower — Unit Economics (v5)

*Revised 19 August 2026, after running every channel end to end.*
*Apify figures come from Apify's own billing API, not from estimates.*

---

## 1. Headline

| Plan | Comps | Variable cost | Revenue | Margin |
|---|---|---|---|---|
| **Starter** $149 | 3 | **$3.67 – $5.77** | $149 | **96.1 – 97.5%** |
| **Growth** $399 | 10 | **$12.25 – $19.25** | $399 | **95.2 – 96.9%** |
| **Enterprise** ~$1,500 | 30 | **$36.75 – $57.75** | $1,500 | **96.2 – 97.6%** |

**Per competitor: $1.22 – $1.92 / month.** v4 said $1.73 – $3.09.

The range is entirely Claude. Everything else is now a measured constant.

---

## 2. Apify — measured, not modelled

31 real runs, billed by Apify:

| Actor | Runs | Billed | Per run |
|---|---|---|---|
| zen-studio reviews (G2 + Capterra + TrustRadius) | 13 | $5.290 | **$0.4069** |
| memo23 Glassdoor | 8 | $0.230 | **$0.0288** |
| harvestapi LinkedIn | 9 | $0.022 | **$0.0025** |
| zen-studio Gartner | 1 | $0.019 | **$0.0188** |

Scaled to production volumes (25 rows, not the 5 used in testing) and to each
channel's cadence:

| Channel | Cadence | $/competitor/month |
|---|---|---|
| reviews | monthly | **$0.407** |
| linkedin | weekly | $0.164 |
| glassdoor | weekly, incremental | $0.150 |
| gartner | monthly | $0.054 |
| **Total** | | **$0.775** |

### The rental line was wrong and is now zero

v4 carried **~$180/month of Apify actor rentals** — six actors at $30. All four
actors actually chosen are **pay-per-event**. That is **$180/month of fixed
cost that does not exist**, and it was the single largest error in the model.

### Where the Apify money goes

The combined reviews actor is **53% of all Apify spend** and the least
efficient thing we run: it enforces a 100-row floor and has no incremental
mode, so every monthly run re-pulls and re-bills reviews already held. Every
other actor bills only what is new.

Moving G2 to a per-channel incremental actor would cut Apify spend by roughly
half. Not worth doing at $0.41/competitor/month — but it is the first place to
look if review coverage ever expands.

---

## 3. Firecrawl — the real fixed cost

**Verified: the free tier is 1,000 credits/month.**

At 550 page fetches per competitor per month, ~20% needing rendering, at ~2
credits per render: **~220 credits per competitor per month**.

So the free tier covers **about 4.5 competitors** — roughly one Starter
customer. **Standard ($83/mo) is needed from customer two**, not "later".

At $83 it is more than half the entire fixed floor, and the largest single
cost in the business.

---

## 4. Fixed floor

| Service | Monthly |
|---|---|
| Firecrawl Standard | $83 |
| Apify Starter | $29 |
| Vercel Pro | $20 |
| Neon Launch | $19 |
| Clerk | $0 (free to 10k MAU) |
| **Total** | **$151** |

v4 said $406. The difference is the $180 of phantom rentals, Apify being $29
rather than $49, and DataForSEO's $50 not yet being committed.

**Break-even: 2 Starter customers, or 1 Growth.**

---

## 5. The one number still unmeasured

**Claude, at $0.45 – $1.15 per competitor per month.**

It is now the **largest single variable line** — bigger than all of Apify
combined — and the only one still estimated. Every previous version of this
document treated Apify as the big unknown; that has inverted.

The whole $3.67–$5.77 spread on Starter is this line. Worth measuring before
quoting margins to anyone outside the company.

---

## 6. What this means

Cost still argues for nothing. At 95–98% margin, every price on the sheet
works, and the caps in `src/lib/plans.ts` remain far more conservative than
they need to be.

Two things did change:

1. **Break-even halved** — 2 Starter customers instead of 3, because the
   rental cost was imaginary.
2. **Firecrawl is the cost centre now**, not scraping vendors. If anything
   gets optimised, optimise page fetches: fewer tier-1 pages, better change
   detection, more plain fetches that never reach the render step.
