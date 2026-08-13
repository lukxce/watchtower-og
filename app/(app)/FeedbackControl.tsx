'use client';
// Platform-admin-only "teach the reasoning layer" control — shown under a
// synthesized card while viewing as any workspace. A correction here is
// stored in interpretation_feedback and fed back as few-shot guidance to
// every future LLM reasoning call, across every workspace (src/lib/reason.ts
// getFeedbackExamples). Never shown to customers — gated by isPlatformAdmin()
// server-side before this even renders.
import { useState } from 'react';

export default function FeedbackControl({ competitorName, channel, signalTitle, headlineShown }: { competitorName: string; channel: string; signalTitle: string; headlineShown: string }) {
  const [sent, setSent] = useState<'correct' | 'incorrect' | null>(null);
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  async function send(verdict: 'correct' | 'incorrect', withNote?: string) {
    setBusy(true);
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ competitorName, channel, signalTitle, headlineShown, verdict, note: withNote ?? null }),
      });
      setSent(verdict);
      setNoteOpen(false);
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return <div className="feedback-row"><span className="feedback-btn sent">{sent === 'correct' ? '✓ marked correct' : '✓ marked wrong — thanks, teaching the model'}</span></div>;
  }

  return (
    <div className="feedback-row">
      <button className="feedback-btn good" disabled={busy} onClick={() => send('correct')}>👍 correct</button>
      <button className="feedback-btn bad" disabled={busy} onClick={() => (noteOpen ? send('incorrect', note) : setNoteOpen(true))}>👎 wrong</button>
      {noteOpen && (
        <>
          <input className="feedback-note" placeholder="What's wrong? (optional, but this is what teaches it)" value={note} onChange={(e) => setNote(e.target.value)} autoFocus />
          <button className="feedback-btn" disabled={busy} onClick={() => send('incorrect', note)}>Send</button>
        </>
      )}
    </div>
  );
}
