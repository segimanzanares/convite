import { useEffect, useState } from 'react';
import { buttonClass, cn } from '../../../components/ui/styles';
import { Cupcake } from './Illustrations';
import { Sprinkles } from './ui';

interface SweetIntroProps {
  firstName: string;
  age: number;
  onOpen?: () => void;
  /** Fires once the card has gone and page scroll is unlocked. */
  onOpened?: () => void;
}

const CLOSE_MS = 700;

/**
 * The first screen: a cupcake on a round card over a sprinkled strawberry background. Opening it is the visitor's tap
 * that lets the music start; the card bounces away.
 */
export function SweetIntro({ firstName, age, onOpen, onOpened }: SweetIntroProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isHidden ? '' : 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isHidden]);

  useEffect(() => {
    if (!isOpen) return;
    const timer = window.setTimeout(() => setIsHidden(true), CLOSE_MS);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (isHidden) onOpened?.();
  }, [isHidden, onOpened]);

  if (isHidden) return null;

  return (
    <div className={cn('fixed inset-0 z-[3000] flex items-center justify-center bg-(--frosting) p-5 transition-opacity delay-200 duration-500', isOpen && 'opacity-0')}>
      <Sprinkles />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dulce-intro-title"
        className={cn(
          'relative w-full max-w-sm rounded-[calc(var(--radius)+12px)] bg-(--card) px-8 pt-6 pb-8 text-center shadow-[0_20px_50px_-20px_oklch(0.45_0.15_355/0.6)]',
          'transition-transform duration-500 [transition-timing-function:cubic-bezier(0.36,0,0.66,-0.56)]',
          isOpen ? 'translate-y-[120vh]' : 'animate-[fadeUp_0.6s_cubic-bezier(0.34,1.56,0.64,1)_both]',
        )}
      >
        <Cupcake className="dulce-motion mx-auto w-32 animate-[dulceBob_3s_ease-in-out_infinite]" />
        <h1 id="dulce-intro-title" className="mt-4 font-fredoka text-3xl leading-tight font-semibold">
          ¡Tienes una invitación dulcecita!
        </h1>
        <p className="mt-2 text-base text-(--muted-foreground)">
          {age ? `${firstName} cumple ${age} y te quiere en su fiesta.` : `${firstName} te quiere en su fiesta.`}
        </p>
        <button
          type="button"
          autoFocus
          className={buttonClass('default', 'lg', 'mt-6 h-12 w-full rounded-full font-fredoka text-lg font-semibold shadow-[0_6px_0_var(--gold-deep)] active:translate-y-1 active:shadow-[0_2px_0_var(--gold-deep)]')}
          onClick={() => {
            setIsOpen(true);
            onOpen?.();
          }}
        >
          Destapar la invitación
        </button>
      </div>
    </div>
  );
}
