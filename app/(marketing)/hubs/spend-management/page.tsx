import Link from 'next/link';

export const metadata = {
  title: 'Spend Management — Fortress HQ',
  description:
    "We don't estimate a competitor's ad spend in dollars — that number is always a guess. We show you which platforms they're live on, how their creative mix shifts, and where organic effort is going.",
};

const SPEND_FRAME = [
  { name: 'Klue', theirs: 'Enterprise CI, sales-enablement led. Ad-spend tracking isn\'t a headline capability, and pricing is a quote after a demo call.', us: 'Platform-level ad and traffic signal, published pricing, and the same refusal to publish a dollar figure nobody outside the ad platform actually knows.' },
  { name: 'Crayon', theirs: 'Broad enterprise tracking, no published price.', us: 'Same class of signal — which platforms, how many creatives, how the mix shifts — at a fraction of the cost, with the price on the page.' },
  { name: 'Kompyte', theirs: 'Now runs on Semrush\'s distribution rather than as an independent product.', us: 'A dedicated CI product whose ad and GTM tracking is the point, not a module folded into a much larger suite.' },
  { name: 'Visualping', theirs: 'Page-change monitoring. Good at telling you a page changed; not built to read ad libraries.', us: 'Ad-library and traffic signal read together, per competitor, against everything else on file — not a standalone alert.' },
  { name: 'Signal Labs', theirs: 'Team-tier pricing quoted on a call.', us: 'Published pricing at every tier, and the same honest line on why we don\'t model a dollar figure.' },
];

const PERSONAS = [
  { role: 'Founder / CEO · 10–150 staff', h: 'Kept up by being the last to know who\'s spending to acquire', p: 'Who\'s hunting and who\'s defending should be readable in ten seconds, not require a separate ad-intelligence subscription on top of everything else.' },
  { role: 'Product marketing · often a team of one', h: 'Kept up by not having a real answer to "are they outspending us"', p: 'A platform-level read — which networks, how many creatives, how the mix shifts — is a real answer to that question. A guessed dollar figure dressed up as precise isn\'t.' },
];

const CHANNEL_SAMPLE = ['Meta ads', 'Google ads', 'LinkedIn ads', 'Events & webinars', 'Customer logos', 'Traffic & SEO', 'Search interest'];

const TIERS = [
  { name: 'Starter', price: '$79/mo', note: '3 competitors', items: ['Meta, Google and LinkedIn ad libraries — all live from day one, no paid vendor needed', 'Events & webinars, customer logos'] },
  { name: 'Growth', price: '$199/mo', note: '10 competitors', items: ['Adds Traffic & SEO and Search interest — the paid-source DataForSEO estimates'] },
  { name: 'Enterprise', price: 'Talk to us', note: '30 competitors, standard config', items: ['Same full channel set at scale', 'Dedicated onboarding'] },
];

const MECH = [
  {
    h: 'Three ad-library channels, each read directly against the platform',
    p: 'ads_meta pulls the Ad Library Graph API by page ID (free, needs a token to activate). ads_google reads the Transparency Center by domain, keyless and active by default. ads_linkedin reads the LinkedIn Ad Library, advertiser-exact. Each one is a direct read of what the platform itself discloses — not a modeled inference layered on top of scraped impressions, and not a number we had to estimate from the outside looking in.',
  },
  {
    h: 'Creative counts and platform presence, tracked over time',
    p: 'What gets recorded is how many ads are live on each platform and how that count moves — a competitor going from two Meta ads to eleven in a week is a real, verifiable posture change, sourced to the ad library itself, not a currency figure with no way to check it. The direction of the change usually matters more than the raw count on any single day.',
  },
  {
    h: 'Organic signal runs alongside paid, clearly labelled as an estimate',
    p: 'traffic and trends read DataForSEO for estimated organic traffic and Google Trends search interest. We label these as estimates because that\'s what they honestly are — a third-party model, cited to its source — which is a different thing from inventing a precise-looking dollar figure and presenting it as fact. The distinction is between a labelled estimate and an unlabelled guess, not between an estimate and a fact.',
  },
  {
    h: 'Events and customer logos add where field effort is going',
    p: 'events reads field-marketing themes off events and webinar pages; logos tracks customer wins and losses off logo walls captured during the same site crawl. Both sit in the same GTM & ads group as the ad-library channels, because spend posture and field-marketing posture are the same underlying question — where is a competitor actually choosing to put its effort right now, across every channel that shows up publicly.',
  },
  {
    h: 'The Tower reads platform, creative and organic signal together',
    p: 'None of these five channels means much alone. A creative-count spike on LinkedIn plus flat organic traffic plus a new events page reads differently than the same ad spike paired with rising search interest — the Tower composes the narrative across all of it, per competitor, instead of listing each channel\'s number separately and leaving the connecting work to whoever\'s reading the feed that morning.',
  },
  {
    h: 'What comes out is a posture, not a currency figure',
    p: 'The final read says whether a competitor is acquiring or defending, where their creative mix is shifting, and whether organic reach is growing or shrinking — in plain language, every claim traceable to the ad library, DataForSEO estimate, or page it came from. No modeled dollar number is manufactured to make the answer feel more precise than it is.',
  },
];

