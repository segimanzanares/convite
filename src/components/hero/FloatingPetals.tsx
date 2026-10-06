import { usePetals } from '../../hooks/usePetals';

export function FloatingPetals() {
  const petals = usePetals();

  return (
    // Clipping container: petals near the right edge (left ≈ 100vw) and their
    // rotation would otherwise overflow the viewport and widen the page on mobile.
    <div className="absolute top-0 inset-x-0 h-screen overflow-hidden pointer-events-none z-[1000]" aria-hidden="true">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute opacity-0 animate-[floatDown_12s_infinite_ease-in-out] pointer-events-none text-gold z-[1000]"
          style={{
            left: `${petal.left}vw`,
            top: '-20px',
            animationDelay: `${petal.animationDelay}s`,
            animationDuration: `${petal.animationDuration}s`,
            fontSize: `${petal.fontSize}px`,
          }}
        >
          {petal.symbol}
        </div>
      ))}
    </div>
  );
}
