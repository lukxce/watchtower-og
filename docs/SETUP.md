# Fortress HQ — What to wire, create and configure

*Last revised: 18 August 2026 · Audited against the codebase, not from memory*

---

## 1. Environment variables

Everything the code reads, what it unlocks, and what it costs.

### Required — nothing works without these

| Variable | Status | Notes |
|---|---|---|
| `DATABASE_URL` | ✅ set | Neon pooled connection string |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | ✅ set | |
| `CLERK_SECRET_KEY` | ✅ set | |

### Required for the product to be itself

| Variable | Status | Cost | Unlocks |
|---|---|---|---|
| `ANTHROPIC_API_KEY` | ❌ **empty** | usage | **The Tower's reads, scoring, Ask.** `claude.ts:6` returns null without it and every caller silently drops to a template. This is the differentiator — it is currently off. |
| `CRON_SECRET` | ❌ empty locally | free | Guards `/api/cron/daily`. `vercel.json` schedules 07:00 daily. **If empty in production the watch is not running.** |
| `PLATFORM_ADMIN_EMAILS` | ❌ empty | free | Gates `/admin`. Ungated while empty. |

### Free keys — 30 minutes, no card

| Variable | Cost | Unlocks |
|---|---|---|
| `META_ADS_TOKEN` | free | Meta Ad Library — **the only channel that returns ad creative *text***. Everything else gives counts and formats only. |
| `REDDIT_CLIENT_ID` + `REDDIT_CLIENT_SECRET` | free | Reddit search — unfiltered practitioner opinion |
| `PRODUCTHUNT_TOKEN` | free | Launch detection with dates |
| `GNEWS_API_KEY` | free tier | **Optional.** Google News RSS already works keyless at 746ms. Higher limits only. |

### Paid — buy in this order

| Variable | Cost | Unlocks |
|---|---|---|
| `FIRECRAWL_API_KEY` | $16 Hobby / $83 Standard | The ~20% of pages that are JS-walled, plus Google Ads Transparency and Play Store. **Buy first** — it completes page-diff, which is the core product. |
| `APIFY_TOKEN` + `APIFY_G2_ACTOR` / `APIFY_CAPTERRA_ACTOR` / `APIFY_GLASSDOOR_ACTOR` / `APIFY_LINKEDIN_ACTOR` | $29 platform | Reviews + LinkedIn. Prefer **pay-per-result** actors — the developer absorbs the residential proxy, which is 2–19× cheaper than running generic actors yourself. |
| `DATAFORSEO_LOGIN` + `DATAFORSEO_PASSWORD` | $50 min | Traffic + search trends. **Skip initially** — weakest channels, highest minimum. |
| `CRUNCHBASE_API_KEY` | $$$ | **Skip.** Funding already arrives via News. |
| `TRUSTPILOT_API_KEY` | gated | Public page returns **403**, so this channel is dead without it. |

### Not yet used by any code

| Variable | For |
|---|---|
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PRICE_*` | Billing — **you cannot take money today** |
| `NEWSLETTER_INBOX` | Persona inbox → `/api/inbound`. Costs nothing but an address. |

---

## 2. Accounts to create

| Service | Plan for testing 15 competitors | Why |
|---|---|---|
| Anthropic Console | pay-as-you-go, ~$6/mo | the reasoning layer |
| Vercel | **Hobby, free** | cron limited to 1/day — fine |
| Neon | **Free, 0.5 GB** | ~15 MB needed |
| Clerk | **Free, 10k MAU** | |
| Firecrawl | **Hobby $16** (5,000 credits) | 25,000 fetches/mo across all 15 |
| Apify | **Free ($5 credit)** → Starter $29 | try free first with pay-per-result actors |
| Meta / Reddit / Product Hunt | free apps | three free channels |
| **Resend** (or similar) | **free tier, 3k emails/mo** | §4 — nothing exists yet |
| Stripe | free until you charge | billing |

**Total to run the test: $16–51/month.**

---

## 3. Code still to wire

Built and tested, but **nothing calls it yet**:

| Module | Status | Needs wiring into |
|---|---|---|
| `crawlQueue.planCrawl()` | inert — 0 callers | `orchestrator.runCollection()`. **`pages` has zero rows, so page-diff produces nothing today.** This is the biggest hole: pricing-change detection, the headline feature, is not running. |
| `pageTiers.baseTier()` / `promoteOnContent()` | inert | sitemap ingestion — assign tier on discovery, promote on the one content fetch |
| `pageTiers.isNewPageWorthSurfacing()` | inert | signal creation — stops "they posted a blog" cards |
| `budget.spend()` | partly wired | called by crawlQueue only. Needs adding to vendor runs and every LLM call. |
| `budget.usageSummary()` | inert | a usage panel in the app so limits are visible |
| Subdomain → sitemap hop | not built | a hostname found on the cert log never gets its own robots.txt fetched, so `interviewer-v2.klue.com` is known but never crawled |
| Shared collection | not built | the 84%-saving refactor: collection keys on domain, `competitors` becomes an org's subscription |
| Stripe | not built | no billing path at all |

---

## 4. Email — nothing exists

Confirmed by audit: **no email dependency in `package.json`, no send call anywhere.** `/api/inbound` receives mail (secret-shopper) but nothing sends.

This matters more than it looks. From the GTM doc: *"CI churns when it becomes background noise. The defence is the weekly digest — a recurring, visible reminder of value that lands in the inbox whether or not they open the app."* **That retention mechanism does not exist.**

### What to add

**Provider: Resend.** Free to 3,000/month, then $20. Good DX, React Email templates, and it does inbound too so `/api/inbound` could consolidate onto it.

```
RESEND_API_KEY=
EMAIL_FROM="Fortress HQ <watch@yourdomain>"
```

Plus DNS: SPF, DKIM and DMARC on the sending domain, or everything lands in spam.

### The emails, in priority order

| # | Email | Trigger | Why |
|---|---|---|---|
| **1** | **Weekly digest** | Monday 07:00 | **The retention mechanism.** Track its open rate as the leading churn indicator, ahead of app logins. |
| **2** | **First light** | first collection completes | Turns an empty-feeling signup into a populated one. Directly addresses the biggest onboarding risk. |
| 3 | Trial ending | day 5 of 7 | Converts the $2 trial |
| 4 | Threat alert | a signal clears a high bar | Must be rare — "the beacon is earned". Daily alerts train people to filter you. |
| 5 | Welcome | signup | Set expectations: what arrives, when |
| 6 | Payment failed | Stripe webhook | Involuntary churn is usually the largest churn bucket |

Clerk handles auth email (verification, password reset) — you do not need to build those.

---

## 5. Order I would do it in

1. **`ANTHROPIC_API_KEY`** — one paste, turns the differentiator on
2. **Verify `CRON_SECRET` in Vercel** — if it is empty in production, nothing is being collected at all
3. **Wire `planCrawl` into the orchestrator** — turns on page-diff, and converts three modelled assumptions (walled rate, CU per run, real change rate) into measurements
4. **Resend + weekly digest** — the retention mechanism, and it is small
5. **Firecrawl $16** — completes page coverage
6. **Free keys** (Meta, Reddit, Product Hunt) — 30 minutes, three channels
7. **Apify free tier** — reviews + LinkedIn, measure real actor cost
8. **Stripe** — before you need to charge anyone, not after
9. **Shared collection** — the refactor that makes cost fall as you densify a vertical
