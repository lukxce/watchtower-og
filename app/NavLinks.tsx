'use client';
import { usePathname } from 'next/navigation';

// Top pill nav: the core daily surfaces. Secondary tools live as icons on the
// right of the top bar (TopTools) — the two never duplicate each other.
const PRIMARY = [
  { label: 'Overview', href: '/overview' },
  { label: 'Feed', href: '/feed' },
  { label: 'Competitors', href: '/competitors' },
  { label: 'Battlecards', href: '/battlecards' },
  { label: 'Industry', href: '/industry' },
];

export default function NavLinks() {
  const path = usePathname();
  const isOn = (href: string) => path === href || path.startsWith(href + '/');
  return (
    <nav className="tnav">
      {PRIMARY.map((n) => (
        <a key={n.href} href={n.href} className={isOn(n.href) ? 'on' : ''}>
          {n.label}
        </a>
      ))}
    </nav>
  );
}
