import { Fragment } from 'react';
import { Reveal } from '../../../components/shared/Reveal';
import { Section } from '../../../components/ui/primitives';
import { cn } from '../../../components/ui/styles';
import type { HonorGroup } from '../../../components/xv/HonorSection';
import { Fern, Footprint, Triceratops } from './Illustrations';
import { CHUNKY, CHUNKY_SM, SectionTitle } from './ui';

interface FamilySectionProps {
  parents: HonorGroup;
  firstName: string;
}

/** The parents as the leaders of the herd: a chunky card with a sticker for the role and footprints between names. */
export function FamilySection({ parents, firstName }: FamilySectionProps) {
  return (
    <Section id="familia" className="relative overflow-hidden border-t-[3px] border-(--foreground) bg-(--sky)/35">
      <SectionTitle
        eyebrow="Los líderes de la manada"
        title="¡Bienvenidos a la manada!"
        description={`Los papás de ${firstName} prepararon esta gran aventura y no ven la hora de rugir de alegría contigo.`}
      />
      <Reveal className="relative mx-auto max-w-lg pt-16">
        <Triceratops className="pointer-events-none absolute top-0 right-5 w-24 sm:right-10" />
        <div className={cn('relative rounded-[calc(var(--radius)+12px)] bg-(--card) px-6 pt-12 pb-9 text-center sm:px-10', CHUNKY)}>
          <span className={cn('absolute -top-5 left-1/2 -translate-x-1/2 rotate-2 rounded-full bg-(--secondary) px-5 py-1.5 text-base font-extrabold whitespace-nowrap', CHUNKY_SM)}>
            {parents.role}
          </span>
          {parents.names.map((name, index) => (
            <Fragment key={name}>
              {index > 0 && (
                <span className="my-2 flex justify-center gap-3 text-(--muted-foreground)" aria-hidden="true">
                  <Footprint className="size-5 -rotate-12" />
                  <Footprint className="size-5 rotate-12" />
                </span>
              )}
              <p className="text-[clamp(26px,5vw,36px)] leading-tight font-extrabold tracking-tight text-balance">{name}</p>
            </Fragment>
          ))}
        </div>
      </Reveal>
      <Fern className="pointer-events-none absolute bottom-0 left-2 hidden w-16 md:block lg:w-20" />
    </Section>
  );
}
