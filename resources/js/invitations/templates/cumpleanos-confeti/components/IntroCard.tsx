import { useEffect, useState } from 'react';
import { Gift } from 'lucide-react';
import { buttonClass, cn } from '../../../components/ui/styles';
import { ConfettiBurst } from './ui';

interface IntroCardProps {
  firstName: string;
  age: number;
  hosts: string;
  initials: string;
  onOpen?: () => void;
  /** Fires once the card has gone and page scroll is unlocked. */
  onOpened?: () => void;
}

const CLOSE_MS = 900;

/**
 * The first screen: a shadcn/ui AlertDialog-like card over a blurred page. Opening it is the visitor's tap that lets
 * the music start; the card pops away in a burst of confetti.
 */
export function IntroCard({ firstName, age, hosts, initials, onOpen, onOpened }: IntroCardProps) {
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
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-5">
      <div
        className={cn(
          'confeti-wash absolute inset-0 bg-(--background)/80 backdrop-blur-md transition-opacity delay-300 duration-500',
          isOpen && 'opacity-0',
        )}
        aria-hidden="true"
      />
      {isOpen && <ConfettiBurst />}
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confeti-intro-title"
        aria-describedby="confeti-intro-description"
        className={cn(
          'relative w-full max-w-sm rounded-[calc(var(--radius)+8px)] border border-(--border) bg-(--card) p-8 text-center shadow-2xl',
          'transition-[transform,opacity] duration-300 ease-out',
          isOpen ? 'scale-90 opacity-0' : 'animate-[fadeUp_0.6s_cubic-bezier(0.34,1.56,0.64,1)_both]',
        )}
      >
        <span className="mx-auto flex size-20 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--primary),var(--confetti-lilac))] font-dm-serif text-3xl text-(--primary-foreground) shadow-lg ring-4 ring-(--secondary)">
          {initials}
        </span>
        <h1 id="confeti-intro-title" className="mt-6 font-dm-serif text-3xl leading-tight">
          ¡Tienes una invitación!
        </h1>
        <p id="confeti-intro-description" className="mt-3 text-sm leading-relaxed text-(--muted-foreground)">
          {hosts ? `${hosts} te invitan` : 'Te invitamos'} a celebrar {age ? `los ${age} de ${firstName}` : `el cumpleaños de ${firstName}`}.
        </p>
        <button
          type="button"
          autoFocus
          className={buttonClass('default', 'lg', 'mt-8 w-full rounded-full')}
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
