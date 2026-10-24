'use client';

import { useEffect, useRef, useState } from 'react';
import { formatBRL } from '@/utils/currency';

interface AnimatedMoneyProps {
  value: number;
  hidden?: boolean;
  duration?: number;
}

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export function AnimatedMoney({ value, hidden = false, duration = 700 }: AnimatedMoneyProps) {
  const [shown, setShown] = useState(value);
  const previous = useRef(value);

  useEffect(() => {
    const from = previous.current;
    previous.current = value;
    if (from === value) return;

    const reduced = prefersReducedMotion();
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = reduced ? 1 : Math.min(1, (now - start) / duration);
      setShown(from + (value - from) * easeOut(progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  if (hidden) return <>••••••</>;
  return <>{formatBRL(shown)}</>;
}
