import { SectionHeading } from '../shared/SectionHeading';
import { Reveal } from '../shared/Reveal';
import { useCountdown } from '../../hooks/useCountdown';

interface CountdownProps {
  targetDateTime: string;
  eyebrow?: string;
  title?: string;
  /** Heading color scheme; 'dark' gives better contrast on the dark section background. */
  headingTone?: 'light' | 'dark';
}

const UNIT_LABELS = ['Días', 'Horas', 'Minutos', 'Segundos'] as const;

export function Countdown({
  targetDateTime,
  eyebrow = 'Faltan',
  title = 'La cuenta regresiva',
  headingTone = 'light',
}: CountdownProps) {
  const { days, hours, minutes, seconds } = useCountdown(targetDateTime);
  const values = [days, hours, minutes, seconds];

  return (
    <section className="bg-[linear-gradient(160deg,var(--dark-from),var(--dark-to))] border-t border-b border-gold/12 max-w-full py-20 px-10 text-center">
      <Reveal className="max-w-[860px] mx-auto text-center">
        <SectionHeading eyebrow={eyebrow} title={title} tone={headingTone} />
        <div className="grid grid-cols-2 mt-[50px] sm:flex sm:justify-center">
          {UNIT_LABELS.map((label, index) => (
            <div
              className={`text-center py-5 px-[30px] border-gold/20 ${index % 2 === 0 ? 'border-r' : ''} ${index === 1 ? 'sm:border-r' : ''}`}
              key={label}
            >
              <span className="font-display text-[clamp(36px,5vw,52px)] text-gold font-light block leading-none">
                {String(values[index]).padStart(2, '0')}
              </span>
              <span className="font-display text-[8px] tracking-[0.4em] text-gold opacity-50 uppercase mt-1.5 block">
                {label}
              </span>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
