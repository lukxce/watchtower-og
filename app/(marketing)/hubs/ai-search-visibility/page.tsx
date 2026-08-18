import Link from 'next/link';

export const metadata = {
  title: 'AI Search Visibility — Fortress HQ',
  description:
    "We don't track your ChatGPT or Perplexity citations yet. Here's what we track today that gets most of the way there, and why we think we're the right team to build the rest.",
};

export default function AiSearchVisibilityHub() {
  return (
    <div className="hbx">
      <section className="hbx-hero">
        <div className="wrap">
          <span className="hbx-crumb">AI search visibility</span>
          <h1 className="mkt-h1" style={{ marginLeft: 0, marginRight: 0, textAlign: 'left' }}>
            Buyers are asking ChatGPT to compare you before they hit your site.
          </h1>
          <p className="lede" style={{ marginLeft: 0, textAlign: 'left' }}>
            &ldquo;Most of your market happens in the dark&rdquo; used to mean the pages nobody checks. Increasingly it
            means the conversation happening inside a chat window, where a buyer asks an AI tool to shortlist
            vendors and gets an answer built from whatever that model has read and trusts. That answer is public in
            the sense that it&apos;s reachable &mdash; it just isn&apos;t watched by anyone yet, including us.
          </p>
        </div>
      </section>

      <section className="hbx-stats">
        <div className="wrap">
          <div className="hbx-stat-grid">
            <div className="hbx-stat"><span className="n">22</span><span className="l">Public channels watched daily, today &mdash; none of them an AI answer engine, yet</span></div>
            <div className="hbx-stat"><span className="n">7</span><span className="l">Voice &amp; PR channels already tracking how competitors are talked about in public</span></div>
            <div className="hbx-stat"><span className="n">100%</span><span className="l">Of mentions classified as client, same-name, or noise before they reach your feed</span></div>
            <div className="hbx-stat"><span className="n">$149/mo</span><span className="l">Starter, published &mdash; the same price whether a feature is shipped or roadmap</span></div>
          </div>
        </div>
      </section>

      <section className="hbx-argument">
        <div className="wrap">
          <div className="hbx-panel">
            <h2>We don&apos;t track your ChatGPT citations yet.</h2>
            <p>
              Here&apos;s why we think we&apos;re the right team to build it, and what we already track today that gets us
              most of the way there. Live citation tracking inside ChatGPT, Perplexity, Gemini or any other AI answer
              engine is not a shipped Fortress HQ capability. It isn&apos;t something we quietly do in the background
              either &mdash; it simply isn&apos;t built. Anyone who tells you their tool fully monitors this today is
              either overstating a sample of manual prompt checks, or asking you to trust a black box. We&apos;d rather
              say we don&apos;t have it yet.
            </p>
            <p>
              What we do have is the same discipline that would need to sit underneath a feature like that: sources
              that are verified rather than guessed, mentions that are classified rather than keyword-matched, and
              gaps that are disclosed instead of papered over. That&apos;s not a consolation prize &mdash; it&apos;s the hard
              part of building this correctly, and it&apos;s already running.
            </p>
          </div>
        </div>
      </section>

      <section className="hbx-split">
        <div className="wrap">
          <span className="wt-eyebrow">Where we actually stand</span>
          <h2 className="wt-h2">What&apos;s live today, and what genuinely isn&apos;t.</h2>
          <div className="hbx-split-grid">
            <div className="hbx-live-panel">
              <span className="hbx-panel-tag live"><i />Live &middot; today</span>
              <h3>What we track today that gets you most of the way there</h3>
              <p>
                The pieces an AI-citation channel would eventually build on top of are already running, watching how
                competitors show up in public voice and press:
              </p>
              <ul>
                <li><strong>News &amp; press monitoring</strong> &mdash; the <code>news</code> channel, on Google News RSS by
                  default and GNews API when configured.</li>
                <li><strong>Brand mention tracking, classified</strong> &mdash; every mention is checked against your own
                  brand settings and marked client, a different same-name entity, or noise, never shown as a bare
                  keyword hit.</li>
                <li><strong>Funding &amp; corporate-move tracking</strong> &mdash; the <code>funding</code> channel, SEC EDGAR
                  Form D plus funding news, keyless, is exactly the kind of fact an AI answer engine would surface
                  about a company&apos;s trajectory.</li>
                <li><strong>The verified-source discipline</strong> &mdash; every fact cited, every gap disclosed. This is
                  the part of the system that an AI-citation channel can&apos;t skip, and it&apos;s the part we&apos;ve already
                  built.</li>
              </ul>
            </div>
            <div className="hbx-roadmap-panel">
              <span className="hbx-panel-tag roadmap">Roadmap &middot; not shipped</span>
              <h3>What&apos;s not built yet, said plainly</h3>
              <p>
                We&apos;re built to extend into this. It isn&apos;t live yet, and we won&apos;t claim it is:
              </p>
              <ul>
                <li>Live tracking of whether and how your brand is cited inside ChatGPT, Perplexity, Gemini, or
                  similar answer engines.</li>
                <li>Monitoring how a competitor is described or ranked in AI-generated comparisons.</li>
                <li>Any dashboard number that implies a measured &ldquo;AI visibility score&rdquo; &mdash; we haven&apos;t built
                  one, and we won&apos;t publish a made-up one in the meantime.</li>
              </ul>
              <p>
                When we build it, it will be a scout &mdash; one more collector reporting honestly into the same Tower,
                held to the same evidence bar as everything above. That&apos;s the architecture; this is just the
                channel we haven&apos;t written yet.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="hbx-cta">
        <div className="wrap">
          <div className="wt-inline-cta">
            <p>See the 22 channels that are live today, in the workspace we run on our own market.</p>
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
