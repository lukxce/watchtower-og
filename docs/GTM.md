# Watchtower — Go-To-Market Strategy

*Owner: Luka Jovanović · Last revised: 18 August 2026*

---

## 0. The short version

Watchtower sells competitive intelligence to B2B companies who currently do it in a stale Notion doc. The category is well-established, the incumbents are expensive and enterprise-gated, and the wedge is **published pricing plus verifiable output**.

The motion is **product-led with a founder-led sales overlay**: free tools and a no-account demo pull people in, self-serve converts the small deals, and the founder personally closes anything above $399/mo for the first year.

**The single most important thing to prove in the next two quarters:** that someone who runs a free tool, opens the demo and sees their own competitors will pay $99 without talking to anyone. Everything else is downstream of that.

---

## 1. Market

### Category and size

Competitive intelligence software is a real, funded category — Crayon and Klue have both raised substantially, and Semrush bought Kompyte. That's good news: **the category doesn't need to be created, only re-priced.** Buyers already have budget lines and search terms.

The interesting structural fact: the incumbents converged on enterprise. Their sales motion (demo call → quote → procurement) rules out the entire mid-market, which still has the problem and now has no serious option. That's the gap.

### Where the money currently goes

| Today's solution | Who uses it | Annual cost | Why they'd move |
|---|---|---|---|
| Nothing / a Notion doc | Most companies under 200 staff | $0 | It's stale and everyone knows it |
| Google Alerts + manual checks | Scrappy PMMs | $0 | Noise, no synthesis, no coverage |
| Visualping or similar | Teams who solved one channel | ~$500/yr | One channel, no interpretation |
| Klue / Crayon | Enterprise PMM teams | $15k–$40k/yr | Cost, and needing a person to run it |
| A junior analyst's time | Series B+ | $60k+/yr | It's a person doing a machine's job |

**The realistic near-term source of revenue is column one and column three** — not stealing enterprise accounts from Klue. We win people who have the problem and no budget for a $20k tool.

---

## 2. ICP

### Primary ICP — "the PMM of one"

- **Company:** B2B SaaS, 20–200 employees, Series A to B
- **Buyer:** Head of Product Marketing, or a founder still doing PMM
- **Trigger:** lost a deal to a competitor, or got surprised by a launch
- **Budget authority:** can expense $99–$399 without a committee ← *decisive*
- **Competitor count:** 3–10 named companies they think about weekly
- **Why they buy:** they are one person expected to know everything about a market

### Secondary — sales leadership

Head of Sales / Enablement at the same company size. Buys for battlecards and objection handling. Often the one who *feels* the pain most acutely (reps losing deals) but is less likely to go looking for a tool. **Reachable through the PMM, not directly.**

### Tertiary — the founder

10–50 staff, no PMM at all. Buys Starter for themselves. Small deals, fast decisions, high churn risk, but excellent early proof and word-of-mouth.

### Anti-ICP — say no to these

- **Enterprise procurement cycles.** No SSO, no SOC 2, no MSA today. A six-month sales cycle at this stage is fatal, not flattering.
- **Agencies wanting to resell.** Multi-tenant reselling breaks the workspace model.
- **Anyone in a market with no public signal** — heavily offline, regulated, or stealth-mode categories. The product can't work and the churn will be brutal.
- **"Can you also track my customers?"** That's a different product.

---

## 3. Positioning and the wedge

### The wedge, in one line

> **The incumbents make you book a call to learn the price. We publish it, and you can be looking at your own competitors in ninety seconds.**

This is the whole entry strategy. It's not a feature, it's a business-model difference, and it's very hard for Klue or Crayon to copy without cannibalising an enterprise price book.

### The three proof points, in order

1. **Verifiability.** Every claim cites its source. This is the trust wedge, and it's enforced in code, not marketing. In a category full of "AI-powered insights," being the one that shows its work is a real position.
2. **Price transparency.** $99 on the pricing page. A direct shot at a demo-gated category.
3. **Depth of channel coverage.** 22 public channels including certificate transparency — which finds pre-launch buildouts nobody has announced. This is the "how did you even know that" moment that sells the product in a demo.

### Objection handling

