'use client';
import { usePathname } from 'next/navigation';

const NAV = [
  { label: 'Feed', href: '/feed' },
  { label: 'Launch Radar', href: '/radar' },
  { label: 'Competitors', href: '/competitors' },
  { label: 'Compare', href: '/compare' },
  { label: 'Battlecards', href: '/battlecards' },
  { label: 'Ask', href: '/ask' },
  { label: 'Newsletters', href: '/newsletters' },
  { label: 'Reports', href: '/reports' },
  { label: 'Alerts', href: '/alerts' },
  { label: 'Admin', href: '/admin' },
];

export default function NavLinks() {
  const path = usePathname();
  return (
    <nav>
      {NAV.map((n) => {
        const on = path === n.href || path.startsWith(n.href + '/');
        return (
          <a key={n.href} href={n.href} className={on ? 'on' : ''}>
            {n.label}
          </a>
        );
      })}
    </nav>
  );
}
