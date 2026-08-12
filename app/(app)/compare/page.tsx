// Compare — side-by-side matrix across competitors, assembled from live signals.
import { competitorStats } from '@/lib/competitorStats';
import { computeThreat } from '@/lib/threat';
import { requireOrgId } from '@/lib/tenant';

export const dynamic = 'force-dynamic';
const adCount = (note?: string) => note?.match(/~?([\d,-]+)\s*(active |total )?ads/i)?.[1] ?? (note && note.includes('0 ') ? '0' : '—');

export default async function Compare() {
  const orgId = await requireOrgId();
  const stats = await competitorStats(orgId);
  const threat = await computeThreat(orgId);
  const tByName = Object.fromEntries(threat.map((t) => [t.competitor, t]));
  const rows: [string, (c: (typeof stats)[number]) => string][] = [
    ['Threat Index', (c) => String(c.threat ?? '—')],
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
        <h1>Compare</h1>
        <p className="sub">Live side-by-side, assembled from captured signals — not a stale spreadsheet.</p>
        <div className="tblwrap">
          <table className="cmp">
            <thead>
              <tr>
                <th></th>
                {stats.map((c) => (
                  <th key={c.slug}><a href={`/feed?comp=${c.slug}`}>{c.name}</a></th>
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
      </section>
    </main>
  );
}
