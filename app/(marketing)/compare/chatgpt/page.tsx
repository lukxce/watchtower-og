import Link from 'next/link';

export const metadata = {
  title: 'Fortress HQ vs. asking ChatGPT — Fortress HQ',
  description:
    "AI chat tools are good at summarizing what's already been written. They can't see what a competitor did an hour ago, can't tell a real review from a fake one, and answer once instead of watching continuously.",
};

export default function CompareChatGPT() {
  return (
    <>
      <section className="cpx-hero">
        <div className="wrap">
          <span className="kicker">Fortress HQ vs. ChatGPT</span>
          <h1>Is asking ChatGPT enough to track a competitor?</h1>
          <p className="lede">
            This is a genuinely fair question, and it deserves a genuine answer rather than a cheap shot. AI chat
            tools are good — very good, actually — at one specific job: synthesizing what has already been written
            down about something. Ask a capable model &quot;what&apos;s new with Klue&quot; and it will often give
            you a competent-sounding paragraph. The question is what that paragraph is actually built from, and
            what it can&apos;t see.
          </p>
          <div className="counter">
            <b>Our counter:</b> we watch continuously and cite everything. A chat model answers once, from what
            was already public when it was trained or when it searched — it can&apos;t watch, and without citation
            discipline you can&apos;t tell a real fact from a plausible-sounding one.
          </div>
        </div>
      </section>

      <section className="cpx-section">
        <div className="wrap">
          <h2>Where a chat tool genuinely helps</h2>
          <p className="lede">
            To be specific about the credit due: if a competitor has a Wikipedia page, a funding announcement, or
            a well-covered launch, a good model can summarize that history faster than a person reading five
            tabs. That&apos;s real, useful synthesis of already-public writing. It is not the same job as
            <i> watching</i> a competitor — and the difference shows up in exactly four places.
          </p>
        </div>
      </section>

      <section className="cpx-section">
        <div className="wrap">
          <h2>Fortress HQ vs. asking ChatGPT</h2>
          <div className="cpx-table-wrap">
            <table className="cpx-table">
              <caption>Fortress HQ vs. asking ChatGPT</caption>
              <thead>
                <tr>
                  <th scope="col">&nbsp;</th>
                  <th scope="col" className="us">Fortress HQ</th>
                  <th scope="col">Asking ChatGPT</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Continuous monitoring</th>
                  <td className="us">Watches 22 public channels every day, on its own</td>
                  <td>Answers once, only when you remember to ask</td>
                </tr>
                <tr>
                  <th scope="row">Freshness</th>
                  <td className="us">Knows what happened this morning</td>
                  <td>Reflects whatever was written and indexed by the time it looked — an hour-old move is invisible until someone else writes about it</td>
                </tr>
                <tr>
                  <th scope="row">Evidence per claim</th>
                  <td className="us">Every claim links to the public source it came from</td>
                  <td>No citation discipline by default — a well-phrased guess and a sourced fact can read identically</td>
                </tr>
                <tr>
                  <th scope="row">Review authenticity</th>
                  <td className="us">Flags reviews and mentions that don&apos;t hold up, and says so</td>
                  <td>Has no way to tell a real review from a fake or incentivized one</td>
                </tr>
                <tr>
                  <th scope="row">Pricing</th>
                  <td className="us">Published, from $149/mo — built specifically for this job</td>
                  <td>Free or subscription, but not built to do this job</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="cpx-section">
        <div className="wrap">
          <h2>Why citation discipline is the actual issue</h2>
          <p className="lede">
            The uncomfortable part of asking a chat model about a competitor isn&apos;t that it might be wrong —
            it&apos;s that you usually can&apos;t tell when it is. A fabricated detail and a real one arrive in the
            same confident sentence, with no source attached to check. That&apos;s the whole reason every
            conclusion we show carries its source: a competitor &quot;raised funding&quot; always links to the
            article that says so, because a claim you can&apos;t verify isn&apos;t intelligence — it&apos;s a
            guess wearing a suit. We&apos;d rather tell you we found nothing than hand you something that sounds
            right and isn&apos;t.
          </p>
        </div>
      </section>

      <div className="wrap">
        <div className="wt-inline-cta">
          <p>Every fact cited, watched continuously — see it running on real competitors.</p>
          <div className="wt-cta">
            <Link href="/demo" className="btn btn-primary">Try the live demo</Link>
            <Link href="/pricing" className="btn btn-ghost">See pricing</Link>
          </div>
        </div>
      </div>
    </>
  );
}
