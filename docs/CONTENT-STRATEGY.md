# Fortress HQ — Website & Content Strategy

*Owner: Luka Jovanović · Last revised: 18 August 2026*

---

## 1. The thesis

**We publish what the product finds.**

Every competitive-intelligence company on earth publishes "10 Competitive Intelligence Best Practices." It ranks, briefly, and converts nobody, because it proves nothing. We have something none of them have: a machine that finds real, checkable, slightly uncomfortable facts about named companies every single day.

So the content strategy is one sentence: **the blog is the product's output, edited.**

That gives us three things at once:
1. **Proof.** A post that says *"Klue is building an AI voice interviewer — we read it off a certificate log"* is a live demo disguised as an article.
2. **Defensibility.** Competitors can copy a listicle. They cannot copy a finding they didn't make.
3. **Distribution.** Naming real companies is inherently shareable. The subject often shares it themselves.

### The risk, and the rule

Publishing findings about named companies is the whole strategy and also the whole risk. The rule that keeps it safe:

> **Report only what is public, cite it, and never assign motive.**

"Three hostnames appeared on the public certificate log" is a fact. "Klue is desperately racing to catch up" is a story we don't get to tell. If a finding can't survive the named company reading it, it doesn't ship. In practice this has been fine — the tone is analytical, not gossipy, and the named companies are usually flattered to be considered a serious player.

**Never publish** anything sourced from a private beta, a leaked doc, a customer's workspace, or an NDA'd conversation. Public web only. That constraint is also the brand.

---

## 2. Website architecture

The full sitemap, not just the blog. Current state marked.

```
/                        Home — the argument, the fog of war, live battlecards    ✅ live
/pricing                 Published tiers, comparison, FAQ                          ✅ live
/blog                    Index, category filters, generated covers                 ✅ live
/blog/[slug]             Post                                                      ✅ live
/contact                 Sales / enterprise                                        ✅ live
/demo                    One-click live demo, no account                           ✅ live
/sign-up · /sign-in      Auth                                                      ✅ live

── to build ──────────────────────────────────────────────────────────────────
/tools                   Free tools index — the lead-gen engine        ⬜ §4
/tools/hiring-signal     What is a company hiring for right now?       ⬜
/tools/pre-launch        What are they building? (cert-log radar)      ⬜
/tools/ad-check          Are they advertising, and with what?          ⬜
/tools/comparison-pages  Who is writing "vs you" pages?                ⬜
/tools/stack             What's their tech stack?                      ⬜

/vs/crayon               Comparison page                               ⬜ §5
/vs/klue                 Comparison page                               ⬜
/vs/kompyte              Comparison page                               ⬜
/vs/visualping           Comparison page                               ⬜
/alternatives/[brand]    "X alternatives" — a different intent          ⬜

/watch/[industry]        Public industry watch pages (SEO + proof)      ⬜ §6
/newsletter              First Light — subscribe                        ⬜ §7
/glossary/[term]         CI glossary — cheap, honest topical coverage   ⬜
/changelog               Public product changelog                       ⬜
/about                   The story, the lore, who's behind it           ⬜
/security                Data handling, what we do and don't collect    ⬜ — enterprise blocker
/docs                    How each channel works, methodology            ⬜ — trust asset
```

### Priority order

1. **`/tools/*`** — highest leverage. Each is a working demo, a lead magnet and a ranking asset simultaneously.
2. **`/vs/*`** — highest intent traffic in the category. Someone searching "Crayon alternative" is in-market today.
3. **`/security` + `/docs`** — not traffic plays; they unblock deals. Ship before the first enterprise conversation.
4. **`/watch/[industry]`** — the scaled play. Only after tools prove the pipeline.
5. **`/newsletter`** — the compounding asset. Start collecting emails immediately even if the first issue is a month out.

---

## 3. Blog

### Pillars

Four, in descending order of how much they differentiate us.

