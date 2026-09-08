import type { CoupleInfo } from '../../types/wedding';

interface HeroProps {
  couple: CoupleInfo;
  backgroundImageUrl?: string;
}

export function Hero({ couple, backgroundImageUrl }: HeroProps) {
  const [firstName, secondName] = couple.names;

  return (
    <section className="min-h-screen max-w-full flex flex-col items-center justify-center relative bg-black py-20 px-10 overflow-hidden text-center">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 z-0"
        style={backgroundImageUrl ? { backgroundImage: `url(${backgroundImageUrl})` } : undefined}
      />

      <p className="font-display text-[clamp(9px,1.2vw,14px)] tracking-[0.5em] text-ivory uppercase opacity-0 animate-[fadeUp_1.2s_0.3s_forwards] mb-6">
        Con gran alegría anunciamos
      </p>

      <div className="w-[120px] h-px mx-auto bg-[linear-gradient(to_right,transparent,var(--color-gold),transparent)] opacity-0 animate-[fadeUp_1.2s_0.5s_forwards] mb-[30px]" />

      <h1 className="font-script text-[clamp(64px,10vw,120px)] text-gold-deep leading-none text-center opacity-0 animate-[fadeUp_1.4s_0.8s_forwards] [text-shadow:0_2px_30px_rgba(201,168,76,0.2)]">
        {firstName}
        <span className="block text-[clamp(40px,6vw,72px)] text-gold-light my-[-10px] opacity-0 animate-[fadeUp_1.4s_1s_forwards]">
          &amp;
        </span>
        {secondName}
      </h1>

      <div className="w-[120px] h-px mx-auto bg-[linear-gradient(to_right,transparent,var(--color-gold),transparent)] opacity-0 animate-[fadeUp_1.2s_1.1s_forwards] mt-[30px]" />

      <div className="mt-10 opacity-0 animate-[fadeUp_1.2s_1.3s_forwards] text-center">
        <p className="font-display text-[clamp(13px,2vw,18px)] tracking-[0.4em] text-ivory font-light">
          {couple.dateLabel}
        </p>
      </div>

      <div className="absolute bottom-10 flex flex-col items-center gap-2 opacity-0 animate-[fadeIn_1s_2.5s_forwards]">
        <span className="font-display text-[10px] tracking-[0.4em] text-gold uppercase">Descubrir</span>
        <div className="w-px h-10 bg-[linear-gradient(to_bottom,var(--color-gold),transparent)] animate-[pulse_2s_infinite]" />
      </div>
    </section>
  );
}
