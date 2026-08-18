import Link from 'next/link';
import '../company.css';

export const metadata = {
  title: 'About — Fortress HQ',
  description: 'Why Fortress HQ exists, how it started, what it refuses to do, and who stands the watch.',
};

export default function About() {
  return (
    <section className="cox-page">
      <div className="wrap cox-prose">
        <span className="cox-kicker">About</span>
        <h1>The watch you don&rsquo;t have to stand yourself.</h1>
        <p className="cox-lede">
          A fortress exists for one reason: someone stands the watch so everyone else can sleep. Fortress HQ
          stands the watch over your competitors — their pricing, their launches, their hiring, the hostnames
          they haven&rsquo;t announced — and brings you a briefing in the morning. What they did. Why it matters.
          What to do about it.
        </p>

        <h2>Why this exists</h2>
        <p>
          Most teams find out a competitor cut their price, shipped a feature, or picked up a bad review from a
          lost deal — weeks after it happened. The tools that exist either forward raw page-diffs you still have
          to interpret yourself, or cost five figures a year and need someone hired to run them. Neither is
          honest about what a small team actually needs, which is a person — or something that reads like one —
          watching continuously and telling you only when something real moves.
        </p>
        <p>
          Scouts gather. The Tower sees. Individual collectors go out to every public channel a competitor
          leaves a trace on — pricing pages, ad libraries, job boards, certificate logs, press, review sites —
          and report back honestly, including when they find nothing. The Tower is the part that reads what
          came back, together, per competitor, and writes the conclusion. It never acts on your behalf and never
          decides for you. It hands you a briefing and stands back. You command.
        </p>

        <h2>How this started</h2>
        <p>
          Fortress HQ didn&rsquo;t start as a company. It started as an internal tool, built to track one
          company&rsquo;s own competitor set — pricing pages, hiring, ads, launches — because the alternative
          was someone manually reopening a dozen tabs before a board meeting and hoping they hadn&rsquo;t missed
          anything since the last time. It watched a small, real set of named competitors, every day, and it
          worked well enough that the obvious question became: why should this exist for only one company?
        </p>
        <p>
          Productizing it meant rebuilding the parts an internal tool is deliberately allowed to skip —
          multi-tenancy, self-serve onboarding, published pricing instead of a sales call, a methodology written
          down well enough to publish rather than explained once in a Slack thread. The original workspace is
          still the place all of that got proven out before anyone else saw it, and the demo you can try today
          runs on the same reasoning, pointed at competitors you name yourself.
        </p>

        <h2>What we believe</h2>
        <p>
          A fortress is defensive, patient and honest. It is not a spy. Everything Fortress HQ reads is public —
          it is simply read continuously, and read together, which almost nobody does by hand. That distinction
          is the whole company, so we hold to four rules on purpose, and we&rsquo;d rather explain the reasoning
          behind each one than just post the rule.
        </p>

        <h3>No surveillance framing</h3>
        <p>
          We don&rsquo;t do cloak-and-dagger, crosshairs, or targets. We read what a competitor has already
          chosen to publish — a pricing page, a job listing, an ad — not anything private, gated, or obtained by
          pretending to be someone we&rsquo;re not. This isn&rsquo;t only a legal line, it&rsquo;s the correct
          one ethically, and it&rsquo;s also the exact register every mediocre competitor in this category
          already reaches for. &ldquo;War room&rdquo; and &ldquo;target&rdquo; describe a raid. We read and
          report; we don&rsquo;t raid.
        </p>

        <h3>No secrecy about how it works</h3>
        <p>
          The methodology behind every conclusion is public and specific, not a black box we ask you to trust.
          The reasoning is: a tool that only shows you conclusions and hides how it reached them is asking for
          faith, and faith isn&rsquo;t a defensible product claim. So the exact mechanisms — the domain field a
          review has to match, the filing an EDGAR record has to carry, the classification every brand mention
          runs through before it counts — are written up in full on the{' '}
          <Link href="/methodology">methodology page</Link>, not summarized as &ldquo;our proprietary
          algorithm.&rdquo;
        </p>

        <h3>No invented capabilities</h3>
        <p>
          If a page can&rsquo;t be fetched, the product says so. If a match can&rsquo;t be verified — a brand
          name that turns out to belong to a song, a band, or an unrelated company — it&rsquo;s disclosed as
          unverifiable, not quietly counted as a signal anyway. We take this seriously enough that we apply it
          to our own name: this product used to be called Watchtower, and a domain and trademark audit found
          every <code>watchtower.*</code> domain already taken, and the name itself competing for attention with
          a famous song, a band, a film and a farmhouse, on top of half a dozen unrelated cybersecurity products.
          Rather than launch into that confusion and hope customers sorted it out themselves, we renamed the
          company to Fortress HQ. It&rsquo;s the same discipline the product applies to every &ldquo;Klue&rdquo;
          or &ldquo;Crayon&rdquo; match it reads — disambiguate first, or say plainly that you can&rsquo;t.
        </p>

        <h3>No false fires</h3>
        <p>
          Loud treatment is reserved for things that clear an evidence bar. Most of the interface stays calm on
          purpose, so that when something is highlighted, it means something. In practice that means real
          matches get held back rather than guessed at: two unrelated companies both named &ldquo;Crayon&rdquo;
          produce funding headlines that read identically, and rather than attribute one to the other, an
          ambiguous item is counted and disclosed — &ldquo;N items held, name shared with another company&rdquo;
          — instead of shown as fact. The same discipline is why a search for a company called &ldquo;Klue&rdquo;
          on G2 has to be checked against the platform&rsquo;s own domain field before it counts, because a bare
          name search also returns Kluster, Wolters Kluwer and KlientBoost — three unrelated businesses that
          merely share a prefix. See the full mechanics on <Link href="/methodology">how we verify this</Link>.
        </p>

        <h2>Who this is for</h2>
        <p>
          Fortress HQ is built for people who are expected to already know what a competitor did, not for
          people who enjoy reading feeds. Nobody on this list has time to compile a market update by hand, and
          the product is shaped around each seat&rsquo;s actual failure mode rather than one generic dashboard:
        </p>

        <h3>Founders and executives</h3>
        <p>
          The failure mode is finding out in the board meeting — a board member mentions a competitor&rsquo;s
          move and the room turns to you. The product&rsquo;s answer isn&rsquo;t a feed to scroll before the
          call, it&rsquo;s the state of the market in ten seconds, already compiled. See{' '}
          <Link href="/teams/executives">Fortress HQ for executives</Link>.
        </p>

        <h3>Product marketing</h3>
        <p>
          Often the whole competitive-intelligence function is one person, and a battlecard written once,
          carefully, with sources, is three months and one price change out of date by the time someone asks
          &ldquo;what&rsquo;s new with them.&rdquo; The product keeps cards current and sourced enough to
          forward straight to sales. See{' '}
          <Link href="/teams/product-marketing">Fortress HQ for product marketing</Link>.
        </p>

        <h3>Sales</h3>
        <p>
          The failure mode is a rep hitting an objection nobody briefed them on, live, on a call, and losing
          ground they can&rsquo;t get back — not because the answer didn&rsquo;t exist, but because nobody had
          written it down yet. See <Link href="/teams/sales">Fortress HQ for sales</Link>.
        </p>

        <h3>Product</h3>
        <p>
          The failure mode is discovering a competitor shipped the exact thing on your own roadmap, from their
          launch post — when the work that gave it away (a hiring cluster, a hostname on a certificate log) was
          public for months beforehand and nobody was watching. See{' '}
          <Link href="/teams/product">Fortress HQ for product teams</Link>.
        </p>

        <h3>Marketing</h3>
        <p>
          The failure mode is a comparison page that&rsquo;s quietly wrong — a competitor drops their price or
          ships the feature your page says they don&rsquo;t have — and it sits there wrong until a prospect
          points it out on a reply-all. See <Link href="/teams/marketing">Fortress HQ for marketing teams</Link>.
        </p>

        <h2>Where we are today</h2>
        <p>
          Fortress HQ is a small, focused team building one product. We don&rsquo;t have a headcount or a funding
          round to announce, because there isn&rsquo;t one — we&rsquo;d rather tell you that plainly than pad an
          about page with corporate biography that doesn&rsquo;t exist yet. What we do have is specific: a
          product that watches 28 public channels across pricing, hiring, ads, launches, reviews and press,
          self-serve pricing that&rsquo;s published starting at $149/mo rather than gated behind a demo call, a
          live workspace you can try without talking to anyone first, and a methodology we&rsquo;re glad to
          explain in detail rather than wave at.
        </p>
        <p>
          Some things aren&rsquo;t built yet, and we say so rather than let you find out the hard way — the
          product tells you plainly when a capability is still on the way instead of quietly pretending it
          already ships. The full channel inventory is public on{' '}
          <Link href="/features/data-sources">what we track</Link>, and it grows in the open, not behind a
          changelog nobody reads.
        </p>

        <div className="cox-cta-row">
          <Link href="/pricing" className="btn btn-primary">See pricing</Link>
          <Link href="/demo" className="btn btn-ghost">Try the live demo →</Link>
        </div>
      </div>
    </section>
  );
}
