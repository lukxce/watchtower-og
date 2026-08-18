// Mentions — where OUR brand shows up: general news, inside a competitor's
// own already-captured page content (the highest-value kind), and any
// already-ingested signal that names us. An empty section is an honest
// answer, not a bug — a brand this size may genuinely have zero press this
// week, and that's worth knowing too.
import { requireOrgId } from '@/lib/tenant';
import { findBrandMentions } from '@/lib/mentions';
import { getBrandSettings } from '@/lib/brand';
import BrandSettingsForm from './BrandSettingsForm';

export const dynamic = 'force-dynamic';

function ago(iso: string): string {
  const d = Date.now() - new Date(iso).getTime();
  const h = Math.floor(d / 3600000);
  if (h < 1) return `${Math.max(1, Math.floor(d / 60000))}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default async function Mentions() {
  const orgId = await requireOrgId();
  const settings = await getBrandSettings(orgId);

  if (!settings.configured) {
    return (
      <main className="main solo">
        <section className="feed">
          <h1>Mentions</h1>
          <p className="sub">
            Tell Fortress HQ who you are, and this page tracks where your brand shows up — in the news, inside a
            competitor&apos;s own site copy, and in signals already captured.
          </p>
          <BrandSettingsForm />
        </section>
      </main>
    );
  }

  const m = await findBrandMentions(orgId);
  const totalCount = m.news.length + m.siteMentions.length + m.signalMentions.length;

  return (
    <main className="main solo">
      <section className="feed">
        <div className="comp-head">
          <div>
            <h1>Mentions</h1>
            <p className="sub" style={{ marginBottom: 0 }}>
              Where <b>{m.brandName}</b> shows up — {totalCount} mention{totalCount === 1 ? '' : 's'} found across news,
              competitor sites, and captured signals.
            </p>
          </div>
          <BrandSettingsForm compact brandName={settings.brandName} brandDomain={settings.brandDomain ?? ''} aliases={settings.aliases.join(', ')} description={settings.description ?? ''} competencies={settings.competencies ?? ''} />
        </div>

        <h3 className="admin-h" style={{ marginTop: 4 }}>On competitor sites</h3>
        <p className="pos-note">
          The highest-value kind — a competitor&apos;s own page copy naming you. Scanned from pages Fortress HQ already
          crawls, not a new fetch.
        </p>
        {m.siteMentions.length === 0 ? (
          <div className="empty">No competitor page currently mentions {m.brandName}. That&apos;s a real result, not a gap — it&apos;ll update as pages are recrawled.</div>
        ) : (
          m.siteMentions.map((s, i) => (
            <div className="card" key={i}>
              <div className="crow">
                <span className="badge c-product">On their site</span>
                <span className="comp">{s.competitorName}</span>
                <span className="when">{ago(s.capturedAt)}</span>
              </div>
              <div className="title"><a href={s.url} target="_blank" rel="noreferrer">{s.url}</a></div>
              <div className="howknow">&ldquo;…{s.snippet}…&rdquo;</div>
            </div>
          ))
        )}

        <h3 className="admin-h">In the news</h3>
        {m.newsUnconfirmed && m.news.length > 0 && (
          <p className="sub" style={{ marginTop: -4 }}>
            These are raw name matches — add your domain and a line about what you do in{' '}
            <a href="/mentions#brand" style={{ fontWeight: 700 }}>brand settings</a> and the Tower can tell your
            coverage apart from anyone else called {m.brandName}.
          </p>
        )}
        {(m.newsSameName.length > 0 || m.newsUnverified.length > 0) && (
          <details className="bundle" style={{ marginBottom: 14 }}>
            <summary>
              {m.newsSameName.length + m.newsUnverified.length} more named &ldquo;{m.brandName}&rdquo; but could not be
              confirmed as you — show them
            </summary>
            <ul className="bundle-items">
              {m.newsSameName.map((n) => (
                <li key={n.url}>
                  <a href={n.url} target="_blank" rel="noreferrer">{n.title}</a>
                  <span className="howknow"> — reads as a different {m.brandName} (same name, other field)</span>
                </li>
              ))}
              {m.newsUnverified.map((n) => (
                <li key={n.url}>
                  <a href={n.url} target="_blank" rel="noreferrer">{n.title}</a>
                  <span className="howknow"> — names you, nothing in it ties back to your market</span>
                </li>
              ))}
            </ul>
          </details>
        )}
        {m.news.length === 0 ? (
          <div className="empty">No news coverage naming {m.brandName} right now.</div>
        ) : (
          m.news.slice(0, 10).map((n, i) => (
            <div className="card" key={i}>
              <div className="crow">
                <span className="badge c-news">News</span>
                {n.publishedAt && <span className="when">{ago(n.publishedAt)}</span>}
              </div>
              <div className="title"><a href={n.url} target="_blank" rel="noreferrer">{n.title}</a></div>
              <div className="ind-src">{n.source} · via Google News</div>
            </div>
          ))
        )}

        <h3 className="admin-h">In captured signals</h3>
        {m.signalMentions.length === 0 ? (
          <div className="empty">No already-captured signal (ads, jobs, reviews, community posts…) names {m.brandName} yet.</div>
        ) : (
          m.signalMentions.slice(0, 10).map((s, i) => (
            <div className="card" key={i}>
              <div className="crow">
                <span className="badge c-other">{s.channel}</span>
                <span className="comp">{s.competitorName}</span>
                <span className="when">{ago(s.at)}</span>
              </div>
              <div className="title">{s.url ? <a href={s.url} target="_blank" rel="noreferrer">{s.title}</a> : s.title}</div>
            </div>
          ))
        )}
      </section>
    </main>
  );
}
