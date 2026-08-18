// Inbound email webhook (Resend Inbound / SendGrid Parse / Mailgun Routes).
//
// A persona inbox subscribes to competitors' newsletters and signs up as a
// lead — secret shopping, which is how competitive research has always worked
// and is legitimate precisely because the mail was sent TO US. Nothing here
// scrapes anyone.
//
// Two things about this route were wrong and made the channel impossible to
// operate rather than merely unconfigured:
//
//  1. It authorised with `authorized()`, the CRON check, which expects a
//     bearer token. No email provider posts one. Every real webhook would have
//     been rejected. It now takes a shared token in the query string, which is
//     the one thing every provider can carry.
//
//  2. The workspace was identified by a `?org=` parameter the user had to wire
//     per tenant. Plus-addressing is better: one inbox, `persona+<org>@domain`,
//     and the workspace falls out of the To: header. The parameter still works
//     as a fallback for providers that drop the envelope recipient.
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/db/client';
import { ingestItems } from '@/db/queries';

export const dynamic = 'force-dynamic';

interface Inbound {
  from?: string;
  to?: string;
  recipient?: string; // Mailgun
  envelope?: { to?: string | string[] };
  subject?: string;
  text?: string;
  html?: string;
  date?: string;
}

function domainOf(from: string): string | null {
  return from.match(/@([a-z0-9.-]+)/i)?.[1]?.toLowerCase() ?? null;
}

/** `watch+acme@example.com` → `acme`. The workspace rides in the address. */
function orgFromRecipient(body: Inbound): string | null {
  const candidates = [
    body.to,
    body.recipient,
    ...(Array.isArray(body.envelope?.to) ? body.envelope!.to! : [body.envelope?.to]),
  ].filter((x): x is string => typeof x === 'string' && x.length > 0);
  for (const c of candidates) {
    const tag = c.match(/\+([A-Za-z0-9_-]+)@/)?.[1];
    if (tag) return tag;
  }
  return null;
}

export async function POST(req: NextRequest) {
  // Providers post as an anonymous machine, so the credential has to live in
  // the URL they were given. Unset means the channel is not configured, and we
  // refuse rather than accept anything.
  const expected = process.env.INBOUND_TOKEN;
  if (!expected) {
    return NextResponse.json({ error: 'inbound not configured (set INBOUND_TOKEN)' }, { status: 503 });
  }
  if (req.nextUrl.searchParams.get('token') !== expected) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as Inbound;
  const orgId = orgFromRecipient(body) ?? req.nextUrl.searchParams.get('org');
  if (!orgId) {
    return NextResponse.json({ error: 'no workspace: use persona+<org>@… or ?org=' }, { status: 400 });
  }

  const from = body.from ?? '';
  const senderDomain = domainOf(from);
  if (!senderDomain) return NextResponse.json({ ok: false, reason: 'no sender domain' });

  const db = await getDb();
  const comps = await db.query<{ id: number; domain: string }>(
    'SELECT id, domain FROM competitors WHERE org_id = $1',
    [orgId],
  );
  const bare = (d: string) => d.replace(/^www\./, '');
  const match = comps.find(
    (c) => senderDomain.endsWith(bare(c.domain)) || bare(c.domain).endsWith(senderDomain),
  );
  // Mail from a company we do not track is not an error — the persona inbox
  // will also receive plenty of unrelated post. Recorded as unmatched so the
  // page can say "12 arrived, 9 matched" instead of quietly binning three.
  if (!match) return NextResponse.json({ ok: true, matched: false, sender: senderDomain });

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
