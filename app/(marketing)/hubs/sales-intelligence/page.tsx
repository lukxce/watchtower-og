import Link from 'next/link';

export const metadata = {
  title: 'Sales Intelligence — Fortress HQ',
  description:
    'Battlecards built from review patterns and funding moves, not a hunch — how a rep wins against a named competitor, cited and current.',
};

const SALES_FRAME = [
  { name: 'Klue', theirs: 'Strong battlecards, deep CRM integration, sales-enablement led. Quote after a demo call.', us: 'Same battlecard structure &mdash; positioning, strengths, vulnerabilities, how-to-win, the discovery question &mdash; but auto-built from public signal and live for a rep to read the same day they sign up.' },
  { name: 'Crayon', theirs: 'Enterprise motion, broad tracking, no published price.', us: 'A rep can compare our pricing page to theirs on the call itself. Ours has a number. Theirs has a form.' },
  { name: 'Kompyte', theirs: 'Acquired by Semrush; the roadmap now competes for attention inside a much larger suite.', us: 'A dedicated CI product, not a bundled module &mdash; the battlecard is the whole business, not a line item in someone else&apos;s renewal.' },
  { name: 'Visualping', theirs: 'Page-change monitoring. Tells you a page changed.', us: 'A single alert is not a battlecard. We read the change against hiring, ads, reviews and funding before it ever reaches a rep.' },
  { name: 'Signal Labs', theirs: 'Free tier caps at one competitor; Team pricing is quoted on a call.', us: 'Published pricing at every tier. A rep prepping for one deal shouldn&apos;t need three.' },
  { name: 'A shared Notion doc', theirs: 'Written once, after a lost deal. Free.', us: 'Rebuilt as the signal changes, not on a quarterly review cycle nobody keeps to.' },
];

const PERSONAS = [
  { role: 'Sales lead / enablement', h: 'Kept up by reps losing deals on unbriefed objections', p: 'This hub exists to put "how we win against X" in a rep\'s hands before the call, not discovered afterward in a deal post-mortem nobody wanted to write.' },
  { role: 'Product marketing · often a team of one', h: 'Kept up by being the one who has to keep every card current', p: 'The battlecard here rebuilds itself from live signal instead of sitting on a PMM\'s task list as "update Q3 competitor decks" every quarter.' },
];

const CHANNEL_SAMPLE = ['G2 reviews', 'Trustpilot reviews', 'Capterra reviews', 'TrustRadius reviews', 'Gartner Peer Insights', 'Funding & M&A', 'Job postings', 'Meta ads'];

const TIERS = [
  { name: 'Starter', price: '$149/mo', note: '3 competitors · watched daily', items: ['Battlecards from what\'s free to collect: pricing, hiring, ads, funding', 'Review-platform channels (G2, Trustpilot, Capterra, TrustRadius, Gartner) are paid-source and unlock on Growth'] },
  { name: 'Growth', price: '$399/mo', note: '10 competitors · full coverage', items: ['All five review-platform channels turn on here', 'Reads & auto-generated battlecards', 'Slack / Teams digest for the daily read'] },
  { name: 'Enterprise', price: 'Talk to us', note: 'Unlimited competitors · SSO · win-loss', items: ['CRM-embedded battlecards', 'Native win-loss program', 'Dedicated onboarding'] },
];

