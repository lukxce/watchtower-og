'use client';
import { FormEvent } from 'react';

export default function EmailPrefsForm() {
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const email = String(data.get('email') ?? '');
    const details = String(data.get('details') ?? '');
    const body = [
      email ? `My email: ${email}` : '',
      details ? `What I'd like less of:\n${details}` : '',
    ].filter(Boolean).join('\n\n');
    const mailto = `mailto:hello@fortress-hq.example?subject=${encodeURIComponent('Email preferences')}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  }

  return (
    <form className="cox-pref-form" onSubmit={onSubmit}>
      <div className="field">
        <label htmlFor="email">Your email</label>
        <input id="email" name="email" type="email" required maxLength={200} placeholder="you@company.com" />
      </div>
      <div className="field">
        <label htmlFor="details">What would you like less of?</label>
        <textarea id="details" name="details" rows={4} maxLength={2000} placeholder="e.g. product updates, but keep the weekly digest" />
      </div>
      <button type="submit" className="btn btn-primary">Update my preferences</button>
      <p className="cox-pref-note">
        Tell us your email and what you&rsquo;d like less of, and we&rsquo;ll handle it by hand. We&rsquo;re a
        small team and don&rsquo;t have a self-serve preference center built yet — this opens an email to us with
        what you filled in, and we&rsquo;ll update it on our end. That&rsquo;s not a bug, it&rsquo;s the actual
        current process.
      </p>
    </form>
  );
}
