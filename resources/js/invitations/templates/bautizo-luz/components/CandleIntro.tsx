import { useEffect, useState } from 'react';
import { Flame } from 'lucide-react';
import { buttonClass, cn } from '../../../components/ui/styles';
import { Candle } from './LuzArt';

interface CandleIntroProps {
  name: string;
  dateLabel: string;
  onOpen?: () => void;
  /** Fires once the intro has gone and page scroll is unlocked. */
  onOpened?: () => void;
}

const HIDE_AFTER_MS = 2100;

/**
 * The first screen, in the dark: an unlit baptismal candle and a button to light it. Lighting it is the visitor's tap
 * that lets the music start; the flame catches, its halo fills the screen and the invitation appears.
 */
export function CandleIntro({ name, dateLabel, onOpen, onOpened }: CandleIntroProps) {
  const [isLit, setIsLit] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isHidden ? '' : 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isHidden]);

  useEffect(() => {
    if (!isLit) return;
    const timer = window.setTimeout(() => setIsHidden(true), HIDE_AFTER_MS);
    return () => window.clearTimeout(timer);
  }, [isLit]);

  useEffect(() => {
    if (isHidden) onOpened?.();
  }, [isHidden, onOpened]);

  if (isHidden) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="luz-intro-title"
      className={cn(
        'ui-dark fixed inset-0 z-[3000] flex flex-col items-center justify-center overflow-hidden px-6 text-center',
        'transition-[opacity,visibility] delay-[1400ms] duration-700',
        isLit && 'invisible opacity-0',
      )}
    >
      <div
        className={cn(
          'luz-halo pointer-events-none absolute inset-0 transition-[opacity,transform] duration-[1600ms] ease-out',
          isLit ? 'scale-[2.6] opacity-100' : 'scale-50 opacity-0',
        )}
        aria-hidden="true"
      />
      <Candle lit={isLit} catchFire className="relative h-[min(220px,34vh)] w-auto animate-[fadeUp_1s_0.2s_both]" />
      <p className="relative mt-8 text-xs font-semibold tracking-[0.35em] text-(--primary) uppercase animate-[fadeUp_1s_0.4s_both]">
        Sacramento del bautismo
      </p>
      <h1 id="luz-intro-title" className="relative mt-3 font-newsreader text-[clamp(40px,10vw,64px)] leading-tight font-light italic animate-[fadeUp_1s_0.5s_both]">
        {name}
      </h1>
      <p className="relative mt-3 max-w-xs text-sm leading-relaxed text-(--muted-foreground) animate-[fadeUp_1s_0.6s_both]">
        {isLit ? 'Que esta luz te acompañe siempre.' : `Enciende la vela para abrir la invitación${dateLabel ? ` del ${dateLabel}` : ''}.`}
      </p>
      <button
        type="button"
        autoFocus
        disabled={isLit}
        className={buttonClass('default', 'lg', 'relative mt-8 rounded-full px-8 animate-[fadeUp_1s_0.7s_both]')}
        onClick={() => {
          setIsLit(true);
          onOpen?.();
        }}
      >
        <Flame aria-hidden="true" />
        Encender la vela
      </button>
    </div>
  );
}
