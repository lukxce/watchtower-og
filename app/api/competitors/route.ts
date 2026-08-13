// Add a competitor to the current workspace. Minimal on purpose: name +
// domain in, row created; the next crawl (daily cron, or POST /api/run)
// baselines it. No fake "analyzing…" theater — the honest answer to "when
// will I see data" is "on the next crawl", and the UI says exactly that.
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/db/client';
import { resolveOrgId } from '@/lib/tenant';

export async function POST(req: NextRequest) {
  const orgId = await resolveOrgId();
  if (!orgId) return NextResponse.json({ error: 'sign in required' }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as { name?: string; domain?: string };
  const name = (body.name ?? '').trim();
  let domain = (body.domain ?? '').trim().toLowerCase();
  if (!name || !domain) return NextResponse.json({ error: 'name and domain are both required' }, { status: 400 });

  // Accept "https://www.x.com/path" or bare "x.com"; store the hostname.
  domain = domain.replace(/^https?:\/\//, '').split('/')[0];
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(domain)) {
    return NextResponse.json({ error: 'that domain doesn’t look valid' }, { status: 400 });
  }
  const slug = domain.replace(/^www\./, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const db = await getDb();
  const existing = await db.query<{ id: number }>('SELECT id FROM competitors WHERE org_id = $1 AND slug = $2', [orgId, slug]);
  if (existing.length > 0) return NextResponse.json({ error: 'already tracking that domain' }, { status: 409 });

  await db.query(
    `INSERT INTO competitors (org_id, slug, name, domain, queries, extra_tier1, extra_tier2)
     VALUES ($1, $2, $3, $4, '{}'::jsonb, '[]'::jsonb, '[]'::jsonb)`,
    [orgId, slug, name, domain],
  );
  return NextResponse.json({ ok: true, slug });
}
