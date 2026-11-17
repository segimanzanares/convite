import { Reveal } from '../../../components/shared/Reveal';
import { CloudBank, Clouds, FlyingDove } from './CelesteArt';

interface CelesteClosingProps {
  message: string;
  signature: string;
  dateLabel: string;
}

/** The last words under an open sky: a dove flies over the message, between two banks of clouds. */
export function CelesteClosing({ message, signature, dateLabel }: CelesteClosingProps) {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,var(--color-ivory)_0%,var(--sky-top)_100%)] text-center">
      <CloudBank flip />
      <Clouds count={3} />
      <Reveal className="relative mx-auto max-w-[600px] px-6 pt-10 pb-24">
        <FlyingDove className="mx-auto w-[130px]" />
        <p className="mt-6 font-display text-[10px] tracking-[0.5em] text-gold uppercase">Con amor</p>
        <p className="mt-6 text-[clamp(19px,3vw,25px)] leading-[1.7] font-light italic text-[var(--text-body)] text-balance">{message}</p>
        <p className="mt-8 font-script text-[clamp(42px,8vw,60px)] leading-tight text-gold-deep">{signature}</p>
        {dateLabel && <p className="mt-2 font-display text-[11px] tracking-[0.4em] text-gold">{dateLabel}</p>}
      </Reveal>
    </section>
  );
}
