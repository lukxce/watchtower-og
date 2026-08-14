'use client';
// Agentic onboarding: describe who you are (or paste your site), we save
// your identity and recommend who to track. Each recommendation is one
// click to add; everything baselines on the next crawl.
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface Rec { name: string; domain: string; reason: string; added?: boolean }

export default function OnboardingFlow() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [recs, setRecs] = useState<Rec[] | null>(null);
  const [unavailable, setUnavailable] = useState('');
  const [done, setDone] = useState(false);
  const router = useRouter();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setBusy(true);
    setError('');
    try {
      const save = await fetch('/api/brand-settings', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          brandName: data.get('brandName'),
          brandDomain: data.get('brandDomain'),
          description: data.get('description'),
          competencies: data.get('competencies'),
        }),
      });
      const saved = await save.json();
      if (!save.ok) throw new Error(saved.error ?? 'Could not save your identity.');
      setDone(true);

      const rec = await fetch('/api/recommend-competitors', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ description: data.get('description'), url: data.get('brandDomain') }),
      });
      const json = await rec.json();
      if (json.available && Array.isArray(json.recommendations)) setRecs(json.recommendations);
      else setUnavailable(json.reason ?? 'Recommendations unavailable right now.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  }

  async function addRec(i: number) {
    if (!recs) return;
    const r = recs[i];
    const res = await fetch('/api/competitors', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: r.name, domain: r.domain }),
    });
    if (res.ok || res.status === 409) setRecs(recs.map((x, j) => (j === i ? { ...x, added: true } : x)));
  }

  return (
    <div className="onb">
      {!done ? (
        <form className="onb-form" onSubmit={onSubmit}>
          {error && <div className="addcomp-err">{error}</div>}
          <label>Your brand name<input name="brandName" required maxLength={100} placeholder="e.g. Hypefy" /></label>
          <label>Your website<input name="brandDomain" maxLength={200} placeholder="e.g. hypefy.ai — we can work from just this" /></label>
          <label>Who you are<textarea name="description" rows={3} maxLength={1000} placeholder="What you sell, to whom, and how — a sentence or two is enough." /></label>
          <label>Core competencies<input name="competencies" maxLength={500} placeholder="Comma-separated — what you genuinely do better" /></label>
          <button type="submit" className="addcomp-btn" disabled={busy}>{busy ? 'Working…' : 'Save & recommend competitors'}</button>
        </form>
      ) : (
        <div className="onb-recs">
          <p className="onb-saved">✓ Identity saved — battlecards will now say how <b>you</b> win.</p>
          {busy && !recs && !unavailable && <p className="covnote">Thinking about who you should track…</p>}
          {unavailable && (
            <div className="empty">{unavailable} <a href="/battlecards" style={{ color: 'var(--brand)', fontWeight: 700 }}>Add competitors →</a></div>
          )}
          {recs && recs.length > 0 && (
            <>
              <h3 className="admin-h">Recommended competitors</h3>
              {recs.map((r, i) => (
                <div className="onb-rec" key={r.domain}>
                  <div>
                    <b>{r.name}</b> <span className="mono onb-dom">{r.domain}</span>
                    <p>{r.reason}</p>
                  </div>
                  {r.added ? <span className="tag good">added</span> : <button className="addcomp-btn" onClick={() => addRec(i)}>+ Track</button>}
                </div>
              ))}
              <button className="addcomp-btn onb-done" onClick={() => router.push('/overview')}>Done — go to my dashboard</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
