import { requireOrgId } from '@/lib/tenant';
import { getCoverage, type CellState } from '@/lib/coverage';
import './beta.css';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Coverage — Watchtower' };

const LEGEND: { state: CellState; label: string; hint: string }[] = [
  { state: 'found', label: 'Watched', hint: 'Collected, with signals' },
  { state: 'empty', label: 'Clear', hint: 'We looked. Genuinely nothing there.' },
  { state: 'failed', label: 'Blocked', hint: 'We tried and could not reach it' },
  { state: 'locked', label: 'Locked', hint: 'Needs a key or account first' },
  { state: 'fog', label: 'Unwatched', hint: 'Never looked. This is the gap.' },
];

export default async function Beta() {
  const orgId = await requireOrgId();
  const cov = await getCoverage(orgId);
  const groups = [...new Set(cov.channels.map((c) => c.group))];

  return (
    <main className="main solo">
      <section className="cov">
        <header className="cov-head">
          <span className="cov-eyebrow">Beta · the frontier</span>
          <h1>Coverage</h1>
          <p className="cov-lede">
            Every competitor against every channel. The point of this map is the distinction nothing else
            in the product makes: <b>clear</b> means we looked and there was nothing, <b>unwatched</b> means
            we never looked. A blank cell should never mean both.
          </p>
        </header>

        <div className="cov-stats">
          <div className="cov-stat">
            <b>{cov.litPct}%</b>
            <span>of the frontier is lit</span>
          </div>
          {LEGEND.map((l) => (
            <div className="cov-stat sm" key={l.state}>
              <b><i className={`cov-dot cov-${l.state}`} />{cov.counts[l.state]}</b>
              <span>{l.label}</span>
            </div>
          ))}
        </div>

        <div className="cov-legend">
          {LEGEND.map((l) => (
            <span key={l.state}><i className={`cov-dot cov-${l.state}`} />{l.label} — {l.hint}</span>
          ))}
        </div>

        <div className="cov-wrap">
          <table className="cov-table">
            <thead>
              <tr>
                <th className="cov-rowhead">Competitor</th>
                {cov.channels.map((c) => (
                  <th key={c.key} className="cov-colhead"><span>{c.label}</span></th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cov.rows.map((r) => (
                <tr key={r.slug}>
                  <th className="cov-rowhead">{r.competitor}</th>
                  {r.cells.map((cell) => (
                    <td key={cell.channel} className={`cov-cell cov-${cell.state}`}
                        title={`${r.competitor} · ${cell.label}\n${
                          cell.state === 'fog' ? 'Never looked'
                          : cell.state === 'locked' ? 'Needs a key or account'
                          : cell.state === 'failed' ? `Blocked — ${cell.note ?? 'could not reach'}`
                          : cell.state === 'empty' ? `Checked, nothing found — ${cell.note ?? ''}`
                          : `${cell.items} signals — ${cell.note ?? ''}`}`}>
                      {cell.state === 'found' ? cell.items : ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="cov-groups">
          {groups.map((g) => (
            <span key={g} className="cov-group">{g} · {cov.channels.filter((c) => c.group === g).length}</span>
          ))}
        </div>

        <p className="cov-foot">
          Fog is not a failure state. It is the honest answer to a question the product has not been asked
          yet, and it is the only number here that tells you what adding a competitor or a key would buy you.
        </p>
      </section>
    </main>
  );
}
