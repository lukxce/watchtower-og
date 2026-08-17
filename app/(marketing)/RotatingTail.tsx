'use client';
import { useEffect, useState } from 'react';

// The hero headline finishes itself, over and over. This is the whole
// "what does it watch" pitch without a feature list: the sentence just
// keeps landing somewhere new.
//
// Every phrase is kept to ~15 characters on purpose. The sweep is
// white-space:nowrap (see .wt-tail), so a phrase that does not fit moves
// to the next line WHOLE rather than splitting into a two-line yellow
// slab. Short phrases plus nowrap is what keeps the headline at a stable
// two lines from a 320px phone up to desktop.
const TAILS = [
  'cut a price.',
  'mention you.',
  'ship something.',
  'launch an ad.',
  'get a review.',
  'open roles.',
  'raise a round.',
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
