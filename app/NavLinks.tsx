'use client';
import { usePathname } from 'next/navigation';

// Top pill nav: the core daily workflow. Secondary tools (Ask, Compare,
// Newsletters, Reports, Alerts, Admin) live on the left icon rail instead —
// the two never duplicate each other.
const PRIMARY = [
  { label: 'Overview', href: '/feed' },
  { label: 'Competitors', href: '/competitors' },
  { label: 'Battlecards', href: '/battlecards' },
  { label: 'Radar', href: '/radar' },
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
