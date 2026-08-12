// Blog content lives here as typed data rather than MDX/a CMS — three real
// posts, no lorem, sourced directly from the positioning research behind this
// build. Swap for a CMS later; the page templates don't need to change.
export interface BlogPost {
  slug: string;
  title: string;
  dek: string;
  date: string; // ISO
  readMins: number;
  body: string[]; // paragraphs; a leading "## " marks a subheading
}

export const POSTS: BlogPost[] = [
  {
    slug: 'the-blind-spot-every-ci-tool-shares',
    title: 'Every competitive intelligence tool has the same blind spot',
    dek: 'Signal-to-noise and stale battlecards aren’t two complaints. They’re the same complaint, and it’s architectural.',
    date: '2026-08-05',
    readMins: 6,
    body: [
      'Ask anyone who has actually run a competitive intelligence program what they’d fix first, and you get one of two answers: too much noise, or battlecards nobody trusts because they’re out of date. Those sound like separate problems — one is a filtering problem, the other is a freshness problem. They’re not. Both come from the same design decision: treating a page change as the thing worth capturing, instead of the claim inside it.',
      '## Change detection isn’t intelligence',
      'A pricing page changing is an event. It is not, by itself, information. Did the price go up or down? Did a tier get renamed? Did a feature move from "included" to "add-on"? A system that alerts on the diff and stops there is asking a human to do the actual work of reading the page, deciding what changed, and deciding whether it matters — for every single change, forever. That’s the manual-curation burden every buyer of these tools complains about, and it isn’t a rollout problem or a training problem. It’s what happens when the product’s unit of work is "a page changed" instead of "a claim changed."',
      'The fix isn’t a better diff algorithm. It’s extracting the actual claims a page makes — this feature exists, this price is $49, this integration is certified — and tracking those as first-class objects with their own history. A claim can be reaffirmed, changed, or contradicted. A page can only be "different."',
      '## Why this also fixes the noise problem',
      'Once claims are the unit of record, most of what used to look like noise turns out to be reaffirmation: the same claim seen again, which raises confidence rather than triggering an alert. What’s left — a genuinely new claim, or a change to an existing one — is naturally the small, high-signal set. You don’t need a separate noise filter bolted on top; the architecture stops manufacturing noise in the first place.',
      'This is also the only honest way to build "how to win" content without a human sitting between every signal and every battlecard. If a competitor’s page claims something your own product already does, that’s not a vague inference — it’s a direct contradiction between two structured claim sets, theirs and yours, and it’s checkable. Nobody in this category appears to do that rigorously today. Most "how to win" sections are still authored by hand from win-loss interviews, months after the moment they describe.',
      'None of this requires more AI. It requires deciding, early, what the system is actually keeping a record of.',
    ],
  },
  {
    slug: 'the-vs-page-nobody-is-watching',
    title: 'The page your competitor wrote about you, and nobody is watching',
    dek: 'Comparison pages are the highest-value asset in competitive intelligence, and the category mostly isn’t built to find them.',
    date: '2026-07-22',
    readMins: 5,
    body: [
      'Somewhere on a competitor’s site there is probably a page comparing themselves to you. It has a URL like /compare/us-vs-you or /alternative-to-you, and it says, in the competitor’s own words, exactly what they think your weaknesses are and exactly what they’re telling prospects to worry about before they buy from you. It is the single most useful document in the entire category of "things worth monitoring" — and most monitoring tools never see it.',
      '## Why these pages are hard to find',
      'Comparison pages are deliberately SEO-shaped: short, targeted URLs, built to rank for "[competitor] alternative" searches. That makes them easy to find if you know the pattern — and easy to miss if your monitoring only follows a sitemap. Companies routinely keep these pages out of the sitemap, or de-link them once they stop being useful, which means a system that only "monitors going forward" from a linked page list will miss both the ones that were never linked and the ones that were quietly taken down.',
      'There’s a second, free source almost nobody uses for this: the Internet Archive’s CDX API returns every URL Wayback has ever captured for a domain, whether or not it’s currently linked. Query it once when you start tracking a new competitor, filter for comparison-page patterns, and you get their entire history of positioning against you — including the pages they deleted because they stopped working, which is itself information.',
      '## The pattern is simple; almost nobody applies it consistently',
      'A gazetteer of your own name and brand terms, a small dictionary of URL patterns (/vs/, /compare/, /alternative-to-), and three unioned discovery methods — sitemap, crawled internal links, and Wayback’s CDX index — will find nearly every comparison page that’s ever existed for a given competitor pair. None of the three methods alone gets there; sitemaps miss unlinked pages, crawling misses orphaned ones, and Wayback misses anything it never indexed. Run all three, dedupe, and the gap closes.',
      'What you do with the page once you’ve found it matters more than finding it. A comparison page is a competitor telling you, unprompted, what they think your weakest point is. Read it that way and it stops being a monitoring target and starts being free research.',
    ],
  },
  {
    slug: 'what-fifteen-thousand-dollars-buys-you',
    title: 'What $15,000 a year buys you in competitive intelligence — and why it shouldn’t have to',
    dek: 'Every established vendor in this category gates pricing behind a sales call. That’s not a pricing strategy problem. It’s a trust problem wearing a pricing strategy costume.',
    date: '2026-08-11',
    readMins: 4,
    body: [
      'Look up pricing for any established competitive intelligence platform and you’ll find the same page: a short pitch, a lead-capture form, and the words "tailored to your needs." No tiers. No self-serve. No number. Third-party pricing trackers estimate entry deployments somewhere around $15,000 a year, scaling well past six figures — but that’s an estimate, because none of the vendors say so themselves.',
      'There’s a reason the whole category converged on this. When your core deliverable is "trust our synthesis of what your competitors are doing," a published price list feels like it undersells the seriousness of what you’re buying. Enterprise software has trained buyers to read "contact sales" as "this is important enough to warrant a human conversation." Sometimes that’s true. Often it’s just friction that happens to select for accounts big enough to be worth the sales team’s time.',
      '## What that friction actually costs',
      'It costs the category its own smallest, most competitively exposed teams — the ones a five-figure annual contract genuinely doesn’t fit — the ability to see what their competitors are doing at all, at exactly the stage of a company when that visibility would matter most. And it costs the vendors any incentive to make onboarding fast, because a sales-led motion doesn’t need a new customer to see value in the first five minutes; it needs them to sit through a demo.',
      'The honest test of whether a competitive intelligence tool actually works is whether you’d let a stranger sign up, pick two or three competitors, and watch real signals appear inside an hour — with sources attached, so there’s nothing to take on faith. If a product can survive that test, gating it behind a sales call isn’t protecting its value. It’s hiding how long it actually takes to deliver any.',
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}
