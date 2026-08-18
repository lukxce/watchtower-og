import Link from 'next/link';

export const metadata = {
  title: 'Campaign Intelligence — Fortress HQ',
  description:
    'Ad monitoring across the Meta, Google and LinkedIn ad libraries, plus events, webinars and customer-logo wins and losses — what they are actually running, not press releases about it.',
};

export default function CampaignIntelligenceFeature() {
  return (
    <div className="ftx">
      {/* ---------- hero ---------- */}
      <section className="wt-hero">
        <div className="wrap wt-hero-grid">
          <div className="wt-hero-copy">
            <span className="wt-over">Feature · Campaign intelligence</span>
            <span className="kicker">GTM &amp; ads · watched daily</span>
            <h1 className="wt-h1">We watch what they&apos;re running, not what they announce.</h1>
            <p className="wt-dek">
              Campaign intelligence scouts the Meta, Google and LinkedIn ad libraries, events and webinar pages, and
              customer-logo walls for every competitor on your watch. A press release tells you what a competitor
              wants you to think. Live spend tells you what they actually believe is working.
            </p>
            <div className="wt-cta">
              <Link href="/sign-up" className="btn btn-primary btn-lg">Start free</Link>
              <Link href="/demo" className="btn btn-ghost btn-lg">Try the live demo →</Link>
            </div>
            <p className="wt-note">From $149/mo · no card required</p>
          </div>

          <div className="ftx-art">
            <div className="wt-panel" aria-label="A mocked campaign intelligence feed">
              <div className="wt-panel-head">
                <span className="mono">gtm &amp; ads · today</span>
                <span className="wt-live"><i />live</span>
              </div>
              <div className="ftx-stats">
                <div className="ftx-stat"><b>11</b><span>Visualping ads live</span></div>
                <div className="ftx-stat"><b>1</b><span>Crayon LinkedIn ad</span></div>
                <div className="ftx-stat"><b>0</b><span>Crayon Google ads</span></div>
              </div>
              <div className="wt-row hot" style={{ animationDelay: '0.1s' }}>
                <span className="wt-row-t mono">08:12</span>
                <span className="wt-row-x">Signal Labs: 10 ads live, still zero press coverage</span>
                <span className="wt-row-g mono">ads</span>
              </div>
              <div className="wt-row" style={{ animationDelay: '0.24s' }}>
                <span className="wt-row-t mono">09:05</span>
                <span className="wt-row-x">Klue: new events page live, &quot;State of CI&quot; webinar listed</span>
                <span className="wt-row-g mono">events</span>
              </div>
              <div className="wt-row" style={{ animationDelay: '0.38s' }}>
                <span className="wt-row-t mono">10:31</span>
                <span className="wt-row-x">Kompyte: logo wall unchanged for the fourth month running</span>
                <span className="wt-row-g mono">logos</span>
              </div>
              <div className="ftx-readout">
                <span className="mono">the tower</span>
                <b>Crayon is defending, not hunting.</b>
                <p>Zero Google ads and one on LinkedIn, against a events page pushing enterprise case studies — this is retention spend, not new-buyer spend.</p>
              </div>
              <div className="ftx-know">
                <b>How we know:</b> Google &amp; LinkedIn ad library counts, checked daily · cited on the card
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- mechanism ---------- */}
      <section className="mkt-section tight ftx-mech">
        <div className="wrap">
          <span className="wt-eyebrow">How it works</span>
          <h2 className="wt-h2">Spend is a confession. We read it daily.</h2>
          <p className="wt-lede">
            What a competitor spends money to say, in public, and how that changes week to week — three real
            channels, read together.
          </p>
          <div className="ftx-steps">
            <div className="ftx-step">
              <div className="ftx-step-n" />
              <div className="ftx-step-body">
                <span className="mono">ad libraries checked</span>
                <h4>Meta, Google and LinkedIn, on a schedule</h4>
                <p>
                  Every public ad library gets checked for each competitor on your watch, and the count and the
                  creative get logged — so a quiet quarter and a spend surge both show up as a trend over time, not a
                  one-off screenshot you have to remember to compare.
                </p>
              </div>
            </div>
            <div className="ftx-step">
              <div className="ftx-step-n" />
              <div className="ftx-step-body">
                <span className="mono">events &amp; webinars scanned</span>
                <h4>What they&apos;re trying to convince a room of</h4>
                <p>
                  New events pages and webinar listings are one of the earliest tells of a positioning shift — they
                  get written and published months before the campaign that follows them, so this channel often
                  surfaces a shift before the ad spend does.
                </p>
              </div>
            </div>
            <div className="ftx-step">
              <div className="ftx-step-n" />
              <div className="ftx-step-body">
                <span className="mono">logo walls captured</span>
                <h4>Wins and losses on the wall</h4>
                <p>
                  A logo wall that adds a name is a proof point; one that goes quiet for months is a gap. The scout
                  captures the wall on each run, so a new name — or a name that quietly disappears — becomes evidence
                  instead of something only noticed by accident.
                </p>
              </div>
            </div>
            <div className="ftx-step">
              <div className="ftx-step-n" />
              <div className="ftx-step-body">
                <span className="mono">read together</span>
                <h4>Spend, message and event theme, cross-checked</h4>
                <p>
                  A rise in ad count alongside a new events page pushing the same theme is a real campaign. A rise in
                  ad count with a stagnant logo wall and no events activity is likely just retention spend. The Tower
                  checks all three before deciding which story it&apos;s looking at.
                </p>
              </div>
            </div>
            <div className="ftx-step">
              <div className="ftx-step-n" />
              <div className="ftx-step-body">
                <span className="mono">written as a read</span>
                <h4>&quot;Hunting&quot; versus &quot;defending,&quot; named plainly</h4>
                <p>
                  The conclusion lands as a plain sentence — new-buyer spend versus retention spend, a positioning
                  shift versus a quiet quarter — with the ad counts, event pages and logo changes cited underneath
                  it, exactly as they were found.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- what's included ---------- */}
      <section className="mkt-section tight">
        <div className="wrap">
          <span className="wt-eyebrow">What&apos;s actually watched</span>
          <h2 className="wt-h2">Every public place a GTM motion shows itself.</h2>
          <div className="ftx-included">
            <div className="ftx-inc">
              <b>Meta ad library</b>
              <p>Active creatives and counts by page ID from Meta&apos;s public Ad Library Graph API.</p>
            </div>
            <div className="ftx-inc">
              <b>Google ad library</b>
              <p>Live ads by domain from Google&apos;s Ads Transparency Center, checked on the standard schedule.</p>
            </div>
            <div className="ftx-inc">
              <b>LinkedIn ad library</b>
              <p>Advertiser-exact matches from LinkedIn&apos;s public ad library — no guessing which account is theirs.</p>
            </div>
            <div className="ftx-inc">
              <b>Events &amp; webinar pages</b>
              <p>Field-marketing themes pulled from a competitor&apos;s own events pages as they&apos;re published.</p>
            </div>
            <div className="ftx-inc">
              <b>Customer-logo walls</b>
              <p>Site captures of logo walls, compared run over run to catch additions and quiet removals.</p>
            </div>
            <div className="ftx-inc">
              <b>Spend-count trends over time</b>
              <p>Ad counts logged on every run build a real trend line — surge, plateau or retreat — not a single snapshot.</p>
            </div>
            <div className="ftx-inc">
              <b>Message-level tracking</b>
              <p>What the ad creative and events copy actually say, not just that something is running.</p>
            </div>
            <div className="ftx-inc">
              <b>Cross-competitor comparison</b>
              <p>Ad and events activity for every competitor on your watch, side by side, in the same feed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- who reads it ---------- */}
      <section className="mkt-section tight">
        <div className="wrap">
          <span className="wt-eyebrow">Two different reads, same feed</span>
          <h2 className="wt-h2">A PMM and a sales lead want different things from it.</h2>
          <div className="ftx-pair">
            <div className="ftx-paircard">
              <span className="mono">product marketing</span>
              <h3>The positioning shift, before the launch post</h3>
              <p>
                A PMM watching for a competitor&apos;s next move gets more from an events page than a launch
                announcement — the themes a field team is pushing in webinars usually precede the messaging that
                shows up everywhere else by a quarter.
              </p>
              <p>New events content is exactly the kind of buildout signal a battlecard&apos;s marketing angle draws on.</p>
            </div>
            <div className="ftx-paircard">
              <span className="mono">sales lead / enablement</span>
              <h3>&quot;They&apos;re advertising this — your prospect has seen it&quot;</h3>
              <p>
                A rep doesn&apos;t need spend estimates; they need to know what message a prospect is likely to have
                already encountered. A live ad campaign is a specific claim a rep can pre-empt on a call, not an
                abstract competitive threat.
              </p>
              <p>A logo win on a competitor&apos;s wall is also a useful, concrete thing to ask a prospect about directly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- worked example ---------- */}
      <section className="mkt-section tight">
        <div className="wrap">
          <span className="wt-eyebrow">A quarter of Crayon&apos;s ad spend, watched</span>
          <h2 className="wt-h2">From eleven live ads to one, over ten weeks.</h2>
          <div className="ftx-story">
            <span className="mono">campaign intelligence · crayon · gtm &amp; ads</span>
            <h3>&quot;Crayon shifted from hunting to defending this quarter.&quot;</h3>
            <p>
              In early June, Crayon had eleven ads live across Google and LinkedIn, most pointed at
              category-comparison landing pages — &quot;Crayon vs. Klue,&quot; &quot;Crayon vs. a spreadsheet.&quot;
              Classic new-buyer acquisition spend. By late June, the count had dropped to four. By mid-August, it was
              one — a single LinkedIn ad, retargeting a case-study page rather than a comparison page.
            </p>
            <p>
              The Tower cross-checked it against the events channel: over the same ten weeks, Crayon&apos;s events
              page added two new enterprise-focused webinars and zero net-new comparison content. And the logo wall
              picked up one new name in that window — a healthy sign, but a single addition against a near-total ad
              retreat.
            </p>
            <p>
              Read together, the conclusion was specific: &quot;Crayon has moved from acquisition spend to retention
              spend this quarter — comparison ads down 91%, enterprise webinar content up, one new logo.&quot; A
              sales team using Fortress HQ read that as a signal that new-buyer competition from Crayon was easing,
              not that Crayon itself was struggling.
            </p>
            <div className="ftx-know">
              <b>How we know:</b> Google &amp; LinkedIn ad library counts (Jun 3 → Aug 12, weekly) + 2 new events
              pages + 1 logo-wall addition, all linked
            </div>
          </div>
        </div>
      </section>

      {/* ---------- comparison ---------- */}
      <section className="mkt-section tight">
        <div className="wrap">
          <span className="mkt-eyebrow">Versus the alternative</span>
          <h2 style={{ fontSize: 24 }}>A count on a page isn&apos;t campaign intelligence.</h2>
          <div className="ftx-vs">
            <span className="mono">how the others do it</span>
            <p>
              Klue and Crayon both claim ad-tracking breadth, at their usual enterprise price and demo-gated onboarding.
              Visualping could technically point at an ad library page and diff it, but a page change isn&apos;t the
              same as reading spend trend, event themes and logo movement together — page changes are one of our 22
              channels, and a change alone was never the insight. Fortress HQ reads all three GTM channels as one
              story, cited, from day one.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="mkt-section tight">
        <div className="wrap">
          <span className="wt-eyebrow">Questions</span>
          <h2 className="wt-h2">Campaign intelligence, honestly.</h2>
          <div className="ftx-faq">
            <div className="ftx-faq-item">
              <h4>Do you see exact dollar spend, not just ad counts?</h4>
              <p>
                No, and we won&apos;t claim to. Public ad libraries generally don&apos;t expose exact spend for
                standard commercial ads — what they expose is which ads are live, their creative, and how that
                changes over time. That&apos;s a real, useful trend line; it isn&apos;t a finance report, and we
                don&apos;t pretend it is.
              </p>
            </div>
            <div className="ftx-faq-item">
              <h4>Do you track TV, out-of-home, or podcast ad buys?</h4>
              <p>
                No — campaign intelligence here is Meta, Google and LinkedIn&apos;s public ad libraries specifically,
                plus events and logo walls. If a competitor is spending heavily on channels outside those three ad
                libraries, that spend won&apos;t show up in this feature.
              </p>
            </div>
            <div className="ftx-faq-item">
              <h4>Is this real-time — will I see an ad the hour it goes live?</h4>
              <p>
                No. Ad libraries get checked on the standard daily schedule, the same as every other channel. You&apos;ll
                see a new ad within a day of it going live, not within minutes.
              </p>
            </div>
            <div className="ftx-faq-item">
              <h4>What about targeting details — who they&apos;re showing the ad to?</h4>
              <p>
                Public ad libraries generally don&apos;t expose granular audience-targeting data for standard
                commercial ads, so neither do we. What&apos;s real is the creative, the count, and the trend — not
                the targeting logic behind it.
              </p>
            </div>
            <div className="ftx-faq-item">
              <h4>Can I set an alert for when a competitor launches a new ad campaign?</h4>
              <p>
                Not yet as a push notification — that&apos;s a standing order, and standing-order delivery is in
                build, not shipped. Today, a new campaign shows up in your feed and the daily order of the day the
                morning it&apos;s found.
              </p>
            </div>
            <div className="ftx-faq-item">
              <h4>Do closed or rejected ads still show up?</h4>
              <p>
                The scout logs what the public library shows on each run — generally active listings. A campaign
                that&apos;s already been pulled before a scheduled check may not appear, which is exactly the kind of
                honest gap the coverage map discloses rather than papering over.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- related ---------- */}
      <section className="ftx-relate">
        <div className="wrap">
          <span className="mkt-eyebrow">Keep going</span>
          <h2 style={{ fontSize: 22, margin: '0 0 4px' }}>Ad spend is one channel of 22.</h2>
          <div className="ftx-relate-row">
            <Link href="/features/data-sources">See the full channel list →</Link>
            <Link href="/features/battlecards">How this feeds a battlecard →</Link>
            <Link href="/features/insights">How the Tower reasons →</Link>
            <Link href="/pricing">Pricing →</Link>
          </div>
        </div>
      </section>

      {/* ---------- close ---------- */}
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
    </div>
  );
}
