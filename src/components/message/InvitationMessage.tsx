import { SectionHeading } from '../shared/SectionHeading';
import { Reveal } from '../shared/Reveal';

interface InvitationMessageProps {
  eyebrow: string;
  title: string;
  message: string;
  signature: string;
}

export function InvitationMessage({ eyebrow, title, message, signature }: InvitationMessageProps) {
  return (
    <section className="max-w-[920px] mx-auto text-center py-[100px] px-10">
      <Reveal>
        <SectionHeading eyebrow={eyebrow} title={title} />
        <div
          className={[
            'bg-[linear-gradient(135deg,var(--color-cream)_0%,var(--color-ivory)_100%)]',
            'border border-gold/25 rounded-[2px] py-[60px] px-[50px] relative mt-[60px]',
            "before:content-['\"'] before:font-script before:text-[120px] before:text-gold-pale before:absolute before:leading-none before:top-[10px] before:left-5",
            "after:content-['\"'] after:font-script after:text-[120px] after:text-gold-pale after:absolute after:leading-none after:bottom-[-30px] after:right-5",
          ].join(' ')}
        >
          <p className="text-[clamp(16px,2vw,19px)] font-light leading-[1.9] text-[var(--text-body)] italic">
            {message}
          </p>
        </div>
        <p className="font-light leading-[1.9] text-[var(--text-body)] italic mt-10 text-[15px] opacity-70">
          — {signature} —
        </p>
      </Reveal>
    </section>
  );
}
