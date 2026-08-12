// Inbound email webhook (Resend inbound / SendGrid parse / Mailgun routes).
// A persona inbox subscribes to competitors' newsletters and signs up as a lead
// (secret shopper); forwarded emails POST here. We match the sender domain to a
// competitor and ingest the email as a 'newsletters' signal — no scraping.
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/db/client';
import { ingestItems } from '@/db/queries';
import { authorized } from '@/lib/auth';

export const dynamic = 'force-dynamic';

interface Inbound {
  from?: string;
  subject?: string;
  text?: string;
  html?: string;
  date?: string;
}

function domainOf(from: string): string | null {
  const m = from.match(/@([a-z0-9.-]+)/i);
  return m ? m[1].toLowerCase() : null;
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  // Each workspace gets its own forwarding address (…/api/inbound?org=<id>) so
  // a forwarded newsletter routes to the right tenant — the email itself
  // carries no workspace context.
  const orgId = req.nextUrl.searchParams.get('org');
  if (!orgId) return NextResponse.json({ error: 'missing ?org=' }, { status: 400 });
  const body = (await req.json().catch(() => ({}))) as Inbound;
  const from = body.from ?? '';
  const senderDomain = domainOf(from);
  if (!senderDomain) return NextResponse.json({ ok: false, reason: 'no sender domain' });

  const db = await getDb();
  const comps = await db.query<{ id: number; domain: string }>('SELECT id, domain FROM competitors WHERE org_id = $1', [orgId]);
  const match = comps.find((c) => senderDomain.endsWith(c.domain.replace(/^www\./, '')) || c.domain.replace(/^www\./, '').endsWith(senderDomain));
  if (!match) return NextResponse.json({ ok: true, matched: false });

  const subject = body.subject ?? '(no subject)';
  const { added } = await ingestItems(match.id, 'newsletters', [
    {
      externalId: `mail:${senderDomain}:${subject}:${(body.date ?? '').slice(0, 10)}`,
      title: `Email from ${senderDomain}: ${subject}`,
      publishedAt: body.date,
      payload: { from, preview: (body.text ?? '').slice(0, 500) },
    },
  ]);
  return NextResponse.json({ ok: true, matched: match.domain, added });
}
