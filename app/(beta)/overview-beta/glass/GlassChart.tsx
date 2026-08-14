'use client';
// Interactive needle-bars + momentum-curve chart: the flag and crosshair
// follow the cursor (nearest week), defaulting to the peak week. Pure SVG,
// no chart lib — geometry mirrors the server layout so there's no jump.
import { useMemo, useRef, useState } from 'react';

export interface ChartWeek { key: string; nice: string; label: string; product: number; gtm: number; market: number }

const CW = 700, CH = 190, TOP = 64, NEEDLE = 4.5;

function smoothPath(pts: [number, number][]): string {
  if (pts.length < 2) return '';
  let dPath = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    dPath += ` C ${p1[0] + (p2[0] - p0[0]) / 6} ${p1[1] + (p2[1] - p0[1]) / 6}, ${p2[0] - (p3[0] - p1[0]) / 6} ${p2[1] - (p3[1] - p1[1]) / 6}, ${p2[0]} ${p2[1]}`;
  }
  return dPath;
}

export default function GlassChart({ weeks, maxWeek, monthTicks }: { weeks: ChartWeek[]; maxWeek: number; monthTicks: { idx: number; label: string }[] }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const totals = useMemo(() => weeks.map((w) => w.product + w.gtm + w.market), [weeks]);
  const peak = useMemo(() => totals.reduce((best, v, i) => (v > totals[best] ? i : best), 0), [totals]);
  const [hover, setHover] = useState<number | null>(null);
  const idx = hover ?? peak;

  const GAP = (CW - 30 - weeks.length * NEEDLE) / (weeks.length + 1);
  const bx = (i: number) => GAP + i * (NEEDLE + GAP);
  const by = (v: number) => TOP + (CH - TOP) * (1 - v / maxWeek);
  const barH = (t: number) => (t === 0 ? 4 : Math.max(7, (CH - TOP) * (t / maxWeek)));

  const avg = useMemo(
    () => totals.map((_, i) => {
      const s = totals.slice(Math.max(0, i - 3), i + 1);
      return s.reduce((a, b) => a + b, 0) / s.length;
    }),
    [totals],
  );
  const curvePts = useMemo<[number, number][]>(() => avg.map((v, i) => [bx(i) + NEEDLE / 2, by(v)]), [avg]); // eslint-disable-line react-hooks/exhaustive-deps
  const curve = useMemo(() => smoothPath(curvePts), [curvePts]);
  const area = `${curve} L ${curvePts[curvePts.length - 1][0]} ${CH} L ${curvePts[0][0]} ${CH} Z`;

  const w = weeks[idx];
  const flagX = Math.min(Math.max(bx(idx) - 62, 4), CW - 178);

  function onMove(e: React.MouseEvent<SVGSVGElement>) {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * CW;
    let nearest = 0, best = Infinity;
    for (let i = 0; i < weeks.length; i++) {
      const dist = Math.abs(bx(i) + NEEDLE / 2 - x);
      if (dist < best) { best = dist; nearest = i; }
    }
    setHover(nearest);
  }

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${CW} ${CH + 30}`}
      className="gx-chart live"
      aria-label="Weekly events with momentum curve — hover to inspect"
      onMouseMove={onMove}
      onMouseLeave={() => setHover(null)}
    >
      {monthTicks.map((t) => (
        <text key={t.idx} x={bx(t.idx)} y={14} className="gx-wlab">{t.label}</text>
      ))}
      {[0.33, 0.66, 1].map((f) => (
        <text key={f} x={CW - 2} y={by(maxWeek * f) + 3} className="gx-ytick">{Math.round(maxWeek * f)}</text>
      ))}
      <path d={area} className="gx-area" />
      {weeks.map((wk, i) => (
        <rect
          key={wk.key}
          x={bx(i)}
          y={CH - barH(totals[i])}
          width={NEEDLE}
          height={barH(totals[i])}
          rx={2.2}
          className={i === idx ? 'gx-needle hi' : 'gx-needle'}
        />
      ))}
      <path d={curve} className="gx-curve" />
      <g className="gx-flag">
        <line x1={bx(idx) + NEEDLE / 2} y1={84} x2={bx(idx) + NEEDLE / 2} y2={CH - barH(totals[idx])} />
        <rect x={flagX} y={20} width={172} height={62} rx={12} />
        <text x={flagX + 13} y={38} className="gx-flag-d">Week of {w.nice}</text>
        <rect x={flagX + 11} y={45} width={8} height={8} rx={2.5} className="fr1" />
        <text x={flagX + 24} y={52.5} className="gx-flag-r">{totals[idx]} event{totals[idx] === 1 ? '' : 's'}</text>
        <rect x={flagX + 11} y={59} width={8} height={8} rx={2.5} className="fr2" />
        <text x={flagX + 24} y={66.5} className="gx-flag-r">{w.gtm} gtm · {w.market} market · {w.product} product</text>
      </g>
    </svg>
  );
}
