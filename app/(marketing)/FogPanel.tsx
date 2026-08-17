'use client';
import { useRef, useState } from 'react';

// The pitch, as an interaction: your market is dark, and the tower's light is
// the only thing that reveals it. The veil covers everything and its mask cuts
// one soft circular hole; the pointer moves the hole, and an idle CSS sweep
// moves it otherwise so touch users still see the idea.
const FINDS = [
  { x: 6,  y: 16, tag: 'buildout', text: 'voice.klue.com appeared on the certificate log' },
  { x: 52, y: 8,  tag: 'hiring',   text: 'crayon.co opened 3 roles' },
  { x: 30, y: 44, tag: 'the tower', text: '“Kompyte is absorbed into Semrush”', hot: true },
  { x: 68, y: 40, tag: 'ads',      text: 'Visualping is running ~11 Google ads' },
  { x: 10, y: 72, tag: 'signal',   text: 'kompyte.com/careers returns 404' },
  { x: 58, y: 74, tag: 'pricing',  text: 'Signal Labs still quotes Team on a call' },
];

export default function FogPanel() {
  const ref = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState(false);

  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
    if (!lit) setLit(true);
  };

  return (
    <div
      ref={ref}
      className={`fog${lit ? ' lit' : ''}`}
      onPointerMove={move}
      onPointerLeave={() => setLit(false)}
    >
      {FINDS.map((f) => (
        <div className={`fog-find${f.hot ? ' hot' : ''}`} key={f.text} style={{ left: `${f.x}%`, top: `${f.y}%` }}>
          <span className="fog-tag mono">{f.tag}</span>
          <span>{f.text}</span>
        </div>
      ))}
      <div className="fog-veil" aria-hidden="true" />
    </div>
  );
}