const SPEND_FAQ = [
  {
    q: 'Why not just add a modeled dollar figure like every other ad-spend tracker?',
    a: 'Because it would be a guess wearing a currency symbol, and this whole product is built around not doing that. Third-party ad-spend estimates are modeled from panel data and traffic proxies, and they\'re routinely off by multiples — you\'ve probably already caught one being wrong about your own company. Adding a more polished version of the same guess would look complete and be less honest than what we have now.',
  },
  {
    q: 'Isn\'t "we don\'t estimate spend" just a workaround for not having the data?',
    a: 'No — we could build a modeled estimate the same way every other vendor in this category does; we\'ve chosen not to, on principle, because it fails the evidence bar the rest of the product is held to. What we do instead is track what\'s actually verifiable directly against the platform: live creative counts, which networks a competitor runs on, and how that shifts. That\'s a real constraint we\'re choosing, not a capability we\'re missing.',
  },
  {
    q: 'How do I know a number like "11 ads live" is even accurate?',
    a: 'Because it\'s read directly from the ad platform\'s own public library — the Meta Ad Library, the Google Ads Transparency Center, the LinkedIn Ad Library — not inferred from a model. If a competitor has 11 ads live, that\'s what the platform itself reports, and the source is the platform, not a third-party estimate.',
  },
  {
    q: 'Is the traffic and search-interest data not also a modeled guess, though?',
    a: 'Yes, honestly — and we label it that way rather than hiding it. traffic and trends run on DataForSEO, which is itself an estimate, not a platform-verified number the way the three ad libraries are. The difference we care about isn\'t "estimate versus fact" everywhere; it\'s being explicit about which is which, instead of dressing an estimate up as a precise fact the way a fabricated dollar-spend figure would.',
  },
  {
    q: 'What happens if Meta, Google or LinkedIn rate-limit the ad library or change the format?',
    a: 'The channel reports that plainly rather than silently returning stale or wrong data — the same honest-gap discipline that runs across all 28 channels. A channel that can\'t reach its source says so; it doesn\'t quietly keep showing yesterday\'s number as if it were current.',
  },
  {
    q: 'Which plan includes this?',
    a: 'The three ad-library channels — Meta, Google, LinkedIn — run on Starter at $79/mo, since none of them need a paid data source. Traffic and search-interest estimates, which run through DataForSEO, sit in Growth ($199/mo) and above, because that cost scales with usage and we won\'t promise a flat price we can\'t actually hold.',
  },
  {
    q: 'Can I see this running on a real competitor before I pay for anything?',
    a: 'Yes — the live demo workspace shows real ad-library and traffic signal on our own market, including the exact kind of posture read (acquiring versus defending) described above, before you enter a card number anywhere.',
  },
  {
    q: 'Do you track spend on channels outside Meta, Google and LinkedIn — TikTok, programmatic, connected TV?',
    a: 'Not today. The three ad libraries we read are the ones with a public, queryable transparency API a scout can hit directly. If a platform without one becomes important enough to a customer base to justify building against, we\'d evaluate it the same way we evaluate any new channel — starting from what\'s actually verifiable, not from what would look complete on a features page.',
  },
];

