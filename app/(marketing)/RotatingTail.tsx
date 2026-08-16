'use client';
import { useEffect, useState } from 'react';

// The hero headline finishes itself, over and over. This is the whole
// "what does it watch" pitch without a feature list: the sentence just
// keeps landing somewhere new. Phrases stay short so the marker sweep
// never wraps to a second line (a wrapped sweep reads as a yellow block,
// not a highlight).
const TAILS = [
  'cut a price.',
  'mention you by name.',
  'start building something.',
  'change the pitch.',
  'go quiet.',
];

export default function RotatingTail() {
  const [i, setI] = useState(0);
  const [on, setOn] = useState(true);

  useEffect(() => {
    const hold = setInterval(() => {
      setOn(false);
      setTimeout(() => {
        setI((n) => (n + 1) % TAILS.length);
        setOn(true);
      }, 260);
    }, 2600);
    return () => clearInterval(hold);
  }, []);

  return (
    <span className="wt-tail-slot">
      <span className={`wt-tail${on ? ' on' : ''}`}>{TAILS[i]}</span>
    </span>
  );
}
