'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const LINKS = [
  { href: '/#platform', label: 'Product' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Lock the page behind the sheet, and let Escape close it.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', esc);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', esc); };
  }, [open]);

  // The header pill carries a backdrop-filter, which makes it the containing
  // block for anything position:fixed inside it — the backdrop came out 52px
  // tall and taps fell straight through to the page. The overlay has to hang
  // off <body>, not off the header.
  const overlay = open && (
    <>
      <div className="mnav-backdrop" onClick={() => setOpen(false)} aria-hidden="true" />
      <div className="mnav-sheet" role="dialog" aria-modal="true">
        <nav>
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</Link>
          ))}
        </nav>
        <div className="mnav-cta">
          <Link href="/sign-in" className="btn btn-ghost btn-lg" onClick={() => setOpen(false)}>Sign in</Link>
          <Link href="/sign-up" className="btn btn-primary btn-lg" onClick={() => setOpen(false)}>Start free</Link>
        </div>
      </div>
    </>
  );

  return (
    <>
      <button
        className={`mnav-btn${open ? ' on' : ''}`}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span /><span /><span />
      </button>

      {mounted && overlay ? createPortal(overlay, document.body) : null}
    </>
  );
}
