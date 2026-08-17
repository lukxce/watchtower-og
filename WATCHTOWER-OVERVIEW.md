# What Watchtower Is

Watchtower is a competitive-intelligence SaaS: it watches your competitors across the public web, all day every day, and turns what it finds into a briefing you can actually act on, not a pile of alerts you have to interpret yourself.

**One line:** know your competitors' next move before your customers do.

**The lore, which is also the literal architecture:** Scouts gather. The Tower sees — and tells you what it means.
- **Scouts** = the individual collectors, one per data channel (pricing pages, job boards, ad libraries, certificate logs, press, review sites…).
- **The Tower** = the product. It sees everything the scouts bring back, reads it together per competitor, and writes the briefing.

---

## The problem it solves

Most teams track competitors by hand: a shared doc someone updates when they remember, a Slack channel where people paste screenshots, a "competitive intel" tab in Notion that's six months stale. You find out a competitor cut their price, launched a feature, or landed a funding round from a lost deal or a LinkedIn post, three weeks after it happened.

The tools that exist to fix this mostly forward raw detections: "this page changed," "this ad appeared," with no read on whether it matters or what it means together with everything else that competitor is doing.

Watchtower does two things differently:
1. **It watches continuously and broadly** — 22 public channels per competitor, not just their homepage.
2. **It reads signals together, not in isolation.** Ten ads on the same day is one story, not ten alerts. A new hostname plus a hiring cluster plus a funding round in the same window is a launch forecast, not three unrelated pings.

---

## Who it's for

B2B teams who need to actually act on competitive information: sales (objection handling, win/loss), marketing (positioning, comparison pages), product (roadmap and pricing moves), and founders/execs who want the state of the market without assigning someone to compile it.

---

## How it works

1. **Scouts collect, daily, across 22 channels**: pricing pages, Google & LinkedIn ad libraries, job boards, certificate transparency logs (catches pre-launch subdomains before they're announced), press & news, G2/Trustpilot reviews, changelogs, sitemaps, tech stack, podcasts, events pages, logos/social-proof pages.
2. **Signals are bundled, not dumped.** 66 ads observed in a day becomes one card describing the platform/format mix, not 66 separate alerts. Five articles covering the same funding round become one story with five citations.
3. **The Tower reads each competitor's whole picture** — moves, buildouts, hiring, all considered together — and writes one narrative read per competitor, personalized to your own company (not generic advice pulled off their homepage). Every claim is sourced: a link, a captured timestamp, and if a page can't be fetched, the product says so instead of guessing.
4. **Launch Radar** fires only when independent signal types genuinely align in the same window (e.g. a new pre-launch hostname *and* a hiring cluster *and* a funding round) — not on any single signal. Confidence is labeled High / Medium / Emerging based on how many independent things corroborate.
5. **Mentions** tracks where your own brand shows up — on competitor pages, in the press, in reviews — so you know when a competitor starts targeting your specific gap before your prospects find out.

**No false fires is a product law, not a slogan**: no fabricated rows, no confidence-score hand-waving, no silent failures. If a page can't be verified, it isn't shown as fact.

---

## The core surfaces

| Page | What it's for |
|---|---|
| **Overview** | The daily 10-second read: activity chart across all competitors, bundled highlights, competitor ratings, biggest-threat spotlight, launch radar preview, "Ask the Tower" free-text query. |
| **Feed** | The full bundled signal stream, ranked by impact, one card per thing that actually happened. |
| **Battlecards** | One card per competitor: the Tower's read (a whole-picture narrative), their strengths, their vulnerabilities, and exactly how *your* company wins against them — plus a side-by-side comparison table and positioning map. |
| **Radar** | Launch forecasts: which competitors are showing signs of shipping something new, and the evidence behind each forecast. |
| **Industry** | The wider market pulse — news and moves beyond your tracked competitor set. |
| **Mentions** | Where your own brand shows up across competitor sites, the press, and captured signals. |
| **Admin** (platform-admin only) | Cross-tenant view of every customer workspace, "view as" impersonation for support/QA, and a feedback loop that teaches the reasoning layer what a good read looks like. |

---

## What makes it different

- **Verifiable by design.** Every claim cites its source and capture time. A competitor "raised funding" always links to the article that says so.
- **Bundled, not dumped.** The product does the work of grouping related detections into one meaningful event instead of making you do that triage yourself.
- **Personalized battlecards**, not a copy of the competitor's own website. The read is written relative to *your* company's positioning.
- **Honest about gaps.** When a page can't be fetched or a connection is only circumstantial timing, the product says exactly that instead of overclaiming.
- **Self-serve pricing**, published up front — no five-figure quote after a demo call.

---

## Under the hood (brief)

- **Next.js 15** (App Router) on **Vercel**.
- **Postgres**: Neon in production, an embedded PGlite database for zero-setup local dev.
- **Clerk** for auth and multi-tenancy (organizations = workspaces; every row is scoped to an `org_id`).
- **Claude** powers the reasoning layer that writes each competitor's read/briefing, grounded only in real retrieved signals — never freeform generation detached from evidence.
- Collectors are channel-specific modules (ads, jobs, subdomains via certificate transparency, news, reviews, etc.) that run daily and feed a shared scoring + bundling pipeline.

---

## Pricing (self-serve, from $99/mo)

- **Starter — $99/mo**: 3 competitors, bundled feed & Threat Index, comparison-page discovery, weekly digest.
- **Growth — $399/mo**: 10 competitors, all channels, reads & auto-generated battlecards, campaign/landing-page tracking, Slack/Teams digest.
- **Enterprise — custom**: unlimited competitors, SSO, CRM battlecard surface, dedicated onboarding.

---

## Where it stands today

Watchtower started as an internal tool built for **Hypefy** (an AI-powered influencer-marketing platform) to track its own competitor set, and is being productized into a standalone SaaS. That Hypefy workspace still exists as the development dataset.

The **public demo** (`/demo`, no account needed) now runs Watchtower's *own* market instead — five real competitors in competitive intelligence: Kompyte, Crayon, Klue, Visualping and Signal Labs, with genuine signals, not mocked data. The marketing site should show our industry, not a borrowed example set.
