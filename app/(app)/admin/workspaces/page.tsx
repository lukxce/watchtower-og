// Platform-admin cross-tenant view: every workspace on Watchtower, not just
// the one you're signed into. "View as" sets the impersonation cookie
// (adminAuth.ts) so you see exactly what that client sees — same pages, same
// data, org-scoped exactly as their own login would show. Redirects any
// non-admin straight back to their own overview; this route doesn't exist
// for a customer.
import { redirect } from 'next/navigation';
import { getDb } from '@/db/client';
import { distinctOrgIds } from '@/db/queries';
import { isPlatformAdmin, getViewAsOrg } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

function ago(iso: string | null): string {
  if (!iso) return 'never';
  const d = Date.now() - new Date(iso).getTime();
  const h = Math.floor(d / 3600000);
  if (h < 1) return 'just now';
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default async function AdminWorkspaces() {
  if (!(await isPlatformAdmin())) redirect('/overview');
  const viewingAs = await getViewAsOrg();
  const db = await getDb();
  const orgIds = await distinctOrgIds();

  const rows = await Promise.all(
    orgIds.map(async (orgId) => {
      const comps = await db.query<{ id: number }>('SELECT id FROM competitors WHERE org_id = $1', [orgId]);
      const compIds = comps.map((c) => c.id);
      const inClause = compIds.length ? compIds.map((_, i) => `$${i + 1}`).join(',') : 'NULL';
      const signals = compIds.length
        ? Number((await db.query<{ n: string }>(`SELECT COUNT(*)::text n FROM stream_items WHERE competitor_id IN (${inClause})`, compIds))[0]?.n ?? 0)
        : 0;
      const latest = compIds.length
        ? (await db.query<{ m: string | null }>(`SELECT MAX(created_at)::text m FROM stream_items WHERE competitor_id IN (${inClause})`, compIds))[0]?.m ?? null
        : null;
      const brand = (await db.query<{ brand_name: string }>('SELECT brand_name FROM org_settings WHERE org_id = $1', [orgId]))[0]?.brand_name ?? null;
      return { orgId, competitors: comps.length, signals, latest, brand };
    }),
  );

  return (
    <main className="main solo">
      <section className="feed">
        <h1>All workspaces</h1>
        <p className="sub">
          Every customer workspace on Watchtower, platform-admin only. &ldquo;View as&rdquo; shows you exactly what
          that workspace sees — same pages, their data, nothing else. Corrections you leave on a workspace&apos;s
          signals teach the reasoning layer for everyone (<code className="mono">interpretation_feedback</code>).
        </p>

        <div className="tblwrap">
          <table className="cmp">
            <thead>
              <tr><th className="rl">workspace</th><th className="rl">brand</th><th>competitors</th><th>signals</th><th>last activity</th><th></th></tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.orgId}>
                  <td className="rl mono">{r.orgId}</td>
                  <td className="rl">{r.brand ?? <span style={{ color: 'var(--faint)' }}>not set</span>}</td>
                  <td className="n">{r.competitors}</td>
                  <td className="n">{r.signals}</td>
                  <td className="n">{ago(r.latest)}</td>
                  <td className="n">
                    {viewingAs === r.orgId ? (
                      <span className="tag good">viewing</span>
                    ) : (
                      <a className="mod-more" href={`/api/admin/view-as?org=${encodeURIComponent(r.orgId)}`}>View as →</a>
                    )}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && <tr><td colSpan={6} style={{ color: 'var(--faint)' }}>No workspaces yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
