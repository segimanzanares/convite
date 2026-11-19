import { Gift } from 'lucide-react';
import { useIntro } from '../../../components/gender-reveal/useIntro';
import { buttonClass, cn } from '../../../components/ui/styles';
import { GiftBox } from './OsitoArt';

interface IntroScreenProps {
  names: string;
  dateLabel: string;
  onOpen?: () => void;
  /** Fires once the screen has gone and page scroll is unlocked. */
  onOpened?: () => void;
}

const CLOSE_MS = 1500;

/**
 * The first screen: a gift box tied with a rose and a blue ribbon. "Abrir la caja" (the visitor's tap that lets the
 * music start) sends the lid flying, the bear peeks out and the screen fades into the invitation.
 */
export function IntroScreen({ names, dateLabel, onOpen, onOpened }: IntroScreenProps) {
  const { isOpen, isHidden, open } = useIntro(CLOSE_MS, onOpened);

  if (isHidden) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="osito-intro-title"
      className={cn(
        'fixed inset-0 z-[3000] flex flex-col items-center justify-center px-6 text-center transition-opacity delay-[900ms] duration-500',
        isOpen && 'is-open opacity-0',
      )}
      style={{ background: 'radial-gradient(circle at 50% 38%, var(--card), var(--background) 55%, var(--secondary))' }}
    >
      <p className="font-caveat text-3xl text-(--primary)">Una cajita para ti</p>
      <GiftBox className="mt-2 w-[min(230px,58vw)]" />
      <h1 id="osito-intro-title" className="mt-6 font-lora text-[clamp(30px,8vw,46px)] leading-tight">
        {names}
      </h1>
      <p className="mx-auto mt-2 max-w-xs text-pretty text-(--muted-foreground)">
        Adentro hay alguien que quiere saber si viene un osito o una osita{dateLabel ? `, el ${dateLabel}` : ''}.
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
        <Gift aria-hidden="true" />
        Abrir la caja
      </button>
    </div>
  );
}
