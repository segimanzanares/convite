import { useEffect, useState } from 'react';
import { MailOpen } from 'lucide-react';
import { buttonClass, cn } from '../../../components/ui/styles';
import { Tiara } from './AuroraArt';
import { AuroraSky } from './ui';

interface IntroSheetProps {
  name: string;
  dateLabel: string;
  onOpen?: () => void;
  /** Fires once the sheet has gone and page scroll is unlocked. */
  onOpened?: () => void;
}

const CLOSE_MS = 700;

/**
 * The first screen: a shadcn/ui Sheet that rises from the bottom over the auroras, with the tiara drawing itself.
 * Opening it is the visitor's tap that lets the music start; the sheet slides away and the auroras fade.
 */
export function IntroSheet({ name, dateLabel, onOpen, onOpened }: IntroSheetProps) {
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
    <div className="fixed inset-0 z-[3000] flex items-end justify-center">
      <div
        className={cn('absolute inset-0 bg-(--background) transition-opacity delay-200 duration-500', isOpen && 'opacity-0')}
        aria-hidden="true"
      >
        <AuroraSky />
        <p className="absolute inset-x-0 top-[16%] text-center font-bodoni text-[clamp(120px,32vw,260px)] leading-none italic aurora-text opacity-60 select-none">
          XV
        </p>
      </div>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="aurora-intro-title"
        aria-describedby="aurora-intro-description"
        className={cn(
          'relative w-full max-w-lg rounded-t-[calc(var(--radius)+16px)] border border-b-0 border-(--border) bg-(--card) px-7 pt-3 pb-10 text-center shadow-[0_-20px_60px_-20px_oklch(0.3_0.1_293/0.35)] sm:px-10',
          'transition-transform duration-500 ease-in',
          isOpen ? 'translate-y-full' : 'animate-[auroraSheetUp_0.7s_cubic-bezier(0.22,1,0.36,1)_both]',
        )}
      >
        <span className="mx-auto block h-1.5 w-12 rounded-full bg-(--border)" aria-hidden="true" />
        <Tiara play delay={0.5} className="mx-auto mt-6 w-32" />
        <p className="mt-3 text-xs font-semibold tracking-[0.3em] text-(--primary) uppercase">Mis XV años</p>
        <h1 id="aurora-intro-title" className="mt-2 font-bodoni text-[clamp(38px,9vw,52px)] leading-tight italic">
          {name}
        </h1>
        <p id="aurora-intro-description" className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-(--muted-foreground)">
          Tienes una invitación esperándote{dateLabel ? ` para el ${dateLabel}` : ''}.
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
          <MailOpen aria-hidden="true" />
          Abrir mi invitación
        </button>
      </div>
    </div>
  );
}
