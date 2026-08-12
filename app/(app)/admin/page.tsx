// Internal, read-only backend viewer — no GUI exists for the underlying
// Postgres (PGlite locally / Neon in prod), so this is the fastest way to see
// what's actually in the database: raw competitor rows, the collection-run
// log (successes AND failures, honestly), the most recent raw ingested
// items before scoring, and the claim-ledger tables from the field-report
// architecture (empty until that pipeline is built).
import { getDb } from '@/db/client';
import { requireOrgId } from '@/lib/tenant';

export const dynamic = 'force-dynamic';

function ago(iso: string): string {
  const d = Date.now() - new Date(iso).getTime();
  const m = Math.floor(d / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default async function Admin() {
  const orgId = await requireOrgId();
  const db = await getDb();

  const competitors = await db.query<{ id: number; slug: string; name: string; domain: string }>(
    'SELECT id, slug, name, domain FROM competitors WHERE org_id = $1 ORDER BY id',
    [orgId],
  );
  const compIds = competitors.map((c) => c.id);
  const inClause = compIds.length ? compIds.map((_, i) => `$${i + 1}`).join(',') : 'NULL';

  const runs = compIds.length
    ? await db.query<{ competitor_id: number; channel: string; run_at: string; ok: boolean; items: number; note: string | null }>(
        `SELECT competitor_id, channel, run_at, ok, items, note FROM collection_runs WHERE competitor_id IN (${inClause}) ORDER BY id DESC LIMIT 60`,
        compIds,
      )
    : [];
  const items = compIds.length
    ? await db.query<{ competitor_id: number; channel: string; title: string; status: string; score: number | null; created_at: string }>(
        `SELECT competitor_id, channel, title, status, score, created_at FROM stream_items WHERE competitor_id IN (${inClause}) ORDER BY id DESC LIMIT 25`,
        compIds,
      )
    : [];
  const claims = compIds.length
    ? await db.query<{ competitor_id: number; section: string; claim_text: string; status: string }>(
        `SELECT competitor_id, section, claim_text, status FROM claims WHERE competitor_id IN (${inClause}) ORDER BY id DESC LIMIT 20`,
        compIds,
      )
    : [];
  const threat = compIds.length
    ? await db.query<{ competitor_id: number; total: number; dims: Record<string, number>; as_of: string }>(
        `SELECT competitor_id, total, dims, as_of FROM threat_scores WHERE competitor_id IN (${inClause})`,
        compIds,
      )
    : [];

  const nameOf = (id: number) => competitors.find((c) => c.id === id)?.name ?? `#${id}`;
  const okRuns = runs.filter((r) => r.ok).length;

  return (
    <main className="main solo">
      <section className="feed">
        <h1>Admin — raw backend</h1>
        <p className="sub">
          Workspace <code className="mono">{orgId}</code> · {competitors.length} competitors · no GUI exists for
          the underlying Postgres, so this page reads the tables directly.
        </p>

        <h3 className="admin-h">Competitors ({competitors.length})</h3>
        <div className="tblwrap">
          <table className="cmp">
            <thead><tr><th>id</th><th>slug</th><th>name</th><th>domain</th></tr></thead>
            <tbody>
              {competitors.map((c) => (
                <tr key={c.id}><td className="n">{c.id}</td><td className="n">{c.slug}</td><td>{c.name}</td><td className="n">{c.domain}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="admin-h">Threat scores (raw dims)</h3>
        <div className="tblwrap">
          <table className="cmp">
            <thead><tr><th>competitor</th><th>total</th><th>gtm</th><th>talent</th><th>product</th><th>market</th><th>corporate</th><th>as of</th></tr></thead>
            <tbody>
              {threat.map((t) => (
                <tr key={t.competitor_id}>
                  <td>{nameOf(t.competitor_id)}</td>
                  <td className="n">{t.total}</td>
                  <td className="n">{t.dims.gtm}</td>
                  <td className="n">{t.dims.talent}</td>
                  <td className="n">{t.dims.product}</td>
                  <td className="n">{t.dims.market}</td>
                  <td className="n">{t.dims.corporate}</td>
                  <td className="n">{t.as_of.slice(0, 16)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="admin-h">Collection runs — last 60 ({okRuns} ok / {runs.length - okRuns} failed)</h3>
        <div className="tblwrap">
          <table className="cmp">
            <thead><tr><th>when</th><th>competitor</th><th>channel</th><th>ok</th><th>items</th><th>note</th></tr></thead>
            <tbody>
              {runs.map((r, i) => (
                <tr key={i}>
                  <td className="n">{ago(r.run_at)}</td>
                  <td>{nameOf(r.competitor_id)}</td>
                  <td className="n">{r.channel}</td>
                  <td><span className={`tag ${r.ok ? 'good' : 'risk'}`}>{r.ok ? 'ok' : 'FAILED'}</span></td>
                  <td className="n">{r.items}</td>
                  <td style={{ color: 'var(--faint)', fontSize: 12 }}>{r.note}</td>
                </tr>
              ))}
              {runs.length === 0 && <tr><td colSpan={6} style={{ color: 'var(--faint)' }}>No runs yet — trigger one with <code>npm run populate</code>.</td></tr>}
            </tbody>
          </table>
        </div>

        <h3 className="admin-h">Raw stream_items — last 25 (pre-scoring ingest)</h3>
        <div className="tblwrap">
          <table className="cmp">
            <thead><tr><th>when</th><th>competitor</th><th>channel</th><th>status</th><th>score</th><th>title</th></tr></thead>
            <tbody>
              {items.map((it, i) => (
                <tr key={i}>
                  <td className="n">{ago(it.created_at)}</td>
                  <td>{nameOf(it.competitor_id)}</td>
                  <td className="n">{it.channel}</td>
                  <td className="n">{it.status}</td>
                  <td className="n">{it.score ?? '—'}</td>
                  <td style={{ maxWidth: 360 }}>{it.title}</td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan={6} style={{ color: 'var(--faint)' }}>Nothing ingested yet.</td></tr>}
            </tbody>
          </table>
        </div>

        <h3 className="admin-h">Claim ledger — {claims.length} rows (pipeline not built yet — see README)</h3>
        <div className="tblwrap">
          <table className="cmp">
            <thead><tr><th>competitor</th><th>section</th><th>status</th><th>claim</th></tr></thead>
            <tbody>
              {claims.map((c, i) => (
                <tr key={i}><td>{nameOf(c.competitor_id)}</td><td className="n">{c.section}</td><td className="n">{c.status}</td><td>{c.claim_text}</td></tr>
              ))}
              {claims.length === 0 && <tr><td colSpan={4} style={{ color: 'var(--faint)' }}>Empty — the extract/dedupe/contradict pipeline from field-report §03 isn&apos;t wired up yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
