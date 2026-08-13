'use client';
import { usePathname } from 'next/navigation';

// Left icon rail: tools and secondary destinations only. The top pill nav
// owns the core workflow (Overview / Competitors / Battlecards / Radar /
// Industry) — nothing here duplicates it.
const ITEMS: { href: string; label: string; icon: React.ReactNode }[] = [
  {
    href: '/ask', label: 'Ask Watchtower',
    icon: <><path d="M4.5 6.5A2.5 2.5 0 0 1 7 4h10a2.5 2.5 0 0 1 2.5 2.5v7A2.5 2.5 0 0 1 17 16H9.5L5.5 19.5v-3.4A2.5 2.5 0 0 1 4.5 13.5Z" strokeLinejoin="round" /><path d="M9 9.5h6M9 12.5h4" strokeLinecap="round" /></>,
  },
  {
    href: '/compare', label: 'Compare',
    icon: <><path d="M8 4v16M16 4v16" strokeLinecap="round" /><path d="M4 9h4M4 15h4M16 9h4M16 15h4" strokeLinecap="round" /></>,
  },
  {
    href: '/newsletters', label: 'Newsletters & secret shopper',
    icon: <><rect x="3.5" y="5.5" width="17" height="13" rx="2.5" /><path d="m4.5 7 7.5 6 7.5-6" strokeLinecap="round" strokeLinejoin="round" /></>,
  },
  {
    href: '/reports', label: 'Reports',
    icon: <><path d="M6 4h9l4 4v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" strokeLinejoin="round" /><path d="M9 13h6M9 16h4" strokeLinecap="round" /></>,
  },
  {
    href: '/alerts', label: 'Alerts',
    icon: <><path d="M12 4a5.5 5.5 0 0 0-5.5 5.5c0 4-1.8 5.5-1.8 5.5h14.6s-1.8-1.5-1.8-5.5A5.5 5.5 0 0 0 12 4Z" strokeLinejoin="round" /><path d="M10.3 18.5a1.8 1.8 0 0 0 3.4 0" strokeLinecap="round" /></>,
  },
  {
    href: '/admin', label: 'Admin console',
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
