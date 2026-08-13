'use client';
import { usePathname } from 'next/navigation';

// Top nav: every page, as it was before the pill/icon split. Channel
// shortcuts live on the persistent left rail instead (ChannelRail.tsx) —
// the two never overlap in purpose.
const PAGES = [
  { label: 'Overview', href: '/overview' },
  { label: 'Feed', href: '/feed' },
  { label: 'Competitors', href: '/competitors' },
  { label: 'Battlecards', href: '/battlecards' },
  { label: 'Launch Radar', href: '/radar' },
  { label: 'Industry', href: '/industry' },
  { label: 'Ask', href: '/ask' },
  { label: 'Newsletters', href: '/newsletters' },
  { label: 'Reports', href: '/reports' },
  { label: 'Alerts', href: '/alerts' },
  { label: 'Admin', href: '/admin' },
];

export default function NavLinks() {
  const path = usePathname();
  const isOn = (href: string) => path === href || path.startsWith(href + '/');
  return (
    <nav className="tnav">
      {PAGES.map((n) => (
        <a key={n.href} href={n.href} className={isOn(n.href) ? 'on' : ''}>
          {n.label}
        </a>
      ))}
    </nav>
  );
}
