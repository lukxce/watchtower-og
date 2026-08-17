// Feed — bundled events, day-grouped. Ten ads observed the same day is ONE
// card ("10 new ads observed — 4 LinkedIn · 6 Google") with the members
// inside a native expander; the same story in five outlets is ONE card.
// Filtering by channel happens from the persistent left rail
// (ChannelRail.tsx, app-wide). The at-a-glance view lives on /overview.
import { getDb } from '@/db/client';
import { computeThreat } from '@/lib/threat';
import { requireOrgId } from '@/lib/tenant';
import { interpretSignal } from '@/lib/interpret';
import { bundleRows, type BundleRow } from '@/lib/bundle';

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
  // Higher LIMIT than the old per-card feed: bundling collapses most of
  // these rows (a single day's ad crawl can be 60 rows on its own).
  const items = await db.query<BundleRow>(
    `SELECT si.id, si.channel, si.category, si.score, si.title, si.url, si.created_at, si.published_at, c.name, c.slug
     FROM stream_items si JOIN competitors c ON c.id = si.competitor_id
     WHERE ${clauses.join(' AND ')}
     ORDER BY si.score DESC NULLS LAST, si.created_at DESC LIMIT 400`,
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

  // Collapse locale duplicates before bundling: the same new page published
  // in /de/ /pt/ /ko/… is one product move, not eight.
  const LOCALE = /^(https?:\/\/[^/]+)\/([a-z]{2}(?:-[a-z]{2})?)\//i;
  const byPage = new Map<string, BundleRow & { locales?: number }>();
  const display: (BundleRow & { locales?: number })[] = [];
  for (const raw of items as (BundleRow & { locales?: number })[]) {
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

  const bundles = bundleRows(display);

  const buckets = new Map<(typeof BUCKET_ORDER)[number], typeof bundles>();
  for (const b of bundles) {
    const key = bucketOf(b.when);
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key)!.push(b);
  }

  return (
    <main className="main">
      <section className="feed">
        <h1>{activeComp ? `${activeComp} — feed` : 'Signal feed'}</h1>
        <p className="sub">
          Bundled events, ranked by impact — one card per thing that happened, not per raw detection. Times are the
          event date where known, else when Watchtower first observed it. The at-a-glance view is the <a href="/overview" style={{ color: 'var(--brand)', fontWeight: 700 }}>Overview</a>.
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

        {bundles.length === 0 ? (
          <div className="empty">
            No signals in this view yet. Trigger a collection with <code>POST /api/run</code> (or wait for the daily
            07:00 crawl). The first run captures each competitor&apos;s current state; changes surface from the next run.
          </div>
        ) : (
          <div className="timeline">
            {BUCKET_ORDER.filter((b) => buckets.has(b)).map((b) => (
              <div className="tl-group" key={b}>
                <div className="tl-label"><span>{b}</span></div>
                {buckets.get(b)!.map((bundle, i) => {
                  const single = bundle.kind === 'single' ? bundle.rows[0] : null;
                  const read = single ? interpretSignal(single.channel, single.title, single.name) : null;
                  const first = bundle.rows[0];
                  const dated = bundle.kind === 'news' || (single && single.published_at);
                  // The URL is the citation, not the headline. Rather than
                  // printing it in the sentence, the whole card becomes the
                  // target — bundles keep their disclosure instead, which sits
                  // above the hit area.
                  const href = single?.url ?? null;
                  return (
                    <div
                      className={`card${href ? ' hitcard' : ''}${bundle.score >= 80 ? ` featured fc-${catClass(bundle.category).slice(2)}` : ''}`}
                      key={i}
                    >
                      {href && (
                        <a
                          className="card-hit"
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`${read!.headline} — open source`}
                        />
                      )}
                      <div className="crow">
                        <span className={`badge ${catClass(bundle.category)}`}>{bundle.category}</span>
                        <span className="card-avatar">{initials(bundle.name)}</span>
                        <span className="comp">{bundle.name}</span>
                        {bundle.score > 0 && <span className={`score ${scoreClass(bundle.score)}`}>{bundle.score}</span>}
                        {dated ? (
                          <span className="when">{ago(bundle.when)}</span>
                        ) : (
                          <span className="when seen" title="Watchtower first observed this here; the underlying item may be older">
                            first seen {ago(bundle.when)}
                          </span>
                        )}
                      </div>
                      <div className="title">
                        {bundle.kind === 'single' ? read!.headline : bundle.headline}
                        {href && <span className="title-out" aria-hidden="true"> ↗</span>}
                        {(first as { locales?: number }).locales && (first as { locales?: number }).locales! > 1 && (
                          <span className="locale-note"> (+{(first as { locales?: number }).locales! - 1} locale versions)</span>
                        )}
                      </div>
                      {bundle.sub && <div className="bundle-sub">{bundle.sub}</div>}
                      {single && read!.howWeKnow && <div className="howknow">How we know: {read!.howWeKnow}</div>}
                      {bundle.kind !== 'single' && (
                        <details className="bundle">
                          <summary>See all {bundle.rows.length}</summary>
                          <ul className="bundle-items">
                            {bundle.rows.map((r) => (
                              <li key={r.id}>
                                {r.url ? <a href={r.url} target="_blank" rel="noreferrer">{r.title}</a> : r.title}
                              </li>
                            ))}
                          </ul>
                        </details>
                      )}
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
