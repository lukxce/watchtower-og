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
    hook: 'Not a company any more. A module inside Semrush.',
    read: 'Their site still sells Kompyte as a product. Nothing on it says the independent company is gone. We worked it out anyway: the careers page started returning 404, and there is no advertiser account on Google or LinkedIn for a company that plainly still sells — because the spend now runs under Semrush. The news trail confirms it. You are not competing with a roadmap, you are competing with a checkbox in somebody else’s renewal.',
    evidence: [
      ['How we knew', 'careers page 404 + zero own ad accounts, then confirmed in the news'],
      ['What it means', 'Roadmap now competes for attention inside a much larger suite'],
    ],
    win: [
      'Ask what has actually shipped in Kompyte since the acquisition. Make them answer with dates.',
      'If they do not already pay for Semrush, the bundle is worth nothing and this is just a smaller product.',
      'If they do, you cannot win on price. Win on the read: a suite module is never the best tool in its category.',
    ],
    ask: '“Are you buying this because it was the best tool you evaluated, or because it was already in the Semrush contract?”',
  },
  {
    key: 'crayon',
    name: 'Crayon',
    threat: 48,
    hook: 'Enterprise pricing, and they will not put a number on it',
    read: 'No price anywhere on the site. Every route to a number runs through a demo call, which is the tell: this is priced per-seat, per-year, negotiated, and it is not aimed at a team that wants to start on Tuesday. Meanwhile they have gone almost silent on paid, zero Google ads and one on LinkedIn, and are buying reach through a Glean integration instead. They are defending an installed base, not competing for new self-serve buyers.',
    evidence: [
      ['Pricing', 'No published price. Every path ends at a demo call.'],
      ['Posture', '0 Google ads, 1 LinkedIn ad — defending, not hunting'],
    ],
    win: [
      'Put the two pricing pages side by side. Ours has a number on it. Theirs has a form.',
      'Time-to-value is the whole fight: signals inside the hour against a call, a quote, then onboarding.',
      'Ask who administers it after month three. Enterprise CI tools go quiet when the champion gets busy.',
    ],
    ask: '“How long from first call to seeing intelligence about your actual competitors, and what does it cost per seat per year?”',
  },
  {
    key: 'signal-labs',
    name: 'Signal Labs',
    threat: 32,
    hook: 'Same promise as us. Then they make you get on a call.',
    read: 'The closest competitor in the set, and they know it: source-linked citations on every claim, battlecards, an ask-the-AI chat. The free tier is real but caps at one competitor, which is below the point where any of this is useful. Then Team pricing is custom and quoted on a 30-minute call. Their own page promises you will know the price before the trial starts, which tells you buyers have already complained about exactly that.',
    evidence: [
      ['The cap', 'Free = 1 competitor. One competitor is not competitive intelligence.'],
      ['Their own tell', '“You will know the price before the trial starts, not after it ends”'],
    ],
    win: [
      'We publish the number. They do not. That is the whole comparison and it fits on one slide.',
      'Ask how many competitors they actually need. The answer disqualifies the free tier immediately.',
      'They have zero press coverage. If the buyer wants third-party validation, there is none to find.',
    ],
    ask: '“How many competitors do you need to watch, and what does it cost once you go past the first one?”',
  },
  {
    key: 'visualping',
    name: 'Visualping',
    threat: 54,
    hook: 'Not a competitor. A free habit you have to break.',
    read: 'It usually is not on the shortlist, it is already installed. Someone set it to watch a pricing page two years ago and it has been firing alerts into an inbox ever since. That is the real fight: not a bake-off, but a free tool that has trained the buyer to think this problem is solved. It tells you a page changed. It cannot tell you that the change plus a hiring cluster plus a hostname add up to a launch.',
    evidence: [
      ['Where it lives', 'Consumer heritage: delivery slots, vaccine appointments, then business'],
      ['The gap', 'Detection with no synthesis. Every alert stands alone.'],
    ],
    win: [
      'Ask how many alerts they get a week, then how many they actually read. That number closes the deal.',
      'Never fight on price with a freemium utility. Fight on what happens after the alert fires.',
      'One card per thing that happened, not one alert per detection. Say it exactly like that.',
    ],
    ask: '“When it tells you a pricing page changed, who works out what it means and what you do about it?”',
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
