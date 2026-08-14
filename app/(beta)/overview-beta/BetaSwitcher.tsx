// Tiny floating switcher, bottom-right — deliberately unobtrusive so each
// beta's own design fills the screen without our chrome polluting it.
const VARIANTS = [
  { slug: 'glass', label: 'G' },
  { slug: 'azure', label: 'A' },
  { slug: 'noir', label: 'N' },
  { slug: 'daylight', label: 'D' },
];

export default function BetaSwitcher({ active }: { active: string }) {
  return (
    <div className="beta-fab">
      {VARIANTS.map((v) => (
        <a key={v.slug} href={`/overview-beta/${v.slug}`} className={v.slug === active ? 'on' : ''} title={v.slug}>{v.label}</a>
      ))}
      <a href="/overview" className="beta-fab-live" title="Back to live Overview">live</a>
    </div>
  );
}