| Objection | Answer |
|---|---|
| *"How is this different from Google Alerts?"* | Alerts forward mentions. We watch 22 channels, group ten ads into one event, and tell you what it means. Also: alerts don't read certificate logs. |
| *"We already use Crayon."* | Then you already believe in the category. The question is whether you're getting $20k of value, and whether your team actually opens it. |
| *"$99 seems too cheap to be good."* | The incumbents' price reflects an enterprise sales motion, not the cost of watching a website. We don't have that motion. Try the demo. |
| *"Is this legal?"* | Everything is public data — the same pages, ad libraries and certificate logs anyone can open. We don't scrape anything behind a login and we don't touch personal data. |
| *"What if it's wrong?"* | Every claim links to its source and timestamp, so you can check in one click. When we can't verify something, we say so instead of guessing. |
| *"Who else uses it?"* | Honest answer, early: name real users when we have them, and until then say "we're new, here's the demo, judge it yourself." Never fake a logo wall. |

---

## 4. Pricing and packaging

Current, published:

| Tier | Price | Contents |
|---|---|---|
| **Starter** | $99/mo | 3 competitors, bundled feed, Threat Index, comparison-page discovery, weekly digest |
| **Growth** | $399/mo | 10 competitors, all channels, reads & auto battlecards, campaign tracking, Slack/Teams digest |
| **Enterprise** | Custom | Unlimited, SSO, CRM battlecards, onboarding |

### Assessment

**The structure is right; Starter may be underpriced.** $99 for three competitors is defensible as a wedge, but the value gap to $399 is very large — most of the actual product (the reads, the battlecards) sits above the line. Two risks: Starter feels thin and churns, or it's so cheap it attracts non-ICP tyre-kickers.

**Recommendation, to test in Q4:** raise Starter to **$149** and move *reads and battlecards for 3 competitors* down into it. Rationale — the reasoning layer is the product; a tier without it isn't Watchtower, it's a monitoring tool, and that's the one comparison we lose. Better to defend $149 with the real product than $99 with a hollow one.

**Keep Enterprise deliberately vague.** Not because we're coy, but because we don't yet know what it needs, and the honest answer today is that we're not ready for procurement.

### Free tier — don't

A free tier of a monitoring product means running collectors forever for people who will never pay. **The free tools plus the no-account demo do the job of a free tier** at a fraction of the cost, and convert better because the demo shows a populated workspace rather than an empty one.

### 14-day trial, no card

Standard, and correct here. The product needs a few days of collection to be impressive — a trial that ends before first light is worthless. **Consider 21 days** so the customer sees at least two weekly digests.

---

## 5. The motion

### Stage 1 — Pull (product-led)

Free tool or blog post → live demo (no account) → sign-up. Fully self-serve, no human. This carries Starter and most Growth.

**The critical asset is the no-account demo**, which already exists and is already populated with real competitors. Most SaaS demos are empty shells; ours shows a working workspace with genuine signals about real companies. **Lead with it everywhere.**

### Stage 2 — Convert

Onboarding must reach a populated workspace fast. The single biggest product risk in the whole GTM is a new user signing up, adding three competitors, and seeing an empty feed for 24 hours.

**Mitigation, in priority order:**
1. Run a first collection pass *synchronously at sign-up* for the fast free channels (jobs, news, sitemap, cert logs — all sub-3s). The workspace should never be empty, not even for a minute.
2. Backfill historical signals where the source allows.
3. If it must be slow, say so honestly with a real progress state.

### Stage 3 — Founder-led sales (overlay)

For the first year, the founder personally handles anything above $399/mo and every enterprise conversation. Not scalable, and that's fine — the goal in year one is **learning what the enterprise tier must contain**, not revenue efficiency.

Trigger for a human: >10 competitors requested, SSO asked for, security review, or multi-seat.

### Stage 4 — Retention

CI churns when it becomes background noise. The defence is the **weekly digest** — a recurring, visible reminder of value that lands in the inbox whether or not they open the app. Track digest open rate as the real leading indicator of churn, ahead of app logins.

---

## 6. Channel plan

| Channel | Effort | Horizon | Priority |
|---|---|---|---|
| Free tools → demo | High build, near-zero marginal | 1–3 mo | **1** |
| Founder LinkedIn | High, ongoing | Immediate | **2** |
| Field-note blog posts | Medium | 3–9 mo compounding | **3** |
| `/vs` comparison pages | Low | 6–12 mo | **4** |
| Newsletter | Medium ongoing | 6 mo+ | **5** |
| Communities (PMA, Sharebird) | Medium | 3–6 mo | 6 |
| Product Hunt | One-off | Single spike | 7 |
| Cold outbound | High | Immediate but low yield | 8 |
| Paid ads | Money | Fast, expensive | **Not yet** |

