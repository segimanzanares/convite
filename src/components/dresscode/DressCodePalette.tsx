import { SectionHeading } from '../shared/SectionHeading';
import { Reveal } from '../shared/Reveal';
import { ColorSwatch } from './ColorSwatch';
import type { ColorSwatchData } from '../../types/wedding';

interface DressCodePaletteProps {
  swatches: ColorSwatchData[];
}

export function DressCodePalette({ swatches }: DressCodePaletteProps) {
  return (
    <section className="max-w-[920px] mx-auto text-center py-[100px] px-10">
      <Reveal>
        <SectionHeading eyebrow="Paleta sugerida" title="Colorimetría" />
        <p className="text-[clamp(16px,2vw,19px)] font-light leading-[1.9] text-[#4a3820] italic">
          Inspirados en la elegancia atemporal, sugerimos los siguientes tonos para
          su vestimenta.
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
