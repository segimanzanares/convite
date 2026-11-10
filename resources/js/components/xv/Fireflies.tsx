import { useMemo } from 'react';

interface Firefly {
  id: number;
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
  driftX: number;
  driftY: number;
}

// Deterministic pseudo-random so the layout is stable across renders and
// identical between the prerendered HTML and the hydrated page.
function seeded(index: number, salt: number) {
  const x = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function buildFireflies(count: number): Firefly[] {
  return Array.from({ length: count }, (_, id) => ({
    id,
    left: seeded(id, 1) * 100,
    top: seeded(id, 2) * 100,
    size: 3 + seeded(id, 3) * 4,
    delay: seeded(id, 4) * 6,
    duration: 4 + seeded(id, 5) * 5,
    driftX: (seeded(id, 6) - 0.5) * 50,
    driftY: -10 - seeded(id, 7) * 30,
  }));
}

interface FirefliesProps {
  count?: number;
  className?: string;
}

/** Softly glowing dots that drift in place, for the enchanted-garden scenes. */
export function Fireflies({ count = 18, className = '' }: FirefliesProps) {
  const fireflies = useMemo(() => buildFireflies(count), [count]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      {fireflies.map((fly) => (
        <span
          key={fly.id}
          className="absolute rounded-full opacity-0 bg-gold-light animate-[fireflyGlow_6s_ease-in-out_infinite] motion-reduce:animate-none motion-reduce:opacity-60"
          style={{
            left: `${fly.left}%`,
            top: `${fly.top}%`,
            width: fly.size,
            height: fly.size,
            animationDelay: `${fly.delay}s`,
            animationDuration: `${fly.duration}s`,
            boxShadow: `0 0 ${fly.size * 3}px ${fly.size}px color-mix(in srgb, var(--gold-light) 55%, transparent)`,
            ['--drift-x' as string]: `${fly.driftX}px`,
            ['--drift-y' as string]: `${fly.driftY}px`,
          }}
        />
      ))}
    </div>
  );
}
