import type { BlogPost } from '@/lib/blog';

// Generated cover art, one per post. Stock photography would say nothing and
// would be the fastest way to make the blog look like every other SaaS blog;
// these are drawn from the subject of the piece — a certificate log, a 404,
// an ad grid — in the product's own palette.
export default function BlogCover({ cover, className = '' }: { cover: BlogPost['cover']; className?: string }) {
  const art = {
    // hostnames appearing on a transparency log, one of them the find
    certlog: (
      <>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x="26" y={30 + i * 22} width={i === 3 ? 150 : 78 + ((i * 37) % 70)} height="8" rx="4"
            fill="currentColor" opacity={i === 3 ? 0 : 0.16} />
        ))}
        <rect x="26" y="96" width="150" height="8" rx="4" fill="#eafd35" />
        <rect x="188" y="96" width="34" height="8" rx="4" fill="#eafd35" opacity=".45" />
        <text x="26" y="176" fontFamily="ui-monospace, monospace" fontSize="11" fill="currentColor" opacity=".45">
          interviewer-v2
        </text>
      </>
    ),
    // two gaps where something should be
    absence: (
      <>
        {[0, 1, 2, 3].map((r) =>
          [0, 1, 2, 3, 4].map((c) => {
            const missing = (r === 1 && c === 3) || (r === 2 && c === 1);
            return (
              <rect key={`${r}-${c}`} x={26 + c * 46} y={34 + r * 38} width="34" height="26" rx="5"
                fill={missing ? 'none' : 'currentColor'} opacity={missing ? 1 : 0.14}
                stroke={missing ? '#eafd35' : 'none'} strokeWidth="2" strokeDasharray="4 3" />
            );
          }),
        )}
      </>
    ),
    // ad inventory, wildly uneven
    adgrid: (
      <>
        {[54, 12, 48, 4, 40].map((h, i) => (
          <rect key={i} x={30 + i * 44} y={160 - h * 2} width="30" height={h * 2} rx="5"
            fill={i === 0 ? '#eafd35' : 'currentColor'} opacity={i === 0 ? 1 : 0.18} />
        ))}
        <rect x="26" y="168" width="200" height="2" rx="1" fill="currentColor" opacity=".2" />
      </>
    ),
    // a page changing vs a claim changing
    diff: (
      <>
        <rect x="26" y="34" width="92" height="120" rx="8" fill="currentColor" opacity=".1" />
        <rect x="134" y="34" width="92" height="120" rx="8" fill="currentColor" opacity=".1" />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x="40" y={54 + i * 24} width={64 - i * 8} height="7" rx="3.5" fill="currentColor" opacity=".22" />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x="148" y={54 + i * 24} width={64 - i * 8} height="7" rx="3.5"
            fill={i === 1 ? '#eafd35' : 'currentColor'} opacity={i === 1 ? 1 : 0.22} />
        ))}
      </>
    ),
    // the comparison page: them, and you
    versus: (
      <>
        <rect x="26" y="40" width="88" height="108" rx="8" fill="currentColor" opacity=".12" />
        <rect x="138" y="40" width="88" height="108" rx="8" fill="#eafd35" opacity=".5" />
        <text x="126" y="100" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="15"
              fill="currentColor" opacity=".5">vs</text>
      </>
    ),
    // a price that is never shown
    redacted: (
      <>
        <rect x="26" y="52" width="120" height="10" rx="5" fill="currentColor" opacity=".16" />
        <rect x="26" y="80" width="176" height="26" rx="6" fill="currentColor" opacity=".82" />
        <rect x="26" y="124" width="86" height="10" rx="5" fill="currentColor" opacity=".16" />
        <rect x="26" y="146" width="62" height="10" rx="5" fill="#eafd35" />
      </>
    ),
  }[cover];

  return (
    <svg className={className} viewBox="0 0 252 190" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      {art}
    </svg>
  );
}
