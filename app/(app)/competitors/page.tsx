// Competitors — market positioning map (authored read, see src/lib/positioning.ts)
// plus a richer card per competitor: real latest signal, real dimension-lead
// count, and the existing live stats. Each card links into the feed filtered
// to that competitor.
import { competitorStats, leadCounts } from '@/lib/competitorStats';
import { positionOf } from '@/lib/positioning';
import { requireOrgId } from '@/lib/tenant';

export const dynamic = 'force-dynamic';
const ring = (n: number) => (n >= 70 ? '#B8362A' : n >= 55 ? '#9A5B00' : n >= 42 ? '#4A5BC9' : '#1F7A45');
const adCount = (note?: string) => note?.match(/~?([\d,-]+)\s*(active |total )?ads/i)?.[1] ?? (note?.includes('0 ') ? '0' : '—');
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
  const leads = leadCounts(stats);
  const dimCount = 5;
  const mapped = stats.map((c) => ({ ...c, pos: positionOf(c.slug) })).filter((c) => c.pos);

  return (
    <main className="main solo">
      <section className="feed">
        <h1>Competitors</h1>
        <p className="sub">{stats.length} tracked · click any to see its full signal stream.</p>

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

        <h3 className="admin-h">Tracked competitors</h3>
        {stats.map((c) => (
          <a className="compcard v2" key={c.slug} href={`/feed?comp=${c.slug}`}>
            <div className="cc-avatar">{initials(c.name)}</div>
            <div className="gauge sm" style={{ background: `conic-gradient(${ring(c.threat ?? 0)} ${(c.threat ?? 0) * 3.6}deg, var(--gr) 0)` }}>
              <span>{c.threat ?? '—'}</span>
            </div>
            <div className="cc-body">
              <div className="cc-top">
                <span className="comp">{c.name}</span>
                <span className="cc-dom">{c.domain}</span>
                {c.threat != null && <span className="cc-lead">leads on {leads[c.id] ?? 0} of {dimCount} dimensions</span>}
              </div>
              {c.latestSignal ? (
                <div className="cc-latest">latest: {c.latestSignal.title} · {ago(c.latestSignal.createdAt)}</div>
              ) : (
                <div className="cc-latest muted">no signals captured yet</div>
              )}
              <div className="cc-stats">
                <span><b>{c.signals}</b> signals</span>
                <span><b>{c.jobs}</b> open roles</span>
                <span>Meta <b>{adCount(c.adNote.meta)}</b></span>
                <span>Google <b>{adCount(c.adNote.google)}</b></span>
                <span>LinkedIn <b>{adCount(c.adNote.linkedin)}</b> ads</span>
              </div>
            </div>
            <span className="cc-arrow">→</span>
          </a>
        ))}
      </section>
    </main>
  );
}
