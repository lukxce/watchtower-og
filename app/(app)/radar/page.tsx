// Launch Radar — the flagship. Cross-signal forecasts per competitor.
import { computeRadar } from '@/lib/radar';
import { requireOrgId } from '@/lib/tenant';

export const dynamic = 'force-dynamic';
const conf = (c: string) => (c === 'High' ? 'r-hi' : c === 'Medium' ? 'r-md' : 'r-lo');

export default async function Radar() {
  const orgId = await requireOrgId();
  const forecasts = await computeRadar(orgId);
  return (
    <main className="main solo">
      <section className="feed">
        <h1>Launch Radar</h1>
        <p className="sub">
          One signal is a data point; a cluster is a prediction. Radar fires when multiple pre-launch signals align on the
          same competitor in the same window — the moves you want to see before the press release.
        </p>
        {forecasts.length === 0 ? (
          <div className="empty">No clusters detected yet. Radar needs a few channels populated — run a collection, then check back.</div>
        ) : (
          forecasts.map((f) => (
            <div className="radar" key={f.slug}>
              <div className="radar-top">
                <span className={`conf ${conf(f.confidence)}`}>{f.confidence} confidence</span>
                <a className="bc-link" href={`/feed?comp=${f.slug}`}>view signals →</a>
              </div>
              <h3 className="radar-h">{f.headline}</h3>
              <div className="radar-win">Signals aligned · {f.window}</div>
              <ul className="radar-ev">
                {f.evidence.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>
          ))
        )}
        <p className="covnote" style={{ marginTop: 18 }}>
          Detection is deterministic (signal-cluster analysis); the forecast wording is authored by Claude. Confidence
          scales with how many independent signals corroborate — breadth no single-source tool can match.
        </p>
      </section>
    </main>
  );
}
