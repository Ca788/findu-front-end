'use client';

import { useEffect, useState } from 'react';

export function useKeyboardInset(): { inset: number; isOpen: boolean } {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const viewport = window.visualViewport;
    if (!viewport) return;

    const update = () => {
      const overlap = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
      setInset(overlap > 80 ? overlap : 0);
    };

    update();
    viewport.addEventListener('resize', update);
    viewport.addEventListener('scroll', update);
    window.addEventListener('resize', update);

    return () => {
      viewport.removeEventListener('resize', update);
      viewport.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return { inset, isOpen: inset > 0 };
}
