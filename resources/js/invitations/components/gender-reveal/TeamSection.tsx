import type { ReactNode } from 'react';
import { Check, PartyPopper } from 'lucide-react';
import { Reveal } from '../shared/Reveal';
import { Section } from '../ui/primitives';
import { cn } from '../ui/styles';
import { useTeamGuess } from '../../hooks/useTeamGuess';
import type { BabyGender } from '../../types/invitation';

interface TeamSectionProps {
  heading: ReactNode;
  babyNames: Record<BabyGender, string | null>;
  reveal: BabyGender | null;
  /** The animated illustration of each team's card. */
  art: Record<BabyGender, ReactNode>;
  /** e.g. { girl: 'Equipo niña', boy: 'Equipo niño' }. */
  labels: Record<BabyGender, string>;
  titleClassName?: string;
  className?: string;
}

const TEAM_CLASSES: Record<BabyGender, { card: string; picked: string; chip: string }> = {
  girl: {
    card: 'bg-[linear-gradient(180deg,var(--girl-soft),var(--card)_75%)]',
    picked: 'border-(--girl) ring-4 ring-(--girl)/25',
    chip: 'bg-(--girl) text-(--primary-foreground)',
  },
  boy: {
    card: 'bg-[linear-gradient(180deg,var(--boy-soft),var(--card)_75%)]',
    picked: 'border-(--boy) ring-4 ring-(--boy)/25',
    chip: 'bg-(--boy) text-(--primary-foreground)',
  },
};

const GENDERS: BabyGender[] = ['girl', 'boy'];

/**
 * "¿Tú qué crees?": the visitor picks a team (kept in this browser only) and each team's card shows the name the
 * parents picked for it. Once the answer is revealed the winning team is crowned and the picks close.
 */
export function TeamSection({ heading, babyNames, reveal, art, labels, titleClassName, className }: TeamSectionProps) {
  const { guess, setGuess } = useTeamGuess();

  const message = reveal
    ? guess === reveal
      ? '¡Le atinaste! Tu corazonada era correcta.'
      : guess
        ? `¡Casi! Esta vez ganó el ${labels[reveal].toLowerCase()}.`
        : `¡Ganó el ${labels[reveal].toLowerCase()}!`
    : guess
      ? `¡Anotado! Vas con el ${labels[guess].toLowerCase()}. El día de la fiesta sabremos si le atinaste.`
      : 'Toca un equipo para dejar tu corazonada.';

  return (
    <Section className={className}>
      {heading}
      <Reveal className="mx-auto max-w-3xl">
        <div className="grid grid-cols-2 gap-3 sm:gap-5" role="radiogroup" aria-label="¿Niño o niña?">
          {GENDERS.map((gender) => {
            const isPicked = guess === gender;
            const isWinner = reveal === gender;

            return (
              <button
                key={gender}
                type="button"
                role="radio"
                aria-checked={isPicked}
                disabled={Boolean(reveal)}
                onClick={() => setGuess(gender)}
                className={cn(
                  'group relative flex cursor-pointer flex-col items-center rounded-(--radius) border-2 border-(--border) px-3 pt-4 pb-6 text-center transition-[border-color,box-shadow,transform,opacity] duration-300 outline-none focus-visible:ring-[3px] focus-visible:ring-(--ring)/50 enabled:hover:-translate-y-1 disabled:cursor-default sm:px-6',
                  TEAM_CLASSES[gender].card,
                  isPicked && TEAM_CLASSES[gender].picked,
                  reveal && !isWinner && 'opacity-55 grayscale-[0.5]',
                )}
              >
                {(isPicked || isWinner) && (
                  <span
                    className={cn(
                      'absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full px-3 py-1 text-xs font-bold whitespace-nowrap shadow-sm',
                      TEAM_CLASSES[gender].chip,
                    )}
                  >
                    {isWinner ? <PartyPopper className="size-3.5" aria-hidden="true" /> : <Check className="size-3.5" aria-hidden="true" />}
                    {isWinner ? '¡Ganador!' : 'Tu equipo'}
                  </span>
                )}
                <span className="block w-full max-w-[180px]" aria-hidden="true">
                  {art[gender]}
                </span>
                <span className={cn('mt-2 text-[clamp(20px,4vw,30px)] leading-tight', titleClassName)}>{labels[gender]}</span>
                {babyNames[gender] && (
                  <span className="mt-1.5 text-sm text-(--muted-foreground)">
                    Se llamaría <strong className="font-bold text-(--foreground)">{babyNames[gender]}</strong>
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <p className="mt-6 text-center text-sm font-medium text-pretty text-(--muted-foreground)" aria-live="polite">
          {message}
        </p>
      </Reveal>
    </Section>
  );
}
