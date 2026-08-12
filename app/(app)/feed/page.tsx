// Signal feed dashboard — matches the product design: filter pills, scored
// signal cards, and a Threat Index rail with circular gauges + WoW deltas.
import { getDb } from '@/db/client';
import { computeThreat } from '@/lib/threat';
import { CHANNELS } from '@/lib/channels';
import { requireOrgId } from '@/lib/tenant';

export const dynamic = 'force-dynamic';

const FILTERS = ['All channels', 'Pricing', 'Product', 'Hiring', 'Ads', 'News', 'Reviews'];
const catClass = (c: string) => `c-${(c || 'other').toLowerCase()}`;
const scoreClass = (n: number) => (n >= 70 ? 's-hi' : n >= 45 ? 's-md' : 's-lo');

// gauge ring color by threat level
const ring = (n: number) => (n >= 70 ? '#B8362A' : n >= 55 ? '#9A5B00' : n >= 42 ? '#4A5BC9' : '#1F7A45');

function ago(iso: string): string {
  const d = Date.now() - new Date(iso).getTime();
  const h = Math.floor(d / 3600000);
  if (h < 1) return `${Math.max(1, Math.floor(d / 60000))}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default async function Home({ searchParams }: { searchParams: Promise<{ cat?: string; comp?: string }> }) {
  const { cat, comp } = await searchParams;
  const active = cat && FILTERS.includes(cat) ? cat : 'All channels';
  const orgId = await requireOrgId();
  const db = await getDb();

  const clauses: string[] = ["si.status IN ('pending','signaled')", 'c.org_id = $1'];
  const params: unknown[] = [orgId];
  if (active !== 'All channels') {
    params.push(active);
    clauses.push(`si.category = $${params.length}`);
  }
  if (comp) {
    params.push(comp);
    clauses.push(`c.slug = $${params.length}`);
  }
  const items = await db.query<{ channel: string; category: string | null; score: number | null; title: string; url: string | null; created_at: string; published_at: string | null; name: string }>(
    `SELECT si.channel, si.category, si.score, si.title, si.url, si.created_at, si.published_at, c.name
     FROM stream_items si JOIN competitors c ON c.id = si.competitor_id
     WHERE ${clauses.join(' AND ')}
     ORDER BY si.score DESC NULLS LAST, si.created_at DESC LIMIT 40`,
    params,
  );
  const compCount = (await db.query<{ n: string }>('SELECT COUNT(*)::text n FROM competitors WHERE org_id = $1', [orgId]))[0]?.n ?? '0';
  const threat = await computeThreat(orgId);
  const activeComp = comp ? threat.find((t) => t.slug === comp)?.competitor ?? comp : null;
  const pillHref = (f: string) => {
    const p = new URLSearchParams();
    if (f !== 'All channels') p.set('cat', f);
    if (comp) p.set('comp', comp);
    const s = p.toString();
    return s ? `/feed?${s}` : '/feed';
  };
  const activeCount = CHANNELS.filter((c) => c.status === 'active').length;
  const groups = [...new Set(CHANNELS.map((c) => c.group))];

  return (
    <main className="main">
      <section className="feed">
        <h1>{activeComp ? `${activeComp} — signals` : 'Signal feed'}</h1>
        <p className="sub">
          {items.length} signals · {activeComp ? '1 competitor' : `${compCount} competitors`} · ranked by impact. Times are the event
          date where known, else when Watchtower first observed it.
        </p>

        {activeComp && (
          <div className="filterchip">
            Filtered to <b>{activeComp}</b>
            <a href={active === 'All channels' ? '/feed' : `/feed?cat=${active}`}>clear ✕</a>
          </div>
        )}

        <div className="pills">
          {FILTERS.map((f) => (
            <a key={f} href={pillHref(f)} className={`pill ${f === active ? 'on' : ''}`}>
              {f}
            </a>
          ))}
        </div>

        {items.length === 0 ? (
          <div className="empty">
            No signals in this view yet. Trigger a collection with <code>POST /api/run</code> (or wait for the daily
            07:00 crawl). The first run captures each competitor&apos;s current state; changes surface from the next run.
          </div>
        ) : (
          items.map((it, i) => (
            <div className="card" key={i}>
              <div className="crow">
                <span className={`badge ${catClass(it.category ?? 'other')}`}>{it.category ?? it.channel}</span>
                <span className="comp">{it.name}</span>
                {it.score != null && <span className={`score ${scoreClass(it.score)}`}>{it.score}</span>}
                {it.published_at ? (
                  <span className="when">{ago(it.published_at)}</span>
                ) : (
                  <span className="when seen" title="Watchtower first observed this here; the underlying item may be older">
                    first seen {ago(it.created_at)}
                  </span>
                )}
              </div>
              <div className="title">{it.url ? <a href={it.url} target="_blank" rel="noreferrer">{it.title}</a> : it.title}</div>
            </div>
          ))
        )}
      </section>

      <aside className="rail">
        <h3>Threat Index · 30d</h3>
        {threat.map((t) => (
          <a className={`trow ${comp === t.slug ? 'on' : ''}`} key={t.competitor} href={comp === t.slug ? '/feed' : `/feed?comp=${t.slug}`}>
            <div className="gauge" style={{ background: `conic-gradient(${ring(t.total)} ${t.total * 3.6}deg, var(--gr) 0)` }}>
              <span>{t.total}</span>
            </div>
            <div>
              <div className="tnm">{t.competitor}</div>
              {t.delta == null ? (
                <div className="tdl flat">baseline</div>
              ) : t.delta >= 0 ? (
                <div className="tdl up">▲ +{t.delta} this week</div>
              ) : (
                <div className="tdl down">▼ {t.delta} this week</div>
              )}
            </div>
          </a>
        ))}

        <div className="cov" id="coverage">
          <h3>Channel coverage · {activeCount}/{CHANNELS.length}</h3>
          {groups.map((g) => (
            <div key={g}>
              <div className="covgrp">{g}</div>
              {CHANNELS.filter((c) => c.group === g).map((c) => (
                <div className={`covitem ${c.status === 'active' ? 'live' : ''}`} key={c.key} title={c.note}>
                  <span className={`dot d-${c.status}`} />
                  {c.label}
                </div>
              ))}
            </div>
          ))}
          <p className="covnote">Green = live now · orange = needs a free key/account · blue = paid data source. Deferred channels light up automatically once configured.</p>
        </div>
      </aside>
    </main>
  );
}
