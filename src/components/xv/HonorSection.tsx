import { SectionHeading } from '../shared/SectionHeading';
import { Reveal } from '../shared/Reveal';

export interface HonorGroup {
  /** e.g. "Mis papás", "Mis padrinos de velación". */
  role: string;
  names: string[];
}

interface HonorSectionProps {
  eyebrow?: string;
  title?: string;
  intro?: string;
  /** Shown first and larger, usually the parents. */
  featured: HonorGroup;
  /** Smaller cards below, usually the godparents. */
  groups?: HonorGroup[];
}

export function HonorSection({
  eyebrow = 'Con la bendición de Dios',
  title = 'Y de quienes me guían',
  intro,
  featured,
  groups = [],
}: HonorSectionProps) {
  return (
    <section className="max-w-full py-[100px] px-6 sm:px-10 text-center bg-[linear-gradient(160deg,var(--color-cream),var(--color-ivory),var(--color-cream))] border-y border-gold/15">
      <Reveal className="max-w-[920px] mx-auto">
        <SectionHeading eyebrow={eyebrow} title={title} />
        {intro && (
          <p className="text-[clamp(16px,2vw,19px)] font-light leading-[1.9] text-[var(--text-body)] italic max-w-[560px] mx-auto">
            {intro}
          </p>
        )}

        <div className="mt-12">
          <p className="font-display text-[10px] tracking-[0.5em] text-gold uppercase mb-4">{featured.role}</p>
          {featured.names.map((name, index) => (
            <p key={name} className="font-script text-[clamp(34px,7vw,46px)] text-gold-deep leading-[1.25]">
              {index > 0 && <span className="block font-display text-[14px] text-gold my-1" aria-hidden="true">&amp;</span>}
              {name}
            </p>
          ))}
        </div>

        {groups.length > 0 && (
          <div className={`grid gap-5 mt-14 grid-cols-1 ${groups.length > 1 ? 'sm:grid-cols-2' : 'max-w-[420px] mx-auto'}`}>
            {groups.map((group) => (
              <div key={group.role} className="relative border border-gold/30 bg-ivory py-8 px-6">
                <span className="absolute -top-[7px] left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-ivory border border-gold/50" aria-hidden="true" />
                <p className="font-display text-[9px] tracking-[0.45em] text-gold uppercase mb-3">{group.role}</p>
                {group.names.map((name) => (
                  <p key={name} className="text-[19px] font-normal text-[var(--text-body)] leading-[1.6]">
                    {name}
                  </p>
                ))}
              </div>
            ))}
          </div>
        )}
      </Reveal>
    </section>
  );
}
