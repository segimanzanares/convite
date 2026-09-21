import { useEffect } from 'react';

interface UseAutoScrollOptions {
  /** Whether the auto-scroll tour should be running. */
  active: boolean;
  /** Scroll speed in pixels per second. */
  speed?: number;
  /** Delay in ms before the tour starts once activated. */
  startDelay?: number;
}

const CANCEL_EVENTS = ['wheel', 'touchstart', 'pointerdown'] as const;
const SCROLL_KEYS = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '];

/**
 * Automatically scrolls the page from top to bottom at a steady pace,
 * stopping as soon as the visitor scrolls, taps, clicks or presses a
 * navigation key — handing control back to them immediately.
 */
export function useAutoScroll({ active, speed = 60, startDelay = 0 }: UseAutoScrollOptions) {
  useEffect(() => {
    if (!active) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frameId: number | null = null;
    let startTimer: number | null = null;
    let lastTimestamp: number | null = null;
    let stopped = false;

    const stop = () => {
      if (stopped) return;
      stopped = true;
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      if (startTimer !== null) window.clearTimeout(startTimer);
      CANCEL_EVENTS.forEach((type) => window.removeEventListener(type, stop));
      window.removeEventListener('keydown', handleKeydown);
    };

    const handleKeydown = (event: KeyboardEvent) => {
      if (SCROLL_KEYS.includes(event.key)) stop();
    };

    const step = (timestamp: number) => {
      if (stopped) return;
      if (lastTimestamp === null) lastTimestamp = timestamp;
      const deltaSeconds = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const next = Math.min(window.scrollY + speed * deltaSeconds, maxScroll);
      window.scrollTo(0, next);

      if (next >= maxScroll) {
        stop();
        return;
      }
      frameId = window.requestAnimationFrame(step);
    };

    CANCEL_EVENTS.forEach((type) => window.addEventListener(type, stop, { passive: true }));
    window.addEventListener('keydown', handleKeydown);

    startTimer = window.setTimeout(() => {
      if (!stopped) frameId = window.requestAnimationFrame(step);
    }, startDelay);

    return stop;
  }, [active, speed, startDelay]);
}
