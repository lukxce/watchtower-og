'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function AddCompetitor() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/competitors', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: data.get('name'), domain: data.get('domain') }),
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

  if (!open) {
    return (
      <button className="addcomp-btn" onClick={() => setOpen(true)}>+ Add competitor</button>
    );
  }

  return (
    <form className="addcomp-form" onSubmit={onSubmit}>
      {error && <div className="addcomp-err">{error}</div>}
      <input name="name" placeholder="Name (e.g. Fathom Labs)" required maxLength={100} autoFocus />
      <input name="domain" placeholder="Domain (e.g. fathomlabs.com)" required maxLength={200} />
      <button type="submit" className="addcomp-btn" disabled={busy}>{busy ? 'Adding…' : 'Add'}</button>
      <button type="button" className="addcomp-cancel" onClick={() => setOpen(false)}>Cancel</button>
      <p className="addcomp-note">Baselines on the next crawl — the daily 07:00 run, or trigger one with POST /api/run.</p>
    </form>
  );
}
