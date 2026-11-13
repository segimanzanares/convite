import { useEffect, useState } from 'react';
import { MailOpen } from 'lucide-react';
import { buttonClass, capitalize, cn } from './styles';
import { Ampersand } from './ui';

interface IntroDialogProps {
  names: [string, string];
  dateLabel: string;
  onOpen?: () => void;
  /** Fires once the dialog has faded out and page scroll is unlocked. */
  onOpened?: () => void;
}

const FADE_OUT_MS = 500;

/**
 * The first screen: a shadcn/ui-style dialog over the blurred page. Opening it is the visitor's tap that lets the
 * music start; the page scrolls again once it is gone.
 */
export function IntroDialog({ names, dateLabel, onOpen, onOpened }: IntroDialogProps) {
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
    const timer = window.setTimeout(() => setIsHidden(true), FADE_OUT_MS);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (isHidden) onOpened?.();
  }, [isHidden, onOpened]);

  if (isHidden) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-[3000] flex items-center justify-center bg-black/60 p-5 backdrop-blur-sm transition-opacity duration-500',
        isOpen ? 'opacity-0' : 'animate-[fadeIn_0.4s_ease_both]',
      )}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="boda-moderna-intro-title"
        className={cn(
          'w-full max-w-sm rounded-(--radius) border border-(--border) bg-(--background) p-6 text-center shadow-2xl',
          'transition-transform duration-500',
          isOpen ? 'scale-95' : 'animate-[fadeUp_0.5s_0.1s_ease_both]',
        )}
      >
        <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-(--border) bg-(--muted)">
          <MailOpen className="size-5" aria-hidden="true" />
        </div>
        <p className="mt-5 text-sm text-(--muted-foreground)">Tienes una invitación de</p>
        <h1 id="boda-moderna-intro-title" className="mt-1 text-2xl font-semibold tracking-tight">
          {names[0]} <Ampersand /> {names[1]}
        </h1>
        {dateLabel && <p className="mt-2 text-sm text-(--muted-foreground)">{capitalize(dateLabel)}</p>}
        <button
          type="button"
          autoFocus
          className={buttonClass('default', 'lg', 'mt-6 w-full')}
          onClick={() => {
            setIsOpen(true);
            onOpen?.();
          }}
        >
          Abrir invitación
        </button>
      </div>
    </div>
  );
}
