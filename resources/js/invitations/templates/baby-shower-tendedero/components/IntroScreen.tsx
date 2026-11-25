import { Shirt } from 'lucide-react';
import { useIntro } from '../../../components/gender-reveal/useIntro';
import { buttonClass, cn } from '../../../components/ui/styles';
import { Hanger, Pennants } from './TendederoArt';

interface IntroScreenProps {
  names: string;
  dateLabel: string;
  /** The letter on the onesie, e.g. the baby's initial. */
  letter: string | null;
  onOpen?: () => void;
  /** Fires once the screen has gone and page scroll is unlocked. */
  onOpened?: () => void;
}

const CLOSE_MS = 1500;

/**
 * The first screen: a wooden hanger swings under a garland of pennants, holding a onesie with a "¡hola!" tag.
 * "Abrir la invitación" (the visitor's tap that lets the music start) lifts the hanger away and the screen fades into
 * the invitation.
 */
export function IntroScreen({ names, dateLabel, letter, onOpen, onOpened }: IntroScreenProps) {
  const { isOpen, isHidden, open } = useIntro(CLOSE_MS, onOpened);

  if (isHidden) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tendedero-intro-title"
      className={cn(
        'fixed inset-0 z-[3000] flex flex-col items-center justify-center overflow-hidden px-6 text-center transition-opacity delay-[900ms] duration-500',
        isOpen && 'is-open opacity-0',
      )}
      style={{ background: 'radial-gradient(circle at 50% 35%, var(--card), var(--background) 60%, var(--secondary))' }}
    >
      <Pennants className="absolute inset-x-0 top-0 w-full" count={11} />
      <Hanger className="tende-lift w-[min(230px,60vw)]" letter={letter} />
      <p className="mt-2 font-reenie text-3xl leading-none text-(--primary)">baby shower</p>
      <h1 id="tendedero-intro-title" className="mt-2 font-yeseva text-[clamp(30px,8vw,44px)] leading-tight">
        {names}
      </h1>
      <p className="mx-auto mt-2 max-w-xs text-pretty text-(--muted-foreground)">
        Estamos preparando el nido{dateLabel ? ` y el ${dateLabel} lo celebramos` : ''}. ¿Nos acompañas?
      </p>
      <button
        type="button"
        autoFocus
        disabled={isOpen}
        className={buttonClass('default', 'lg', 'mt-8 rounded-full px-8')}
        onClick={() => {
          open();
          onOpen?.();
        }}
      >
        <Shirt aria-hidden="true" />
        Abrir la invitación
      </button>
    </div>
  );
}
