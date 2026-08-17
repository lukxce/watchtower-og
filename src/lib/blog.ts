// Blog content lives here as typed data rather than MDX/a CMS. Three real
// posts, no lorem, sourced directly from the positioning research behind this
// build. Swap for a CMS later; the page templates don't need to change.
export type Category = 'Field notes' | 'Method' | 'Opinion';

export interface BlogPost {
  slug: string;
  title: string;
  dek: string;
  date: string; // ISO
  readMins: number;
  category: Category;
  author: string;
  /** Key into BlogCover — each post gets its own generated SVG, no stock art. */
  cover: 'certlog' | 'absence' | 'adgrid' | 'diff' | 'versus' | 'redacted';
  body: string[]; // paragraphs; a leading "## " marks a subheading
}

export const CATEGORIES: Category[] = ['Field notes', 'Method', 'Opinion'];

export const POSTS: BlogPost[] = [
  {
    slug: 'the-certificate-log-told-us-first',
    title: 'Klue is building an AI voice interviewer. We read it off a certificate log.',
    dek: 'Three hostnames, no announcement, and a version number that gave away more than the product name did.',
    date: '2026-08-16',
    readMins: 5,
    category: 'Field notes',
    author: 'Luka Jovanović',
    cover: 'certlog',
    body: [
      'Every certificate issued for a public domain is logged, publicly and permanently. That is not a leak or a loophole; it is how certificate transparency is designed to work, so that a rogue certificate cannot be issued for your domain without somebody being able to see it. The side effect is that when a company provisions a hostname for something it has not announced yet, the hostname is visible the moment the certificate is issued.',
      'We track Klue because they are a competitor. Their log currently carries interview.klue.com, interviewer-v2.klue.com and voice.klue.com.',
      '## Any one of those is nothing',
      'A hostname on its own is not a story, and this is the discipline that matters most. Companies provision subdomains constantly, for staging, for experiments, for things that get killed. Klue alone has 255 hostnames visible, the vast majority of them per-pull-request preview environments with names like frontend-v2-pr-8624. Treating each of those as a signal would produce a feed nobody could read, which is exactly the failure mode most monitoring tools ship with.',
      'What makes these three different is that the context was already on file. Klue sells win-loss interviews as a core motion, and they spent this year publishing agentic-workflow workshops and an AI-in-competitive-intelligence report. Put the hostnames next to the content and the shape is obvious: interview, plus voice, plus a company whose product is win-loss interviews, plus a year of publishing about AI agents.',
      '## The version number is the good part',
      'interviewer-v2 is more informative than interviewer would have been. A v2 in a hostname means there was a v1. They have already built this once, learned something, and started again. That is not a company exploring an idea; that is a company iterating on a thing it intends to ship.',
      'There is a second detail worth noting. mcp-adapter.app.klue.com resolves on their production hostname, not just staging. Model Context Protocol support is not a research project for them either.',
      '## What we are not claiming',
      'We do not know what it looks like, when it ships, or whether it survives. We have not seen the product. What we have is three hostnames, a content trail, and a version number, and the read says exactly that and no more. If it turns out to be an internal tool for their own research team, the evidence still supported the inference at the time it was made.',
      'That is the honest version of this kind of work. You are not predicting the future. You are reading what a company has already committed engineering effort to, weeks before it is announced, and giving your own team time to decide what to do about it.',
    ],
  },
  {
    slug: 'when-a-careers-page-starts-404ing',
    title: 'Kompyte\u2019s careers page started returning 404. That is how we knew.',
    dek: 'The most useful signals are often things that stopped happening. Almost nothing is built to notice those.',
    date: '2026-08-14',
    readMins: 4,
    category: 'Field notes',
    author: 'Luka Jovanović',
    cover: 'absence',
    body: [
      'Monitoring tools are built around events. A page changed, an ad appeared, an article was published. That framing has a blind spot you can drive a company through: it can only tell you about things that happen. It has nothing to say about things that stop.',
      'Kompyte is a competitor of ours. At some point their careers page began returning 404. On its own that is close to meaningless, because sites get reorganised and URLs move all the time.',
      '## The second absence is what makes it a story',
      'They also have no advertiser account. Not a small budget, not a seasonal pause. Zero ads on Google and zero on LinkedIn, for a company that is unambiguously still selling software.',
      'Two absences with an obvious shared cause: Kompyte was acquired by Semrush, and an acquired company stops hiring under its own name and stops buying ads under its own account, because both now run through the parent. The news trail confirms it afterwards. The point is that the structural evidence was legible first, and it was legible from two things that were not there.',
      '## Why this matters commercially, not just technically',
      'If you sell against Kompyte, the read changes what you do. You are no longer competing with a roadmap; you are competing with a line item in somebody else\u2019s renewal. The question to ask a prospect stops being about features and becomes: are you buying this because it was the best tool you evaluated, or because it was already in the Semrush contract?',
      'Their own site, incidentally, still sells Kompyte as a standalone product. Nothing on it says the independent company is gone. A tool that only reads what a website claims would never have caught this. A system that also notices what is missing gets there first.',
    ],
  },
  {
    slug: 'ad-libraries-are-public',
    title: 'Ad libraries are public. Almost nobody in your company reads them.',
    dek: 'What a competitor spends, where, and under whose name, is on the record. The absences are as loud as the spend.',
    date: '2026-08-09',
    readMins: 5,
    category: 'Method',
    author: 'Luka Jovanović',
    cover: 'adgrid',
    body: [
      'Google and LinkedIn both publish searchable archives of the ads running on their platforms, including who paid for them. This exists for regulatory reasons rather than competitive ones, but the effect is that your competitors\u2019 paid strategy is a matter of public record, updated continuously, free to read.',
      'We pulled the numbers for our own market recently. The distribution was not what a feature comparison would have suggested.',
      '## Spend does not track size',
      'Klue, by some distance the best-funded company in the set, runs roughly eleven Google ads and six on LinkedIn. Visualping, far smaller, runs about eleven Google ads, which relative to its size is aggressive. Crayon, an established incumbent, runs zero on Google and one on LinkedIn.',
      'An incumbent going near-silent on paid is a decision, not a shortfall. Read alongside their integration work, the picture is a company buying distribution inside tools its buyers already use, rather than paying to interrupt them somewhere else. That is a strategy you can plan against. It is invisible if you only look at their website.',
      '## The advertiser name is the part people miss',
      'Ads are attributed to a legal entity, not a brand, and that mapping is where the real intelligence hides. Klue\u2019s run under Klue Labs Inc. Visualping\u2019s under Webmonitoring Technologies Inc. Kompyte has no advertiser account at all, because it was acquired and its spend now runs under the parent company.',
      'So a null result is not a failed lookup. It is a finding, provided your system is honest enough to distinguish between "no ads found" and "we could not check." Most tools collapse those two into one empty state, and the difference between them is the entire signal.',
      '## What to do with it',
      'Check the creative mix, not just the count. A competitor moving from text search ads to video is moving from capturing existing demand to building new demand, which usually means a positioning shift is coming. Check the advertiser entity when you start tracking someone, and check it again after any funding or acquisition rumour, because the entity changes before the branding does.',
    ],
  },
  {
    slug: 'the-blind-spot-every-ci-tool-shares',
    title: 'Every competitive intelligence tool has the same blind spot',
    dek: 'Signal-to-noise and stale battlecards aren’t two complaints. They’re the same complaint, and it’s architectural.',
    date: '2026-08-05',
    readMins: 6,
    category: 'Method',
    author: 'Luka Jovanović',
    cover: 'diff',
    body: [
      'Ask anyone who has actually run a competitive intelligence program what they’d fix first, and you get one of two answers: too much noise, or battlecards nobody trusts because they’re out of date. Those sound like separate problems. One is a filtering problem, the other is a freshness problem. They’re not separate at all. Both come from the same design decision: treating a page change as the thing worth capturing, instead of the claim inside it.',
      '## Change detection isn’t intelligence',
      'A pricing page changing is an event. It is not, by itself, information. Did the price go up or down? Did a tier get renamed? Did a feature move from "included" to "add-on"? A system that alerts on the diff and stops there is asking a human to do the actual work of reading the page, deciding what changed, and deciding whether it matters, for every single change, forever. That’s the manual-curation burden every buyer of these tools complains about, and it isn’t a rollout problem or a training problem. It’s what happens when the product’s unit of work is "a page changed" instead of "a claim changed."',
      'The fix isn’t a better diff algorithm. It’s extracting the actual claims a page makes (this feature exists, this price is $49, this integration is certified) and tracking those as first-class objects with their own history. A claim can be reaffirmed, changed, or contradicted. A page can only be "different."',
      '## Why this also fixes the noise problem',
      'Once claims are the unit of record, most of what used to look like noise turns out to be reaffirmation: the same claim seen again, which raises confidence rather than triggering an alert. What’s left, a genuinely new claim or a change to an existing one, is naturally the small, high-signal set. You don’t need a separate noise filter bolted on top. The architecture just stops manufacturing noise in the first place.',
      'This is also the only honest way to build "how to win" content without a human sitting between every signal and every battlecard. If a competitor’s page claims something your own product already does, that’s not a vague inference. It’s a direct contradiction between two structured claim sets, theirs and yours, and it’s checkable. Nobody in this category appears to do that rigorously today. Most "how to win" sections are still authored by hand from win-loss interviews, months after the moment they describe.',
      'None of this requires more AI. It requires deciding, early, what the system is actually keeping a record of.',
    ],
  },
  {
    slug: 'the-vs-page-nobody-is-watching',
    title: 'The page your competitor wrote about you, and nobody is watching',
    dek: 'Comparison pages are the highest-value asset in competitive intelligence, and the category mostly isn’t built to find them.',
    date: '2026-07-22',
    readMins: 5,
    category: 'Method',
    author: 'Luka Jovanović',
    cover: 'versus',
    body: [
      'Somewhere on a competitor’s site there is probably a page comparing themselves to you. It has a URL like /compare/us-vs-you or /alternative-to-you, and it says, in the competitor’s own words, exactly what they think your weaknesses are and exactly what they’re telling prospects to worry about before they buy from you. It is the single most useful document in the entire category of "things worth monitoring." Most monitoring tools never see it.',
      '## Why these pages are hard to find',
      'Comparison pages are deliberately SEO-shaped: short, targeted URLs, built to rank for "[competitor] alternative" searches. That makes them easy to find if you know the pattern, and easy to miss if your monitoring only follows a sitemap. Companies routinely keep these pages out of the sitemap, or de-link them once they stop being useful, which means a system that only "monitors going forward" from a linked page list will miss both the ones that were never linked and the ones that were quietly taken down.',
      'There’s a second, free source almost nobody uses for this. The Internet Archive’s CDX API returns every URL Wayback has ever captured for a domain, whether or not it’s currently linked. Query it once when you start tracking a new competitor, filter for comparison-page patterns, and you get their entire history of positioning against you, including the pages they deleted because they stopped working. That deletion is itself information.',
      '## The pattern is simple; almost nobody applies it consistently',
      'A gazetteer of your own name and brand terms, a small dictionary of URL patterns (/vs/, /compare/, /alternative-to-), and three unioned discovery methods, sitemap, crawled internal links, and Wayback’s CDX index, will find nearly every comparison page that’s ever existed for a given competitor pair. None of the three methods alone gets there. Sitemaps miss unlinked pages, crawling misses orphaned ones, and Wayback misses anything it never indexed. Run all three, dedupe, and the gap closes.',
      'What you do with the page once you’ve found it matters more than finding it. A comparison page is a competitor telling you, unprompted, what they think your weakest point is. Read it that way and it stops being a monitoring target. It becomes free research.',
    ],
  },
  {
    slug: 'what-fifteen-thousand-dollars-buys-you',
    title: 'What $15,000 a year buys you in competitive intelligence, and why it shouldn’t have to',
    dek: 'Every established vendor in this category gates pricing behind a sales call. That’s not a pricing strategy problem. It’s a trust problem wearing a pricing strategy costume.',
    date: '2026-08-11',
    readMins: 4,
    category: 'Opinion',
    author: 'Luka Jovanović',
    cover: 'redacted',
    body: [
      'Look up pricing for any established competitive intelligence platform and you’ll find the same page: a short pitch, a lead-capture form, and the words "tailored to your needs." No tiers. No self-serve. No number. Third-party pricing trackers estimate entry deployments somewhere around $15,000 a year, scaling well past six figures. That’s an estimate, though, because none of the vendors say so themselves.',
      'There’s a reason the whole category converged on this. When your core deliverable is "trust our synthesis of what your competitors are doing," a published price list can feel like it undersells the seriousness of what you’re buying. Enterprise software has trained buyers to read "contact sales" as "this is important enough to warrant a human conversation." Sometimes that’s true. Often it’s just friction that happens to select for accounts big enough to be worth the sales team’s time.',
      '## What that friction actually costs',
      'It costs the category its own smallest, most competitively exposed teams (the ones a five-figure annual contract genuinely doesn’t fit) the ability to see what their competitors are doing at all, at exactly the stage of a company when that visibility would matter most. It also costs the vendors any incentive to make onboarding fast, because a sales-led motion doesn’t need a new customer to see value in the first five minutes. It needs them to sit through a demo.',
      'The honest test of whether a competitive intelligence tool actually works is whether you’d let a stranger sign up, pick two or three competitors, and watch real signals appear inside an hour, with sources attached, so there’s nothing to take on faith. If a product can survive that test, gating it behind a sales call isn’t protecting its value. It’s just hiding how long it actually takes to deliver any.',
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}
