'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function BrandSettingsForm({ compact = false, brandName = '', brandDomain = '', aliases = '' }: { compact?: boolean; brandName?: string; brandDomain?: string; aliases?: string }) {
  const [open, setOpen] = useState(!compact);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/brand-settings', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ brandName: data.get('brandName'), brandDomain: data.get('brandDomain'), aliases: data.get('aliases') }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Something went wrong.');
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  }

  if (compact && !open) {
    return (
      <button className="addcomp-btn" onClick={() => setOpen(true)}>Edit brand identity</button>
    );
  }

  return (
    <form className="addcomp-form" onSubmit={onSubmit}>
      {error && <div className="addcomp-err">{error}</div>}
      <input name="brandName" defaultValue={brandName} placeholder="Your brand name (e.g. Hypefy)" required maxLength={100} autoFocus />
      <input name="brandDomain" defaultValue={brandDomain} placeholder="Your domain, optional (e.g. hypefy.com)" maxLength={200} />
      <input name="aliases" defaultValue={aliases} placeholder="Other names people call you, comma-separated — optional" maxLength={300} />
      <button type="submit" className="addcomp-btn" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
      {compact && <button type="button" className="addcomp-cancel" onClick={() => setOpen(false)}>Cancel</button>}
      <p className="addcomp-note">Used only to search for your brand — in the news, on competitor sites, and in signals already captured. Nothing is guessed.</p>
    </form>
  );
}
