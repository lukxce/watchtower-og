// Feed — every single event, one card each, day-grouped. Filtering by
// channel happens from the persistent left rail (ChannelRail.tsx, app-wide);
// this page just reads whatever ?cat=/?comp= it's given. A compact pill row
// is shown as a mobile fallback where the rail is hidden. The at-a-glance
// view lives on /overview.
import { getDb } from '@/db/client';
import { computeThreat } from '@/lib/threat';
import { requireOrgId } from '@/lib/tenant';
import { interpretSignal } from '@/lib/interpret';

export const dynamic = 'force-dynamic';

const FILTERS = ['Pricing', 'Product', 'Hiring', 'Ads', 'News', 'Reviews'];
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

export default async function Feed({ searchParams }: { searchParams: Promise<{ cat?: string; comp?: string }> }) {
  const { cat, comp } = await searchParams;
  const active = cat && FILTERS.includes(cat) ? cat : null;
  const orgId = await requireOrgId();
  const db = await getDb();

  const clauses: string[] = ["si.status IN ('pending','signaled')", 'c.org_id = $1'];
  const params: unknown[] = [orgId];
  if (active) {
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

  const threat = await computeThreat(orgId);
  const activeComp = comp ? threat.find((t) => t.slug === comp)?.competitor ?? comp : null;
  const pillHref = (f: string | null) => {
    const p = new URLSearchParams();
    if (f) p.set('cat', f);
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

        {(activeComp || active) && (
          <div className="filterchip">
            {activeComp && <>Filtered to <b>{activeComp}</b></>}
            {activeComp && active && ' · '}
            {active && <>Channel <b>{active}</b></>}
            <a href={activeComp ? pillHref(active) : '/feed'}>clear ✕</a>
          </div>
        )}

        <div className="pills mobile-only">
          <a href={pillHref(null)} className={`pill ${!active ? 'on' : ''}`}>All channels</a>
          {FILTERS.map((f) => (
            <a key={f} href={pillHref(f)} className={`pill ${f === active ? 'on' : ''}`}>{f}</a>
          ))}
        </div>

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
      </section>
    </main>
  );
}
