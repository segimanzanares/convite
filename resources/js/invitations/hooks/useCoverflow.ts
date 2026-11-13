import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
import { useLightbox } from './useLightbox';

const SWIPE_THRESHOLD_PX = 40;

/**
 * Per-position look of a slide relative to the active one. Horizontal offsets
 * come from --step / --step-far, which the stage sets per breakpoint.
 */
const POSITION_STYLES: Record<number, CSSProperties> = {
  0: { transform: 'translateX(-50%) scale(1)', opacity: 1, filter: 'brightness(1) blur(0)', zIndex: 4 },
  [-1]: { transform: 'translateX(calc(-50% - var(--step))) translateY(30px) scale(0.8)', opacity: 0.67, filter: 'brightness(0.85) blur(1px)', zIndex: 2 },
  1: { transform: 'translateX(calc(-50% + var(--step))) translateY(30px) scale(0.8)', opacity: 0.67, filter: 'brightness(0.85) blur(1px)', zIndex: 2 },
  [-2]: { transform: 'translateX(calc(-50% - var(--step-far))) translateY(55px) scale(0.66)', opacity: 0.23, filter: 'brightness(0.8) blur(2px)', zIndex: 1 },
  2: { transform: 'translateX(calc(-50% + var(--step-far))) translateY(55px) scale(0.66)', opacity: 0.23, filter: 'brightness(0.8) blur(2px)', zIndex: 1 },
};
const HIDDEN_LEFT: CSSProperties = { transform: 'translateX(calc(-50% - var(--step-far) * 1.4)) translateY(70px) scale(0.55)', opacity: 0, filter: 'blur(3px)', zIndex: 0 };
const HIDDEN_RIGHT: CSSProperties = { transform: 'translateX(calc(-50% + var(--step-far) * 1.4)) translateY(70px) scale(0.55)', opacity: 0, filter: 'blur(3px)', zIndex: 0 };

/** Signed distance from the active slide, wrapping around so the carousel is circular. */
function relativePosition(index: number, active: number, count: number) {
  let pos = (index - active) % count;
  if (pos > count / 2) pos -= count;
  if (pos < -count / 2) pos += count;
  return pos;
}

/**
 * State of a coverflow carousel: one large slide in the middle, its neighbours smaller, lower and softly blurred on
 * each side. It navigates with swipes and the keyboard (spread `stageProps` on the stage), advances on its own while
 * visible, and opens the active slide in a lightbox. Templates only render the markup.
 */
export function useCoverflow(count: number, autoplayMs: number) {
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const swipeStartX = useRef<number | null>(null);
  // A swipe ends with a click on the slide under the finger; this swallows it.
  const suppressClick = useRef(false);
  const lightbox = useLightbox(count);

  const go = useCallback((direction: 1 | -1) => setActive((prev) => (prev + direction + count) % count), [count]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.4 });
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  // Restarts whenever `active` changes, so a manual move also resets the countdown.
  useEffect(() => {
    if (!autoplayMs || !inView || paused || lightbox.isOpen || count < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setTimeout(() => go(1), autoplayMs);
    return () => window.clearTimeout(timer);
  }, [active, autoplayMs, inView, paused, lightbox.isOpen, count, go]);

  const stageProps = {
    ref: stageRef,
    tabIndex: 0,
    role: 'region',
    'aria-roledescription': 'carrusel',
    'aria-label': 'Galería de fotografías. Usa las flechas del teclado para cambiar de foto.',
    onKeyDown: (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') go(-1);
      if (event.key === 'ArrowRight') go(1);
    },
    onPointerDown: (event: PointerEvent) => {
      swipeStartX.current = event.clientX;
    },
    onPointerUp: (event: PointerEvent) => {
      if (swipeStartX.current === null) return;
      const delta = event.clientX - swipeStartX.current;
      swipeStartX.current = null;
      if (Math.abs(delta) <= SWIPE_THRESHOLD_PX) return;
      go(delta < 0 ? 1 : -1);
      suppressClick.current = true;
      // If no click follows (e.g. the pointer left the slide), don't swallow the next real one.
      window.setTimeout(() => {
        suppressClick.current = false;
      }, 0);
    },
    onPointerCancel: () => {
      swipeStartX.current = null;
    },
    onMouseEnter: () => setPaused(true),
    onMouseLeave: () => setPaused(false),
  };

  /** Where slide `index` sits: its inline style, and whether it is the active one or near enough to click. */
  const slide = (index: number) => {
    const pos = relativePosition(index, active, count);
    return {
      style: POSITION_STYLES[pos] ?? (pos < 0 ? HIDDEN_LEFT : HIDDEN_RIGHT),
      isActive: pos === 0,
      isNear: Math.abs(pos) <= 2,
      onClick: () => {
        if (suppressClick.current) {
          suppressClick.current = false;
          return;
        }
        if (pos === 0) lightbox.open(index);
        else setActive(index);
      },
    };
  };

  return { active, setActive, go, stageProps, slide, lightbox };
}
