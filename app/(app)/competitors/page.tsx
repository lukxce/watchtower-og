// Competitors list — each card links into the feed filtered to that competitor.
import { competitorStats } from '@/lib/competitorStats';

export const dynamic = 'force-dynamic';
const ring = (n: number) => (n >= 70 ? '#C4453A' : n >= 55 ? '#E08A34' : n >= 42 ? '#4E9AC4' : '#3A9B6E');
const adCount = (note?: string) => note?.match(/~?([\d,-]+)\s*(active |total )?ads/i)?.[1] ?? (note?.includes('0 ') ? '0' : '—');

export default async function Competitors() {
  const stats = await competitorStats();
  return (
    <main className="main solo">
      <section className="feed">
        <h1>Competitors</h1>
        <p className="sub">{stats.length} tracked · click any to see its full signal stream.</p>
        {stats.map((c) => (
          <a className="compcard" key={c.slug} href={`/feed?comp=${c.slug}`}>
            <div className="gauge sm" style={{ background: `conic-gradient(${ring(c.threat ?? 0)} ${(c.threat ?? 0) * 3.6}deg, var(--gr) 0)` }}>
              <span>{c.threat ?? '—'}</span>
            </div>
            <div className="cc-body">
              <div className="cc-top"><span className="comp">{c.name}</span> <span className="cc-dom">{c.domain}</span></div>
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
