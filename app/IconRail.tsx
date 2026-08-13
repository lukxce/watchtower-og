'use client';
import { usePathname } from 'next/navigation';

// Slim floating icon rail on the left edge (inspo: rounded-square nav buttons
// stacked vertically). Mirrors the top pill nav's destinations; hidden on
// narrower viewports where the pills carry navigation alone.
const ITEMS: { href: string; label: string; icon: React.ReactNode }[] = [
  {
    href: '/feed', label: 'Overview',
    icon: <><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /></>,
  },
  {
    href: '/competitors', label: 'Competitors',
    icon: <><circle cx="12" cy="8" r="3.2" /><path d="M5 19c.8-3 3.5-4.6 7-4.6s6.2 1.6 7 4.6" strokeLinecap="round" /></>,
  },
  {
    href: '/battlecards', label: 'Battlecards',
    icon: <><rect x="4" y="5" width="16" height="14" rx="2.5" /><path d="M8 9.5h8M8 13h5" strokeLinecap="round" /></>,
  },
  {
    href: '/radar', label: 'Launch Radar',
    icon: <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><path d="M12 12l5.5-5.5" strokeLinecap="round" /></>,
  },
  {
    href: '/newsletters', label: 'Newsletters',
    icon: <><rect x="3.5" y="5.5" width="17" height="13" rx="2.5" /><path d="m4.5 7 7.5 6 7.5-6" strokeLinecap="round" strokeLinejoin="round" /></>,
  },
  {
    href: '/compare', label: 'Compare',
    icon: <><path d="M8 4v16M16 4v16" strokeLinecap="round" /><path d="M4 9h4M4 15h4M16 9h4M16 15h4" strokeLinecap="round" /></>,
  },
  {
    href: '/admin', label: 'Admin',
    icon: <><circle cx="12" cy="12" r="3" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" strokeLinecap="round" /></>,
  },
];

export default function IconRail() {
  const path = usePathname();
  const isOn = (href: string) => path === href || path.startsWith(href + '/');
  return (
    <aside className="irail">
      {ITEMS.map((it) => (
        <a key={it.href} href={it.href} title={it.label} aria-label={it.label} className={`irail-btn ${isOn(it.href) ? 'on' : ''}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">{it.icon}</svg>
        </a>
      ))}
    </aside>
  );
}
