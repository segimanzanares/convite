import { useEffect, useState } from 'react';
import type { CoupleInfo } from '../../types/wedding';

interface EnvelopeProps {
  couple: CoupleInfo;
  onOpen?: () => void;
}

export function Envelope({ couple, onOpen }: EnvelopeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [firstName, secondName] = couple.names;
  const initials = `${firstName.charAt(0)}${secondName.charAt(0)}`;

  useEffect(() => {
    document.body.style.overflow = isHidden ? '' : 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isHidden]);

  useEffect(() => {
    if (!isOpen) return;
    const timer = window.setTimeout(() => setIsHidden(true), 1800);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  if (isHidden) return null;

  return (
    <div
      className={[
        'fixed inset-0 z-[3000] flex flex-col items-center justify-center gap-8',
        '[background:radial-gradient(circle_at_50%_40%,#2a1d0d_0%,#120c04_65%,#000_100%)]',
        'transition-[opacity,visibility] duration-[900ms] delay-[900ms]',
        isOpen ? 'opacity-0 invisible pointer-events-none' : 'opacity-100 visible',
      ].join(' ')}
      aria-hidden={isOpen}
    >
      <div className="[perspective:1600px] flex flex-col items-center gap-6">
        <button
          type="button"
          className={[
            'relative w-[min(320px,78vw)] h-[min(210px,51vw)] border-none bg-transparent p-0 cursor-pointer',
            '[transform-style:preserve-3d] animate-[envelopeDrop_1s_cubic-bezier(0.34,1.56,0.64,1)_0.2s_both]',
            'motion-reduce:animate-none motion-reduce:duration-200',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-light focus-visible:outline-offset-8',
          ].join(' ')}
          onClick={() => {
            setIsOpen(true);
            onOpen?.();
          }}
          aria-label={`Abrir la invitación de ${firstName} y ${secondName}`}
        >
          <span className="absolute inset-0 overflow-hidden rounded-[4px] shadow-[0_20px_60px_rgba(0,0,0,0.5)] z-[1]">
            <span className="absolute inset-0 bg-[linear-gradient(160deg,var(--color-cream),var(--color-off-white))]" />
            <span className="absolute inset-0 bg-[linear-gradient(160deg,var(--color-gold-pale),var(--color-off-white))] [clip-path:polygon(0_0,50%_50%,0_100%)] brightness-[0.94]" />
            <span className="absolute inset-0 bg-[linear-gradient(160deg,var(--color-gold-pale),var(--color-off-white))] [clip-path:polygon(100%_0,50%_50%,100%_100%)] brightness-90" />
            <span className="absolute inset-0 bg-[linear-gradient(160deg,var(--color-gold-pale),var(--color-off-white))] [clip-path:polygon(0_100%,100%_100%,50%_50%)] brightness-[1.05] z-[2]" />
            <span
              className={[
                'absolute left-[6%] right-[6%] bottom-[6%] h-[80%] z-[3] bg-ivory border border-gold-light rounded-[2px]',
                'flex flex-col items-center justify-center gap-1.5',
                'transition-transform duration-[1100ms] [transition-timing-function:cubic-bezier(0.65,0,0.35,1)] delay-[500ms]',
                'shadow-[0_-6px_20px_rgba(0,0,0,0.08)]',
                'motion-reduce:animate-none motion-reduce:duration-200',
                isOpen ? 'translate-y-[-135%]' : 'translate-y-[72%]',
              ].join(' ')}
            >
              <span className="font-script text-[30px] text-gold-deep">{initials}</span>
              <span className="font-display text-[9px] tracking-[0.3em] text-gold uppercase">
                {firstName} &amp; {secondName}
              </span>
            </span>
          </span>
          <span
            className={[
              'absolute top-0 left-0 w-full h-[52%] z-[4]',
              'bg-[linear-gradient(160deg,var(--color-gold-light),var(--color-gold))]',
              '[clip-path:polygon(0_0,100%_0,50%_100%)] [transform-origin:top_center]',
              'transition-transform duration-[900ms] [transition-timing-function:cubic-bezier(0.65,0,0.35,1)]',
              '[backface-visibility:hidden] shadow-[0_2px_10px_rgba(0,0,0,0.15)]',
              'motion-reduce:animate-none motion-reduce:duration-200',
              isOpen ? '[transform:rotateX(180deg)]' : '[transform:rotateX(0deg)]',
            ].join(' ')}
          />
          <span
            className={[
              'absolute top-[calc(52%-22px)] left-1/2 w-11 h-11 rounded-full z-[5]',
              'bg-[radial-gradient(circle_at_35%_30%,var(--color-gold-light),var(--color-gold-deep))]',
              'text-ivory font-display text-[15px] tracking-[0.05em] flex items-center justify-center',
              'shadow-[0_3px_10px_rgba(0,0,0,0.35),inset_0_1px_2px_rgba(255,255,255,0.4)]',
              'transition-[transform,opacity] duration-[500ms] ease delay-[150ms]',
              'motion-reduce:animate-none motion-reduce:duration-200',
              isOpen ? '[transform:translate(-50%,-10px)_scale(0)] opacity-0' : '[transform:translate(-50%,0)_scale(1)]',
            ].join(' ')}
          >
            {initials}
          </span>
        </button>
        <p
          className={[
            'font-display text-[11px] tracking-[0.35em] uppercase text-gold-light',
            'motion-reduce:animate-none motion-reduce:duration-200',
            isOpen
              ? 'opacity-0 animate-none transition-opacity duration-[400ms] ease'
              : 'opacity-[0.85] animate-[envelopeHintPulse_2.2s_ease-in-out_infinite]',
          ].join(' ')}
        >
          {isOpen ? 'Abriendo…' : 'Toca el sobre para abrir'}
        </p>
      </div>
    </div>
  );
}