const MECH = [
  {
    h: 'Reputation channels surface what buyers are already saying',
    p: 'g2, trustpilot, capterra, trustradius and gartner each watch one review platform for a competitor. A cluster of new reviews naming the same complaint — slow support, a missing integration, a confusing upgrade path — is exactly what a rep needs, sourced to the review itself rather than a rep\'s hallway memory of "I heard they\'re bad at support."',
  },
  {
    h: 'The funding channel adds deal-relevant corporate facts',
    p: 'funding reads SEC EDGAR Form D filings and funding news, keyless, no account required. A competitor raising a round changes their runway and their sales pressure. A departed VP of Sales or Product is a deal-relevant fact, not gossip a rep half-remembers from LinkedIn — and it always links to the filing or article that says so.',
  },
  {
    h: 'GTM, ads and talent channels add momentum context',
    p: 'ads_meta, ads_google and ads_linkedin show whether a competitor is spending to acquire, or quiet and defending an installed base — the same read used in the sales-intelligence Crayon example below. jobs shows whether they\'re hiring aggressively into a segment, which usually means new budget behind it. None of these alone tells a rep how to win a call — together, they tell the Tower whether this competitor is hunting for new logos or holding the ones it already has.',
  },
  {
    h: 'The Tower composes one read per competitor',
    p: 'Everything on file — the review pattern, the funding fact, the ad posture, the hiring signal — gets read together and written into positioning, strengths, vulnerabilities and how-to-win, in plain language a rep can actually say out loud. Numbers are pulled live from captured signal; the strategy layer on top is authored by the reasoning model, grounded in what\'s on file rather than freeform.',
  },
  {
    h: 'The battlecard writes itself, scored',
    p: 'The finished card carries a hook, the Tower\'s read with its evidence lines, a how-we-win list, and one discovery-call question — alongside a Threat Index scored across five weighted dimensions, always shown with its inputs rather than as a bare number a rep has to trust blind. A rep opening the card gets the whole shape of the account in the time it takes to scroll once, not a wall of raw detections to interpret alone.',
  },
  {
    h: 'It rebuilds as the signal changes, not on a schedule',
    p: 'A battlecard written by hand goes stale the week after someone writes it, usually right around the point a competitor actually does something worth knowing. This one rebuilds when the underlying signal moves — a new review cluster, a funding event, a pricing change — rather than waiting for the next quarterly enablement review that, in most teams, quietly slips a quarter or two behind.',
  },
];

const SALES_FAQ = [
  {
    q: 'How often do battlecards actually update?',
    a: 'They rebuild when the underlying signal changes — a new review pattern, a funding event, a pricing move — rather than on a fixed schedule. That\'s the whole point of building them from live signal instead of writing them once by hand: the card is only as stale as the last thing that actually happened.',
  },
  {
    q: 'Is "how we win" written by a person, or generated?',
    a: 'Generated, and we\'d rather say that than let you assume a person wrote it. The numbers — review counts, ad posture, hiring activity — are pulled live from captured signal. The strategy layer on top, the actual "how we win" language, is authored by the reasoning model, grounded in what\'s on file for that competitor rather than a generic template.',
  },
  {
    q: 'Does this replace a formal win-loss interview program?',
    a: 'No, and we don\'t claim it does. Review patterns are the closest thing to a live, always-on focus group a competitor runs on themselves — but they\'re not the same as sitting down with a lost deal and asking why. A dedicated win-loss program is an Enterprise-tier addition, not something the public review signal replaces.',
  },
  {
    q: 'Standing orders to Slack aren\'t wired yet — so how does a rep actually see the card before a call, today?',
    a: 'Today, a rep opens the battlecard in the app before the call — it\'s not pushed to them automatically yet. Pushing a standing rule out to Slack the moment a card changes is the delivery layer we\'re building next; the scoring and rebuild logic that decides what belongs on the card already runs, the notification isn\'t wired yet, and we\'d rather say that plainly than let the page imply it already ships.',
  },
  {
    q: 'Do you have a CRM integration, so this shows up inside Salesforce at deal time?',
    a: 'CRM-embedded battlecards are listed as an Enterprise-tier item, not a Starter or Growth self-serve feature today. If your team lives inside the CRM and needs the card surfaced at deal time specifically, that\'s a conversation for the Enterprise tier, not something we\'ll quietly claim ships everywhere.',
  },
  {
    q: 'What happens if a competitor doesn\'t have enough public reviews yet?',
    a: 'The card says so rather than inventing a sentiment. A thin review footprint is itself a fact worth knowing — it usually means either a very new company or one that hasn\'t built a review-driven buying motion — and the battlecard reflects that gap instead of papering over it with a generic "positive reception" line.',
  },
  {
    q: 'Can I see a real battlecard before I pay for anything?',
    a: 'Yes — four real cards, built from public signal about our own market (Kompyte, Crayon, Signal Labs, Visualping), are readable on the homepage and in the live demo workspace right now, with every line sourced the same way a paying workspace\'s cards are.',
  },
  {
    q: 'I\'m on Starter — do I still get battlecards?',
    a: 'You get a card built from what Starter already collects — pricing, hiring, ads, funding — which is real signal, just narrower than the full picture. The review-platform channels this hub leans on hardest (G2, Trustpilot, Capterra, TrustRadius, Gartner) are paid-source channels that turn on at Growth, because their cost scales with usage in a way flat Starter pricing can\'t absorb.',
  },
];

