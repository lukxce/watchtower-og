// Shared strip across all four design-test pages so it's one click to
// compare them side by side, plus a way back to the live Overview.
const VARIANTS = [
  { slug: 'glass', label: '1 · Glass' },
  { slug: 'azure', label: '2 · Azure' },
  { slug: 'noir', label: '3 · Noir' },
  { slug: 'daylight', label: '4 · Daylight' },
];

export default function BetaSwitcher({ active }: { active: string }) {
  return (
    <div className="beta-switcher">
      <span className="beta-switcher-label">Design test — real data, four skins</span>
      <div className="beta-switcher-links">
        {VARIANTS.map((v) => (
          <a key={v.slug} href={`/overview-beta/${v.slug}`} className={v.slug === active ? 'on' : ''}>{v.label}</a>
        ))}
        <a href="/overview" className="beta-switcher-live">← Live Overview</a>
      </div>
    </div>
  );
}
