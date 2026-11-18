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
/** The longest frame the tour advances for, so a stalled frame (or a hidden tab) doesn't jump the page. */
const MAX_FRAME_SECONDS = 0.1;
/** How far, in px, the page may drift from the tour's position before the tour takes the page's (scroll anchoring, a jump link). */
const RESYNC_THRESHOLD = 2;

/**
 * Automatically scrolls the page from top to bottom at a steady pace,
 * stopping as soon as the visitor scrolls, taps, clicks or presses a
 * navigation key — handing control back to them immediately.
 *
 * The position is kept as a float of its own: browsers round `scrollY` (to whole or device pixels), so at a
 * slow speed and a high refresh rate, advancing from it would lose the fraction of every frame and stall.
 * Each step scrolls with `behavior: 'instant'`, because the root's `scroll-smooth` would otherwise start a
 * smooth scroll per frame, each one cut short by the next.
 */
export function useAutoScroll({ active, speed = 60, startDelay = 0 }: UseAutoScrollOptions) {
  useEffect(() => {
    if (!active) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frameId: number | null = null;
    let startTimer: number | null = null;
    let lastTimestamp: number | null = null;
    let position = 0;
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
      if (lastTimestamp === null) {
        lastTimestamp = timestamp;
        position = window.scrollY;
      }
      const deltaSeconds = Math.min((timestamp - lastTimestamp) / 1000, MAX_FRAME_SECONDS);
      lastTimestamp = timestamp;

      if (Math.abs(window.scrollY - position) > RESYNC_THRESHOLD) position = window.scrollY;

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      position = Math.min(position + speed * deltaSeconds, maxScroll);
      window.scrollTo({ top: position, behavior: 'instant' });

      if (position >= maxScroll) {
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
