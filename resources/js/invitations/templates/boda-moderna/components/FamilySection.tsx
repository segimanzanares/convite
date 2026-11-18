import { Fragment } from 'react';
import { HeartHandshake, Users } from 'lucide-react';
import { Reveal } from '../../../components/shared/Reveal';
import { Card, Section } from '../../../components/ui/primitives';
import { cn } from '../../../components/ui/styles';
import type { HonorGroup } from '../../../components/xv/HonorSection';
import { Ampersand, SectionHeader } from './ui';

interface FamilySectionProps {
  parents: HonorGroup[];
  godparents: HonorGroup[];
}

/**
 * Both families on twin cards joined by the serif "&", and the godparents as the rows of a hairline table, the role
 * on the left and the names on the right.
 */
export function FamilySection({ parents, godparents }: FamilySectionProps) {
  return (
    <Section id="familia" className="border-b border-(--border)">
      <SectionHeader
        badge={
          <>
            <HeartHandshake aria-hidden="true" />
            Nuestras familias
          </>
        }
        title="Con la bendición de nuestros padres"
        description="Ellos nos enseñaron a amar; hoy caminan a nuestro lado mientras comenzamos nuestra propia historia."
      />
      <Reveal className="mx-auto max-w-3xl">
        <div className={cn('grid gap-4', parents.length > 1 ? 'sm:grid-cols-[1fr_auto_1fr] sm:items-center' : 'mx-auto max-w-md')}>
          {parents.map((group, index) => (
            <Fragment key={`${index}-${group.role}`}>
              {index > 0 && (
                <span className="mx-auto flex size-12 items-center justify-center rounded-full border border-(--border) bg-(--background)" aria-hidden="true">
                  <Ampersand className="text-2xl" />
                </span>
              )}
              <Card className="h-full p-6 text-center sm:p-8">
                <p className="text-sm font-medium text-(--muted-foreground)">{group.role}</p>
                <div className="mt-4 grid gap-1">
                  {group.names.map((name) => (
                    <p key={name} className="font-instrument text-[clamp(26px,4vw,32px)] leading-tight text-balance italic">
                      {name}
                    </p>
                  ))}
                </div>
              </Card>
            </Fragment>
          ))}
        </div>

        {godparents.length > 0 && (
          <Card className="mt-6 overflow-hidden">
            <p className="flex items-center gap-2 border-b border-(--border) bg-(--muted)/50 px-5 py-3 text-sm font-medium">
              <Users className="size-4" aria-hidden="true" />
              Nuestros padrinos
            </p>
            <dl className="divide-y divide-(--border)">
              {godparents.map((group, index) => (
                <div key={`${index}-${group.role}`} className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <dt className="text-sm text-(--muted-foreground)">{group.role}</dt>
                  <dd className="font-medium sm:text-right">{group.names.join(' y ')}</dd>
                </div>
              ))}
            </dl>
          </Card>
        )}
      </Reveal>
    </Section>
  );
}
