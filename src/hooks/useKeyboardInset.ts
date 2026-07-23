'use client';

import { useEffect, useState } from 'react';

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
  return target.isContentEditable;
}

export function useKeyboardInset(): { inset: number; isOpen: boolean } {
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onFocusIn = (event: FocusEvent) => {
      if (isEditableTarget(event.target)) setFocused(true);
    };

    const onFocusOut = () => {
      window.setTimeout(() => {
        setFocused(isEditableTarget(document.activeElement));
      }, 80);
    };

    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('focusout', onFocusOut);

    return () => {
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('focusout', onFocusOut);
    };
  }, []);

  return {
    inset: 0,
    isOpen: focused,
  };
}
