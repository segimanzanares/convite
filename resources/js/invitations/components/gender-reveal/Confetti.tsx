import type { CSSProperties } from 'react';
import { cn } from '../ui/styles';
import './confetti.css';

interface ConfettiProps {
  /** CSS variables of the pieces' colors, e.g. ['--girl', '--boy']. */
  colors: string[];
  count?: number;
  /** "rain" falls over and over across the box; "burst" bursts once from its center. */
  mode?: 'rain' | 'burst';
  className?: string;
}

/** Deterministic pseudo-random numbers, so the pieces land in the same places on every render. */
function noise(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

/**
 * Confetti for the gender reveal templates: paper strips and dots in the given colors. It is decorative, ignores the
 * pointer and stops for visitors who prefer reduced motion.
 */
export function Confetti({ colors, count = 36, mode = 'rain', className }: ConfettiProps) {
  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden="true">
      {Array.from({ length: count }, (_, index) => {
        const angle = noise(index + 1) * Math.PI * 2;
        const reach = 30 + noise(index + 7) * 70;
        const style = {
          '--x': `${(noise(index + 3) * 100).toFixed(2)}%`,
          '--dx': `${(Math.cos(angle) * reach).toFixed(1)}vmin`,
          '--dy': `${(Math.sin(angle) * reach).toFixed(1)}vmin`,
          '--spin': `${Math.round(noise(index + 5) * 720 - 360)}deg`,
          '--wait': `${(noise(index + 9) * (mode === 'rain' ? 6 : 0.25)).toFixed(2)}s`,
          '--every': `${(4 + noise(index + 11) * 4).toFixed(2)}s`,
          backgroundColor: `var(${colors[index % colors.length]})`,
        } as CSSProperties;

        return <span key={index} className={cn('confetti-piece', mode === 'burst' ? 'confetti-burst' : 'confetti-rain', index % 3 === 0 && 'confetti-dot')} style={style} />;
      })}
    </div>
  );
}
