'use client';

import { useEffect, useState } from 'react';

function readKeyboardInset(): number {
  const viewport = window.visualViewport;
  if (!viewport) return 0;
  const overlap = window.innerHeight - viewport.height - viewport.offsetTop;
  return overlap > 120 ? Math.round(overlap) : 0;
}

export function useKeyboardInset(): { inset: number; isOpen: boolean } {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const update = () => {
      const next = readKeyboardInset();
      setInset((current) => (current === next ? current : next));
    };

    update();
    viewport.addEventListener('resize', update);
    viewport.addEventListener('scroll', update);
    return () => {
      viewport.removeEventListener('resize', update);
      viewport.removeEventListener('scroll', update);
    };
  }, []);

  return { inset, isOpen: inset > 0 };
}
