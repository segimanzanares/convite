import type { CSSProperties } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import './floral-art.css';

/**
 * Plays the animated flower ornaments of the floral templates (floral-art.css). An ornament's root gets the
 * class `floral-art`, and each piece one of the `floral-*` classes and its own delay: the pieces wait hidden
 * until the root turns `is-playing`, then grow one after another and keep a slow motion.
 */
export interface ArtProps {
  className?: string;
  /** When given, the ornament grows once this turns true instead of when it scrolls into view. */
  play?: boolean;
  /** Seconds added to every piece's delay. */
  delay?: number;
}

/** The CSS variable with the delay, in seconds, after which a piece starts to grow. */
export function delayStyle(delay: number): CSSProperties {
  return { '--d': `${delay}s` } as CSSProperties;
}

/** The ref, class names and style of an ornament's root. */
export function useArt<T extends Element>({ play, delay = 0 }: ArtProps) {
  const { ref, isVisible } = useScrollReveal<T>(0.25);
  const isPlaying = play ?? isVisible;

  return {
    ref,
    artClass: `floral-art${isPlaying ? ' is-playing' : ''}`,
    artStyle: { '--d0': `${delay}s` } as CSSProperties,
  };
}
