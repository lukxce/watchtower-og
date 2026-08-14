'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

// Top nav, kept short: the five surfaces someone actually lives in, plus
// Mentions. Everything occasional (Ask, stubs, Admin) sits behind "More".
// Channel shortcuts live on the persistent left rail (ChannelRail.tsx) —
// the two never overlap in purpose. /competitors was folded into
// Battlecards: one place per competitor, not two.
const PAGES = [
  { label: 'Overview', href: '/overview' },
  { label: 'Feed', href: '/feed' },
  { label: 'Battlecards', href: '/battlecards' },
  { label: 'Radar', href: '/radar' },
  { label: 'Industry', href: '/industry' },
  { label: 'Mentions', href: '/mentions' },
];
const MORE = [
  { label: 'Ask', href: '/ask' },
  { label: 'Newsletters', href: '/newsletters' },
  { label: 'Reports', href: '/reports' },
  { label: 'Alerts', href: '/alerts' },
  { label: 'Admin', href: '/admin' },
];

export default function NavLinks() {
  const path = usePathname();
  const ref = useRef<HTMLDetailsElement>(null);
  const isOn = (href: string) => path === href || path.startsWith(href + '/');
  const moreOn = MORE.some((m) => isOn(m.href));
  // Close the dropdown when navigating away (links are full navigations, but
  // soft transitions keep the DOM alive).
  useEffect(() => {
    ref.current?.removeAttribute('open');
  }, [path]);
  return (
    <nav className="tnav">
      {PAGES.map((n) => (
        <Link key={n.href} href={n.href} className={isOn(n.href) ? 'on' : ''}>
          {n.label}
        </Link>
      ))}
      <details className="tnav-more" ref={ref}>
        <summary className={moreOn ? 'on' : ''}>More ▾</summary>
        <div className="tnav-menu">
          {MORE.map((n) => (
            <Link key={n.href} href={n.href} className={isOn(n.href) ? 'on' : ''}>
              {n.label}
            </Link>
          ))}
        </div>
      </details>
    </nav>
  );
}
