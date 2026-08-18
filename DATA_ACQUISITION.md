# Fortress HQ — Data Acquisition Audit & Target Architecture

How each of the 22 channels *should* pull data, ranked by robustness. The rule:
**never hand-scrape when a real source exists.** Prefer, in order:

1. **Official API** — vendor-supported, stable, ToS-clean. Always first choice.
2. **Licensed data API** — a paid provider that legally resells the data
   (news, reviews, LinkedIn, traffic). Buys reliability + shifts ToS risk off us.
3. **Firecrawl** — managed headless-browser scraping for the open web. Handles
   bot walls, proxies, rendering. Use for anything genuinely scrape-only so we
   maintain zero custom evasion logic.
4. **Undocumented endpoint / DIY parse** — last resort, only where 1–3 don't
   exist. Must self-monitor for breakage (implausible-zeros doctrine).

Current state: too much of tier 4 (custom `smartFetch`/regex parsing). This doc
is the migration target.

---

## The 22 channels — current vs. target

| # | Channel | Best source (target) | Tier | Current | Action |
|---|---|---|---|---|---|
| 1 | Website & pricing | **Firecrawl** `/scrape` + change-tracking | 3 | DIY smartFetch | → Firecrawl (managed bot-wall/render) |
| 2 | Blog & changelog | **RSS** first, else Firecrawl of sitemap-new URLs | 1/3 | sitemap diff | add RSS auto-discovery as cheap first-line |
| 3 | YouTube | **YouTube Data API v3** (official, free quota) | 1 | channel RSS | keep RSS for new-video; add Data API for view traction |
| 4 | News & press | **Licensed news API** (GNews / Event Registry / NewsAPI.ai) | 2 | Google News RSS (fragile) | **replace** — RSS is a stopgap, not production |
| 5 | LinkedIn posts | **Licensed vendor** (Bright Data / Apify actor) | 2 | not built | vendor only — never DIY (ToS + ban risk) |
| 6 | Trustpilot | **Trustpilot Business API** (official) | 1 | page scrape (fragile) | **replace** with official API |
| 7 | G2 / Capterra | **Licensed vendor** (Apify / Bright Data); G2 partner API | 2 | not built | vendor; gate to paid tier |
| 8 | Job postings | **ATS board APIs** (Greenhouse/Lever/Ashby/Workable) | 1 | ✅ ATS APIs | add SmartRecruiters/Recruitee/Personio + jobs-aggregator fallback |
| 9a | Meta ads | **Meta Ad Library Graph API** (official) | 1 | ✅ Graph API | keep |
| 9b | Google ads | Transparency Center RPC (no official commercial API) | 4 | internal RPC | keep + self-monitor; vendor fallback if it breaks |
| 9c | LinkedIn ads | **Firecrawl** of public Ad Library (no API) | 3 | DIY parse | → Firecrawl for resilience |
| 10 | Funding & M&A | **Crunchbase API** (official, paid) | 1 | via news only | add Crunchbase for structured rounds/M&A |
| 11 | App stores | **iTunes Search API** + Play (google-play-scraper/Firecrawl) | 1/3 | iTunes only | add Google Play |
| 12a | Reddit | **Reddit OAuth API** (official) | 1 | ✅ OAuth | keep |
| 12b | Product Hunt | **Product Hunt GraphQL API** (official) | 1 | not built | add PH API |
| 12c | X / Twitter | X API (paid) or vendor | 2 | not built | defer / vendor (expensive) |
| 13 | Newsletters | **Inbound mailbox** (Resend inbound / IMAP) — not scraping | 1 | not built | persona inbox + parse webhook |
| 14 | Tech stack | DIY signature fingerprint (fine) or **Wappalyzer/BuiltWith API** | 1/4 | DIY regex | keep DIY (free, legit); API only for depth |
| 15 | Subdomain watch | **CT-log APIs**: crt.sh + **certspotter/Censys** fallback | 1 | crt.sh only (flaky) | add certspotter API fallback (crt.sh 502s often) |
| 16 | Secret shopper | **Inbound mailbox** — not scraping | 1 | not built | persona inbox; explicit opt-in |
| 17 | Customer logos | **Derive from the Firecrawl website capture** (LLM extract) | 3 | separate DIY scrape | fold into #1's capture — don't re-fetch the site |
| 18 | Events & webinars | Firecrawl events page + **Eventbrite/Luma APIs** | 1/3 | DIY page fetch | Firecrawl + event-platform APIs |
| 19 | Podcasts | **iTunes Search API** (free) / Listen Notes (paid) | 1 | ✅ iTunes | keep; Listen Notes for better relevance |
| 20 | Google Trends | **SerpAPI / DataForSEO Trends** (paid — no official API) | 2 | not built | paid API only; never DIY (Google blocks) |
| 21 | Traffic & SEO | **DataForSEO / Similarweb API** (paid) | 2 | not built | DataForSEO (cheaper); Scale tier |
| 22 | Glassdoor | **Licensed vendor** (Apify / Bright Data) | 2 | not built | vendor; opt-in |

