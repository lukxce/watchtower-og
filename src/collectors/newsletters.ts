// Newsletters & sales sequences (secret shopper). Webhook-driven, not pulled:
// a persona inbox forwards competitor emails to /api/inbound, which ingests
// them. This collector just reports channel health in the daily run — how many
// emails arrived recently — so the coverage map is honest. "Active" once the
// inbox is wired (NEWSLETTER_INBOX documents the configured address).
import { getDb } from '@/db/client';
import { recordRun, type Competitor } from '@/db/queries';

export async function collectNewsletters(comp: Competitor): Promise<string> {
  if (!process.env.NEWSLETTER_INBOX) {
    await recordRun(comp.id, 'newsletters', true, 0, 'deferred: configure a persona inbox → /api/inbound (set NEWSLETTER_INBOX)');
    return 'deferred (needs inbox)';
  }
  const db = await getDb();
  const r = await db.query<{ n: string }>(
    "SELECT COUNT(*)::text n FROM stream_items WHERE competitor_id=$1 AND channel='newsletters' AND created_at > now() - interval '2 days'",
    [comp.id],
  );
  const recent = Number(r[0]?.n ?? 0);
  await recordRun(comp.id, 'newsletters', true, recent, `${recent} emails in last 48h (inbound webhook)`);
  return `${recent} recent emails (webhook-driven)`;
}
