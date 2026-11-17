import { Reveal } from '../../../components/shared/Reveal';
import { Lamb, SprigDivider } from './OliveArt';

interface OlivoClosingProps {
  message: string;
  signature: string;
  dateLabel: string;
}

/** The last words on linen, under a little lamb resting among daisies. */
export function OlivoClosing({ message, signature, dateLabel }: OlivoClosingProps) {
  return (
    <section className="olivo-linen relative overflow-hidden px-6 py-24 text-center">
      <Reveal className="relative mx-auto max-w-[600px]">
        <Lamb className="mx-auto w-[min(240px,70vw)]" />
        <p className="mt-8 text-[clamp(19px,3vw,25px)] leading-[1.7] font-light italic text-[var(--text-body)] text-balance">{message}</p>
        <p className="mt-8 font-script text-[clamp(46px,8vw,64px)] leading-tight text-gold-deep">{signature}</p>
        {dateLabel && <p className="mt-1 font-display text-[11px] tracking-[0.4em] text-gold">{dateLabel}</p>}
        <SprigDivider className="mt-10" />
      </Reveal>
    </section>
  );
}
