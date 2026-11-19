import { useEffect, useState } from 'react';

/**
 * The state of a gender reveal template's first screen: it locks the page scroll until the visitor opens it, plays
 * its closing animation for `closeMs` and then goes away, calling `onOpened`.
 */
export function useIntro(closeMs: number, onOpened?: () => void) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isHidden ? '' : 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isHidden]);

  useEffect(() => {
    if (!isOpen) return;
    const timer = window.setTimeout(() => setIsHidden(true), closeMs);
    return () => window.clearTimeout(timer);
  }, [isOpen, closeMs]);

  useEffect(() => {
    if (isHidden) onOpened?.();
  }, [isHidden, onOpened]);

  return { isOpen, isHidden, open: () => setIsOpen(true) };
}
