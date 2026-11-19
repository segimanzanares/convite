import { PartyPopper } from 'lucide-react';
import { Confetti } from '../../../components/gender-reveal/Confetti';
import { useIntro } from '../../../components/gender-reveal/useIntro';
import { buttonClass, cn } from '../../../components/ui/styles';
import { MysteryBalloon } from './GlobosArt';

interface IntroScreenProps {
  names: string;
  dateLabel: string;
  onOpen?: () => void;
  /** Fires once the screen has gone and page scroll is unlocked. */
  onOpened?: () => void;
}

const CLOSE_MS = 1100;

const SKY = 'radial-gradient(circle at 20% 20%, var(--girl-soft), transparent 45%), radial-gradient(circle at 80% 75%, var(--boy-soft), transparent 45%), var(--background)';

/**
 * The first screen: the mystery balloon floats over a cream and pink sky. Tapping "Reventar el globo" (the visitor's
 * tap that lets the music start) pops it in a burst of pink and blue confetti and the invitation shows.
 */
export function IntroScreen({ names, dateLabel, onOpen, onOpened }: IntroScreenProps) {
  const { isOpen, isHidden, open } = useIntro(CLOSE_MS, onOpened);

  if (isHidden) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="globos-intro-title"
      className={cn(
        'fixed inset-0 z-[3000] flex flex-col items-center justify-center overflow-hidden px-6 text-center',
        'transition-opacity delay-500 duration-500',
        isOpen && 'opacity-0',
      )}
      style={{ background: SKY }}
    >
      {isOpen && <Confetti colors={['--girl', '--boy', '--lemon', '--primary']} count={60} mode="burst" />}
      <div className={cn('w-[min(220px,52vw)]', isOpen && 'globos-pop')}>
        <MysteryBalloon className="w-full drop-shadow-[0_24px_30px_oklch(0.4_0.1_300/0.25)]" />
      </div>
      <p className="mt-4 text-xs font-bold tracking-[0.22em] text-(--primary) uppercase">Revelación de género</p>
      <h1 id="globos-intro-title" className="mt-2 font-sniglet text-[clamp(34px,9vw,52px)] leading-tight">
        {names}
      </h1>
      <p className="mx-auto mt-2 max-w-xs text-pretty text-(--muted-foreground)">
        Dentro de este globo hay una sorpresa{dateLabel ? ` que descubriremos el ${dateLabel}` : ''}.
      </p>
      <button
        type="button"
        autoFocus
        disabled={isOpen}
        className={buttonClass('default', 'lg', 'mt-8 h-12 rounded-full px-8 text-base')}
        onClick={() => {
          open();
          onOpen?.();
        }}
      >
        <PartyPopper aria-hidden="true" />
        Reventar el globo
      </button>
    </div>
  );
}
