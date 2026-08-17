'use client';
import { useState } from 'react';

// A real battlecard, switchable, using the same content the product actually
// generated for our own workspace (scripts/reads.ts + scripts/battlecards.ts).
// A screenshot of one card proves less than three cards a visitor can move
// between and read — and every line here is in the live demo too.
const CARDS = [
  {
    key: 'kompyte',
    name: 'Kompyte',
    threat: 49,
    hook: 'Absorbed into Semrush, and running on its distribution',
    read: 'Kompyte no longer behaves like an independent company, and the collection makes that visible in a way a feature comparison would not: no careers page of its own (it 404s), and no advertiser account, because acquisition means the spend runs under Semrush. You are not competing with Kompyte’s roadmap, you are competing with Semrush’s bundle and its existing seats.',
    evidence: [
      ['Absorbed', 'kompyte.com/careers returns 404 · zero own ad accounts'],
      ['Now positioned as', '“Kompyte by Semrush”'],
    ],
    win: [
      'Sell depth against breadth: a suite module is rarely the best tool in its category.',
      'Target teams that do not already own Semrush, where the bundle is worth nothing.',
    ],
    ask: '“Are you buying this because it is the best competitive intelligence you evaluated, or because it was already in the contract?”',
  },
  {
    key: 'signal-labs',
    name: 'Signal Labs',
    threat: 32,
    hook: 'Closest on promise, furthest on pricing',
    read: 'The nearest competitor in the set, and the overlap is not accidental: CIx sells source-linked citations on every claim, battlecards as the artifact, and an ask-the-AI chat. The divergence is the buying motion. Team pricing is custom, scoped on a 30-minute call, and their own page concedes the friction by promising you will know the price before the trial starts.',
    evidence: [
      ['Pricing motion', 'Free = 1 competitor · Team = quoted on a call'],
      ['Coverage', '0 qualifying news articles — real for a company this young'],
    ],
    win: [
      'Publish the number. They gate Team pricing on a call; we do not.',
      'Sell the full competitive set from day one. One competitor is not intelligence.',
    ],
    ask: '“How many competitors do you actually need to watch, and what does it cost once you go past the first one?”',
  },
  {
    key: 'visualping',
    name: 'Visualping',
    threat: 54,
    hook: 'Coming up from the bottom, not down from enterprise',
    read: 'The only competitor here that arrives from underneath. Its press history is consumer utility and its product news is extension-level. The threat is not that it wins enterprise evaluations; it is that it makes “just watch their pricing page” free and obvious, and anchors what buyers think this should cost before they reach a real vendor.',
    evidence: [
      ['Product direction', 'One-click AI monitoring shipped to the Chrome extension'],
      ['Paid presence', '~11 Google ads — most aggressive in the set for its size'],
    ],
    win: [
      'Draw the line between a change alert and a briefing. That is the whole difference.',
      'Do not compete on price with a freemium utility. Compete on what happens after the alert.',
    ],
    ask: '“When their tool says a pricing page changed, who works out what it means and what you do next?”',
  },
];

export default function BattlecardDemo() {
  const [i, setI] = useState(0);
  const c = CARDS[i];
  return (
    <div className="bcd">
      <div className="bcd-tabs" role="tablist">
        {CARDS.map((x, n) => (
          <button key={x.key} role="tab" aria-selected={n === i} className={n === i ? 'on' : ''} onClick={() => setI(n)}>
            {x.name}
          </button>
        ))}
      </div>

      <div className="bcd-card">
        <div className="bcd-top">
          <h4>{c.name}</h4>
          <span className="bcd-threat">Threat {c.threat}</span>
        </div>

        <div className="bcd-read">
          <span className="bcd-tag">The Tower&apos;s read</span>
          <b>{c.hook}</b>
          <p>{c.read}</p>
          <div className="bcd-ev">
            {c.evidence.map(([k, v]) => (
              <span key={k}><b>{k}</b> {v}</span>
            ))}
          </div>
        </div>

        <div className="bcd-cols">
          <div>
            <span className="bcd-h">How we win</span>
            <ul>{c.win.map((w) => <li key={w}>{w}</li>)}</ul>
          </div>
          <div>
            <span className="bcd-h">Ask in discovery</span>
            <p className="bcd-ask">{c.ask}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
