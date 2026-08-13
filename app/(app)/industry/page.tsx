// Industry — the market-wide view, standalone. Two lenses side by side:
// headlines for the whole industry (Google News, not tied to any competitor),
// cross-tagged when they mention a tracked competitor, and the competitor
// press column (news-channel signals) so "the market" and "our set" read
// against each other.
import { getDb } from '@/db/client';
import { requireOrgId } from '@/lib/tenant';
import { industryNews } from '@/lib/industryNews';

export const dynamic = 'force-dynamic';

const initials = (name: string) => name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();

function ago(iso: string): string {
  const d = Date.now() - new Date(iso).getTime();
  const h = Math.floor(d / 3600000);
  if (h < 1) return `${Math.max(1, Math.floor(d / 60000))}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default async function Industry() {
  const orgId = await requireOrgId();
  const db = await getDb();

  const competitors = await db.query<{ id: number; name: string; slug: string }>(
    'SELECT id, name, slug FROM competitors WHERE org_id = $1 ORDER BY id',
    [orgId],
  );
  const headlines = await industryNews(orgId, 14);
  const press = await db.query<{ title: string; url: string | null; published_at: string | null; created_at: string; name: string; slug: string }>(
    `SELECT si.title, si.url, si.published_at, si.created_at, c.name, c.slug
     FROM stream_items si JOIN competitors c ON c.id = si.competitor_id
     WHERE c.org_id = $1 AND si.channel = 'news' AND si.status IN ('pending','signaled')
     ORDER BY COALESCE(si.published_at, si.created_at) DESC LIMIT 12`,
    [orgId],
  );

  // Cross-tag: an industry headline that names a tracked competitor is worth
  // more than a generic one — link it straight into that competitor's feed.
  const mentionsOf = (title: string) =>
    competitors.filter((c) => title.toLowerCase().includes(c.name.toLowerCase()));

  return (
    <main className="main solo">
      <section className="feed">
        <h1>Industry</h1>
        <p className="sub">
          The market around your competitor set: industry-wide headlines on the left, press about your tracked
          competitors on the right. Headlines that name a tracked competitor get tagged.
        </p>

        <div className="ov-grid ind-grid">
          <div>
            <h3 className="admin-h" style={{ marginTop: 0 }}>Industry headlines</h3>
            {headlines.length === 0 ? (
              <div className="empty">Couldn&apos;t fetch industry headlines right now — the source (Google News RSS) may be rate-limiting. They&apos;ll be back on the next load.</div>
            ) : (
              headlines.map((h, i) => {
                const mentions = mentionsOf(h.title);
                return (
                  <div className={`card${mentions.length ? ' featured fc-news' : ''}`} key={i}>
                    <div className="crow">
                      <span className="badge c-news">Industry</span>
                      {mentions.map((m) => (
                        <a key={m.slug} className="ind-mention" href={`/feed?comp=${m.slug}`}>
                          <span className="rail-avatar">{initials(m.name)}</span>
                          {m.name}
                        </a>
                      ))}
                      {h.publishedAt && <span className="when">{ago(h.publishedAt)}</span>}
                    </div>
                    <div className="title"><a href={h.url} target="_blank" rel="noreferrer">{h.title}</a></div>
                    <div className="ind-src">{h.source} · via Google News</div>
                  </div>
                );
              })
            )}
          </div>

          <aside className="ov-side">
            <div className="mod">
              <h3>Competitor press</h3>
              {press.length === 0 ? (
                <p className="covnote">No competitor news captured yet.</p>
              ) : (
                press.map((p, i) => (
                  <a className="pulse-row" key={i} href={p.url ?? `/feed?comp=${p.slug}`} target={p.url ? '_blank' : undefined} rel="noreferrer">
                    <span className="pulse-t">{p.title}</span>
                    <span className="pulse-s">{p.name} · {ago(p.published_at ?? p.created_at)}</span>
                  </a>
                ))
              )}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
