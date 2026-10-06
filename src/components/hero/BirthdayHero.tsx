import type { CelebrantInfo } from '../../types/birthday';

interface BirthdayHeroProps {
  celebrant: CelebrantInfo;
  backgroundImageUrl?: string;
}

export function BirthdayHero({ celebrant, backgroundImageUrl }: BirthdayHeroProps) {
  return (
    <section className="min-h-screen max-w-full flex flex-col items-center justify-center relative bg-black py-20 px-10 overflow-hidden text-center">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 z-0"
        style={backgroundImageUrl ? { backgroundImage: `url(${backgroundImageUrl})` } : undefined}
      />

      <p className="relative font-display text-[clamp(9px,1.2vw,14px)] tracking-[0.5em] text-ivory uppercase opacity-0 animate-[fadeUp_1.2s_0.3s_forwards] mb-6">
        Te invitamos a celebrar
      </p>

      <div className="relative w-[120px] h-px mx-auto bg-[linear-gradient(to_right,transparent,var(--color-gold-light),transparent)] opacity-0 animate-[fadeUp_1.2s_0.5s_forwards] mb-[30px]" />

      <h1 className="relative font-script text-[clamp(56px,9vw,110px)] text-gold-pale leading-[1.1] opacity-0 animate-[fadeUp_1.4s_0.8s_forwards] [text-shadow:0_2px_30px_color-mix(in_srgb,var(--color-gold)_35%,transparent)]">
        <span className="font-bold">{celebrant.name}</span>
      </h1>

      <div className="relative mt-6 flex flex-col items-center opacity-0 animate-[fadeUp_1.4s_1s_forwards]">
        <span className="font-display text-[clamp(72px,12vw,140px)] font-light text-gold-light leading-none">
          {celebrant.age}
        </span>
        <span className="font-display text-[clamp(10px,1.4vw,14px)] tracking-[0.6em] text-gold-pale uppercase mt-2">
          Años
        </span>
      </div>

      <div className="relative w-[120px] h-px mx-auto bg-[linear-gradient(to_right,transparent,var(--color-gold-light),transparent)] opacity-0 animate-[fadeUp_1.2s_1.1s_forwards] mt-[30px]" />

      <div className="relative mt-10 opacity-0 animate-[fadeUp_1.2s_1.3s_forwards] text-center">
        <p className="font-display text-[clamp(13px,2vw,18px)] tracking-[0.4em] text-ivory font-light">
          {celebrant.dateLabel}
        </p>
      </div>

      <div className="absolute bottom-10 flex flex-col items-center gap-2 opacity-0 animate-[fadeIn_1s_2.5s_forwards]">
        <span className="font-display text-[10px] tracking-[0.4em] text-gold-light uppercase">Descubrir</span>
        <div className="w-px h-10 bg-[linear-gradient(to_bottom,var(--color-gold-light),transparent)] animate-[pulse_2s_infinite]" />
      </div>
    </section>
  );
}
