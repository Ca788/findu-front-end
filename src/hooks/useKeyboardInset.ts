'use client';

import { useEffect, useRef, useState } from 'react';

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
  return target.isContentEditable;
}

export function useKeyboardInset(): { inset: number; isOpen: boolean } {
  const [inset, setInset] = useState(0);
  const [focused, setFocused] = useState(false);
  const baselineRef = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    baselineRef.current = window.innerHeight;

    const measureInset = () => {
      const viewport = window.visualViewport;
      const vvOverlap = viewport
        ? Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop)
        : 0;
      const shrink = Math.max(0, baselineRef.current - window.innerHeight);
      const next = Math.max(vvOverlap, shrink > 100 ? shrink : 0);
      setInset(next);
    };

    const refreshBaseline = () => {
      if (!isEditableTarget(document.activeElement)) {
        baselineRef.current = Math.max(baselineRef.current, window.innerHeight);
      }
      measureInset();
    };

    const onFocusIn = (event: FocusEvent) => {
      if (isEditableTarget(event.target)) {
        setFocused(true);
        window.setTimeout(measureInset, 80);
      }
    };

    const onFocusOut = () => {
      window.setTimeout(() => {
        const stillEditing = isEditableTarget(document.activeElement);
        setFocused(stillEditing);
        if (!stillEditing) {
          baselineRef.current = window.innerHeight;
          setInset(0);
        }
      }, 80);
    };

    measureInset();
    window.visualViewport?.addEventListener('resize', measureInset);
    window.visualViewport?.addEventListener('scroll', measureInset);
    window.addEventListener('resize', refreshBaseline);
    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('focusout', onFocusOut);

    return () => {
      window.visualViewport?.removeEventListener('resize', measureInset);
      window.visualViewport?.removeEventListener('scroll', measureInset);
      window.removeEventListener('resize', refreshBaseline);
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('focusout', onFocusOut);
    };
  }, []);

  return {
    inset,
    isOpen: focused || inset > 0,
  };
}
