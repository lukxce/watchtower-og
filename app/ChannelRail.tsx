'use client';
import { usePathname, useSearchParams } from 'next/navigation';

// Persistent left rail: shortcuts into the Feed filtered by category. Present
// on every app page (not scoped to /feed), so it's always one click to
// "what changed on pricing" etc. Top nav owns full page navigation instead.
const CHANNELS: { label: string; cat?: string; icon: React.ReactNode }[] = [
  { label: 'All', icon: <><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /></> },
  { label: 'Pricing', cat: 'Pricing', icon: <path d="M12 3v18M7 7.5c0-1.4 2.2-2.5 5-2.5s5 1.1 5 2.5-2.2 2.5-5 2.5-5 1.1-5 2.5 2.2 2.5 5 2.5 5 1.1 5 2.5" strokeLinecap="round" /> },
  { label: 'Product', cat: 'Product', icon: <><path d="M5 19c1.5-4.5 3-7.5 7-11.5 2.5-2.5 6-3 7-2s.5 4.5-2 7C13 16.5 10 18 5.5 19.5Z" strokeLinejoin="round" /><path d="M9 15l-1.5 4M15 9l4-1.5" strokeLinecap="round" /></> },
  { label: 'Hiring', cat: 'Hiring', icon: <><circle cx="12" cy="8" r="3.2" /><path d="M5 19c.8-3 3.5-4.6 7-4.6s6.2 1.6 7 4.6" strokeLinecap="round" /></> },
  { label: 'Ads', cat: 'Ads', icon: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /></> },
  { label: 'News', cat: 'News', icon: <><rect x="4" y="5" width="16" height="14" rx="2" /><path d="M8 9.5h8M8 13h5" strokeLinecap="round" /></> },
  { label: 'Reviews', cat: 'Reviews', icon: <path d="M12 3.5l2.5 5.2 5.7.7-4.2 3.9 1.1 5.6-5.1-2.8-5.1 2.8 1.1-5.6L3.8 9.4l5.7-.7Z" strokeLinejoin="round" /> },
];

export default function ChannelRail() {
  const path = usePathname();
  const params = useSearchParams();
  const activeCat = params.get('cat');
  const comp = params.get('comp');

  const href = (cat?: string) => {
    const p = new URLSearchParams();
    if (cat) p.set('cat', cat);
    if (comp) p.set('comp', comp);
    const s = p.toString();
    return s ? `/feed?${s}` : '/feed';
  };
  const isOn = (cat?: string) => path === '/feed' && ((!cat && !activeCat) || cat === activeCat);

  return (
    <aside className="side-rail">
      {CHANNELS.map((c) => (
        <a key={c.label} href={href(c.cat)} title={c.label} className={`side-item ${isOn(c.cat) ? 'on' : ''}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">{c.icon}</svg>
          <span>{c.label}</span>
        </a>
      ))}
    </aside>
  );
}