---

## Scorecard

- **Genuinely official-API-backed (tier 1): 11 channels** — YouTube, Trustpilot,
  jobs, Meta ads, Crunchbase, app stores, Reddit, Product Hunt, newsletters,
  subdomains, podcasts, tech stack. These are robust and ToS-clean. **This is
  the majority — the product does NOT depend on fragile scraping for its spine.**
- **Licensed-API/vendor (tier 2): 6** — news, LinkedIn posts, G2/Capterra,
  Glassdoor, Google Trends, traffic. Paid, reliable, ToS handled by the vendor.
  Gate the expensive ones to paid plans (already in the pricing model).
- **Firecrawl-scraped (tier 3): 3** — website/pricing, LinkedIn ads, events.
  No API exists; Firecrawl gives managed rendering + bot-wall handling so we
  write zero evasion code.
- **Undocumented endpoint (tier 4): 1** — Google Ads Transparency RPC. The only
  true "no clean source" channel. Keep it, self-monitor, vendor-fallback ready.

So of 22: **only ~4 involve any real scraping, and 3 of those go through
Firecrawl, not custom code.** Everything else is an API.

---

## Architectural moves this audit forces

1. **One site capture, many signals.** Website, sitemap, tech-stack, customer
   logos and events all hit the *same* competitor domain. Today they're separate
   fetches (5× the requests, 5× the bot-wall exposure). Target: **one Firecrawl
   crawl per competitor per run → derive all site-based signals from that single
   captured HTML.** Cheaper (Firecrawl credits), faster, and one bot-wall pass.

2. **Firecrawl replaces all DIY browser scraping.** Kill the custom
   `smartFetch`/challenge-detection code for website, LinkedIn ads, events,
   logos. Firecrawl handles Cloudflare, JS rendering, and proxies as a service —
   we stop maintaining evasion logic (the single biggest maintenance sink in the
   MVP).

3. **Replace the two fragile stopgaps now, before launch:**
   - **News → a licensed news API** (GNews is cheapest to start). Google News
     RSS will embarrass us on reliability with paid traffic landing.
   - **Trustpilot → the official Business API.** Page-scraping a reviews site is
     needless when an API exists.

4. **Adopt the free official APIs we're not using yet:** YouTube Data API
   (traction metrics), Product Hunt GraphQL, Google Play, certspotter (subdomain
   fallback). All free, all higher-signal than what's there.

5. **The vendor layer is a deliberate paid-tier feature, not a gap.** LinkedIn
   posts, G2/Capterra, Glassdoor, traffic — route through licensed vendors
   (Apify/Bright Data/DataForSEO), gate to Growth/Scale, and every one degrades
   gracefully so the product feels complete without them.

---

## Provider shortlist (accounts to open)

| Provider | Covers | Cost model |
|---|---|---|
| **Firecrawl** | website, LinkedIn ads, events, logos capture | credits (~$83/mo 100k) |
| **GNews** or **Event Registry** | news #4 | ~$50–150/mo pooled |
| **Trustpilot Business API** | reviews #6 | free/low (public read) |
| **Crunchbase API** | funding #10 | paid tiers |
| **Apify** or **Bright Data** | LinkedIn posts, G2, Capterra, Glassdoor | pay-per-record |
| **DataForSEO** | Google Trends #20, traffic/SEO #21 | pay-per-request (cheap) |
| **Product Hunt / YouTube / Reddit / iTunes** | community, video, podcasts | free (OAuth/quota) |

No-key / free forever: ATS boards, Meta Ad Library, Google Transparency RPC,
crt.sh, certspotter, iTunes, YouTube RSS, sitemaps.

---

## Status — priority fixes shipped (2026-07-10)

- ✅ **News → GNews API** with Google News RSS fallback (`GNEWS_API_KEY`).
- ✅ **Trustpilot → Business API** with public-page/Firecrawl fallback (`TRUSTPILOT_API_KEY`).
- ✅ **Firecrawl is the production scrape path** + a per-run capture memo so
  website/tech-stack/logos share ONE fetch per competitor (consolidation).
- ✅ **Subdomains: certspotter fallback** for flaky crt.sh — verified live
  (Modash, which previously failed on crt.sh 503, now resolves via certspotter).
- ✅ Dead duplicate `metaAds.ts` deleted.

Custom `smartFetch` logic is retained only as the Firecrawl-less local-dev
fallback; with `FIRECRAWL_API_KEY` set, walled pages route through Firecrawl.

Still queued (post-launch, tier-by-tier): YouTube Data API metrics, Crunchbase,
Product Hunt, Google Play, and the vendor channels (LinkedIn posts, G2/Capterra,
Glassdoor, traffic) gated to paid plans.
