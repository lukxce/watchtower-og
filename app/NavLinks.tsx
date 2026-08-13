'use client';
import { usePathname } from 'next/navigation';

// Top pill nav. Primary destinations get pills; lower-traffic and stub pages
// live under More (a no-JS <details> dropdown).
const PRIMARY = [
  { label: 'Overview', href: '/feed' },
  { label: 'Competitors', href: '/competitors' },
  { label: 'Battlecards', href: '/battlecards' },
  { label: 'Radar', href: '/radar' },
  { label: 'Newsletters', href: '/newsletters' },
];

const MORE = [
  { label: 'Compare', href: '/compare' },
  { label: 'Ask', href: '/ask' },
  { label: 'Reports', href: '/reports' },
  { label: 'Alerts', href: '/alerts' },
  { label: 'Admin', href: '/admin' },
];

export default function NavLinks() {
  const path = usePathname();
  const isOn = (href: string) => path === href || path.startsWith(href + '/');
  const moreOn = MORE.some((n) => isOn(n.href));
  return (
    <nav className="tnav">
      {PRIMARY.map((n) => (
        <a key={n.href} href={n.href} className={isOn(n.href) ? 'on' : ''}>
          {n.label}
        </a>
      ))}
      <details className="tnav-more">
        <summary className={moreOn ? 'on' : ''}>More ▾</summary>
        <div className="tnav-drop">
          {MORE.map((n) => (
            <a key={n.href} href={n.href} className={isOn(n.href) ? 'on' : ''}>
              {n.label}
            </a>
          ))}
        </div>
      </details>
    </nav>
  );
}
