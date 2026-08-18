// Newsletters & secret shopper. A persona inbox signs up for each
// competitor's newsletter and product emails as a lead would; forwarded mail
// lands here via /api/inbound (matched by sender domain, see that route) and
// shows up in the feed below tagged 'newsletters'. Signup itself is tracked,
// not automated: there's no honest way to fake filling out a real form.
import { getDb } from '@/db/client';
import { requireOrgId } from '@/lib/tenant';
import ShopperRow from './ShopperRow';

export const dynamic = 'force-dynamic';

function ago(iso: string): string {
  const d = Date.now() - new Date(iso).getTime();
  const h = Math.floor(d / 3600000);
  if (h < 1) return `${Math.max(1, Math.floor(d / 60000))}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default async function Newsletters() {
  const orgId = await requireOrgId();
  const db = await getDb();

  const competitors = await db.query<{
    id: number; name: string; slug: string; domain: string;
    persona_email: string | null; status: string | null; last_mail_at: string | null; mail_count: string;
  }>(
    `SELECT c.id, c.name, c.slug, c.domain,
            ss.persona_email, ss.status,
            (SELECT MAX(created_at) FROM stream_items WHERE competitor_id = c.id AND channel = 'newsletters') AS last_mail_at,
            (SELECT COUNT(*)::text FROM stream_items WHERE competitor_id = c.id AND channel = 'newsletters') AS mail_count
     FROM competitors c
     LEFT JOIN secret_shopper ss ON ss.competitor_id = c.id AND ss.org_id = c.org_id
     WHERE c.org_id = $1
     ORDER BY c.id`,
    [orgId],
  );

  const compIds = competitors.map((c) => c.id);
  const inClause = compIds.map((_, i) => `$${i + 1}`).join(',') || 'NULL';
  const mail = compIds.length
    ? await db.query<{ competitor_id: number; title: string; url: string | null; created_at: string; payload: { from?: string; preview?: string } | null }>(
        `SELECT competitor_id, title, url, created_at, payload FROM stream_items WHERE channel = 'newsletters' AND competitor_id IN (${inClause}) ORDER BY id DESC LIMIT 30`,
        compIds,
      )
    : [];
  const nameOf = (id: number) => competitors.find((c) => c.id === id)?.name ?? `#${id}`;

  const confirmedCount = competitors.filter((c) => c.status === 'confirmed').length;
  // The customer needs an EMAIL ADDRESS to forward to — not a webhook URL.
  // NEWSLETTER_INBOX holds the persona address (e.g. watch@yourdomain.com) and
  // the workspace rides in a plus-tag, so one inbox serves every tenant.
  const inbox = process.env.NEWSLETTER_INBOX ?? '';
  const forwardTo = inbox
    ? inbox.replace(/^([^@]+)@/, `$1+${orgId}@`)
    : null;

  return (
    <main className="main solo">
      <section className="feed">
        <h1>Newsletters &amp; secret shopper</h1>
        <p className="sub">
          {confirmedCount}/{competitors.length} competitors confirmed and receiving mail. Subscribe a persona inbox
          to each competitor&apos;s newsletter, forward what arrives to the address below, and it lands in the feed
          tagged as a newsletter signal.
        </p>

        {forwardTo ? (
          <div className="callout-box">
            <b>Forward their emails to</b>{' '}
            <code className="mono">{forwardTo}</code>
            <br />
            The <code className="mono">+{orgId}</code> tag is what routes mail to this workspace, so keep it. Most mail
            clients let you auto-forward by sender, which makes this a one-time setup per competitor.
          </div>
        ) : (
          <div className="empty">
            <b>Not configured yet.</b> This channel needs an inbox that can receive mail and post it onwards — Resend
            Inbound, SendGrid Parse or Mailgun Routes all do it. Point one at{' '}
            <code className="mono">/api/inbound?token=…</code>, then set <code className="mono">NEWSLETTER_INBOX</code>{' '}
            to the address and <code className="mono">INBOUND_TOKEN</code> to the shared secret. The address then
            appears here, per workspace.
          </div>
        )}

        <div className="callout-box">
          Signup itself is a manual, one-time action per competitor: visit their site, subscribe with your persona
          email, confirm from the inbox. Nothing here fakes that step. Once you&apos;re subscribed, forward
          (or auto-forward) their emails to the address above and Fortress HQ does the rest: matches the sender
          domain, dedupes, and ingests it as a signal. Mail from companies you don&apos;t track is ignored rather
          than stored — the persona inbox will receive plenty of unrelated post.
        </div>

        <h3 className="admin-h">Subscription status</h3>
        <div className="tblwrap">
          <table className="cmp">
            <thead><tr><th>competitor</th><th>status</th><th>mail received</th><th>last email</th></tr></thead>
            <tbody>
              {competitors.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="comp">{c.name}</div>
                    <div className="cc-dom">{c.domain}</div>
                  </td>
                  <td>
                    <ShopperRow competitorId={c.id} initialStatus={c.status ?? 'not_started'} initialEmail={c.persona_email ?? ''} />
                  </td>
                  <td className="n">{c.mail_count}</td>
                  <td className="n">{c.last_mail_at ? ago(c.last_mail_at) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="admin-h">Captured mail — last 30</h3>
        {mail.length === 0 ? (
          <div className="empty">
            No newsletter signals yet. Once a persona inbox is confirmed and forwarding, captured emails show up
            here automatically.
          </div>
        ) : (
          mail.map((m, i) => (
            <div className="card" key={i}>
              <div className="crow">
                <span className="badge c-community">Newsletter</span>
                <span className="comp">{nameOf(m.competitor_id)}</span>
                <span className="when">{ago(m.created_at)}</span>
              </div>
              <div className="title">{m.title}</div>
              {m.payload?.preview && <div className="mail-preview">{m.payload.preview}</div>}
            </div>
          ))
        )}
      </section>
    </main>
  );
}
