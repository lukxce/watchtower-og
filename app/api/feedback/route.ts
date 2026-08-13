// Admin corrections on the LLM reasoning layer. Platform-admin only — a
// customer isn't teaching the shared reasoning model, the platform owner is
// (see adminAuth.ts / reason.ts for why this generalizes across workspaces
// safely: only the admin's judgment is stored, never raw competitor data).
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/db/client';
import { resolveOrgId } from '@/lib/tenant';
import { isPlatformAdmin } from '@/lib/adminAuth';

export async function POST(req: NextRequest) {
  if (!(await isPlatformAdmin())) return NextResponse.json({ error: 'not authorized' }, { status: 403 });
  const orgId = await resolveOrgId();
  if (!orgId) return NextResponse.json({ error: 'sign in required' }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as {
    competitorName?: string;
    channel?: string;
    signalTitle?: string;
    headlineShown?: string;
    verdict?: string;
    note?: string | null;
  };
  const { competitorName, channel, signalTitle, headlineShown, verdict, note } = body;
  if (!competitorName || !channel || !signalTitle || !headlineShown || (verdict !== 'correct' && verdict !== 'incorrect')) {
    return NextResponse.json({ error: 'missing or invalid fields' }, { status: 400 });
  }

  const db = await getDb();
  await db.query(
    `INSERT INTO interpretation_feedback (org_id, competitor_name, channel, signal_title, headline_shown, verdict, note)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [orgId, competitorName, channel, signalTitle.slice(0, 500), headlineShown.slice(0, 1000), verdict, note?.slice(0, 500) || null],
  );
  return NextResponse.json({ ok: true });
}
