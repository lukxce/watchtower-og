// Competitors — the market view: positioning map (authored read) plus a real
// side-by-side comparison table, not a redundant list of cards duplicating
// /compare. Each competitor also gets one compact "what's latest" line.
import { competitorStats, leadCounts, adCount } from '@/lib/competitorStats';
import { computeThreat } from '@/lib/threat';
import { positionOf } from '@/lib/positioning';
import { requireOrgId } from '@/lib/tenant';
import AddCompetitor from './AddCompetitor';

export const dynamic = 'force-dynamic';
const initials = (name: string) => name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();

function ago(iso: string): string {
  const d = Date.now() - new Date(iso).getTime();
  const h = Math.floor(d / 3600000);
  if (h < 1) return `${Math.max(1, Math.floor(d / 60000))}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default async function Competitors() {
  const orgId = await requireOrgId();
  const stats = await competitorStats(orgId);
  const threat = await computeThreat(orgId);
  const leads = leadCounts(stats);
  const dimCount = 5;
  const mapped = stats.map((c) => ({ ...c, pos: positionOf(c.slug) })).filter((c) => c.pos);
  const tByName = Object.fromEntries(threat.map((t) => [t.competitor, t]));

  const rows: [string, (c: (typeof stats)[number]) => string][] = [
    ['Threat Index', (c) => String(c.threat ?? '—')],
    ['Leads on', (c) => `${leads[c.id] ?? 0} of ${dimCount} dims`],
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
            <h1>Competitors</h1>
            <p className="sub" style={{ marginBottom: 0 }}>{stats.length} tracked, compared side by side on live signals — not a stale spreadsheet.</p>
          </div>
          <AddCompetitor />
        </div>

        {mapped.length > 1 && (
          <>
            <h3 className="admin-h" style={{ marginTop: 4 }}>Market positioning map</h3>
            <p className="pos-note">Editorial read, updated by hand — not derived from signals. Axes and placement live in <code className="mono">src/lib/positioning.ts</code>.</p>
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
                  const flip = c.pos!.x > 62; // near the right edge — label goes on the left instead
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

        <h3 className="admin-h">Side by side</h3>
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
              {rows.map(([label, fn]) => (
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

        <h3 className="admin-h">What&apos;s latest</h3>
        <div className="lb-list">
          {stats.map((c) => (
            <a className="lb-row" key={c.slug} href={`/feed?comp=${c.slug}`}>
              <span className="lb-avatar">{initials(c.name)}</span>
              <span className="lb-name">{c.name}</span>
              {c.latestSignal ? (
                <span className="latest-line">{c.latestSignal.title} <span className="latest-ago">· {ago(c.latestSignal.createdAt)}</span></span>
              ) : (
                <span className="latest-line muted">no signals captured yet</span>
              )}
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
