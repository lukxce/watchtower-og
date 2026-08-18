# Watchtower — the finish list

*Last verified: 19 August 2026, against a live run of every channel.*

Everything still standing between the current state and "fully collecting".
Ordered by what unlocks the most. Nothing here is speculative — each line was
checked against the code or a real vendor run.

**Set every variable in BOTH `.env.local` and Vercel.** A variable set in one
place only is the single most common reason something works locally and not in
production.

**A variable that exists but is empty counts as unset.** `FIRECRAWL_API_KEY=`
with no value does not enable Firecrawl — it silently disables the whole third
rung of the fetch ladder. That is the current state.

---

## Already done — don't touch

| | Status |
|---|---|
| **Apify** — token + 4 actors | complete, all verified end to end |
| Database (Neon), Clerk, Anthropic | set |
| LinkedIn company URLs | 10 / 10 competitors |
| Glassdoor / Gartner for Klue | set |

Apify is finished. There is nothing further to add there.

---

## 1. Firecrawl — the biggest single gap

`FIRECRAWL_API_KEY` is declared and empty, so the fetch ladder has no third
rung and every JS-rendered or bot-walled page just fails.

It silently degrades **11 collectors**: `news`, `jobs`, `logos`, `techstack`,
`events`, `googleplay`, `subdomains`, `youtube`, `adsLinkedin`, `trustpilot`,
`linkedinPosts`.

It does **not** fix everything, and two guesses of mine were wrong when tested:
Kompyte and Upfluence render fine and simply do not link LinkedIn from their
homepages at all, and Trustpilot still blocks Firecrawl outright (713 bytes
returned). Trustpilot goes through Apify for that reason.

Get it: **https://firecrawl.dev** → Dashboard → API Keys.
The cost model assumes Standard at $83/mo; the free tier is enough to prove it
works first.

```bash
FIRECRAWL_API_KEY=fc-…
```

---

## 2. Three free keys — takes you to 25 of 28 channels

| Variable | Where | Unlocks |
|---|---|---|
| `META_ADS_TOKEN` | [Graph API Explorer](https://developers.facebook.com/tools/explorer) | Meta ad spend + creative |
| `PRODUCTHUNT_TOKEN` | [PH OAuth apps](https://www.producthunt.com/v2/oauth/applications) | launches |
| `REDDIT_CLIENT_ID` + `REDDIT_CLIENT_SECRET` | [reddit.com/prefs/apps](https://www.reddit.com/prefs/apps) — app type **script** | unfiltered user voice |

All free, all a few minutes each.

---

## 3. `CRON_SECRET` — currently empty

Protects `/api/run`, `/api/cron/daily` and `/api/health`. Empty locally means
anonymous callers can trigger collection runs.

```bash
openssl rand -hex 32
```

Set the same value locally and in Vercel. Production already has one, so use
the Vercel value locally if you want `/api/health` to be queryable.

---

## 4. Glassdoor + Gartner pages — 18 lookups

Only Klue has these. They cannot be derived: Glassdoor keys pages by an
internal id (`…-E2919580.htm`), and a Gartner URL encodes market + vendor +
product.

Set them in the app: **Battlecards → Channel sources**. Or:

```bash
node scripts/set-source.mjs <slug> glassdoor <url>
```

Expect several to genuinely not exist — the influencer tools (Modash, Cirqle,
Upfluence) are unlikely to be on Gartner Peer Insights, and smaller companies
often have no Glassdoor page. Leaving those blank is the correct answer, not a
gap.

| Competitor | Glassdoor | Gartner |
|---|---|---|
| Klue | ✅ | ✅ |
| Crayon, CreatorIQ, Grin, Kompyte, Modash, Signal Labs, Cirqle, Upfluence, Visualping | — | — |

---

## 5. Newsletters — highest value, most setup

The secret-shopper channel: a persona inbox subscribes to competitors'
newsletters, and inbound mail is matched to a competitor by sender domain. It
is legitimate precisely because the mail was sent *to us* — nothing is scraped.

1. Create an inbox you control (Resend Inbound, SendGrid Parse, or Mailgun
   Routes all work).
2. Point its webhook at `https://<host>/api/inbound?token=<INBOUND_TOKEN>`.
3. Subscribe that address to each competitor's newsletter.

```bash
NEWSLETTER_INBOX=watch@yourdomain.com
INBOUND_TOKEN=<openssl rand -hex 32>
```

The workspace rides in a plus-tag (`watch+<org>@…`), so one inbox serves every
tenant.

---

## 6. Paid, and can wait

| | Cost | Unlocks |
|---|---|---|
| `DATAFORSEO_LOGIN` / `_PASSWORD` | $50 min deposit | `traffic`, `trends` |
| `STRIPE_SECRET_KEY` etc. | — | billing; not needed to collect |
| `GNEWS_API_KEY` | free tier | upgrades `news` off Google News RSS |

---

## 7. Housekeeping

- **Rotate the Apify token, the Neon `DATABASE_URL` and the Anthropic key.**
  All three were pasted into a chat transcript and are on disk in plain text.
- Set `PLATFORM_ADMIN_EMAILS` to your email, or `/admin` stays ungated.
- Don't run `npm run build` while `npm run dev` is running — it overwrites
  `.next` and breaks the dev server until it is restarted.

---

## Where each channel stands

**Collecting with no further setup (22):** website, sitemap, appstore,
googleplay, subdomains, techstack, ads_google, ads_linkedin, events, logos,
jobs, glassdoor, news, youtube, podcasts, linkedin_posts, trustpilot, g2,
capterra, trustradius, gartner, funding.

**Blocked on the above (6):** ads_meta, producthunt, reddit, newsletters,
traffic, trends.

Note that several of the 22 are *degraded* rather than broken without
Firecrawl — they run, and quietly return less than they should. That is why
Firecrawl is first on this list.
