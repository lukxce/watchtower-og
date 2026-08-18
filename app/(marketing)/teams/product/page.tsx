import Link from 'next/link';

export const metadata = {
  title: 'For Product Teams — Fortress HQ',
  description:
    'Early buildout signals — hostnames, hiring clusters — before the launch post, not after.',
};

export default function ProductTeamPage() {
  return (
    <>
      <section className="tmx-hero">
        <div className="tmx-wrap">
          <h1 className="tmx-pull">
            You find out they shipped it <span className="hl">from the launch post.</span>
          </h1>
          <p className="tmx-dek">
            The thing on your roadmap, the one you were building carefully and on your own timeline, is suddenly a
            competitor&apos;s announcement. The work that gave it away was public for months. Nobody was watching
            for it.
          </p>
        </div>
      </section>

      <section className="tmx-proof-sec">
        <div className="tmx-wrap">
          <p className="tmx-proof">
            A hostname on the certificate log shows up the week it&apos;s registered, not the week they announce
            it. <b>Three subdomains handed to one feature, alongside a run of senior hires in the same area</b>, is
            engineering commitment you can see months before the press release — read together, not as a pile of
            disconnected facts.
          </p>
        </div>
      </section>

      <section className="tmx-section">
        <div className="tmx-wrap tmx-monday">
          <span className="tmx-eyebrow">Monday morning</span>
          <h2 className="tmx-h2">The roadmap surprise you used to only find out about at launch.</h2>
          <span className="tmx-monday-time">11:20 — before the roadmap review</span>
          <p>
            You used to find out a competitor built the thing on your roadmap the same way everyone else did: a
            launch post, a press release, a customer forwarding a link with &quot;did you see this.&quot; By then
            the decision was already made for you — ship faster with less confidence, reposition the feature, or
            explain in the roadmap review why the thing you&apos;ve been building for two quarters now looks like a
            reaction instead of a plan. The frustrating part was always that the work behind their launch had been
            visible the whole time, in places nobody on the team was set up to check daily — a certificate log, a
            careers page, a changelog line easy to miss.
          </p>
          <p>
            Now you check the feed filtered to Product before the roadmap review, and it&apos;s already done the
            watching. Klue has a new hostname — <code>interview.klue.com</code> — live in production, observed on
            the certificate-transparency log. On its own that&apos;s one fact, not a story. Read next to four open
            roles posted this month, all tagged &quot;voice,&quot; it stops being one fact: it&apos;s a team being
            built around a specific feature area, months before anyone at Klue says a word about it publicly.
          </p>
          <p>
            The Tower&apos;s read is a single sentence: <b>&quot;Klue is building an AI interviewer. They
            haven&apos;t said so.&quot;</b> Underneath it, the how-we-know line — the cert-transparency log, plus
            the four hiring posts, all linked. You don&apos;t take the conclusion on faith; you can open every
            source it&apos;s built from and decide for yourself whether it holds up. It does.
          </p>
          <p>
            You bring that into the roadmap review instead of a launch-day surprise three months from now. Maybe it
            changes the sequencing of your own related work. Maybe it doesn&apos;t — but it&apos;s a decision made
            with time to think, not a scramble the day their post goes live.
          </p>
        </div>
      </section>

      <section className="tmx-section">
        <div className="tmx-wrap">
          <span className="tmx-eyebrow">What you get</span>
          <h2 className="tmx-h2">The public trail a launch always leaves, actually watched.</h2>
          <p className="tmx-lede">
            None of this is proprietary or hidden — it&apos;s the public buildout evidence every launch leaves
            behind, read continuously instead of discovered after the fact.
          </p>
          <div className="tmx-grid">
            <div className="tmx-card">
              <span className="tmx-card-k">Certificate watch</span>
              <h3>New hostnames, the week they&apos;re registered</h3>
              <p>
                A subdomain going live is one of the earliest public tells of a new feature area — it turns up on
                the certificate-transparency log before the product behind it is ever announced.
              </p>
            </div>
            <div className="tmx-card">
              <span className="tmx-card-k">Hiring clusters</span>
              <h3>A run of roles in the same area</h3>
              <p>
                One senior hire tagged to a feature area is a data point. Four in a month is a team being built —
                and job postings are public months before a launch is.
              </p>
            </div>
            <div className="tmx-card">
              <span className="tmx-card-k">Sitemap diff</span>
              <h3>Pages appearing before they&apos;re linked</h3>
              <p>
                New pages sometimes exist on a competitor&apos;s site before they&apos;re navigable from the menu —
                a sitemap diff catches that gap between &quot;built&quot; and &quot;announced.&quot;
              </p>
            </div>
            <div className="tmx-card">
              <span className="tmx-card-k">Tech stack detection</span>
              <h3>What they&apos;re actually building with</h3>
              <p>
                A shift in a competitor&apos;s detected stack — a new vendor, a new SDK — can be an early tell for
                the kind of feature they&apos;re about to be capable of shipping.
              </p>
            </div>
            <div className="tmx-card">
              <span className="tmx-card-k">Launch Radar</span>
              <h3>A forecast, not a guess</h3>
              <p>
                Fires only when corroborating signal types line up — a hostname alone isn&apos;t a launch. When it
                does fire, it&apos;s built on named evidence you can check yourself.
              </p>
            </div>
            <div className="tmx-card">
              <span className="tmx-card-k">Battlecards</span>
              <h3>The product angle, already written</h3>
              <p>
                Buildout signals read together and turned into a plain-language read of what a competitor is likely
                building — before the launch post, not a recap after it.
              </p>
            </div>
            <div className="tmx-card">
              <span className="tmx-card-k">Threat Index</span>
              <h3>The product dimension, isolated</h3>
              <p>
                One of five weighted dimensions behind each competitor&apos;s score — you can see specifically how
                much of a rating shift is coming from buildout activity versus GTM, talent, market or corporate.
              </p>
            </div>
            <div className="tmx-card">
              <span className="tmx-card-k">Signal feed</span>
              <h3>Every raw fact, if you want to dig further</h3>
              <p>
                Every scout report that fed a conclusion is sitting underneath it, dated and sourced — for the times
                you want to check the buildout evidence yourself before it reaches the roadmap review.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="tmx-section">
        <div className="tmx-wrap">
          <span className="tmx-eyebrow">How product actually uses it</span>
          <h2 className="tmx-h2">Built around a roadmap decision, not a research habit.</h2>
          <div className="tmx-steps">
            <div className="tmx-step">
              <span className="tmx-step-n">01</span>
              <div>
                <h3>Launch Radar or the feed flags a buildout pattern</h3>
                <p>
                  A hostname, a hiring cluster, or both together — surfaced because they corroborate each other, not
                  because either alone crossed a threshold.
                </p>
              </div>
            </div>
            <div className="tmx-step">
              <span className="tmx-step-n">02</span>
              <div>
                <h3>You open the how-we-know line</h3>
                <p>
                  Every conclusion sits on top of its actual evidence — you check the cert log entry or the job
                  posts yourself before treating the read as settled.
                </p>
              </div>
            </div>
            <div className="tmx-step">
              <span className="tmx-step-n">03</span>
              <div>
                <h3>You bring it into planning, not a scramble</h3>
                <p>
                  The signal reaches you with enough lead time to change sequencing deliberately — the entire value
                  is the lead time, not the fact itself.
                </p>
              </div>
            </div>
            <div className="tmx-step">
              <span className="tmx-step-n">04</span>
              <div>
                <h3>You check the battlecard&apos;s product angle</h3>
                <p>
                  If the signal is strong enough to matter, the read is likely already written — a starting point
                  for the team&apos;s own discussion, not a replacement for it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="tmx-section tmx-honest">
        <div className="tmx-wrap">
          <span className="tmx-eyebrow">Why not just do this by hand</span>
          <h2 className="tmx-h2">Nobody on a product team is set up to check a certificate log daily.</h2>
          <p>
            The information that would have warned you is genuinely public — that&apos;s the frustrating part. A
            certificate-transparency log is a real, checkable thing. So are job postings. The problem was never that
            the evidence was hidden; it&apos;s that <b>reading it requires checking sources nobody on a product team
            has in their weekly routine</b>, and doing it manually across even a handful of competitors, every week,
            isn&apos;t a realistic use of anyone&apos;s time.
          </p>
          <p>
            Even a team that tried — say, someone set a calendar reminder to check competitor job boards monthly —
            would still miss the actual signal, because the value isn&apos;t in any one channel. It&apos;s in
            reading a hostname next to a hiring cluster next to a changelog line, together, which is exactly the
            kind of cross-referencing that&apos;s tedious by hand and mechanical to do continuously.
          </p>
          <p>
            This doesn&apos;t predict what a competitor will ship, and we won&apos;t claim it does — Launch Radar is
            a forecast with named evidence, not a prophecy. It closes the gap between when the evidence became
            public and when your team actually reads it.
          </p>
        </div>
      </section>

      <section className="tmx-section">
        <div className="tmx-wrap">
          <span className="tmx-eyebrow">Questions product teams actually ask</span>
          <h2 className="tmx-h2">Including the one about how reliable a forecast can really be.</h2>
          <div className="tmx-faq">
            <details>
              <summary>How accurate is Launch Radar, really?</summary>
              <p>
                It&apos;s a forecast built on corroborating public evidence, not a guarantee. It fires only when
                signal types actually reinforce each other — a hostname alone doesn&apos;t trigger it. It can still
                be wrong; a hiring cluster can be for something that never ships. What it won&apos;t do is dress up
                a single weak signal as a confident prediction.
              </p>
            </details>
            <details>
              <summary>Will I get notified the moment a hostname or a hiring cluster shows up?</summary>
              <p>
                Not automatically, not yet. Standing orders — a persistent rule that pushes a notification the
                instant a pattern fires — are in build, not shipped today. What&apos;s real is that the signal lands
                in the feed and Launch Radar the day it&apos;s found, cited, ready to check when you look.
              </p>
            </details>
            <details>
              <summary>What if a competitor hasn&apos;t shipped anything publicly yet — is there anything to see?</summary>
              <p>
                Often yes, before they&apos;ve said a word. Buildout signals — hostnames, hiring clusters, tech-stack
                shifts — routinely show up months before an announcement, because the public infrastructure work
                happens before the marketing does.
              </p>
            </details>
            <details>
              <summary>We already set Google Alerts on competitor names. Isn&apos;t that basically this?</summary>
              <p>
                Google Alerts catches what&apos;s already been written about publicly — press, blog posts, news. It
                won&apos;t catch a certificate-log entry or a job posting pattern, and it can&apos;t read two facts
                together to notice they corroborate each other. That reading-together step is most of the actual
                value here.
              </p>
            </details>
            <details>
              <summary>What does it cost for a product team to get this coverage?</summary>
              <p>
                Starter is $149/mo for 3 competitors, which covers the product-signal channels — sitemap diffs,
                certificate watch, tech-stack detection, hiring — for a focused competitive set. Broader coverage
                and campaign tracking sit in Growth at $399/mo.
              </p>
            </details>
          </div>
        </div>
      </section>

      <section className="wt-close">
        <div className="wrap">
          <h2>Stop being the last to know.</h2>
          <p>Name your competitors, or let the Tower find them. Real signals inside the hour.</p>
          <div className="wt-cta">
            <Link href="/sign-up" className="btn btn-primary btn-lg">Start free</Link>
            <Link href="/demo" className="btn btn-ghost btn-lg">Try the live demo</Link>
          </div>
        </div>
      </section>
    </>
  );
}
