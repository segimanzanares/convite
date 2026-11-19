import { CakeSlice } from 'lucide-react';
import { Confetti } from '../../../components/gender-reveal/Confetti';
import { useIntro } from '../../../components/gender-reveal/useIntro';
import { buttonClass, cn } from '../../../components/ui/styles';
import { BakeryBox } from './DulceArt';

interface IntroScreenProps {
  names: string;
  dateLabel: string;
  onOpen?: () => void;
  /** Fires once the screen has gone and page scroll is unlocked. */
  onOpened?: () => void;
}

const CLOSE_MS = 1300;

/**
 * The first screen: a bakery box with a little cake behind its window. "Abrir la caja" (the visitor's tap that lets
 * the music start) flips the lid open, sprinkles burst out and the screen fades into the invitation.
 */
export function IntroScreen({ names, dateLabel, onOpen, onOpened }: IntroScreenProps) {
  const { isOpen, isHidden, open } = useIntro(CLOSE_MS, onOpened);

  if (isHidden) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dulce-intro-title"
      className={cn(
        'fixed inset-0 z-[3000] flex flex-col items-center justify-center overflow-hidden bg-(--background) px-6 text-center transition-opacity delay-700 duration-500',
        isOpen && 'is-open opacity-0',
      )}
      style={{ backgroundImage: 'radial-gradient(var(--girl-soft) 2px, transparent 2.5px)', backgroundSize: '22px 22px' }}
    >
      {isOpen && <Confetti colors={['--girl', '--boy', '--flame', '--chocolate']} count={50} mode="burst" />}
      <p className="rounded-full bg-(--card) px-4 py-1 text-xs font-bold tracking-[0.22em] text-(--secondary-foreground) uppercase shadow-sm">Recién horneado</p>
      <BakeryBox className="mt-4 w-[min(240px,62vw)]" />
      <h1 id="dulce-intro-title" className="mt-4 font-shrikhand text-[clamp(32px,8.5vw,50px)] leading-tight">
        {names}
      </h1>
      <p className="mx-auto mt-2 max-w-xs text-pretty text-(--muted-foreground)">
        Te mandan algo dulce: una pregunta que se responde con pastel{dateLabel ? ` el ${dateLabel}` : ''}.
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
        <CakeSlice aria-hidden="true" />
        Abrir la caja
      </button>
    </div>
  );
}
