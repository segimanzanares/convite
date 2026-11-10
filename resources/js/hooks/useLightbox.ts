import { useCallback, useEffect, useState } from 'react';

export function useLightbox(itemCount: number) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const open = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const navigate = useCallback(
    (direction: 1 | -1) => {
      setCurrentIndex((prev) => (prev + direction + itemCount) % itemCount);
    },
    [itemCount],
  );

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowLeft') navigate(-1);
      if (event.key === 'ArrowRight') navigate(1);
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, close, navigate]);

  return { isOpen, currentIndex, open, close, navigate };
}