**Pillar 1 — Field notes (50% of output).** A real finding about a real company, with the evidence. This is the pillar nobody can copy.
- *"Klue is building an AI voice interviewer. We read it off a certificate log."* ✅ published
- *"Kompyte's careers page started returning 404. That's how we knew."* ✅ published
- *"Visualping pushed 141 pages into /pages/ in one week. Here's the play."*
- *"Nobody in this category advertises on LinkedIn except one company."*

**Pillar 2 — Method (25%).** How a specific public signal works, taught properly, so the reader could do it manually — and immediately understands why they won't.
- *"Ad libraries are public. Almost nobody in your company reads them."* ✅ published
- *"Certificate transparency logs, explained for people who don't run infrastructure."*
- *"How to read an ATS board API, and what hiring actually tells you."*
- *"Sitemap diffing: the cheapest competitive signal there is."*

**Pillar 3 — Opinion (15%).** Category arguments we're willing to have in public.
- *"Every competitive intelligence tool has the same blind spot"* ✅ published
- *"What $15,000/year buys you in CI, and why it shouldn't have to"* ✅ published
- *"'AI-powered' is doing a lot of work in this category"*
- *"Your competitor's silence is a signal too"*

**Pillar 4 — Practitioner (10%).** Genuinely useful craft content for the PMM/sales reader. This is the pillar everyone else does; we do the least of it, and only when we have a real angle.
- *"A battlecard a rep will actually open"*
- *"The five objections you should already have answers to"*

### Cadence

**One post a week, published Tuesday.** Not more. The value is that each post contains a real finding, and findings don't arrive on a content calendar. A thin week gets a Method post from the backlog rather than a filler listicle.

### Format rules

- **Lead with the finding.** No throat-clearing, no "In today's fast-paced market."
- **Show the evidence** — the hostname, the screenshot, the timestamp, the link.
- **800–1,500 words.** Long enough to prove it, short enough to read.
- **Every post ends with the same honest CTA**: this is what the product does automatically, here's the live demo.
- **Generated SVG covers**, in-palette, keyed to the post. Never stock photography.
- **Author is a person**, not "Fortress HQ Team."

### The editorial flywheel

```
The product finds something
    → it's genuinely interesting?  → Field note post
    → it's a technique?            → Method post
    → it contradicts category orthodoxy? → Opinion post
    → nothing this week?           → Method backlog
Every post → newsletter issue → social thread → /watch page evidence
```

---

## 4. Free tools — the lead-gen engine

This is the highest-leverage unbuilt thing on the list.

Each tool takes a domain, returns a real answer in seconds, and is a **working slice of the product**. No email gate on the result — gate the *depth* instead ("this is one channel; Fortress HQ watches 28 — see all of them for this domain").

### What's actually cheap and fast

I timed every keyless source against live endpoints on 17 Aug 2026. These are real numbers, not estimates:

| Source | Latency | Cost | Verdict |
|---|---|---|---|
| YouTube channel RSS | **105ms** | free | ✅ |
| Greenhouse ATS API | **387ms** | free | ✅ best-in-class |
| iTunes Search (apps, podcasts) | ~500ms | free | ✅ |
| Events / webinar pages | 567ms | free | ✅ |
| Google News RSS | **746ms** | free, **no key** | ✅ |
| Sitemap XML | 942ms | free | ✅ |
| Homepage fetch (tech stack) | 1.4s | free | ✅ |
| **certspotter** (cert transparency) | 3.2s | free | ✅ the unique one |
| crt.sh | — | free | ⚠️ **returned 429, rate-limited** — certspotter is the reliable path |
| LinkedIn Ad Library | 435ms | free | ⚠️ usable, watch for blocking |
| Google Ad Transparency | 572ms | free | ❌ returns a 2.4MB JS shell — needs rendering → Firecrawl → **costs money** |
| Trustpilot public page | — | free | ❌ **returned 403** |

**One competitor across the whole free set: ~10s sequential, ~3s in parallel.** That is fast enough to run synchronously in a web page.

### The answer on Google News

