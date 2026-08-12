// Marketing-site contact form. No email service is wired yet (would be
// Resend) — submissions are persisted so nothing is silently dropped; wiring
// a notification is a follow-up, not a blocker for the form to work honestly.
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/db/client';

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as { name?: string; email?: string; message?: string };
  const name = (body.name ?? '').trim();
  const email = (body.email ?? '').trim();
  const message = (body.message ?? '').trim();
  if (!name || !email || !message) {
    return NextResponse.json({ error: 'name, email, and message are all required' }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'that email address doesn’t look right' }, { status: 400 });
  }
  const db = await getDb();
  await db.query('INSERT INTO contact_messages (name, email, message) VALUES ($1, $2, $3)', [
    name.slice(0, 200),
    email.slice(0, 200),
    message.slice(0, 5000),
  ]);
  return NextResponse.json({ ok: true });
}
