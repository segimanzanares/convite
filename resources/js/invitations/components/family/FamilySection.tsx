import { Fragment, type ReactNode } from 'react';
import { Reveal } from '../shared/Reveal';
import { SectionHeading } from '../shared/SectionHeading';
import type { HonorGroup } from '../xv/HonorSection';

interface FamilySectionProps {
  eyebrow: string;
  title: string;
  intro?: string;
  /** One group (a celebrant's parents) or two, side by side (the parents of each one of the couple). */
  parents: HonorGroup[];
  godparents?: HonorGroup[];
  /** Small caps above the godparents' cards. */
  godparentsTitle?: string;
  /** An illustration of the template above the heading. */
  ornament?: ReactNode;
}

/**
 * The parents and godparents in the classic templates' look: the parents' names in the script font, two families
 * divided by an "&" in the primary color, and each group of godparents on a card with a diamond on top.
 */
export function FamilySection({
  eyebrow,
  title,
  intro,
  parents,
  godparents = [],
  godparentsTitle = 'Nuestros padrinos',
  ornament,
}: FamilySectionProps) {
  const paired = parents.length > 1;

  return (
    <section className="relative max-w-full overflow-hidden border-y border-(--primary)/15 bg-[linear-gradient(160deg,var(--surface),var(--card),var(--surface))] px-6 py-[100px] text-center sm:px-10">
      <Reveal className="relative mx-auto max-w-[960px]">
        {ornament}
        <SectionHeading eyebrow={eyebrow} title={title} />
        {intro && (
          <p className="mx-auto max-w-[580px] text-[clamp(16px,2vw,19px)] leading-[1.9] font-light text-[var(--foreground-soft)] italic">
            {intro}
          </p>
        )}

        <div className={`mt-12 grid gap-8 ${paired ? 'sm:grid-cols-[1fr_auto_1fr] sm:gap-6' : 'mx-auto max-w-[560px]'}`}>
          {parents.map((group, index) => (
            <Fragment key={`${index}-${group.role}`}>
              {index > 0 && <FamiliesAmpersand />}
              <ParentsGroup group={group} />
            </Fragment>
          ))}
        </div>

        {godparents.length > 0 && (
          <div className="mt-16">
            <p className="mx-auto mb-10 flex max-w-[420px] items-center justify-center gap-4 font-display text-[10px] tracking-[0.5em] text-(--primary) uppercase before:h-px before:flex-1 before:bg-[linear-gradient(to_right,transparent,var(--primary))] before:content-[''] after:h-px after:flex-1 after:bg-[linear-gradient(to_left,transparent,var(--primary))] after:content-['']">
              {godparentsTitle}
            </p>
            <div
              className={`grid grid-cols-1 gap-x-5 gap-y-7 ${godparents.length > 1 ? 'sm:grid-cols-2' : 'mx-auto max-w-[420px]'} ${godparents.length > 2 ? 'lg:grid-cols-3' : ''}`}
            >
              {godparents.map((group, index) => (
                <div key={`${index}-${group.role}`} className="relative border border-(--primary)/30 bg-(--card) px-6 py-8">
                  <span className="absolute -top-[7px] left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border border-(--primary)/50 bg-(--card)" aria-hidden="true" />
                  <p className="mb-3 font-display text-[9px] tracking-[0.45em] text-(--primary) uppercase">{group.role}</p>
                  {group.names.map((name) => (
                    <p key={name} className="text-[19px] leading-[1.6] font-normal text-[var(--foreground-soft)]">
                      {name}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </Reveal>
    </section>
  );
}

function ParentsGroup({ group }: { group: HonorGroup }) {
  return (
    <div className="flex flex-col items-center">
      <p className="mb-4 font-display text-[10px] tracking-[0.5em] text-(--primary) uppercase">{group.role}</p>
      {group.names.map((name, index) => (
        <Fragment key={name}>
          {index > 0 && <span className="my-1.5 block h-1.5 w-1.5 rotate-45 bg-(--primary)/60" aria-hidden="true" />}
          <p className="font-script text-[clamp(30px,6vw,42px)] leading-[1.25] text-balance text-(--primary-deep)">{name}</p>
        </Fragment>
      ))}
    </div>
  );
}

/** The "&" joining both families: between two gold rules, vertical beside the columns and horizontal when stacked. */
function FamiliesAmpersand() {
  return (
    <div className="flex items-center justify-center gap-4 sm:flex-col" aria-hidden="true">
      <span className="h-px w-16 bg-[linear-gradient(to_right,transparent,var(--primary))] sm:h-auto sm:w-px sm:flex-1 sm:bg-[linear-gradient(to_bottom,transparent,var(--primary))]" />
      <span className="font-script text-[44px] leading-none text-(--primary)">&amp;</span>
      <span className="h-px w-16 bg-[linear-gradient(to_left,transparent,var(--primary))] sm:h-auto sm:w-px sm:flex-1 sm:bg-[linear-gradient(to_top,transparent,var(--primary))]" />
    </div>
  );
}
