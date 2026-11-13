import { useEffect, useState } from 'react';
import { Ticket } from 'lucide-react';
import { buttonClass, cn } from '../../../components/ui/styles';
import { Spotlights } from './DiscoArt';

interface TicketIntroProps {
  firstName: string;
  monogram: string;
  /** e.g. "12.06.2027". */
  dateLabel: string;
  onOpen?: () => void;
  /** Fires once the ticket has gone and page scroll is unlocked. */
  onOpened?: () => void;
}

const CLOSE_MS = 1000;

/** A barcode of thin and thick bars, from the initials so it changes with each invitation. */
function Barcode({ seed }: { seed: string }) {
  const widths = Array.from({ length: 34 }, (_, index) => 1 + ((seed.charCodeAt(index % seed.length) * (index + 3)) % 3));

  return (
    <div className="flex h-10 items-stretch gap-[2px]" aria-hidden="true">
      {widths.map((width, index) => (
        <span key={index} className="bg-(--foreground)/80" style={{ width }} />
      ))}
    </div>
  );
}

/**
 * The first screen: a VIP pass to the party under the spotlights. Tapping it is the visitor's tap that lets the music
 * start; the stub tears off and falls while the pass lifts away.
 */
export function TicketIntro({ firstName, monogram, dateLabel, onOpen, onOpened }: TicketIntroProps) {
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
      <div className={cn('absolute inset-0 bg-(--background) transition-opacity delay-500 duration-500', isOpen && 'opacity-0')} aria-hidden="true">
        <Spotlights />
      </div>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="disco-intro-title"
        className={cn(
          'relative w-full max-w-[340px] animate-[fadeUp_0.7s_cubic-bezier(0.34,1.56,0.64,1)_both]',
          isOpen && 'pointer-events-none',
        )}
      >
        <div
          className={cn(
            'disco-neon-frame relative rounded-t-[calc(var(--radius)+8px)] px-7 pt-8 pb-7 text-center transition-[transform,opacity] delay-300 duration-500',
            isOpen && '-translate-y-24 scale-105 opacity-0',
          )}
        >
          <p className="font-unbounded text-[10px] tracking-[0.35em] text-(--accent-foreground) uppercase">Pase VIP · Admite uno</p>
          <p className="mt-5 font-unbounded text-7xl leading-none font-extrabold disco-gradient-text">XV</p>
          <h1 id="disco-intro-title" className="mt-4 font-unbounded text-2xl font-semibold">
            La fiesta de {firstName}
          </h1>
          <p className="mt-2 text-sm text-(--muted-foreground)">Tu entrada a una noche para bailar sin parar.</p>
          <button
            type="button"
            autoFocus
            className={buttonClass('default', 'lg', 'mt-7 w-full rounded-full font-semibold shadow-[0_0_24px_-4px_var(--neon-pink)]')}
            onClick={() => {
              setIsOpen(true);
              onOpen?.();
            }}
          >
            <Ticket aria-hidden="true" />
            Entrar a la fiesta
          </button>
        </div>
        {/* The perforation between the pass and its stub, with the two notches. */}
        <div className={cn('relative h-0 border-t-2 border-dashed border-(--border) transition-opacity', isOpen && 'opacity-0')} aria-hidden="true">
          <span className="absolute -top-3 -left-3 size-6 rounded-full bg-(--background)" />
          <span className="absolute -top-3 -right-3 size-6 rounded-full bg-(--background)" />
        </div>
        <div
          className={cn(
            'disco-neon-frame flex items-center justify-between gap-4 rounded-b-[calc(var(--radius)+8px)] px-7 py-5',
            isOpen && 'animate-[discoTear_0.7s_ease-in_forwards]',
          )}
          aria-hidden="true"
        >
          <div className="text-left">
            <p className="font-unbounded text-lg font-semibold">{monogram}</p>
            <p className="text-xs text-(--muted-foreground) tabular-nums">{dateLabel}</p>
          </div>
          <Barcode seed={monogram || 'XV'} />
        </div>
      </div>
    </div>
  );
}
