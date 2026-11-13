import type { CelebrantInfo } from '../../../types/birthday';
import { Astronaut, Moon, RingedPlanet, Rocket, Sparkle } from './Illustrations';

/** Fixed star positions (left %, top %, size px), so the sky renders the same every time. */
const STARS = [
  [6, 14, 3], [14, 62, 2], [22, 30, 2], [31, 8, 3], [38, 74, 2], [47, 22, 2], [55, 88, 3], [63, 12, 2],
  [71, 54, 2], [79, 26, 3], [86, 70, 2], [93, 40, 3], [10, 86, 2], [42, 48, 2], [68, 80, 2], [96, 8, 2],
] as const;

const SPARKLES = [
  [12, 22, 18], [84, 14, 14], [74, 64, 20], [20, 70, 14], [52, 10, 12],
] as const;

interface SpaceHeroProps {
  celebrant: CelebrantInfo;
  /** The admin's cover photo, shown in the porthole when there is one. */
  photoUrl: string | null;
}

/**
 * The opening screen: a starry night with shooting stars, a ringed planet, the moon, a floating astronaut and a rocket
 * taking off, the name in big chunky letters, the age on an orange planet and a moon surface leading into the next
 * section.
 */
export function SpaceHero({ celebrant, photoUrl }: SpaceHeroProps) {
  return (
    <section
      data-tone="dark"
      className="relative min-h-screen overflow-hidden bg-[radial-gradient(ellipse_at_50%_20%,var(--dark-to)_0%,var(--dark-from)_70%)] px-6 pt-24 pb-44 text-center flex flex-col items-center justify-center"
    >
      <div className="absolute inset-0" aria-hidden="true">
        {STARS.map(([left, top, size], index) => (
          <span
            key={index}
            className="espacial-motion absolute rounded-full bg-white animate-[espacialTwinkle_3s_ease-in-out_infinite]"
            style={{ left: `${left}%`, top: `${top}%`, width: size, height: size, animationDelay: `${(index % 6) * -0.5}s` }}
          />
        ))}
        {SPARKLES.map(([left, top, size], index) => (
          <Sparkle
            key={index}
            className="espacial-motion absolute text-gold-light animate-[espacialTwinkle_4s_ease-in-out_infinite]"
            style={{ left: `${left}%`, top: `${top}%`, width: size, height: size, animationDelay: `${index * -0.8}s` }}
          />
        ))}
        <span className="espacial-shooting top-[12%] left-[18%]" />
        <span className="espacial-shooting top-[34%] left-[56%] [animation-delay:3.5s]" />
        <span className="espacial-shooting top-[6%] left-[64%] [animation-delay:6s]" />
      </div>

      <RingedPlanet className="absolute top-[8%] -left-6 w-32 opacity-90 sm:left-[6%] sm:w-48" />
      <Moon className="espacial-glow absolute top-[6%] -right-4 w-20 sm:right-[8%] sm:w-28" />
      <Astronaut className="espacial-drift absolute bottom-[22%] left-[3%] w-14 sm:bottom-[26%] sm:left-[9%] sm:w-24" />
      <Rocket className="espacial-motion absolute right-[4%] bottom-28 w-16 animate-[espacialHover_4s_ease-in-out_infinite] sm:right-[12%] sm:bottom-36 sm:w-24" />

      <div className="relative">
        <p className="font-display text-[clamp(11px,1.6vw,14px)] font-medium tracking-[0.4em] text-gold-light uppercase opacity-0 animate-[fadeUp_1s_0.2s_forwards]">
          Misión cumpleaños
        </p>
        {photoUrl && (
          <div className="mx-auto mt-6 size-28 overflow-hidden rounded-full border-[6px] border-[#c9d1ff] shadow-[0_0_0_6px_rgba(201,209,255,0.25)] opacity-0 animate-[fadeUp_1s_0.3s_forwards] sm:size-36">
            <img src={photoUrl} alt={celebrant.name} className="size-full object-cover" />
          </div>
        )}
        <h1 className="mt-6 font-script text-[clamp(52px,11vw,120px)] leading-[0.95] text-white [text-shadow:0_6px_0_var(--gold-deep)] opacity-0 animate-[fadeUp_1.2s_0.4s_forwards] [text-wrap:balance]">
          {celebrant.firstName}
        </h1>
        {celebrant.age > 0 && (
          <div className="mx-auto mt-8 flex w-fit items-center gap-4 opacity-0 animate-[fadeUp_1.2s_0.7s_forwards]">
            <span className="font-display text-[clamp(16px,2.4vw,22px)] font-semibold tracking-[0.15em] text-gold-pale uppercase">Cumple</span>
            <span className="relative flex size-[clamp(88px,13vw,120px)] items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#ffc36b,#ec6a2c_70%)] shadow-[0_0_40px_rgba(255,164,92,0.45)]">
              <span className="font-script text-[clamp(52px,8vw,74px)] leading-none text-white [text-shadow:0_3px_0_rgba(0,0,0,0.2)]">{celebrant.age}</span>
            </span>
            <span className="font-display text-[clamp(16px,2.4vw,22px)] font-semibold tracking-[0.15em] text-gold-pale uppercase">años</span>
          </div>
        )}
        {celebrant.dateLabel && (
          <p className="mt-10 font-display text-[clamp(13px,2vw,17px)] font-medium tracking-[0.2em] text-gold-pale uppercase opacity-0 animate-[fadeUp_1s_1s_forwards]">
            Despegamos el {celebrant.dateLabel}
          </p>
        )}
      </div>

      <svg
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-24 w-full sm:h-36"
        aria-hidden="true"
      >
        <path d="M0 90 C 240 30 420 120 720 70 C 1020 20 1200 110 1440 60 L1440 160 L0 160 Z" fill="var(--white)" />
        <ellipse cx="300" cy="118" rx="46" ry="10" fill="var(--off-white)" />
        <ellipse cx="980" cy="104" rx="30" ry="7" fill="var(--off-white)" />
        <ellipse cx="1220" cy="128" rx="54" ry="11" fill="var(--off-white)" />
      </svg>
    </section>
  );
}
