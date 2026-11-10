import { SectionHeading } from '../shared/SectionHeading';
import { Reveal } from '../shared/Reveal';
import { ColorSwatch } from './ColorSwatch';
import type { ColorSwatchData } from '../../types/wedding';

interface DressCodePaletteProps {
  swatches: ColorSwatchData[];
  eyebrow?: string;
  title?: string;
  intro?: string;
}

export function DressCodePalette({
  swatches,
  eyebrow = 'Paleta sugerida',
  title = 'Colorimetría',
  intro = 'Inspirados en la elegancia atemporal, sugerimos los siguientes tonos para su vestimenta.',
}: DressCodePaletteProps) {
  return (
    <section className="max-w-[920px] mx-auto text-center py-[100px] px-10">
      <Reveal>
        <SectionHeading eyebrow={eyebrow} title={title} />
        <p className="text-[clamp(16px,2vw,19px)] font-light leading-[1.9] text-[var(--text-body)] italic">
          {intro}
        </p>
        <div className="flex gap-6 justify-center flex-wrap mt-10">
          {swatches.map((swatch) => (
            <ColorSwatch key={swatch.label} swatch={swatch} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
