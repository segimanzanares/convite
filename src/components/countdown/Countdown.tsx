import { SectionHeading } from '../shared/SectionHeading';
import { Reveal } from '../shared/Reveal';
import { useCountdown } from '../../hooks/useCountdown';

interface CountdownProps {
  targetDateTime: string;
}

const UNIT_LABELS = ['Días', 'Horas', 'Minutos', 'Segundos'] as const;

export function Countdown({ targetDateTime }: CountdownProps) {
  const { days, hours, minutes, seconds } = useCountdown(targetDateTime);
  const values = [days, hours, minutes, seconds];

  return (
    <section className="bg-[linear-gradient(160deg,#1c1308,#2c1f0a)] border-t border-b border-gold/12 max-w-full py-20 px-10 text-center">
      <Reveal className="max-w-[860px] mx-auto text-center">
        <SectionHeading eyebrow="Faltan" title="La cuenta regresiva" />
        <div className="flex justify-center gap-0 mt-[50px] flex-wrap">
          {UNIT_LABELS.map((label, index) => (
            <div className="text-center py-5 px-[30px] border-r border-gold/20 last:border-r-0" key={label}>
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