**No API key needed.** Google News RSS is free and unauthenticated — 746ms, no quota headaches. `GNEWS_API_KEY` is an optional upgrade for higher limits and cleaner metadata, not a requirement. We already run on the free RSS path.

**Important caveat learned the hard way:** a bare name search is worthless for common brand names. Searching `"Fortress HQ"` returned ten results — the Dylan/Hendrix song ×3, a prog-metal band, a 2015 film, a medieval farmhouse. Every news-based tool or feature must classify matches (*client / same-name / noise*) before showing them. This is now enforced in `src/lib/mentions.ts`.

### The tools, ranked by build-value

**1. Hiring Signal** — `/tools/hiring-signal` · *387ms, free*
Enter a domain → every open role from their ATS, grouped by department, with the read. *"8 in Customer Experience, 5 in Sales, 4 in Engineering, 10 senior+ — that's a go-to-market build, not a product build."*
**Why first:** fastest, most reliable, zero cost, and hiring is the signal executives intuitively trust. Works on Greenhouse, Lever, Workable, Ashby.

**2. Pre-launch Radar** — `/tools/pre-launch` · *3.2s, free*
Enter a domain → hostnames on the public certificate log that look like buildouts, with the vetoes applied so it doesn't return `mail.` and `www.`.
**Why:** this is the *"how did you even know that"* tool. It's the single most impressive thing we do, and nobody else offers it self-serve. Biggest share potential.

**3. Comparison-page finder** — `/tools/comparison-pages` · *942ms, free*
Enter a domain → every `/vs-`, `/compare`, `/alternatives` page on their sitemap.
**Why:** immediately actionable for a PMM, and it surfaces *"they wrote a page about you and you didn't know"* — which is a visceral reason to buy.

**4. Ad check** — `/tools/ad-check` · *435ms LinkedIn, free*
Enter a domain → are they running LinkedIn ads, how many, what formats.
**Why:** high interest. **Scope to LinkedIn only** — Google Ad Transparency needs a rendered browser and would put a paid Firecrawl call behind a free tool. Say so honestly on the page.

**5. Stack sniffer** — `/tools/stack` · *1.4s, free*
Lowest differentiation (BuiltWith and Wappalyzer own this) but cheap and completes the set. Build last, or not at all.

### Tool page pattern

Every tool page follows the same shape, which is also an SEO asset:

```
H1: What is [company] hiring for right now?
[ domain input ] → live result in <1s
The read — plain language, what it means
"This is 1 of 28 channels Fortress HQ watches. See all of them for [domain] →"
Method: exactly where this data comes from, and its limits
FAQ (schema markup)
```

The **method section is not optional.** It's a trust asset and it ranks.

---

## 5. Comparison pages `/vs/*`

Highest-intent traffic in the category. Someone typing "Crayon alternative" is in-market this quarter.

**The rule that makes these work: be scrupulously fair.** Name what the competitor is genuinely better at. A comparison page that claims total victory converts nobody, because the reader already knows the incumbent is good — that's why they're researching it.

Structure:
1. One-paragraph honest summary — who each is genuinely for
2. Feature table, no rigged rows
3. **Pricing, stated plainly** — our strongest card against Klue/Crayon/Signal Labs, all of whom gate it
4. "Choose Crayon if…" — and mean it
5. "Choose Fortress HQ if…"
6. Live demo CTA

We should also, with a straight face, **run these competitors in our own demo workspace** — which we already do. That's the flex: *our comparison pages are maintained by the product.*

---

## 6. `/watch/[industry]` — the scaled play

Public, auto-maintained industry watch pages: *"Competitive intelligence in influencer marketing — who's hiring, who's advertising, who's shipping."* Real data, refreshed weekly, from workspaces we already run.

**This is programmatic SEO, and we must do it in a way we'd be willing to write a blog post about** — since we publicly called out a competitor for pushing 141 templated pages into one directory. The difference must be real:

- **10–20 pages, not 10,000.** Only industries we genuinely track.
- **Real, current data on every page** — no templated filler.
- **Actually useful without signing up.**
- **Refreshed on a schedule**, not generated once and abandoned.

