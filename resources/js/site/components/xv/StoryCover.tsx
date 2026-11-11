import { useEffect, useState } from 'react';
import { Fireflies } from './Fireflies';

interface StoryCoverProps {
  /** Initials stamped on the wax seal. */
  monogram: string;
  /** Name written in script on the cover. */
  name: string;
  /** Small caps line under the name, e.g. "Mis XV años · 05.12.2026". */
  subtitle: string;
  /** Line above the book, e.g. "Un cuento está por comenzar". */
  kicker?: string;
  /** Small caps line at the top of the cover. */
  coverEyebrow?: string;
  /** Script line on the first page, revealed as the cover swings open. */
  firstPageLine?: string;
  /** Who the invitation is from, read out by screen readers. */
  ariaName: string;
  onOpen?: () => void;
  /** Fires once the cover has faded out and page scroll is unlocked. */
  onOpened?: () => void;
}

const HIDE_AFTER_MS = 2900;

/**
 * Storybook intro: a closed book whose cover swings open on its spine when
 * the visitor taps it, revealing the first page before fading into the
 * invitation. Plays the same role as Envelope (scroll lock + open callbacks).
 */
export function StoryCover({
  monogram,
  name,
  subtitle,
  kicker = 'Un cuento está por comenzar',
  coverEyebrow = 'Un sueño hecho realidad',
  firstPageLine = 'Érase una vez…',
  ariaName,
  onOpen,
  onOpened,
}: StoryCoverProps) {
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
    const timer = window.setTimeout(() => setIsHidden(true), HIDE_AFTER_MS);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (isHidden) onOpened?.();
  }, [isHidden, onOpened]);

  if (isHidden) return null;

  return (
    <div
      className={[
        'fixed inset-0 z-[3000] flex flex-col items-center justify-center gap-7 px-6 overflow-hidden',
        '[background:var(--envelope-bg)]',
        'transition-[opacity,visibility] duration-[800ms] delay-[1900ms]',
        isOpen ? 'opacity-0 invisible pointer-events-none' : 'opacity-100 visible',
      ].join(' ')}
      aria-hidden={isOpen}
    >
      <Fireflies count={28} />

      <p
        className={[
          'relative font-display text-[10px] sm:text-[11px] tracking-[0.45em] uppercase text-gold-light text-center',
          'opacity-0 animate-[fadeUp_1.2s_0.2s_forwards]',
          'transition-opacity duration-500',
          isOpen ? '!opacity-0' : '',
        ].join(' ')}
      >
        {kicker}
      </p>

      <div className="relative animate-[envelopeDrop_1.1s_cubic-bezier(0.34,1.56,0.64,1)_0.3s_both] motion-reduce:animate-none">
        <button
          type="button"
          onClick={() => {
            if (isOpen) return;
            setIsOpen(true);
            onOpen?.();
          }}
          aria-label={`Abrir la invitación de ${ariaName}`}
          className={[
            'group relative block w-[min(300px,74vw)] aspect-[3/4.1] p-0 border-none bg-transparent cursor-pointer',
            // Perspective lives here but the button stays flat (no preserve-3d): its
            // children paint in DOM order, so the cover always draws over the first
            // page. A shared 3D context would depth-sort the two nearly coplanar
            // planes and let the page bleed through while the cover starts to swing.
            '[perspective:1800px]',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-light focus-visible:outline-offset-8',
          ].join(' ')}
        >
          {/* First page, revealed under the cover */}
          <span className="absolute inset-0 rounded-r-[6px] rounded-l-[2px] bg-[linear-gradient(100deg,var(--color-off-white)_0%,var(--color-ivory)_18%,var(--color-cream)_100%)] shadow-[0_24px_60px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center gap-4 px-6">
            <span className="absolute inset-3 border border-gold/40 rounded-[2px]" />
            <span className="font-script text-[clamp(34px,10vw,46px)] text-gold-deep leading-tight">{firstPageLine}</span>
            <span className="w-16 h-px bg-[linear-gradient(to_right,transparent,var(--color-gold),transparent)]" />
            <span className="font-display text-[9px] tracking-[0.4em] text-gold uppercase">Capítulo XV</span>
          </span>

          {/* Page edges peeking out on the right */}
          <span className="absolute top-[6px] bottom-[6px] -right-[5px] w-[6px] rounded-r-[3px] bg-[repeating-linear-gradient(to_bottom,var(--color-ivory)_0_2px,var(--color-off-white)_2px_3px)] shadow-[2px_0_6px_rgba(0,0,0,0.3)]" />

          {/* Cover, hinged on its spine */}
          <span
            className={[
              'absolute inset-0 [transform-origin:left_center] [transform-style:preserve-3d]',
              'transition-transform duration-[1600ms] [transition-timing-function:cubic-bezier(0.6,0.05,0.25,1)] delay-[250ms]',
              'motion-reduce:duration-300 motion-reduce:delay-0',
              isOpen
                ? '[transform:rotateY(-168deg)]'
                : '[transform:rotateY(0deg)] group-hover:[transform:rotateY(-6deg)]',
            ].join(' ')}
          >
            {/* Front */}
            <span className="absolute inset-0 [backface-visibility:hidden] rounded-r-[6px] rounded-l-[2px] overflow-hidden bg-[linear-gradient(150deg,var(--dark-to),var(--dark-from))] shadow-[0_24px_60px_rgba(0,0,0,0.55),inset_0_0_0_1px_color-mix(in_srgb,var(--gold)_40%,transparent)] flex flex-col items-center justify-center text-center px-6">
              {/* Spine */}
              <span className="absolute left-0 inset-y-0 w-[14px] bg-[linear-gradient(to_right,rgba(0,0,0,0.35),rgba(255,255,255,0.06),transparent)]" />
              {/* Double gold frame */}
              <span className="absolute inset-[14px] border border-gold/60 rounded-[2px]" />
              <span className="absolute inset-[19px] border border-gold/25 rounded-[2px]" />
              {/* Arched window motif */}
              <span className="absolute left-1/2 -translate-x-1/2 top-[34px] w-[62%] h-[56%] rounded-t-full border border-gold/30" />

              <span className="relative font-display text-[8px] tracking-[0.42em] text-gold-light/80 uppercase mb-3">
                {coverEyebrow}
              </span>
              <span className="relative font-script text-[clamp(38px,11vw,50px)] leading-[1.05] text-gold-light [text-shadow:0_2px_18px_rgba(0,0,0,0.35)]">
                {name}
              </span>
              <span className="relative w-14 h-px my-4 bg-[linear-gradient(to_right,transparent,var(--color-gold-light),transparent)]" />
              <span className="relative font-display text-[9px] tracking-[0.38em] text-gold-light/90 uppercase">
                {subtitle}
              </span>

              {/* Wax seal */}
              <span
                className={[
                  'absolute bottom-[34px] left-1/2 -ml-[27px] w-[54px] h-[54px] rounded-full',
                  'bg-[radial-gradient(circle_at_35%_30%,var(--color-gold-light),var(--color-gold)_55%,color-mix(in_srgb,var(--color-gold)_60%,black))]',
                  'flex items-center justify-center font-display text-[15px] tracking-[0.06em] text-[var(--dark-from)]',
                  'shadow-[0_4px_14px_rgba(0,0,0,0.35)]',
                  'transition-[transform,opacity] duration-500',
                  isOpen
                    ? 'scale-0 opacity-0'
                    : 'animate-[sealBreathe_2.4s_ease-in-out_infinite] motion-reduce:animate-none',
                ].join(' ')}
              >
                <span className="absolute inset-[5px] rounded-full border border-[var(--dark-from)]/25" />
                {monogram}
              </span>
            </span>

            {/* Inside of the cover */}
            <span className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-l-[6px] rounded-r-[2px] bg-[linear-gradient(260deg,var(--color-gold-pale),var(--color-off-white))] shadow-[0_24px_60px_rgba(0,0,0,0.4)]">
              <span className="absolute inset-3 border border-gold/30 rounded-[2px]" />
            </span>
          </span>
        </button>
      </div>

      <p
        className={[
          'relative font-display text-[10px] tracking-[0.35em] uppercase text-gold-light',
          isOpen
            ? 'opacity-0 transition-opacity duration-[400ms]'
            : 'opacity-[0.85] animate-[envelopeHintPulse_2.2s_ease-in-out_infinite]',
        ].join(' ')}
      >
        {isOpen ? 'Abriendo…' : 'Toca el sello para abrir'}
      </p>
    </div>
  );
}
