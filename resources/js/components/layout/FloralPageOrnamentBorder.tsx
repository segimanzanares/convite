import { FloralCornerOrnament } from './FloralCornerOrnament';

export function FloralPageOrnamentBorder() {
  return (
    <>
      {/* Marco perimetral fino doble con esquinas remetidas */}
      <div className="fixed inset-3 sm:inset-5 border border-gold/40 pointer-events-none z-[999] rounded-sm">
        <div className="absolute inset-1 sm:inset-1.5 border border-gold/25 border-dashed rounded-sm" />
      </div>

      {/* Ornamentos florales en las cuatro esquinas */}
      <FloralCornerOrnament position="tl" />
      <FloralCornerOrnament position="tr" />
      <FloralCornerOrnament position="bl" />
      <FloralCornerOrnament position="br" />

      {/* Detalle sutil en los centros superior e inferior */}
      <div className="fixed top-3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[1000] text-gold opacity-60">
        <svg width="60" height="12" viewBox="0 0 60 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 6 H22 M38 6 H60" stroke="currentColor" strokeWidth="0.6" />
          <circle cx="30" cy="6" r="2.5" stroke="currentColor" strokeWidth="0.8" />
          <circle cx="24" cy="6" r="1" fill="currentColor" />
          <circle cx="36" cy="6" r="1" fill="currentColor" />
        </svg>
      </div>

      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 translate-y-1/2 pointer-events-none z-[1000] text-gold opacity-60">
        <svg width="60" height="12" viewBox="0 0 60 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 6 H22 M38 6 H60" stroke="currentColor" strokeWidth="0.6" />
          <circle cx="30" cy="6" r="2.5" stroke="currentColor" strokeWidth="0.8" />
          <circle cx="24" cy="6" r="1" fill="currentColor" />
          <circle cx="36" cy="6" r="1" fill="currentColor" />
        </svg>
      </div>
    </>
  );
}