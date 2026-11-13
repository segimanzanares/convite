import { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { buttonClass, cn } from '../../../components/ui/styles';
import { Ampersand } from './ui';

interface IntroDrawerProps {
  names: [string, string];
  dateLabel: string;
  onOpen?: () => void;
  /** Fires once the drawer has slid away and page scroll is unlocked. */
  onOpened?: () => void;
}

const SLIDE_OUT_MS = 600;

/**
 * The first screen: a shadcn/ui-style drawer over the dimmed hero. Opening it is the visitor's tap that lets the music
 * start; the drawer slides down and the page scrolls again.
 */
export function IntroDrawer({ names, dateLabel, onOpen, onOpened }: IntroDrawerProps) {
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
    const timer = window.setTimeout(() => setIsHidden(true), SLIDE_OUT_MS);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (isHidden) onOpened?.();
  }, [isHidden, onOpened]);

  if (isHidden) return null;

  return (
    <div className="fixed inset-0 z-[3000]">
      <div
        className={cn(
          'absolute inset-0 bg-[oklch(0.129_0.042_264.695/0.55)] backdrop-blur-[2px] transition-opacity duration-500',
          isOpen && 'opacity-0',
        )}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="boda-serena-intro-title"
        className={cn(
          'ui-dark absolute inset-x-0 bottom-0 mx-auto max-w-lg rounded-t-[calc(var(--radius)+12px)] border border-b-0 border-(--border) px-6 pt-3 pb-10 text-center shadow-2xl',
          'transition-transform duration-[600ms] [transition-timing-function:cubic-bezier(0.32,0.72,0,1)]',
          isOpen ? 'translate-y-full' : 'animate-[drawerUp_0.7s_cubic-bezier(0.32,0.72,0,1)_both]',
        )}
      >
        <div className="mx-auto h-1.5 w-12 rounded-full bg-(--muted)" aria-hidden="true" />
        <p className="mt-8 text-xs font-semibold tracking-[0.2em] text-(--primary) uppercase">Una invitación para ti</p>
        <h1 id="boda-serena-intro-title" className="mt-4 font-fraunces text-4xl font-medium tracking-tight sm:text-5xl">
          {names[0]} <Ampersand className="text-(--primary)" /> {names[1]}
        </h1>
        {dateLabel && <p className="mt-3 text-sm text-(--muted-foreground)">{dateLabel}</p>}
        <button
          type="button"
          autoFocus
          className={buttonClass('default', 'lg', 'mt-8 w-full rounded-full')}
          onClick={() => {
            setIsOpen(true);
            onOpen?.();
          }}
        >
          <ChevronUp aria-hidden="true" />
          Ver la invitación
        </button>
      </div>
    </div>
  );
}