export default function SpendManagementHub() {
  return (
    <div className="hbx">
      <section className="hbx-hero">
        <div className="wrap">
          <span className="hbx-crumb">Spend management</span>
          <h1 className="mkt-h1" style={{ marginLeft: 0, marginRight: 0, textAlign: 'left' }}>
            We don&apos;t estimate their ad budget. We show you where they&apos;re pointing it.
          </h1>
          <p className="lede" style={{ marginLeft: 0, textAlign: 'left' }}>
            Every &ldquo;ad spend tracker&rdquo; in this category shows a dollar figure that&apos;s a model&apos;s guess wearing
            a currency symbol. Nobody outside the ad platform actually knows what a competitor spent. What&apos;s real
            and public is which platforms they&apos;re running on, how many creatives are live, how that mix shifts, and
            whether their organic reach is growing or shrinking &mdash; and that&apos;s what we track.
          </p>
        </div>
      </section>

      <section className="hbx-stats">
        <div className="wrap">
          <div className="hbx-stat-grid">
            <div className="hbx-stat"><span className="n">3</span><span className="l">Ad-library channels watched &mdash; Meta, Google, LinkedIn</span></div>
            <div className="hbx-stat"><span className="n">2</span><span className="l">Market channels &mdash; Traffic &amp; SEO estimate, and Google Trends search interest</span></div>
            <div className="hbx-stat"><span className="n">5</span><span className="l">GTM &amp; ads channels total, incl. events &amp; webinars and customer logo wins/losses</span></div>
            <div className="hbx-stat"><span className="n">$79/mo</span><span className="l">Starter, published &mdash; all three ad-library channels included, keyless where possible</span></div>
            <div className="hbx-stat"><span className="n">0</span><span className="l">Dollar-denominated ad-spend estimates published, anywhere in the product</span></div>
            <div className="hbx-stat"><span className="n">5</span><span className="l">Named vendors we compare against directly &mdash; Klue, Crayon, Kompyte, Visualping, Signal Labs</span></div>
            <div className="hbx-stat"><span className="n">$199/mo</span><span className="l">Growth &mdash; adds the paid-source traffic &amp; search-interest estimate on top</span></div>
          </div>
        </div>
      </section>

      <section className="hbx-argument">
        <div className="wrap">
          <div className="hbx-panel">
            <h2>Dollar figures are a guess. Volume and format are a fact.</h2>
            <p>
              Third-party ad-spend estimates are modeled from panel data and traffic proxies, and they&apos;re routinely
              off by multiples &mdash; you&apos;ve probably already caught one being wrong about your own company. We
              didn&apos;t want to build a more polished version of the same guess, so we don&apos;t.
            </p>
            <p>
              <span className="accent">What we track instead is verifiable directly against the ad platform&apos;s own
              library</span>: which of Meta, Google and LinkedIn a competitor is actively advertising on, how many ads
              are live, and how their creative themes shift week to week. Paired with organic signal &mdash; estimated
              traffic and search interest &mdash; that gives you where effort and attention are actually going, paid and
              organic together, without a fabricated number in the middle.
            </p>
          </div>
        </div>
      </section>

      <section className="hbx-split">
        <div className="wrap">
          <span className="wt-eyebrow">Where we actually stand</span>
          <h2 className="wt-h2">What we track today, and what we deliberately don&apos;t.</h2>
          <div className="hbx-split-grid">
            <div className="hbx-live-panel">
              <span className="hbx-panel-tag live"><i />Live &middot; today</span>
              <h3>What we track today</h3>
              <ul>
                <li><strong>Meta ads</strong> &mdash; the Ad Library Graph API by page ID.</li>
                <li><strong>Google ads</strong> &mdash; the Transparency Center, by domain.</li>
                <li><strong>LinkedIn ads</strong> &mdash; the LinkedIn Ad Library, advertiser-exact.</li>
                <li><strong>Traffic &amp; SEO</strong> &mdash; estimated organic traffic via DataForSEO.</li>
                <li><strong>Search interest</strong> &mdash; Google Trends, via DataForSEO.</li>
                <li><strong>Events &amp; webinars, customer logos</strong> &mdash; the field-marketing themes and win/loss
                  tells that sit beside paid activity in the same GTM &amp; ads group.</li>
              </ul>
            </div>
            <div className="hbx-roadmap-panel">
              <span className="hbx-panel-tag roadmap">Not tracked, on principle</span>
              <h3>What we don&apos;t do</h3>
              <p>
                We do not estimate a competitor&apos;s ad spend in dollars, and we&apos;re not planning to bolt one on to
                look more complete. A modeled number that can&apos;t be traced to a source fails the standard the rest
                of this product is held to.
              </p>
              <ul>
                <li>No dollar-denominated spend estimates.</li>
                <li>No historical &ldquo;spend trend&rdquo; line built on a guess.</li>
                <li>No confidence score standing in for a citation.</li>
              </ul>
              <p>
                If a way to verify spend directly against a platform&apos;s own disclosed numbers ever exists, we&apos;d
                build that as a scout like any other. Until then, volume and format are the honest version of this
                metric.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="hbx-block">
        <div className="wrap">
          <span className="wt-eyebrow">Who this is actually for</span>
          <h2 className="wt-h2">Two roles asking the same question, differently.</h2>
          <div className="hbx-persona-grid">
            {PERSONAS.map((per) => (
              <div className="hbx-persona-card" key={per.role}>
                <span className="role">{per.role}</span>
                <h4>{per.h}</h4>
                <p>{per.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="hbx-chansec">
        <div className="wrap">
          <span className="wt-eyebrow">Every channel this hub draws on</span>
          <h2 className="wt-h2">All seven, named &mdash; nothing held back.</h2>
          <div className="hbx-chips">
            {CHANNEL_SAMPLE.map((c) => <span className="hbx-chip" key={c}>{c}</span>)}
          </div>
        </div>
      </section>

      <section className="hbx-block">
        <div className="wrap">
          <span className="wt-eyebrow">What&apos;s included, by tier</span>
          <h2 className="wt-h2">Where the paid-source estimate channels actually sit.</h2>
          <div className="hbx-callout-grid">
            {TIERS.map((t) => (
              <div className="hbx-callout-card" key={t.name}>
                <h4>{t.name} &middot; {t.price}</h4>
                <p>{t.note}</p>
                <p className="us">{t.items.join(' · ')}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="hbx-mech">
        <div className="wrap">
          <span className="wt-eyebrow">The full mechanism</span>
          <h2 className="wt-h2">From an ad library to &ldquo;acquiring or defending,&rdquo; in six steps.</h2>
          <div className="hbx-mech-list">
            {MECH.map((m, i) => (
              <div className="hbx-mech-step" key={m.h}>
                <span className="hbx-mech-num">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{m.h}</h3>
                  <p>{m.p}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="hbx-example">
        <div className="wrap">
          <span className="wt-eyebrow">Reading posture, not a price tag</span>
          <h2 className="wt-h2">Two competitors, two ad postures, read the honest way.</h2>
          <div className="hbx-scenario">
            <span className="hbx-scenario-tag">Worked example &middot; real signal from our own demo workspace</span>
            <p>
              Two real reads from our own market, the same morning. Visualping shows up with 11 ads live across
              Google &mdash; a real, visible posture change, sourced straight to the Transparency Center. Around the same
              window, Signal Labs shows 10 ads live and, paired with it, still zero press coverage anywhere in the
              news channel. Neither of those is a dollar figure. Both are still genuinely useful.
            </p>
            <p>
              <span className="accent">The Visualping number reads as acquisition</span> &mdash; a freemium utility
              buying reach through paid placement rather than earned coverage, which is a specific, actionable posture
              a GTM team can plan around. The Signal Labs pairing reads differently: ad spend with no third-party
              validation anywhere in public voice suggests a company still building its own credibility from a
              standing start, not yet earning the press mentions a more established vendor would. Neither conclusion
              needed a modeled dollar figure to be useful &mdash; the platform-level fact and its pairing with another
              channel did the actual work.
            </p>
          </div>
        </div>
      </section>

      <section className="hbx-argument">
        <div className="wrap">
          <span className="wt-eyebrow">The competitive frame, for GTM &amp; ad signal</span>
          <h2 className="wt-h2">Where the others sit, and our counter.</h2>
          <div className="hbx-table-wrap">
            <table className="hbx-table">
              <thead>
                <tr><th>Vendor</th><th>Their position</th><th>Our counter</th></tr>
              </thead>
              <tbody>
                {SPEND_FRAME.map((f) => (
                  <tr key={f.name}>
                    <th>{f.name}</th>
                    <td>{f.theirs}</td>
                    <td className="us">{f.us}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="hbx-faq">
        <div className="wrap">
          <span className="wt-eyebrow">Questions worth asking</span>
          <h2 className="wt-h2">Including the one that pushes back on the whole premise.</h2>
          <div className="hbx-faq-list">
            {SPEND_FAQ.map((f) => (
              <details className="hbx-faq-item" key={f.q}>
                <summary>
                  <span className="q-txt">
                    {f.q.startsWith('Isn') && <span className="hbx-faq-tag">Hard question</span>}
                    {f.q}
                  </span>
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="hbx-cta">
        <div className="wrap">
          <div className="wt-inline-cta">
            <p>See real ad-library and traffic signal, watched daily, in the live demo.</p>
            <div className="wt-cta">
              <Link href="/demo" className="btn btn-primary">Try the live demo &rarr;</Link>
              <Link href="/pricing" className="btn btn-ghost">See pricing</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
