'use client';
// The hero device. Not a screenshot — an honest, clearly-labeled preview of
// the actual feed card component, cycling through sample rows with a ticking
// "verified Ns ago" clock. Labeled "Preview" throughout: dressing up sample
// data as live data would break the one promise this whole product makes.
import { useEffect, useState } from 'react';

interface Row {
  badge: string;
  badgeClass: string;
  competitor: string;
  title: string;
  source: string;
}

const ROWS: Row[] = [
  { badge: 'Pricing', badgeClass: 'c-pricing', competitor: 'Northwind', title: 'Starter tier dropped from $49 → $39/mo', source: 'northwind.com/pricing' },
  { badge: 'Positioning', badgeClass: 'c-news', competitor: 'Fathom Labs', title: 'New "vs Watchtower" comparison page published', source: 'fathomlabs.com/compare' },
  { badge: 'Hiring', badgeClass: 'c-hiring', competitor: 'Northwind', title: '4 senior roles opened — infra + ML, same week', source: 'northwind.com/careers' },
  { badge: 'Product', badgeClass: 'c-product', competitor: 'Fathom Labs', title: 'Changelog: SOC 2 Type II certification added', source: 'fathomlabs.com/changelog' },
];

export default function LiveFeedDemo() {
  const [seconds, setSeconds] = useState<number[]>(() => ROWS.map((_, i) => 4 + i * 37));

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((prev) => prev.map((s) => s + 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="demo-card">
      <div className="demo-head">
        <span className="demo-dot" />
        Preview — sample data, not a live workspace
      </div>
      {ROWS.map((r, i) => (
        <div className="demo-row" key={r.title}>
          <div className="demo-row-top">
            <span className={`badge ${r.badgeClass}`}>{r.badge}</span>
            <span className="demo-comp">{r.competitor}</span>
            <span className="demo-time">verified {seconds[i]}s ago</span>
          </div>
          <div className="demo-title">{r.title}</div>
          <div className="demo-source">cite: {r.source}</div>
        </div>
      ))}
    </div>
  );
}
