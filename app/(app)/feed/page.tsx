// Feed — every single event, one card each, day-grouped, with a channel rail
// on the left. The at-a-glance view lives on /overview; this page is where
// you read everything that happened, filter by channel or competitor, and
// follow each event to its source.
import { getDb } from '@/db/client';
import { computeThreat } from '@/lib/threat';
import { requireOrgId } from '@/lib/tenant';
import { interpretSignal } from '@/lib/interpret';

export const dynamic = 'force-dynamic';

const FILTERS = ['All channels', 'Pricing', 'Product', 'Hiring', 'Ads', 'News', 'Reviews'];
const catClass = (c: string) => `c-${(c || 'other').toLowerCase()}`;
const scoreClass = (n: number) => (n >= 70 ? 's-hi' : n >= 45 ? 's-md' : 's-lo');
const initials = (name: string) => name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();

function ago(iso: string): string {
  const d = Date.now() - new Date(iso).getTime();
  const h = Math.floor(d / 3600000);
  if (h < 1) return `${Math.max(1, Math.floor(d / 60000))}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const BUCKET_ORDER = ['Today', 'Yesterday', 'This week', 'Earlier'] as const;
function bucketOf(iso: string): (typeof BUCKET_ORDER)[number] {
  const d = new Date(iso);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - 7);
  if (d >= startOfToday) return 'Today';
  if (d >= startOfYesterday) return 'Yesterday';
  if (d >= startOfWeek) return 'This week';
  return 'Earlier';
}

const CHAN_ICONS: Record<string, React.ReactNode> = {
  'All channels': <><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /></>,
  Pricing: <path d="M12 3v18M7 7.5c0-1.4 2.2-2.5 5-2.5s5 1.1 5 2.5-2.2 2.5-5 2.5-5 1.1-5 2.5 2.2 2.5 5 2.5 5 1.1 5 2.5" strokeLinecap="round" />,
  Product: <><path d="M5 19c1.5-4.5 3-7.5 7-11.5 2.5-2.5 6-3 7-2s.5 4.5-2 7C13 16.5 10 18 5.5 19.5Z" strokeLinejoin="round" /><path d="M9 15l-1.5 4M15 9l4-1.5" strokeLinecap="round" /></>,
  Hiring: <><circle cx="12" cy="8" r="3.2" /><path d="M5 19c.8-3 3.5-4.6 7-4.6s6.2 1.6 7 4.6" strokeLinecap="round" /></>,
  Ads: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /></>,
  News: <><rect x="4" y="5" width="16" height="14" rx="2" /><path d="M8 9.5h8M8 13h5" strokeLinecap="round" /></>,
  Reviews: <path d="M12 3.5l2.5 5.2 5.7.7-4.2 3.9 1.1 5.6-5.1-2.8-5.1 2.8 1.1-5.6L3.8 9.4l5.7-.7Z" strokeLinejoin="round" />,
};

export default async function Feed({ searchParams }: { searchParams: Promise<{ cat?: string; comp?: string }> }) {
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
     ORDER BY si.score DESC NULLS LAST, si.created_at DESC LIMIT 60`,
    params,
  );

  // Channel rail counts (respect the competitor filter, not the category one)
  const countParams: unknown[] = [orgId];
  let countComp = '';
  if (comp) {
    countParams.push(comp);
    countComp = ` AND c.slug = $${countParams.length}`;
  }
  const counts = await db.query<{ category: string | null; n: string }>(
    `SELECT si.category, COUNT(*)::text n FROM stream_items si JOIN competitors c ON c.id = si.competitor_id
     WHERE c.org_id = $1 AND si.status IN ('pending','signaled')${countComp}
     GROUP BY si.category`,
    countParams,
  );
  const countBy = new Map(counts.map((r) => [r.category ?? 'Other', Number(r.n)]));
  const totalCount = [...countBy.values()].reduce((a, b) => a + b, 0);

  const threat = await computeThreat(orgId);
  const activeComp = comp ? threat.find((t) => t.slug === comp)?.competitor ?? comp : null;
  const railHref = (f: string) => {
    const p = new URLSearchParams();
    if (f !== 'All channels') p.set('cat', f);
    if (comp) p.set('comp', comp);
    const s = p.toString();
    return s ? `/feed?${s}` : '/feed';
  };

  // Collapse locale duplicates: the same new page published in /de/ /pt/ /ko/…
  // is one product move, not eight.
  type FeedItem = (typeof items)[number] & { locales?: number };
  const LOCALE = /^(https?:\/\/[^/]+)\/([a-z]{2}(?:-[a-z]{2})?)\//i;
  const byPage = new Map<string, FeedItem>();
  const display: FeedItem[] = [];
  for (const raw of items as FeedItem[]) {
    const m = raw.title.match(/^New page published: (\S+)$/);
    if (m) {
      const norm = m[1].replace(LOCALE, '$1/');
      const kept = byPage.get(norm);
      if (kept) {
        kept.locales = (kept.locales ?? 1) + 1;
        continue;
      }
      byPage.set(norm, raw);
    }
    display.push(raw);
  }

  const buckets = new Map<(typeof BUCKET_ORDER)[number], FeedItem[]>();
  for (const it of display) {
    const key = bucketOf(it.published_at ?? it.created_at);
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key)!.push(it);
  }

  return (
    <main className="main">
      <section className="feed">
        <h1>{activeComp ? `${activeComp} — feed` : 'Signal feed'}</h1>
        <p className="sub">
          Every verified event, one card each, ranked by impact. Times are the event date where known, else when
          Watchtower first observed it. The at-a-glance view is the <a href="/overview" style={{ color: 'var(--brand)', fontWeight: 700 }}>Overview</a>.
        </p>

        {activeComp && (
          <div className="filterchip">
            Filtered to <b>{activeComp}</b>
            <a href={active === 'All channels' ? '/feed' : `/feed?cat=${active}`}>clear ✕</a>
          </div>
        )}

        <div className="fgrid">
          <aside className="chan-rail">
            {FILTERS.map((f) => (
              <a key={f} href={railHref(f)} className={`chan-item ${f === active ? 'on' : ''}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" width="16" height="16">{CHAN_ICONS[f]}</svg>
                {f === 'All channels' ? 'All' : f}
                <span className="chan-count">{f === 'All channels' ? totalCount : countBy.get(f) ?? 0}</span>
              </a>
            ))}
          </aside>

          <div>
            {display.length === 0 ? (
              <div className="empty">
                No signals in this view yet. Trigger a collection with <code>POST /api/run</code> (or wait for the daily
                07:00 crawl). The first run captures each competitor&apos;s current state; changes surface from the next run.
              </div>
            ) : (
              <div className="timeline">
                {BUCKET_ORDER.filter((b) => buckets.has(b)).map((b) => (
                  <div className="tl-group" key={b}>
                    <div className="tl-label"><span>{b}</span></div>
                    {buckets.get(b)!.map((it, i) => {
                      const read = interpretSignal(it.channel, it.title, it.name);
                      return (
                        <div className={`card${(it.score ?? 0) >= 80 ? ` featured fc-${catClass(it.category ?? 'other').slice(2)}` : ''}`} key={i}>
                          <div className="crow">
                            <span className={`badge ${catClass(it.category ?? 'other')}`}>{it.category ?? it.channel}</span>
                            <span className="card-avatar">{initials(it.name)}</span>
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
                          <div className="title">
                            {it.url ? <a href={it.url} target="_blank" rel="noreferrer">{read.headline}</a> : read.headline}
                            {it.locales && it.locales > 1 && <span className="locale-note"> (+{it.locales - 1} locale versions)</span>}
                          </div>
                          {read.howWeKnow && <div className="howknow">How we know: {read.howWeKnow}</div>}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
