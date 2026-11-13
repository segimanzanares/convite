import type { CelebrantInfo } from '../../../types/birthday';
import { Bunting, Cloud, Rainbow, Star, Unicorn } from './Illustrations';

/** Fixed star and heart positions (left %, top %, size px), so the sky renders the same every time. */
const STARS = [
  [8, 26, 18], [88, 22, 22], [16, 58, 14], [82, 52, 16], [28, 14, 12], [70, 12, 14], [92, 72, 12], [6, 78, 14],
] as const;

interface MagicHeroProps {
  celebrant: CelebrantInfo;
  /** The admin's cover photo, shown in a round frame instead of the unicorn when there is one. */
  photoUrl: string | null;
  /** Turns true when the envelope opens, so the rainbow paints itself while the guest watches. */
  play?: boolean;
}

/**
 * The opening screen: a pastel sky with a bunting garland, a unicorn on a rainbow, stars and clouds, the name in
 * Pacifico and the age on a big star.
 */
export function MagicHero({ celebrant, photoUrl, play = false }: MagicHeroProps) {
  return (
    <section className={`${play ? 'is-playing ' : ''}relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#efe4ff_0%,#fde7f3_55%,#fff1e6_100%)] px-6 pt-28 pb-40 text-center flex flex-col items-center justify-center`}>
      <Bunting className="unicornio-motion absolute inset-x-0 top-0 h-14 w-full origin-top animate-[unicornioSway_5s_ease-in-out_infinite] sm:h-20" />
      {STARS.map(([left, top, size], index) => (
        <Star
          key={index}
          className={index % 2 ? 'unicornio-twinkle absolute text-[#ffd36e]' : 'unicornio-twinkle absolute text-[#f7b9de]'}
          style={{ left: `${left}%`, top: `${top}%`, width: size, height: size, animationDelay: `${index * -0.4}s` }}
        />
      ))}

      <div className="relative">
        <div className="relative mx-auto w-[min(340px,80vw)] opacity-0 animate-[fadeUp_1s_0.2s_forwards]">
          <Rainbow className="w-full" />
          <div className="absolute inset-x-0 bottom-0 flex justify-center">
            {photoUrl ? (
              <div className="unicornio-motion size-[46%] overflow-hidden rounded-full border-[6px] border-white shadow-lg animate-[unicornioBob_3.5s_ease-in-out_infinite]">
                <img src={photoUrl} alt={celebrant.name} className="size-full object-cover" />
              </div>
            ) : (
              <Unicorn className="unicornio-motion w-[46%] animate-[unicornioBob_3.5s_ease-in-out_infinite] drop-shadow-[0_8px_12px_rgba(111,58,156,0.18)]" />
            )}
          </div>
          <Cloud className="unicornio-drift absolute -bottom-3 -left-6 w-24 sm:w-28" />
          <Cloud className="unicornio-drift absolute -right-6 -bottom-4 w-28 [animation-delay:-3s] sm:w-32" />
        </div>

        <p className="mt-8 font-display text-[clamp(11px,1.6vw,14px)] font-semibold tracking-[0.35em] text-gold uppercase opacity-0 animate-[fadeUp_1s_0.4s_forwards]">
          Una fiesta mágica para
        </p>
        <h1 className="mt-2 font-script text-[clamp(56px,10vw,108px)] leading-[1.2] text-gold-deep [text-shadow:0_4px_0_#f7b9de] opacity-0 animate-[fadeUp_1.2s_0.6s_forwards]">
          {celebrant.firstName}
        </h1>
        {celebrant.age > 0 && (
          <div className="relative mx-auto mt-4 size-[clamp(120px,16vw,150px)] opacity-0 animate-[fadeUp_1.2s_0.8s_forwards]">
            <Star className="unicornio-wobble absolute inset-0 size-full text-[#ffd36e] drop-shadow-[0_6px_10px_rgba(240,179,63,0.35)]" />
            <span className="absolute inset-0 flex flex-col items-center justify-center pt-3">
              <span className="font-display text-[11px] font-semibold tracking-[0.2em] text-gold-deep uppercase">Cumple</span>
              <span className="font-display text-[clamp(38px,5vw,48px)] leading-none font-bold text-gold-deep">{celebrant.age}</span>
            </span>
          </div>
        )}
        {celebrant.dateLabel && (
          <p className="mt-6 font-display text-[clamp(13px,2vw,17px)] font-medium tracking-[0.18em] text-[var(--text-body)] uppercase opacity-0 animate-[fadeUp_1s_1s_forwards]">
            {celebrant.dateLabel}
          </p>
        )}
      </div>

      <svg viewBox="0 0 1440 140" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-20 w-full sm:h-28" aria-hidden="true">
        <path
          d="M0 80 C 60 30 140 30 190 70 C 240 20 340 20 390 70 C 450 30 540 30 590 75 C 650 25 750 25 800 70 C 860 30 950 30 1000 72 C 1060 25 1160 25 1210 70 C 1270 30 1370 30 1440 72 L1440 140 L0 140 Z"
          fill="var(--white)"
        />
      </svg>
    </section>
  );
}
