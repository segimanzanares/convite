import { useEffect, useState } from 'react';
import { buttonClass, cn } from '../../../components/ui/styles';
import { Egg } from './Illustrations';
import { CHUNKY, CHUNKY_SM } from './ui';

interface EggIntroProps {
  firstName: string;
  onOpen?: () => void;
  /** Fires once the intro has gone and page scroll is unlocked. */
  onOpened?: () => void;
}

const HATCH_MS = 1100;

/**
 * The first screen: a wobbling dinosaur egg on a chunky card. Tapping it (the visitor's tap that lets the music
 * start) hatches a little dino, and then the card slides away.
 */
export function EggIntro({ firstName, onOpen, onOpened }: EggIntroProps) {
  const [isHatched, setIsHatched] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isHidden ? '' : 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isHidden]);

  useEffect(() => {
    if (!isHatched) return;
    const timer = window.setTimeout(() => setIsHidden(true), HATCH_MS);
    return () => window.clearTimeout(timer);
  }, [isHatched]);

  useEffect(() => {
    if (isHidden) onOpened?.();
  }, [isHidden, onOpened]);

  if (isHidden) return null;

  const hatch = () => {
    if (isHatched) return;
    setIsHatched(true);
    onOpen?.();
  };

  return (
    <div
      className={cn(
        'dino-dots fixed inset-0 z-[3000] flex items-center justify-center bg-(--accent) p-5 transition-opacity delay-700 duration-400',
        isHatched && 'opacity-0',
      )}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dino-intro-title"
        className={cn('w-full max-w-sm rounded-[calc(var(--radius)+8px)] bg-(--card) p-8 text-center animate-[fadeUp_0.6s_ease_both]', CHUNKY)}
      >
        <button
          type="button"
          onClick={hatch}
          aria-label={`Romper el huevo y abrir la invitación de ${firstName}`}
          className="dino-motion mx-auto block w-36 cursor-pointer outline-none focus-visible:ring-[3px] focus-visible:ring-(--ring)/50"
        >
          <Egg hatched={isHatched} className={cn('w-full', !isHatched && 'dino-motion animate-[dinoWobble_1.6s_ease-in-out_infinite] origin-bottom')} />
        </button>
        <h1 id="dino-intro-title" className="mt-6 text-3xl leading-tight font-extrabold">
          {isHatched ? '¡Rawr! ¡Estás invitado!' : '¡Algo está por nacer!'}
        </h1>
        <p className="mt-2 text-base text-(--muted-foreground)">
          {isHatched ? `Abriendo la invitación de ${firstName}…` : `Rompe el huevo para ver la invitación de ${firstName}.`}
        </p>
        <button type="button" autoFocus onClick={hatch} className={buttonClass('default', 'lg', cn('mt-6 w-full rounded-full text-base font-bold', CHUNKY_SM))}>
          ¡Rómpelo!
        </button>
      </div>
    </div>
  );
}