If we can't meet that bar for an industry, we don't publish the page. Hypocrisy here would cost more than the traffic is worth.

---

## 7. Newsletter — *First Light*

Named after the product's own morning-briefing moment. Weekly, Tuesday, same day as the blog post.

**Format** (short — 3 minutes, read on a phone):
- **One finding.** The week's best real signal, named company, cited.
- **Three lines from the watch.** Shorter movements across the category.
- **One method note.** A technique the reader can use themselves.
- One link to the week's post.

**Why it compounds:** it's the product's own output shape. Subscribing to the newsletter is a low-commitment trial of the actual value proposition. The conversion path is `newsletter → "I want this for my competitors" → demo`.

### On scraping industry newsletters

Worth being careful here. **Reading other people's newsletters as a signal source for our own customers is a legitimate feature** — we already have the mechanism: `NEWSLETTER_INBOX` + `/api/inbound`, a persona inbox that subscribes to competitors' own mailing lists and ingests what arrives. That's secret-shopper research, it's how CI has always worked, and the emails were sent to us.

**Republishing their content in our newsletter is not.** Aggregating someone's newsletter into ours is a copyright and goodwill problem, and it's a bad look for a company whose brand is "we cite everything."

The line: **use inbound newsletters as private signal for the customer's own workspace; write our own findings for publication.** Link to and credit other people's work; never repackage it.

---

## 8. Distribution

Ranked by realistic yield for a founder-led company.

1. **LinkedIn, founder account.** The ICP lives here. One post per finding, written as the finding itself — not "check out our new blog post." Highest-yield channel by a distance.
2. **The named company shares it.** A well-researched, fair post about Klue often gets shared *by* Klue. Free distribution from your competitor is the strategy working as designed.
3. **Communities** — Product Marketing Alliance, Sharebird, r/ProductMarketing, relevant Slacks. Contribute findings, not links. Long-lead, high-trust.
4. **SEO** — tools and `/vs` pages compound quietly. 6–12 month horizon; don't judge it early.
5. **Newsletter** — owned, compounding, immune to algorithm changes.
6. **Product Hunt** — one shot, worth it, but only once `/tools` are live so there's something to try without signing up.

**Not doing:** paid ads before organic proves message-market fit; guest posts on generic SaaS blogs; anything that requires a content mill.

---

## 9. Measurement

Leading indicators, because at this stage revenue is too sparse to steer by.

| Metric | Target by end of Q4 2026 | Why |
|---|---|---|
| Tool runs / week | 500 | The clearest proof the wedge works |
| Tool → demo rate | 15% | Tests whether the gate is placed right |
| Demo → sign-up | 25% | Tests the product's first five minutes |
| Newsletter subs | 1,000 | Compounding owned audience |
| Posts with a real named finding | 100% of Field Notes | The whole differentiation |
| `/vs` pages ranking top 10 | 2 of 4 | In-market intent |

**The one that matters most:** *tool runs → demo*. If people run the free tool and don't want the full thing, the problem is the product's first five minutes, not the marketing. That's a much more useful signal than traffic.

---

## 10. First 90 days

**Weeks 1–3** — Build `/tools/hiring-signal` and `/tools/pre-launch`. Both are near-free to run and the code already exists in the collectors; it's a UI and a rate limiter. Ship `/newsletter` capture.

**Weeks 4–6** — `/vs/crayon` and `/vs/klue`. Write `/security` and `/docs` — they'll be asked for. Start weekly posting cadence properly.

**Weeks 7–9** — `/tools/comparison-pages` and `/tools/ad-check`. First *First Light* issue. Begin LinkedIn cadence in earnest.

**Weeks 10–12** — First three `/watch/[industry]` pages, only for industries genuinely tracked. Product Hunt launch once tools are live. Review tool→demo conversion and fix the first five minutes.

**Deliberately not in the first 90 days:** paid acquisition, a rebrand, conferences, or `/glossary`. All are distractions until the tool→demo→paid path converts.
