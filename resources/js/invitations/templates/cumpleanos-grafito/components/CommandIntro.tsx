import { useEffect, useState } from 'react';
import { CalendarDays, CornerDownLeft, MapPin, PartyPopper, Search } from 'lucide-react';
import { cn } from '../../../components/ui/styles';
import { Kbd } from './ui';

interface CommandIntroProps {
  firstName: string;
  age: number;
  dateLabel: string;
  place?: string;
  onOpen?: () => void;
  /** Fires once the palette has closed and page scroll is unlocked. */
  onOpened?: () => void;
}

const CLOSE_MS = 400;

/**
 * The first screen, as shadcn/ui's command palette (⌘K): a search box that already found the invitation, and the
 * result to open it. Opening it is the visitor's tap (or Enter) that lets the music start.
 */
export function CommandIntro({ firstName, age, dateLabel, place, onOpen, onOpened }: CommandIntroProps) {
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

  // Escape dismisses the palette too, as in a real one: it opens the invitation.
  useEffect(() => {
    if (isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setIsOpen(true);
      onOpen?.();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onOpen]);

  if (isHidden) return null;

  const details = [
    age > 0 && { icon: PartyPopper, label: `Cumple ${age} años` },
    dateLabel && { icon: CalendarDays, label: dateLabel },
    place && { icon: MapPin, label: place },
  ].filter((detail): detail is { icon: typeof MapPin; label: string } => Boolean(detail));

  return (
    <div className="fixed inset-0 z-[3000] flex items-start justify-center px-4 pt-[18vh]">
      <div
        className={cn('absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300', isOpen && 'opacity-0')}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Invitación al cumpleaños de ${firstName}`}
        className={cn(
          'relative w-full max-w-lg overflow-hidden rounded-[calc(var(--radius)+4px)] border border-(--border) bg-(--card) shadow-2xl',
          'transition-[transform,opacity] duration-300',
          isOpen ? 'scale-95 opacity-0' : 'animate-[fadeUp_0.5s_ease_both]',
        )}
      >
        <div className="flex h-12 items-center gap-2 border-b border-(--border) px-4">
          <Search className="size-4 shrink-0 text-(--muted-foreground)" aria-hidden="true" />
          <p className="flex-1 truncate text-sm">
            invitación de {firstName.toLowerCase()}
            <span className="ml-px inline-block h-4 w-px translate-y-0.5 animate-[pulse_1s_steps(1)_infinite] bg-(--foreground)" aria-hidden="true" />
          </p>
          <Kbd>esc</Kbd>
        </div>
        <div className="p-2">
          <p className="px-2 pt-1 pb-1.5 text-xs font-medium text-(--muted-foreground)">Invitaciones</p>
          <button
            type="button"
            autoFocus
            onClick={() => {
              setIsOpen(true);
              onOpen?.();
            }}
            className="flex w-full cursor-pointer items-center gap-3 rounded-[calc(var(--radius)-2px)] bg-(--accent) px-3 py-3 text-left text-(--accent-foreground) outline-none focus-visible:ring-[3px] focus-visible:ring-(--ring)/50"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-(--primary) text-(--primary-foreground)">
              <PartyPopper className="size-4" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">Abrir la invitación de {firstName}</span>
              <span className="block text-xs opacity-75">Toca aquí o presiona Enter</span>
            </span>
            <Kbd className="border-current/20 bg-transparent text-current">
              <CornerDownLeft className="size-3" aria-hidden="true" />
            </Kbd>
          </button>
          {details.length > 0 && (
            <>
              <p className="px-2 pt-3 pb-1.5 text-xs font-medium text-(--muted-foreground)">Detalles</p>
              <ul>
                {details.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-3 px-3 py-2 text-sm text-(--muted-foreground)">
                    <Icon className="size-4 shrink-0" aria-hidden="true" />
                    <span className="truncate first-letter:uppercase">{label}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        <div className="flex items-center justify-between border-t border-(--border) px-4 py-2.5 text-xs text-(--muted-foreground)">
          <span className="font-space-grotesk font-semibold text-(--foreground)">{age > 0 ? `${firstName} · ${age}` : firstName}</span>
          <span className="flex items-center gap-1.5">
            Abrir <Kbd>↵</Kbd>
          </span>
        </div>
      </div>
    </div>
  );
}
