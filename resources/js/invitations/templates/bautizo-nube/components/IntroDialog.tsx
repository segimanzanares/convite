import { useEffect, useState } from 'react';
import { Gift } from 'lucide-react';
import { buttonClass, cn } from '../../../components/ui/styles';
import { BabyMobile, CloudPuffs } from './NubeArt';

interface IntroDialogProps {
  name: string;
  dateLabel: string;
  onOpen?: () => void;
  /** Fires once the dialog has gone and page scroll is unlocked. */
  onOpened?: () => void;
}

const CLOSE_MS = 650;

/**
 * The first screen: a shadcn/ui Dialog over a sky of clouds, with the crib mobile hanging above the baby's name.
 * Opening it is the visitor's tap that lets the music start; the dialog zooms away and the sky fades.
 */
export function IntroDialog({ name, dateLabel, onOpen, onOpened }: IntroDialogProps) {
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
    <div className="fixed inset-0 z-[3000] flex items-center justify-center px-5">
      <div
        className={cn(
          'absolute inset-0 bg-[linear-gradient(180deg,var(--sky)_0%,var(--secondary)_55%,var(--background)_100%)] transition-opacity duration-500',
          isOpen && 'opacity-0',
        )}
        aria-hidden="true"
      >
        <CloudPuffs />
      </div>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="nube-intro-title"
        aria-describedby="nube-intro-description"
        className={cn(
          'relative w-full max-w-sm rounded-[calc(var(--radius)+8px)] border border-(--border) bg-(--card) px-7 pt-2 pb-8 text-center shadow-[0_30px_80px_-30px_oklch(0.4_0.1_240/0.5)]',
          'transition-[transform,opacity] duration-500 ease-in',
          isOpen ? 'scale-90 opacity-0' : 'animate-[nubeDialogIn_0.6s_cubic-bezier(0.22,1,0.36,1)_both]',
        )}
      >
        <BabyMobile play delay={0.3} className="mx-auto -mb-6 w-48" />
        <p className="text-xs font-bold tracking-[0.2em] text-(--primary) uppercase">Mi bautizo</p>
        <h1 id="nube-intro-title" className="mt-2 font-young-serif text-[clamp(32px,9vw,42px)] leading-tight">
          {name}
        </h1>
        <p id="nube-intro-description" className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-(--muted-foreground)">
          Llegó una invitación muy especial para ti{dateLabel ? `, para el ${dateLabel}` : ''}.
        </p>
        <button
          type="button"
          autoFocus
          className={buttonClass('default', 'lg', 'mt-7 w-full rounded-full')}
          onClick={() => {
            setIsOpen(true);
            onOpen?.();
          }}
        >
          <Gift aria-hidden="true" />
          Abrir invitación
        </button>
      </div>
    </div>
  );
}
