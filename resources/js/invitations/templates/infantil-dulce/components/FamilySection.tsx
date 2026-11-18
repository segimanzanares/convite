import { Fragment } from 'react';
import { Heart } from 'lucide-react';
import { Reveal } from '../../../components/shared/Reveal';
import { Card, Section } from '../../../components/ui/primitives';
import type { HonorGroup } from '../../../components/xv/HonorSection';
import { Cupcake, Lollipop } from './Illustrations';
import { SectionTitle, Sprinkles } from './ui';

interface FamilySectionProps {
  parents: HonorGroup;
  firstName: string;
}

/** The parents on a frosted card topped by a cupcake, a little heart between their names, over sprinkles. */
export function FamilySection({ parents, firstName }: FamilySectionProps) {
  return (
    <Section id="familia" className="relative overflow-hidden">
      <Sprinkles className="opacity-60" />
      <SectionTitle
        eyebrow="Con mucho amor"
        title="La familia más dulce"
        description={`Los papás de ${firstName} prepararon este día con todo el cariño del mundo y les hará muy felices que estés ahí.`}
      />
      <Reveal className="relative mx-auto max-w-md pt-10">
        <Cupcake className="absolute top-0 left-1/2 z-10 w-20 -translate-x-1/2 -translate-y-1/4" />
        <Card className="rounded-[2rem] border-0 bg-(--card) px-6 pt-14 pb-10 text-center shadow-[0_0_0_8px_var(--frosting),0_18px_40px_-18px_rgb(0_0_0/0.25)]">
          <p className="inline-block rounded-full bg-(--frosting) px-4 py-1 font-fredoka text-sm font-semibold">{parents.role}</p>
          <div className="mt-5">
            {parents.names.map((name, index) => (
              <Fragment key={name}>
                {index > 0 && <Heart className="mx-auto my-2 size-5 fill-(--frosting) text-(--frosting)" aria-hidden="true" />}
                <p className="font-fredoka text-[clamp(26px,5vw,34px)] leading-tight font-semibold text-balance">{name}</p>
              </Fragment>
            ))}
          </div>
        </Card>
        <Lollipop className="pointer-events-none absolute -bottom-6 -left-16 hidden w-14 -rotate-12 sm:block" />
      </Reveal>
    </Section>
  );
}
