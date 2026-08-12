'use client';
import { useState, FormEvent } from 'react';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle');
  const [error, setError] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: data.get('name'), email: data.get('email'), message: data.get('message') }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Something went wrong. Try again.');
      setStatus('ok');
      form.reset();
    } catch (err) {
      setStatus('err');
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again.');
    }
  }

  if (status === 'ok') {
    return <div className="form-status ok">Sent — we read every one of these and reply within a day or two.</div>;
  }

  return (
    <form onSubmit={onSubmit}>
      {status === 'err' && <div className="form-status err">{error}</div>}
      <div className="field">
        <label htmlFor="name">Name</label>
        <input id="name" name="name" type="text" required maxLength={200} />
      </div>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required maxLength={200} />
      </div>
      <div className="field">
        <label htmlFor="message">What are you trying to do?</label>
        <textarea id="message" name="message" rows={5} required maxLength={5000} />
      </div>
      <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Send message'}
      </button>
    </form>
  );
}
