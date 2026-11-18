import { Heart } from 'lucide-react';
import { Reveal } from '../../../components/shared/Reveal';
import { Card, Section } from '../../../components/ui/primitives';
import { cn } from '../../../components/ui/styles';
import type { HonorGroup } from '../../../components/xv/HonorSection';
import { Ampersand, SectionTitle } from './ui';

interface FamilySectionProps {
  parents: HonorGroup[];
  godparents: HonorGroup[];
}

/**
 * Both families on cards with a blue heart, a Fraunces "&" between them, and the godparents on soft slate cards
 * below.
 */
export function FamilySection({ parents, godparents }: FamilySectionProps) {
  const paired = parents.length > 1;

  return (
    <Section id="familia" className="border-t border-(--border) bg-(--muted)/60">
      <SectionTitle
        centered
        eyebrow="Nuestras familias"
        title="Con la bendición de nuestros padres"
        description="Gracias a su amor y a su ejemplo llegamos hasta aquí. Hoy celebramos también la unión de dos familias."
      />
      <Reveal className="mx-auto max-w-4xl">
        <div className={cn('relative grid gap-5', paired ? 'sm:grid-cols-2 sm:gap-8' : 'mx-auto max-w-md')}>
          {parents.map((group, index) => (
            <Card key={`${index}-${group.role}`} className="flex flex-col items-center px-6 py-9 text-center">
              <span className="flex size-11 items-center justify-center rounded-full bg-(--accent) text-(--accent-foreground)" aria-hidden="true">
                <Heart className="size-5" />
              </span>
              <p className="mt-5 text-xs font-semibold tracking-[0.18em] text-(--primary) uppercase">{group.role}</p>
              <div className="mt-3 grid gap-1">
                {group.names.map((name) => (
                  <p key={name} className="font-fraunces text-[clamp(24px,3.5vw,30px)] leading-tight font-medium tracking-tight text-balance">
                    {name}
                  </p>
                ))}
              </div>
            </Card>
          ))}
          {paired && (
            <span
              className="absolute top-1/2 left-1/2 hidden size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-(--border) bg-(--background) text-2xl text-(--primary) shadow-sm sm:flex"
              aria-hidden="true"
            >
              <Ampersand />
            </span>
          )}
        </div>

        {godparents.length > 0 && (
          <div className="mt-12">
            <p className="mb-5 text-center text-sm font-semibold text-(--muted-foreground)">Y nos acompañan como padrinos</p>
            <div className={cn('grid gap-4', godparents.length > 1 && 'sm:grid-cols-2', godparents.length > 2 && 'lg:grid-cols-3')}>
              {godparents.map((group, index) => (
                <div key={`${index}-${group.role}`} className="rounded-(--radius) border border-(--border) bg-(--background) p-5 text-center">
                  <p className="text-xs font-semibold tracking-[0.14em] text-(--primary) uppercase">{group.role}</p>
                  <p className="mt-2 leading-snug font-medium">{group.names.join(' y ')}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Reveal>
    </Section>
  );
}
