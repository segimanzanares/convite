import type { ColorSwatchData } from '../../types/wedding';

interface ColorSwatchProps {
  swatch: ColorSwatchData;
}

export function ColorSwatch({ swatch }: ColorSwatchProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="w-14 h-14 rounded-full border border-gold/30 shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
        style={{ backgroundColor: swatch.hex }}
      />
      <span className="font-display text-[8px] tracking-[0.3em] text-gold uppercase">{swatch.label}</span>
    </div>
  );
}
