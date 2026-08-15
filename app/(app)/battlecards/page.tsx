// Battlecards — where the Tower's reasoning lives, and the single home for
// everything about a competitor (the old /competitors tab was folded in
// here). Each card opens with "The read": one whole-picture synthesis per
// competitor (competitor_reasoning) connecting every signal on file into
// what's actually happening. Then the card's three angles (sales /
// marketing / product), and at the bottom the market side-by-side table +
// positioning map + add-competitor. "How we win" is personalized to the
// workspace's own brand once it's set.
import { getDb } from '@/db/client';
import { Soon } from '@/lib/soon';
import { requireOrgId } from '@/lib/tenant';
import { getCompetitorReads } from '@/lib/reason';
import { isPlatformAdmin } from '@/lib/adminAuth';
import { getBrandSettings } from '@/lib/brand';
import { competitorStats, leadCounts, adCount } from '@/lib/competitorStats';
import { computeThreat } from '@/lib/threat';
import { positionOf } from '@/lib/positioning';
import FeedbackControl from '../FeedbackControl';
import AddCompetitor from './AddCompetitor';

export const dynamic = 'force-dynamic';

interface Angle { focus: string; points: string[]; action: string }
interface Card {
  positioning: string;
  strengths: string[];
  vulnerabilities: string[];
  howToWin: string[];
  keyQuestion: string;
  angles?: { sales: Angle; marketing: Angle; product: Angle };
}

