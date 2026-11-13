type CornerPosition = 'tl' | 'tr' | 'bl' | 'br';

const CORNER_CLASSES: Record<CornerPosition, string> = {
  tl: 'top-2 left-2',
  tr: 'top-2 right-2 scale-x-[-1]',
  bl: 'bottom-2 left-2 scale-y-[-1]',
  br: 'bottom-2 right-2 scale-[-1]',
};

/** A stepped art-deco corner (top-left orientation), drawn in `currentColor`. */
function DecoCorner({ position }: { position: CornerPosition }) {
  return (
    <div className={`fixed w-[72px] h-[72px] sm:w-[96px] sm:h-[96px] pointer-events-none z-[1000] text-gold ${CORNER_CLASSES[position]}`}>
      <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M4 92 V4 H92" stroke="currentColor" strokeWidth="1.2" opacity="0.7" />
        <path d="M10 70 V18 H18 V10 H70" stroke="currentColor" strokeWidth="0.8" opacity="0.55" />
        <path d="M16 48 V24 H24 V16 H48" stroke="currentColor" strokeWidth="0.8" opacity="0.45" />
        <path d="M28 28 L34 22 L40 28 L34 34 Z" fill="currentColor" opacity="0.7" />
        <path d="M4 4 L22 22" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
        <circle cx="70" cy="10" r="1.6" fill="currentColor" opacity="0.7" />
        <circle cx="10" cy="70" r="1.6" fill="currentColor" opacity="0.7" />
      </svg>
    </div>
  );
}

/** The small diamond on the middle of the frame's top and bottom edges. */
function EdgeMark({ className }: { className: string }) {
  return (
    <div className={`fixed left-1/2 -translate-x-1/2 pointer-events-none z-[1000] text-gold opacity-70 ${className}`}>
      <svg width="72" height="12" viewBox="0 0 72 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 6 H26 M46 6 H72" stroke="currentColor" strokeWidth="0.8" />
        <path d="M36 1 L41 6 L36 11 L31 6 Z" stroke="currentColor" strokeWidth="0.8" />
        <path d="M36 4 L38 6 L36 8 L34 6 Z" fill="currentColor" />
      </svg>
    </div>
  );
}

/** The page frame: a thin brass rule with art-deco corners, in place of the floral template's flowers. */
export function DecoFrame() {
  return (
    <>
      <div className="fixed inset-3 sm:inset-5 border border-gold/45 pointer-events-none z-[999]">
        <div className="absolute inset-1 sm:inset-1.5 border border-gold/20" />
      </div>
      <DecoCorner position="tl" />
      <DecoCorner position="tr" />
      <DecoCorner position="bl" />
      <DecoCorner position="br" />
      <EdgeMark className="top-3 -translate-y-1/2" />
      <EdgeMark className="bottom-3 translate-y-1/2" />
    </>
  );
}
