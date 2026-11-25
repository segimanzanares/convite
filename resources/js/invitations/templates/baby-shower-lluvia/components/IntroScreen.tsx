import { Umbrella as UmbrellaIcon } from 'lucide-react';
import { useIntro } from '../../../components/gender-reveal/useIntro';
import { buttonClass, cn } from '../../../components/ui/styles';
import { HeartDrizzle, RainCloud, Umbrella } from './LluviaArt';

interface IntroScreenProps {
  names: string;
  /** Whether there are two parents-to-be, for the verb. */
  plural: boolean;
  dateLabel: string;
  onOpen?: () => void;
  /** Fires once the screen has gone and page scroll is unlocked. */
  onOpened?: () => void;
}

const CLOSE_MS = 1700;

/**
 * The first screen: "Pronóstico: lluvia de amor", a cloud raining over a folded umbrella. "Abrir el paraguas" (the
 * visitor's tap that lets the music start) opens it, hearts start drifting down and the screen fades into the
 * invitation.
 */
export function IntroScreen({ names, plural, dateLabel, onOpen, onOpened }: IntroScreenProps) {
  const { isOpen, isHidden, open } = useIntro(CLOSE_MS, onOpened);

  if (isHidden) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lluvia-intro-title"
      className={cn(
        'fixed inset-0 z-[3000] flex flex-col items-center justify-center overflow-hidden px-6 text-center transition-opacity delay-[1100ms] duration-500',
        isOpen && 'is-open opacity-0',
      )}
      style={{ background: 'linear-gradient(180deg, var(--muted), var(--background) 60%, var(--secondary))' }}
    >
      {isOpen && <HeartDrizzle />}
      <p className="relative text-sm font-semibold tracking-[0.25em] text-(--primary) uppercase">Pronóstico del día</p>
      <div className="relative mt-2 w-[min(230px,60vw)]">
        <RainCloud className="relative z-10 mx-auto w-[70%]" />
        <Umbrella closed className="mx-auto -mt-12 w-[60%]" />
      </div>
      <h1 id="lluvia-intro-title" className="relative mt-4 font-comfortaa text-[clamp(30px,8vw,44px)] leading-tight font-bold">
        Lluvia de amor
      </h1>
      <p className="relative mx-auto mt-2 max-w-xs text-pretty text-(--muted-foreground)">
        {names} te {plural ? 'esperan' : 'espera'}{dateLabel ? ` el ${dateLabel}` : ''} para celebrar al bebé que viene en camino.
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
        <UmbrellaIcon aria-hidden="true" />
        Abrir el paraguas
      </button>
    </div>
  );
}