export default function SalesIntelligenceHub() {
  return (
    <div className="hbx">
      <section className="hbx-hero">
        <div className="wrap">
          <span className="hbx-crumb">Sales intelligence</span>
          <h1 className="mkt-h1" style={{ marginLeft: 0, marginRight: 0, textAlign: 'left' }}>
            How we win against X, before the call.
          </h1>
          <p className="lede" style={{ marginLeft: 0, textAlign: 'left' }}>
            Reps lose deals on objections nobody briefed them on, and battlecards go stale the week after someone
            writes them by hand. Fortress HQ builds the battlecard from what a competitor is actually doing right
            now &mdash; their review patterns, their funding, their pricing &mdash; and keeps it current without anyone
            maintaining a doc.
          </p>
        </div>
      </section>

      <section className="hbx-stats">
        <div className="wrap">
          <div className="hbx-stat-grid">
            <div className="hbx-stat"><span className="n">5</span><span className="l">Review platforms watched for win-loss signal &mdash; G2, Trustpilot, Capterra, TrustRadius, Gartner</span></div>
            <div className="hbx-stat"><span className="n">1</span><span className="l">Funding &amp; M&amp;A channel &mdash; SEC EDGAR Form D plus funding news, no key required</span></div>
            <div className="hbx-stat"><span className="n">5</span><span className="l">Weighted dimensions behind the Threat Index, always shown with its inputs</span></div>
            <div className="hbx-stat"><span className="n">$399/mo</span><span className="l">Growth tier &mdash; auto-generated battlecards, always current</span></div>
            <div className="hbx-stat"><span className="n">$149/mo</span><span className="l">Starter &mdash; 3 competitors watched daily, from day one</span></div>
            <div className="hbx-stat"><span className="n">4</span><span className="l">Real battlecards live in our own demo right now &mdash; Kompyte, Crayon, Signal Labs, Visualping</span></div>
            <div className="hbx-stat"><span className="n">10</span><span className="l">Competitors watched daily on Growth, each with its own auto-built card</span></div>
          </div>
        </div>
      </section>

      <section className="hbx-argument">
        <div className="wrap">
          <div className="hbx-panel">
            <h2>A battlecard is only useful if it&apos;s still true.</h2>
            <p>
              Most battlecards are written once, after a lost deal, and go stale the moment the market moves again.
              Fortress HQ writes &ldquo;how we win against X&rdquo; from the same signals a rep would want on a call, and
              rebuilds it as those signals change &mdash; not on a quarterly review cycle.
            </p>
            <p>
              <span className="accent">Review patterns are the closest thing to a live focus group your competitor
              runs on themselves.</span> A cluster of new G2 or Capterra reviews naming the same complaint &mdash; slow
              support, a missing integration, a confusing upgrade path &mdash; is an objection a rep can use, sourced to
              the review itself. A Trustpilot or Gartner Peer Insights pattern that skews positive tells you where
              not to compete on price alone.
            </p>
            <p>
              Corporate moves matter just as much. A competitor raising a round changes their runway and their sales
              pressure. A departed VP of Sales or Product is a deal-relevant fact, not gossip &mdash; and it always links
              to the article or filing that says so.
            </p>
          </div>
        </div>
      </section>

      <section className="hbx-how">
        <div className="wrap">
          <span className="wt-eyebrow">How it actually works</span>
          <h2 className="wt-h2">From a public review to a line a rep can say on a call.</h2>
          <div className="hbx-how-grid">
            <div className="hbx-how-item">
              <span className="step">01 · Reputation channels</span>
              <h3>Review patterns become objections</h3>
              <p>
                <code>g2</code>, <code>trustpilot</code>, <code>capterra</code>, <code>trustradius</code> and
                <code> gartner</code> feed the same reasoning layer &mdash; a recurring complaint or a review spike is
                weighed into the read, cited to the platform it came from.
              </p>
            </div>
            <div className="hbx-how-item">
              <span className="step">02 · Corporate moves</span>
              <h3>Funding and exec changes are deal facts</h3>
              <p>
                The <code>funding</code> channel reads SEC EDGAR Form D filings and funding news, keyless. A raise, a
                departure, an acquisition &mdash; each lands with the source, not as a rumor a rep half-remembers from
                LinkedIn.
              </p>
            </div>
            <div className="hbx-how-item">
              <span className="step">03 · The card writes itself</span>
              <h3>One briefing, scored, always current</h3>
              <p>
                Battlecards rebuild from everything on file &mdash; strengths, vulnerabilities, how to win, the one
                question to ask &mdash; alongside a Threat Index scored across five dimensions and shown with its
                inputs, never as a bare number.
              </p>
            </div>
          </div>
          <p className="wt-fine">
            Today, review patterns and funding moves surface in the daily feed and in each battlecard. Pushing a
            standing rule out to Slack the moment one fires is the delivery layer we&apos;re building next &mdash; the
            scoring that decides what&apos;s worth surfacing already runs; the notification isn&apos;t wired yet, and we&apos;d
            rather say that than imply it.
          </p>
        </div>
      </section>

      <section className="hbx-mech">
        <div className="wrap">
          <span className="wt-eyebrow">The full mechanism</span>
          <h2 className="wt-h2">From a review cluster to a card a rep can use, in six steps.</h2>
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

      <section className="hbx-block">
        <div className="wrap">
          <span className="wt-eyebrow">Who this is actually for</span>
          <h2 className="wt-h2">Two roles, one shared frustration: a card that&apos;s already out of date.</h2>
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
          <span className="wt-eyebrow">The channels behind every card</span>
          <h2 className="wt-h2">Eight channels feed a battlecard&apos;s hook, evidence and ask.</h2>
          <div className="hbx-chips">
            {CHANNEL_SAMPLE.map((c) => <span className="hbx-chip" key={c}>{c}</span>)}
          </div>
        </div>
      </section>

      <section className="hbx-example">
        <div className="wrap">
          <span className="wt-eyebrow">A real card, on a real call</span>
          <h2 className="wt-h2">Prepping for Tuesday&apos;s call against Crayon.</h2>
          <div className="hbx-scenario">
            <span className="hbx-scenario-tag">Worked example &middot; the actual Crayon card in our demo workspace</span>
            <p>
              An AE has a discovery call Tuesday against Crayon. Fifteen minutes before, she opens the battlecard
              instead of guessing. The Tower&apos;s read is blunt: <span className="accent">no price published anywhere
              on Crayon&apos;s site &mdash; every route to a number runs through a demo call</span>, which is the tell that
              it&apos;s priced per-seat, per-year, negotiated. Underneath, the evidence: zero Google ads, one LinkedIn ad
              &mdash; a posture that reads as defending an installed base, not hunting for new self-serve buyers.
            </p>
            <p>
              She doesn&apos;t need to memorize any of it. The card already gives her the move: put the two pricing pages
              side by side on screen &mdash; ours has a number, theirs has a form. Then the discovery question, exactly
              as written on the card: <em>&ldquo;How long from first call to seeing intelligence about your actual
              competitors, and what does it cost per seat per year?&rdquo;</em> It&apos;s not a trick question. It&apos;s the
              one question Crayon&apos;s own pricing page can&apos;t answer, and the buyer notices that live, on the call,
              without the rep having to argue anything.
            </p>
          </div>
        </div>
      </section>

      <section className="hbx-block">
        <div className="wrap">
          <span className="wt-eyebrow">What&apos;s included, by tier</span>
          <h2 className="wt-h2">Where the review-platform channels actually sit.</h2>
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

      <section className="hbx-argument">
        <div className="wrap">
          <span className="wt-eyebrow">The competitive frame, for sales</span>
          <h2 className="wt-h2">Same market, read for a rep instead of a buyer.</h2>
          <div className="hbx-table-wrap">
            <table className="hbx-table">
              <thead>
                <tr><th>Vendor</th><th>Their position</th><th>What a rep gets from us instead</th></tr>
              </thead>
              <tbody>
                {SALES_FRAME.map((f) => (
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
          <span className="wt-eyebrow">Questions a sales lead actually asks</span>
          <h2 className="wt-h2">Including the ones with an honest limit attached.</h2>
          <div className="hbx-faq-list">
            {SALES_FAQ.map((f) => (
              <details className="hbx-faq-item" key={f.q}>
                <summary>
                  <span className="q-txt">
                    {f.q.startsWith('Standing orders') && <span className="hbx-faq-tag">Hard question</span>}
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
            <p>See a real battlecard, built from public signals about our own market, with every line sourced.</p>
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
