// Update the manual secret-shopper signup status for one competitor. This is
// intentionally a manual toggle, not automation: actually signing up for a
// competitor's newsletter means filling out a real form on their site with a
// real inbox to click the confirm link from, which isn't something to fake.
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/db/client';
import { resolveOrgId } from '@/lib/tenant';

const STATUSES = new Set(['not_started', 'signed_up', 'confirmed', 'bounced']);

export async function POST(req: NextRequest) {
  const orgId = await resolveOrgId();
  if (!orgId) return NextResponse.json({ error: 'sign in required' }, { status: 401 });
  const body = (await req.json().catch(() => ({}))) as { competitorId?: number; status?: string; personaEmail?: string; note?: string };
  if (!body.competitorId || !body.status || !STATUSES.has(body.status)) {
    return NextResponse.json({ error: 'competitorId and a valid status are required' }, { status: 400 });
  }
  const db = await getDb();
  // Confirm the competitor actually belongs to this workspace before writing.
  const owned = await db.query<{ id: number }>('SELECT id FROM competitors WHERE id = $1 AND org_id = $2', [body.competitorId, orgId]);
  if (owned.length === 0) return NextResponse.json({ error: 'competitor not found in this workspace' }, { status: 404 });

  await db.query(
    `INSERT INTO secret_shopper (org_id, competitor_id, persona_email, status, note, updated_at)
     VALUES ($1, $2, $3, $4, $5, now())
     ON CONFLICT (org_id, competitor_id) DO UPDATE SET
       persona_email = COALESCE(EXCLUDED.persona_email, secret_shopper.persona_email),
       status = EXCLUDED.status, note = EXCLUDED.note, updated_at = now()`,
    [orgId, body.competitorId, body.personaEmail ?? null, body.status, body.note ?? null],
  );
  return NextResponse.json({ ok: true });
}
