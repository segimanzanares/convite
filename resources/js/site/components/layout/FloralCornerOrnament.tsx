type CornerPosition = 'tl' | 'tr' | 'bl' | 'br';

interface FloralCornerOrnamentProps {
  position: CornerPosition;
  className?: string;
}

const POSITION_CLASSES: Record<CornerPosition, string> = {
  tl: 'top-2 left-2',
  tr: 'top-2 right-2 scale-x-[-1]',
  bl: 'bottom-2 left-2 scale-y-[-1]',
  br: 'bottom-2 right-2 scale-[-1]',
};

export function FloralCornerOrnament({ position, className = '' }: FloralCornerOrnamentProps) {
  return (
    <div
      className={`fixed w-[110px] h-[110px] sm:w-[140px] sm:h-[140px] pointer-events-none z-[1000] text-gold ${POSITION_CLASSES[position]} ${className}`}
    >
      <FloralCornerSvg className="w-full h-full drop-shadow-[0_1px_2px_rgba(0,0,0,0.05)]" />
    </div>
  );
}

/** The bare corner artwork (top-left orientation), drawn in `currentColor`. */
export function FloralCornerSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Enmarcado sutil en ángulo */}
      <path d="M 6 120 L 6 6 L 120 6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
      <path d="M 12 90 L 12 12 L 90 12" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.3" />

      {/* Flor Principal (Esquina superior izquierda) */}
      <g transform="translate(24, 24)">
        {/* Pétalos centrales */}
        <path d="M0 -14 C 6 -12, 12 -6, 12 0 C 12 6, 6 12, 0 14 C -6 12, -12 6, -12 0 C -12 -6, -6 -12, 0 -14 Z" fill="currentColor" opacity="0.15" />
        <path d="M-14 0 C -12 6, -6 12, 0 12 C 6 12, 12 6, 14 0 C 12 -6, 6 -12, 0 -12 C -6 -12, -12 -6, -14 0 Z" fill="currentColor" opacity="0.15" />

        {/* Detalles de pétalos finos */}
        <path d="M0 -18 C8 -16, 16 -8, 18 0 C 16 8, 8 16, 0 18 C -8 16, -16 8, -18 0 C -16 -8, -8 -16, 0 -18 Z" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
        <path d="M -12 -12 C -4 -16, 8 -16, 12 -12 C 16 -4, 16 8, 12 12 C 4 16, -8 16, -12 12 C -16 4, -16 -8, -12 -12 Z" stroke="currentColor" strokeWidth="0.6" opacity="0.5" />

        {/* Centro floral con estambres */}
        <circle cx="0" cy="0" r="4" fill="currentColor" opacity="0.8" />
        <circle cx="0" cy="0" r="7" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 2" opacity="0.6" />
      </g>

      {/* Enredaderas y Hojas Rama Superior */}
      <path d="M 38 20 C 65 15, 85 22, 115 10" stroke="currentColor" strokeWidth="0.9" fill="none" opacity="0.8" />
      {/* Hojas superior */}
      <path d="M 55 18 C 58 11, 68 12, 65 18 C 62 20, 56 22, 55 18 Z" fill="currentColor" opacity="0.4" />
      <path d="M 80 18 C 85 10, 94 13, 90 20 C 86 22, 80 22, 80 18 Z" fill="currentColor" opacity="0.4" />
      <path d="M 102 12 C 107 5, 116 10, 112 16 Z" fill="currentColor" opacity="0.4" />

      {/* Enredaderas y Hojas Rama Inferior */}
      <path d="M 20 38 C 15 65, 22 85, 10 115" stroke="currentColor" strokeWidth="0.9" fill="none" opacity="0.8" />
      {/* Hojas inferior */}
      <path d="M 18 55 C 11 58, 12 68, 18 65 C 20 62, 22 56, 18 55 Z" fill="currentColor" opacity="0.4" />
      <path d="M 18 80 C 10 85, 13 94, 20 90 C 22 86, 22 80, 18 80 Z" fill="currentColor" opacity="0.4" />
      <path d="M 12 102 C 5 107, 10 116, 16 112 Z" fill="currentColor" opacity="0.4" />

      {/* Flores secundarias y capullos */}
      <g transform="translate(75, 18)">
        <circle cx="0" cy="0" r="3" fill="currentColor" opacity="0.6" />
        <path d="M -4 -2 C -2 -5, 2 -5, 4 -2 C 5 2, 0 5, -4 -2 Z" fill="currentColor" opacity="0.3" />
      </g>
      <g transform="translate(18, 75)">
        <circle cx="0" cy="0" r="3" fill="currentColor" opacity="0.6" />
        <path d="M -2 -4 C -5 -2, -5 2, -2 4 C 2 5, 5 0, -2 -4 Z" fill="currentColor" opacity="0.3" />
      </g>

      {/* Pétalos pequeños sueltos/flotando */}
      <path d="M 98 28 C 102 24, 108 28, 104 32 C 100 34, 96 30, 98 28 Z" fill="currentColor" opacity="0.35" />
      <path d="M 28 98 C 24 102, 28 108, 32 104 C 34 100, 30 96, 28 98 Z" fill="currentColor" opacity="0.35" />
      <circle cx="120" cy="22" r="1.5" fill="currentColor" opacity="0.5" />
      <circle cx="22" cy="120" r="1.5" fill="currentColor" opacity="0.5" />
    </svg>
  );
}
