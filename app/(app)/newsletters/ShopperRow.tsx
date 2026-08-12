'use client';
import { useState } from 'react';

interface Props {
  competitorId: number;
  initialStatus: string;
  initialEmail: string;
}

const STATUSES = [
  { value: 'not_started', label: 'Not started' },
  { value: 'signed_up', label: 'Signed up — awaiting confirmation' },
  { value: 'confirmed', label: 'Confirmed — receiving mail' },
  { value: 'bounced', label: 'Bounced / no newsletter found' },
];

export default function ShopperRow({ competitorId, initialStatus, initialEmail }: Props) {
  const [status, setStatus] = useState(initialStatus);
  const [email, setEmail] = useState(initialEmail);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save(nextStatus?: string) {
    setSaving(true);
    setSaved(false);
    try {
      await fetch('/api/secret-shopper', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ competitorId, status: nextStatus ?? status, personaEmail: email || null }),
      });
      if (nextStatus) setStatus(nextStatus);
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="shopper-row">
      <select value={status} onChange={(e) => { setStatus(e.target.value); save(e.target.value); }} className="shopper-select">
        {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
      </select>
      <input
        type="email"
        placeholder="persona email used"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => save()}
        className="shopper-email"
      />
      {saving ? <span className="shopper-note">saving…</span> : saved ? <span className="shopper-note ok">saved</span> : null}
    </div>
  );
}