### On outbound

There's a version of outbound that's unusually strong for us: **run the product on the prospect before contacting them.** "I noticed you have three competitors writing comparison pages about you and one of them just opened five sales roles in your territory — here's the briefing" is not a cold email, it's a demonstration.

It's also slow and doesn't scale. **Use it for the 20 best-fit accounts, not for volume.** Done at scale it becomes spam and burns the brand.

### On paid

Don't, until organic proves which message converts. Paying to distribute an unvalidated message is how seed money disappears. Revisit when tool→demo→paid is measurable and positive.

---

## 7. Metrics

### The one number

**Weekly active paying workspaces.** Not signups, not MRR, not traffic — workspaces where someone opened a briefing in the last 7 days. It's the only metric that catches the failure mode that kills CI products: people pay, stop opening it, and churn at renewal.

### The funnel

| Stage | Q4 2026 target | Notes |
|---|---|---|
| Tool runs / week | 500 | Top of funnel |
| Tool → demo | 15% | Tests gate placement |
| Demo → sign-up | 25% | Tests the demo's persuasiveness |
| Sign-up → paid | 20% | Tests the first five minutes |
| Paying workspaces | 40 | ≈ $6k MRR at blended price |
| Weekly active / paying | >70% | **The health metric** |
| Logo churn / month | <5% | Above 7% means the product isn't sticking |

These are deliberately modest. Forty paying customers by year-end from a standing start, founder-led, is a real business forming — and it is enough signal to decide whether to raise, hire or stay lean.

---

## 8. Risks

| Risk | Severity | Mitigation |
|---|---|---|
| **Empty-workspace first run** | **Critical** | Synchronous first collection at sign-up (§5). This is the top product priority. |
| **Signal quality** — junk in the feed | **Critical** | It's already bitten us: image filenames as webinars, a farmhouse as a brand mention, `www.` as a buildout. Every channel needs a precision pass before it's customer-facing. One bad card destroys the "no false fires" position. |
| Sources block us | High | Multiple fallbacks per channel (crt.sh **is already rate-limiting** — certspotter carries it). Fail honestly, never silently. |
| An incumbent drops price | Medium | They'd cannibalise a much larger book. Slow to happen; our defence is the verifiability position, not price alone. |
| Legal complaint from a named company | Medium | Public data only, facts not motive, correct promptly and publicly if ever wrong. |
| Founder is the bottleneck | High | True and unavoidable for now. Self-serve must genuinely work without a human. |
| Category is a vitamin, not a painkiller | Medium | Real risk. The counter is the *lost deal* trigger — sell into the moment of pain, not the abstraction. |
| **Key rotation / secrets hygiene** | Medium | Neon credentials have been pasted into chat logs at least once. Rotate, and move to `vercel env pull` as the standard path. |

### The honest strategic risk

CI is a category people **buy after being burned** and **stop opening once things feel calm**. The whole product needs to fight that: the weekly digest, the beacon discipline, and the fact that it only shouts when something real happened are all retention mechanics disguised as brand principles. If usage decays, that's the thing to fix — not acquisition.

---

## 9. Ninety-day plan

**Month 1 — Prove the pull.**
Ship `/tools/hiring-signal` and `/tools/pre-launch`. Fix the empty-workspace first run — synchronous collection at sign-up. Founder LinkedIn cadence begins. Weekly blog cadence begins.
*Success:* 100 tool runs/week, first 5 paying customers.

**Month 2 — Prove conversion.**
`/vs/crayon`, `/vs/klue`. `/security` and `/docs`. Ship two more tools. Newsletter capture live. Instrument the whole funnel properly — we cannot currently answer "what % of demo visitors sign up," and that's the number that matters.
*Success:* measurable tool→demo→paid, 15 paying customers.

**Month 3 — Prove retention.**
Weekly digest hardened and tracked. Talk to every single paying customer personally. Precision pass on every channel that's customer-facing. Product Hunt.
*Success:* 40 paying workspaces, >70% weekly active, churn <5%.

**The decision at day 90:** if weekly-active/paying is above 70%, the product is sticking — raise or hire into it. If it's below 50%, the product is a vitamin and the fix is retention mechanics, not more traffic. Don't spend a dollar on paid until that's answered.
