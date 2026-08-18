# Fortress HQ — Roadmap to working

*Last revised: 18 August 2026 · Sequenced by dependency, not by appeal*

Everything below is grounded in the codebase as audited on 18 Aug. **🔑 = you**
(accounts, keys, decisions). **⌨️ = code.**

---

## Phase 0 — Make it actually run

Nothing else matters until this is done. Today the product looks like it
works and, in two important places, doesn't.

| # | Task | Who | Why it blocks |
|---|---|---|---|
| 0.1 | **Set `ANTHROPIC_API_KEY`** in Vercel + `.env.local` | 🔑 | `claude.ts:6` returns `null` without it and every caller silently drops to a template. **The reasoning layer — the entire differentiator — is off.** |
| 0.2 | **Verify `CRON_SECRET` is set in Vercel** | 🔑 | `vercel.json` schedules `/api/cron/daily` at 07:00. Empty locally. If it's empty in prod too, **nothing has been collected, ever.** Check this first — it's 30 seconds and it changes what everything else means. |
| 0.3 | **Wire `planCrawl()` into `orchestrator.runCollection()`** | ⌨️ | `pages` has **zero rows**. Page-diff produces nothing: no pricing-change detection, and the competitor-site half of `mentions` is dead because it scans snapshots that don't exist. |
| 0.4 | **Wire tiering into sitemap ingestion** — `baseTier()` on discovery, `promoteOnContent()` on the one content fetch | ⌨️ | Without it every page is treated alike and the budget is spent on blog archives. |
| 0.5 | **Wire `isNewPageWorthSurfacing()` into signal creation** | ⌨️ | Stops "they published a blog post" cards, which is what teaches people to ignore a feed. |
| 0.6 | **Meter vendor runs and LLM calls through `budget.spend()`** | ⌨️ | Currently only the crawl is metered. An unmetered LLM call is an unbounded bill. |
| 0.7 | **Set `PLATFORM_ADMIN_EMAILS`** | 🔑 | `/admin` is ungated while empty. |

**Done when:** a fresh competitor added to a workspace produces dated signals
across all keyless channels within one crawl, `pages` fills, and a pricing
edit on day 2 shows up as a card.

---

## Phase 1 — Make it complete

| # | Task | Who | Notes |
|---|---|---|---|
| 1.1 | **Firecrawl Hobby $16** → `FIRECRAWL_API_KEY` | 🔑 | Completes the last ~20% of pages. 5,000 credits ≈ 25,000 fetches — plenty for 15 competitors. |
| 1.2 | **Free keys**: `META_ADS_TOKEN`, `REDDIT_CLIENT_ID/SECRET`, `PRODUCTHUNT_TOKEN` | 🔑 | ~30 min. Meta is the only channel returning **ad creative text** — everything else gives counts and formats. |
| 1.3 | **Subdomain → sitemap hop** | ⌨️ | A hostname found on the cert log never gets its own robots.txt fetched, so `interviewer-v2.klue.com` is known but never crawled. |
| 1.4 | **Resend + the weekly digest** | 🔑⌨️ | **No email exists at all** — no dependency, no send path. The GTM doc names the weekly digest as *the* retention mechanism, and CI churns when it becomes background noise. Free to 3k/mo. Needs SPF/DKIM/DMARC on the domain. |
| 1.5 | **"First light" email** on first collection completing | ⌨️ | Turns a signup that feels empty into one that feels alive. |
| 1.6 | **Apify free tier** → measure one real actor run | 🔑 | The last unverified number in the cost model. Prefer **pay-per-result** actors — the developer absorbs residential proxy, 2–19× cheaper. |

---

## Phase 2 — Make it sellable

| # | Task | Who | Notes |
|---|---|---|---|
| 2.1 | **Domain**: `fortress-hq.com` — decided 18 Aug 2026, register it | 🔑 | Rebrand from Watchtower to Fortress HQ. `fortresshq.com` (no hyphen) is taken; `.com`/`.io`/`.ai` with the hyphen are open. `sentryhq.*` was the other finalist — dropped for colliding with Sentry.io's registered "software monitoring" trademark in our own buyer's market. |
| 2.2 | **Stripe** — keys, products, webhook | 🔑⌨️ | **You cannot take money today.** All three env vars are empty and nothing reads them. |
| 2.3 | **Add `trial` plan** to `plans.ts` — $2, 7 or 14 days, full Starter | ⌨️ | Day 1 is genuinely populated (cert logs give ~10 months of history), so 7 days works. 14 costs $1.85 more and roughly doubles the odds a *change* signal lands during the trial. |
| 2.4 | **Usage panel** — `budget.usageSummary()` has no UI | ⌨️ | Limits people can't see feel like bugs. |
| 2.5 | **Publish the pricing page** at the new numbers | ⌨️ | Starter $149 / Growth $399 / Enterprise quoted. |

---

## Phase 3 — The two that compound

### 3A · Shared collection *(idea 1)*

The single highest-value piece of engineering on this list.

**Today:** `competitors` is per-org (`client.ts:166` — the slug unique
constraint was dropped and `org_id` added). Three customers tracking Crayon
means three separate crawls of the same site on the same day.

**Change:** collection keys on **domain**. A shared `entities` table does the
crawling once; `competitors` becomes an org's *subscription* to an entity,
carrying only the org-specific read and positioning.

**Effect:** 84% of cost is shareable. 1 customer $7.24 → 5 customers $1.96 →
10 customers **$1.30 (−82%)**.

**Why it's strategy, not plumbing:**
- Cost falls as you densify a vertical; a new entrant pays full freight
- It's an argument for sequencing markets rather than taking whoever signs up
- It creates the dataset for the benchmark layer — once you crawl 50 companies
  for 30 customers you know who hires before they ship and how often prices
  actually move. Nobody else has that.

**Scope:** `snapshots`, `stream_items` and `pages` move to entity scope; reads
and scoring stay org-scoped. Real work — days, not hours.

### 3B · The `/vs-` detector *(idea 2)*

Small build, disproportionate return. Everything needed already exists:
sitemap parsing finds `/vs-`, `/compare` and `/alternatives` paths, and
`mentions.ts` already scans page content for a brand name.

Three uses from one feature:
1. **Free tool** — `/tools/comparison-pages`: "who is writing about you?"
2. **Outbound** — run it on a prospect first. *"Three competitors published
   comparison pages about you this quarter, here they are"* is a
   demonstration, not a pitch.
3. **In-product** — a standing order that fires when a new one appears.

**Do 3B before 3A.** It's a fraction of the work and it feeds the funnel.

---

## Phase 4 — Later, and fine to be later

- **Public workspace** *(idea 3)* — make the demo permanent and public: our own
  market, live, including what competitors do to us. Self-maintaining proof.
- **Founder LinkedIn posts** — not built. Plausibly higher signal than company
  posts; founders tease launches.
- **Cert-log press beat** *(idea 4)* — a repeatable story format
- **Annual report** *(idea 5)* — needs 6 months of data first
- **Trustpilot API key** — the channel returns 403 and is dead without it
- **DataForSEO** — weakest channels, $50 minimum, skip until asked for

---

## The order, in one line

**0.2 → 0.1 → 0.3–0.6 → 1.1–1.2 → 1.4 → 2.2–2.3 → 3B → 3A**

Check the cron secret, turn on Claude, wire the crawl, buy Firecrawl, grab the
free keys, ship the digest, take money, build the `/vs-` detector, then do
shared collection.

**The first two are yours and take five minutes.** Everything in Phase 0 after
that is mine.
