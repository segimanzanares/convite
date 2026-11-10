import { CornerOrnament } from './CornerOrnament';

export function PageOrnamentBorder() {
  return (
    <>
      <div className="fixed inset-3 border border-gold pointer-events-none z-[999] opacity-50 before:content-[''] before:absolute before:inset-1 before:border-[0.5px] before:border-gold-light before:opacity-60" />
      <CornerOrnament position="tl" />
      <CornerOrnament position="tr" />
      <CornerOrnament position="bl" />
      <CornerOrnament position="br" />
    </>
  );
}