function ago(iso: string): string {
  const d = Date.now() - new Date(iso).getTime();
  const h = Math.floor(d / 3600000);
  if (h < 1) return 'just now';
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const ANGLE_META = {
  sales: { label: 'Sales', cls: 'ang-sales' },
  marketing: { label: 'Marketing', cls: 'ang-marketing' },
  product: { label: 'Product', cls: 'ang-product' },
} as const;

export default async function Battlecards() {
  const orgId = await requireOrgId();
  const reads = await getCompetitorReads(orgId);
  const platformAdmin = await isPlatformAdmin();
  const brand = await getBrandSettings(orgId);
  const winLabel = brand.configured ? `How ${brand.brandName} wins` : 'How we win';
  const db = await getDb();
  const rows = await db.query<{ name: string; slug: string; content: Card | string; generated_at: string; generated_by: string }>(
    `SELECT c.name, c.slug, b.content, b.generated_at, b.generated_by
     FROM battlecards b JOIN competitors c ON c.id = b.competitor_id WHERE c.org_id = $1 ORDER BY c.id`,
    [orgId],
  );
  if (rows.length === 0) {
    return (
      <Soon
        title="Battlecards"
        blurb="Auto-generated, self-updating battlecards per competitor, from three angles: sales, marketing, product."
        needs="run `npm run battlecards` (Claude in-session) or set ANTHROPIC_API_KEY in production"
        bullets={[
          'Positioning, strengths, vulnerabilities, how-to-win and the discovery-call question per competitor.',
          'Sales, Marketing, and Product each get a distinct read of the same intelligence.',
          'Numbers pulled live from captured signals; strategy authored by Claude.',
        ]}
      />
    );
  }
  const gen = rows[0];
  const initials = (name: string) => name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  // The market section (folded in from the old /competitors tab).
  const stats = await competitorStats(orgId);
  const threat = await computeThreat(orgId);
  const leads = leadCounts(stats);
  const tByName = Object.fromEntries(threat.map((t) => [t.competitor, t]));
  const mapped = stats.map((c) => ({ ...c, pos: positionOf(c.slug) })).filter((c) => c.pos);
  const tableRows: [string, (c: (typeof stats)[number]) => string][] = [
    ['Threat Index', (c) => String(c.threat ?? '—')],
    ['Leads on', (c) => `${leads[c.id] ?? 0} of 5 dims`],
    ['Signals captured', (c) => String(c.signals)],
    ['Open roles', (c) => String(c.jobs)],
    ['Meta ads', (c) => adCount(c.adNote.meta)],
    ['Google ads', (c) => adCount(c.adNote.google)],
    ['LinkedIn ads', (c) => adCount(c.adNote.linkedin)],
    ['GTM dimension', (c) => String(tByName[c.name]?.dims.gtm ?? '—')],
    ['Talent dimension', (c) => String(tByName[c.name]?.dims.talent ?? '—')],
    ['Product dimension', (c) => String(tByName[c.name]?.dims.product ?? '—')],
    ['Market dimension', (c) => String(tByName[c.name]?.dims.market ?? '—')],
  ];

  return (
    <main className="main solo">
      <section className="feed">
        <div className="comp-head">
          <div>
            <h1>Battlecards</h1>
            <p className="sub" style={{ marginBottom: 0 }}>
              One card per competitor — the read, three angles, and the side-by-side numbers below. Updated {ago(gen.generated_at)}.
            </p>
          </div>
          <AddCompetitor />
        </div>
        {rows.map((r) => {
          const c = (typeof r.content === 'string' ? JSON.parse(r.content) : r.content) as Card;
          const read = reads.get(r.slug);
          return (
            <div className="bc" key={r.slug} id={r.slug}>
              <div className="bc-head">
                <span className="cc-avatar sm">{initials(r.name)}</span>
                <span className="comp">{r.name}</span>
                <a className="bc-link" href={`/feed?comp=${r.slug}`}>view signals →</a>
              </div>
              {read && (
                <div className="bc-read">
                  <div className="bc-read-top">
                    <span className="bc-read-tag">The Tower&apos;s read</span>
                    <span className="bc-read-hook">{read.hook}</span>
                  </div>
                  <p className="bc-read-body">{read.narrative}</p>
                  {read.evidence.length > 0 && (
                    <div className="bc-read-ev">
                      {read.evidence.map((e, i) => (
                        <span className="bc-read-chip" key={i}><b>{e.label}</b> {e.text}</span>
                      ))}
                    </div>
                  )}
                  {platformAdmin && (
                    <FeedbackControl competitorName={r.name} channel="read" signalTitle={`competitor read: ${r.name}`} headlineShown={read.narrative.slice(0, 300)} />
                  )}
                </div>
              )}
              <p className="bc-pos">{c.positioning}</p>
              <div className="bc-grid">
                <div className="bc-col strengths">
                  <h4>Their strengths</h4>
                  <ul>{c.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
                </div>
                <div className="bc-col vulns">
                  <h4>Vulnerabilities</h4>
                  <ul>{c.vulnerabilities.map((s, i) => <li key={i}>{s}</li>)}</ul>
                </div>
                <div className="bc-col win">
                  <h4>{winLabel}</h4>
                  <ul>{c.howToWin.map((s, i) => <li key={i}>{s}</li>)}</ul>
                </div>
              </div>
              <div className="bc-q"><span>Ask in discovery</span>{c.keyQuestion}</div>

              {c.angles && (
                <div className="bc-angles">
                  {/* JSONB doesn't preserve object key order (Postgres reorders by key
                      length), so render in a fixed, intentional sequence rather than
                      trusting Object.entries. */}
                  {(['sales', 'marketing', 'product'] as const).map((key) => {
                    const a = c.angles![key];
                    return [key, a] as [keyof typeof ANGLE_META, Angle];
                  }).map(([key, a]) => (
                    <div className={`bc-angle ${ANGLE_META[key].cls}`} key={key}>
                      <span className="bc-angle-tag">{ANGLE_META[key].label}</span>
                      <p className="bc-angle-focus">{a.focus}</p>
                      <ul>{a.points.map((p, i) => <li key={i}>{p}</li>)}</ul>
                      <div className="bc-angle-action"><span>Do this</span>{a.action}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        <h3 className="admin-h" style={{ marginTop: 30 }}>The market, side by side</h3>
        <div className="tblwrap">
          <table className="cmp">
            <thead>
              <tr>
                <th></th>
                {stats.map((c) => (
                  <th key={c.slug}>
                    <a href={`/feed?comp=${c.slug}`} className="cmp-th">
                      <span className="cc-avatar sm">{initials(c.name)}</span>
                      {c.name}
                    </a>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.map(([label, fn]) => (
                <tr key={label}>
                  <td className="rl">{label}</td>
                  {stats.map((c) => (
                    <td key={c.slug} className="n">{fn(c)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {mapped.length > 1 && (
          <>
            <h3 className="admin-h">Market positioning map</h3>
            <p className="pos-note">Editorial read, updated by hand — not derived from signals.</p>
            <div className="posmap-wrap">
              <svg viewBox="0 0 640 380" className="posmap">
                <line x1="40" y1="20" x2="40" y2="340" className="posmap-axis" />
                <line x1="40" y1="340" x2="600" y2="340" className="posmap-axis" />
                <line x1="320" y1="20" x2="320" y2="340" className="posmap-mid" />
                <line x1="40" y1="180" x2="600" y2="180" className="posmap-mid" />
                <text x="320" y="365" textAnchor="middle" className="posmap-label">SELF-SERVE → MANAGED / AGENCY-LED</text>
                <text x="14" y="180" textAnchor="middle" className="posmap-label" transform="rotate(-90 14 180)">SMB / CREATOR-FIRST → ENTERPRISE / BRAND-FIRST</text>
                {mapped.map((c) => {
                  const px = 40 + (c.pos!.x / 100) * 560;
                  const py = 340 - (c.pos!.y / 100) * 320;
                  const flip = c.pos!.x > 62;
                  const tx = flip ? px - 12 : px + 12;
                  return (
                    <g key={c.slug}>
                      <circle cx={px} cy={py} r="7" className="posmap-dot" />
                      <text x={tx} y={py - 8} textAnchor={flip ? 'end' : 'start'} className="posmap-name">{c.name}</text>
                      <text x={tx} y={py + 8} textAnchor={flip ? 'end' : 'start'} className="posmap-note">{c.pos!.note}</text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
