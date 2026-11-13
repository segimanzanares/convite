import type { CoupleInfo } from '../../../types/wedding';
import { CornerBouquet, FloralSpray } from './Flowers';

interface FloralHeroProps {
  couple: CoupleInfo;
  /** The couple's cover photo, shown softly behind the names. */
  coverUrl?: string | null;
  /** Turns true when the envelope opens, so the flowers grow while the guest is watching. */
  bloom: boolean;
}

/** A light hero framed by bouquets in two corners, with the couple's names in the middle. The flowers grow once `bloom` turns true. */
export function FloralHero({ couple, coverUrl, bloom }: FloralHeroProps) {
  const [firstName, secondName] = couple.names;

  return (
    <section className="min-h-screen max-w-full flex flex-col items-center justify-center relative py-24 px-8 overflow-hidden text-center bg-[radial-gradient(ellipse_at_50%_40%,var(--color-ivory)_0%,var(--color-cream)_55%,var(--color-gold-pale)_100%)]">
      {coverUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.18] z-0"
          style={{ backgroundImage: `url(${coverUrl})` }}
          aria-hidden="true"
        />
      )}

      <CornerBouquet
        play={bloom}
        delay={0.9}
        className="absolute -top-3 -left-3 w-[230px] sm:w-[360px] lg:w-[460px] h-auto z-0"
      />
      <CornerBouquet
        play={bloom}
        delay={1.2}
        className="absolute -bottom-3 -right-3 w-[230px] sm:w-[360px] lg:w-[460px] h-auto z-0 rotate-180"
      />

      <div className="relative z-10">
        <p className="font-display text-[clamp(9px,1.2vw,13px)] tracking-[0.5em] text-[var(--leaf-deep)] uppercase opacity-0 animate-[fadeUp_1.2s_0.3s_forwards] mb-6">
          Con gran alegría anunciamos
        </p>

        <h1 className="font-script text-[clamp(60px,10vw,116px)] text-gold-deep leading-none opacity-0 animate-[fadeUp_1.4s_0.8s_forwards]">
          {firstName}
          <span className="block text-[clamp(38px,6vw,64px)] text-gold my-[-4px]">&amp;</span>
          {secondName}
        </h1>

        <FloralSpray play={bloom} delay={1.6} className="mt-6" />

        <p className="mt-6 font-display text-[clamp(12px,2vw,17px)] tracking-[0.4em] text-ink font-light opacity-0 animate-[fadeUp_1.2s_1.3s_forwards]">
          {couple.dateLabel}
        </p>
      </div>

      <div className="absolute bottom-10 flex flex-col items-center gap-2 opacity-0 animate-[fadeIn_1s_2.5s_forwards] z-10">
        <span className="font-display text-[10px] tracking-[0.4em] text-gold-deep uppercase">Descubrir</span>
        <div className="w-px h-10 bg-[linear-gradient(to_bottom,var(--color-gold),transparent)] animate-[pulse_2s_infinite]" />
      </div>
    </section>
  );
}
