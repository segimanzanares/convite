import { Footprints } from 'lucide-react';
import { useIntro } from '../../../components/gender-reveal/useIntro';
import { buttonClass, cn } from '../../../components/ui/styles';
import { Elephant, Leaves } from './SafariArt';

interface IntroScreenProps {
  names: string;
  dateLabel: string;
  onOpen?: () => void;
  /** Fires once the screen has gone and page scroll is unlocked. */
  onOpened?: () => void;
}

const CLOSE_MS = 1500;

/**
 * The first screen: the elephant waits between two curtains of leaves. "Entrar a la aventura" (the visitor's tap that
 * lets the music start) parts the leaves and the screen fades into the invitation.
 */
export function IntroScreen({ names, dateLabel, onOpen, onOpened }: IntroScreenProps) {
  const { isOpen, isHidden, open } = useIntro(CLOSE_MS, onOpened);

  if (isHidden) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="safari-intro-title"
      className={cn(
        'fixed inset-0 z-[3000] flex flex-col items-center justify-center overflow-hidden px-6 text-center transition-opacity delay-[900ms] duration-500',
        isOpen && 'is-open opacity-0',
      )}
      style={{ background: 'radial-gradient(circle at 50% 40%, var(--card), var(--background) 55%, var(--secondary))' }}
    >
      <div className="safari-curtain safari-curtain-left pointer-events-none absolute inset-y-0 left-0 flex w-1/2 flex-col justify-between" aria-hidden="true">
        <Leaves className="-mt-6 -ml-12 w-48 rotate-[150deg] sm:w-72" flip />
        <Leaves className="-mb-6 -ml-12 w-48 rotate-[20deg] sm:w-72" flip />
      </div>
      <div className="safari-curtain safari-curtain-right pointer-events-none absolute inset-y-0 right-0 flex w-1/2 flex-col items-end justify-between" aria-hidden="true">
        <Leaves className="-mt-6 -mr-12 w-48 rotate-[210deg] sm:w-72" />
        <Leaves className="-mr-12 -mb-6 w-48 -rotate-[20deg] sm:w-72" />
      </div>

      <div className="relative z-10">
        <p className="text-sm font-semibold tracking-[0.25em] text-(--primary) uppercase">Baby shower</p>
        <Elephant className="mx-auto mt-3 w-[min(200px,52vw)]" />
        <h1 id="safari-intro-title" className="mt-4 font-grandstander text-[clamp(30px,8vw,46px)] leading-tight font-bold">
          {names}
        </h1>
        <p className="mx-auto mt-2 max-w-xs text-pretty text-(--muted-foreground)">
          Algo pequeñito viene en camino y queremos celebrarlo contigo{dateLabel ? ` el ${dateLabel}` : ''}.
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
          <Footprints aria-hidden="true" />
          Entrar a la aventura
        </button>
      </div>
    </div>
  );
}
