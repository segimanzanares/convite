import { Bath } from 'lucide-react';
import { useIntro } from '../../../components/gender-reveal/useIntro';
import { buttonClass, cn } from '../../../components/ui/styles';
import { Bathtub, FloatingBubbles } from './PatitoArt';

interface IntroScreenProps {
  names: string;
  dateLabel: string;
  onOpen?: () => void;
  /** Fires once the screen has gone and page scroll is unlocked. */
  onOpened?: () => void;
}

const CLOSE_MS = 1500;

/**
 * The first screen: a bathtub full of foam and something hiding inside. "¿Quién está ahí?" (the visitor's tap that
 * lets the music start) makes the duck pop out of the foam and the screen fades into the invitation.
 */
export function IntroScreen({ names, dateLabel, onOpen, onOpened }: IntroScreenProps) {
  const { isOpen, isHidden, open } = useIntro(CLOSE_MS, onOpened);

  if (isHidden) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="patito-intro-title"
      className={cn(
        'fixed inset-0 z-[3000] flex flex-col items-center justify-center overflow-hidden px-6 text-center transition-opacity delay-[900ms] duration-500',
        isOpen && 'is-open opacity-0',
      )}
      style={{ background: 'radial-gradient(circle at 50% 40%, var(--card), var(--muted) 55%, var(--accent))' }}
    >
      <FloatingBubbles />
      <p className="relative font-chewy text-2xl text-(--primary)">Algo se mueve en la tina…</p>
      <Bathtub className="relative mt-2 w-[min(240px,62vw)]" />
      <h1 id="patito-intro-title" className="relative mt-4 font-chewy text-[clamp(32px,8.5vw,48px)] leading-tight">
        {names}
      </h1>
      <p className="relative mx-auto mt-2 max-w-xs text-pretty text-(--muted-foreground)">
        Te invitamos a nuestro baby shower{dateLabel ? ` el ${dateLabel}` : ''}.
      </p>
      <button
        type="button"
        autoFocus
        disabled={isOpen}
        className={buttonClass('default', 'lg', 'relative mt-8 rounded-full px-8')}
        onClick={() => {
          open();
          onOpen?.();
        }}
      >
        <Bath aria-hidden="true" />
        ¿Quién está ahí?
      </button>
    </div>
  );
}
