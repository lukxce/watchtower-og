import Link from 'next/link';
import '../company.css';

export const metadata = {
  title: 'About — Fortress HQ',
  description: 'Why Fortress HQ exists, what it refuses to do, and who stands the watch.',
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

        <h2>What we refuse to do</h2>
        <p>
          A fortress is defensive, patient and honest. It is not a spy. Everything Fortress HQ reads is public —
          it is simply read continuously, and read together, which almost nobody does by hand. That distinction
          is the whole company, so we hold to it on purpose:
        </p>
        <ul>
          <li><strong>No surveillance framing.</strong> We don&rsquo;t do cloak-and-dagger, crosshairs, or
            targets. We read what a competitor has already chosen to publish — a pricing page, a job listing, an
            ad — not anything private, gated, or obtained by pretending to be someone we&rsquo;re not.</li>
          <li><strong>No secrecy about how it works.</strong> The methodology behind every conclusion is public
            and specific, not a black box we ask you to trust. See how we verify what we show you.</li>
          <li><strong>No invented capabilities.</strong> If a page can&rsquo;t be fetched, the product says so.
            If a match can&rsquo;t be verified — a brand name that turns out to belong to a song, a band, or an
            unrelated company — it&rsquo;s disclosed as unverifiable, not quietly counted as a signal anyway.</li>
          <li><strong>No false fires.</strong> Loud treatment is reserved for things that clear an evidence bar.
            Most of the interface stays calm on purpose, so that when something is highlighted, it means
            something.</li>
        </ul>

        <h2>Where we are today</h2>
        <p>
          Fortress HQ is a small, focused team building one product. We don&rsquo;t have a headcount or a funding
          round to announce, because there isn&rsquo;t one — we&rsquo;d rather tell you that plainly than pad an
          about page with corporate biography that doesn&rsquo;t exist yet. What we do have is a product that
          works today, self-serve pricing that&rsquo;s published rather than gated behind a demo call, and a
          methodology we&rsquo;re glad to explain in detail.
        </p>

        <div className="cox-cta-row">
          <Link href="/pricing" className="btn btn-primary">See pricing</Link>
          <Link href="/demo" className="btn btn-ghost">Try the live demo →</Link>
        </div>
      </div>
    </section>
  );
}
