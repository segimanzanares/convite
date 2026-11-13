import { useEffect, useRef, useState, type ComponentType } from 'react';
import { Check, ChevronDown, ChevronLeft, ChevronRight, Copy, ExternalLink, Info, Sparkles } from 'lucide-react';
import { Lightbox } from '../../../components/gallery/Lightbox';
import { BankIcon, EnvelopeIcon, GiftBoxIcon } from '../../../components/gifts/GiftIcons';
import { Reveal } from '../../../components/shared/Reveal';
import { Card, Section } from '../../../components/ui/primitives';
import { buttonClass, cn } from '../../../components/ui/styles';
import { copyToClipboard } from '../../../utils/clipboard';
import type { DressCodeData, GalleryImage, GiftKind, GiftOption } from '../../../types/wedding';
import { RibbonDivider } from './AuroraArt';
import { SectionTitle } from './ui';

/**
 * The photos as a shadcn/ui-like Carousel: a snapping track of rounded cards with previous / next buttons and a dot per
 * photo. Each photo opens the shared lightbox.
 */
export function GallerySection({ images }: { images: GalleryImage[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () => {
      const slide = track.firstElementChild as HTMLElement | null;
      const step = slide ? slide.offsetWidth + 16 : track.clientWidth;
      setCurrent(Math.min(images.length - 1, Math.round(track.scrollLeft / step)));
    };
    track.addEventListener('scroll', update, { passive: true });
    return () => track.removeEventListener('scroll', update);
  }, [images.length]);

  const scrollTo = (index: number) => {
    const slide = trackRef.current?.children[index] as HTMLElement | undefined;
    slide?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  };

  return (
    <Section>
      <SectionTitle eyebrow="Recuerdos" title="Quince años en momentos" description="Algunas fotos de todo lo que me trajo hasta aquí." />
      <Reveal>
        <div ref={trackRef} className="aurora-track -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-2 sm:mx-0 sm:scroll-px-0 sm:px-0">
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setOpenIndex(index)}
              aria-label={`Ver la foto${image.caption ? `: ${image.caption}` : ` ${index + 1}`}`}
              className="group relative aspect-[4/5] w-[78%] shrink-0 cursor-zoom-in snap-start overflow-hidden rounded-[calc(var(--radius)+6px)] border border-(--border) bg-(--secondary) outline-none focus-visible:ring-[3px] focus-visible:ring-(--ring)/50 sm:w-[calc((100%-32px)/3)]"
            >
              <img src={image.src} alt={image.alt} loading="lazy" className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
              {image.caption && (
                <span className="absolute inset-x-0 bottom-0 bg-[linear-gradient(to_top,oklch(0.25_0.1_293/0.75),transparent)] px-4 pt-10 pb-4 text-left text-sm font-semibold text-white">
                  {image.caption}
                </span>
              )}
            </button>
          ))}
        </div>
        {images.length > 1 && (
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              type="button"
              className={buttonClass('outline', 'icon', 'rounded-full')}
              onClick={() => scrollTo(Math.max(0, current - 1))}
              disabled={current === 0}
              aria-label="Foto anterior"
            >
              <ChevronLeft aria-hidden="true" />
            </button>
            <div className="flex gap-1.5">
              {images.map((image, index) => (
                <button
                  key={image.src}
                  type="button"
                  onClick={() => scrollTo(index)}
                  aria-label={`Ir a la foto ${index + 1}`}
                  aria-current={index === current}
                  className={cn(
                    'h-2 cursor-pointer rounded-full transition-[width,background-color]',
                    index === current ? 'w-6 bg-(--primary)' : 'w-2 bg-(--border) hover:bg-(--input)',
                  )}
                />
              ))}
            </div>
            <button
              type="button"
              className={buttonClass('outline', 'icon', 'rounded-full')}
              onClick={() => scrollTo(Math.min(images.length - 1, current + 1))}
              disabled={current === images.length - 1}
              aria-label="Foto siguiente"
            >
              <ChevronRight aria-hidden="true" />
            </button>
          </div>
        )}
      </Reveal>
      <Lightbox
        images={images}
        currentIndex={openIndex ?? 0}
        isOpen={openIndex !== null}
        onClose={() => setOpenIndex(null)}
        onNavigate={(direction) => setOpenIndex((index) => (index === null ? null : (index + direction + images.length) % images.length))}
      />
    </Section>
  );
}

/** The attire on one card: the type, a tile per look and the reserved color as an alert. */
export function DressCodeSection({ dressCode }: { dressCode: DressCodeData }) {
  const looks = [
    { emoji: '👗', label: 'Ellas', value: dressCode.women },
    { emoji: '🤵', label: 'Ellos', value: dressCode.men },
  ].filter((look): look is { emoji: string; label: string; value: string } => Boolean(look.value));

  return (
    <Section className="bg-(--muted)">
      <SectionTitle eyebrow="Qué ponerte" title="Código de vestimenta" />
      <Reveal className="mx-auto max-w-2xl">
        <Card className="p-7 text-center sm:p-10">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-(--secondary) text-(--secondary-foreground)">
            <Sparkles className="size-5" aria-hidden="true" />
          </span>
          <p className="mt-5 font-bodoni text-[clamp(38px,6vw,52px)] leading-none italic">{dressCode.type}</p>
          {dressCode.description && <p className="mx-auto mt-4 max-w-md leading-relaxed text-(--muted-foreground)">{dressCode.description}</p>}
          {looks.length > 0 && (
            <dl className={cn('mt-8 grid gap-3 text-left', looks.length > 1 && 'sm:grid-cols-2')}>
              {looks.map((look) => (
                <div key={look.label} className="flex items-center gap-3 rounded-[calc(var(--radius)-4px)] border border-(--border) px-4 py-3">
                  <span className="text-2xl" aria-hidden="true">
                    {look.emoji}
                  </span>
                  <div>
                    <dt className="text-xs font-semibold text-(--muted-foreground)">{look.label}</dt>
                    <dd className="font-semibold">{look.value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          )}
          {dressCode.reservedColor && (
            <div role="note" className="mt-6 flex gap-3 rounded-[calc(var(--radius)-4px)] bg-(--accent) p-4 text-left text-sm text-(--accent-foreground)">
              <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <p className="leading-relaxed">
                {dressCode.reservedColor.hex && (
                  <span
                    className="mr-1.5 inline-block size-3 rounded-full border border-current/30 align-[-1px]"
                    style={{ backgroundColor: dressCode.reservedColor.hex }}
                  />
                )}
                <strong className="font-bold">{dressCode.reservedColor.name}</strong> {dressCode.reservedColor.description}
              </p>
            </div>
          )}
        </Card>
      </Reveal>
    </Section>
  );
}

const GIFT_ICONS: Record<GiftKind, ComponentType<{ className?: string }>> = {
  bank: BankIcon,
  registry: GiftBoxIcon,
  envelope: EnvelopeIcon,
};

function CopyButton({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  return (
    <button
      type="button"
      className={buttonClass('default', 'default', 'rounded-full')}
      aria-live="polite"
      onClick={async () => {
        try {
          await copyToClipboard(value);
          setCopied(true);
        } catch {
          // Clipboard access denied; the details remain visible for manual copying.
        }
      }}
    >
      {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
      {copied ? '¡Copiado!' : (label ?? 'Copiar cuenta')}
    </button>
  );
}

/** The gift options as a shadcn/ui-like Accordion, with the first one open. */
export function GiftsSection({ gifts }: { gifts: GiftOption[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section>
      <SectionTitle
        eyebrow="Un detalle"
        title="Tu compañía es mi regalo"
        description="Pero si quieres tener un detalle conmigo, aquí te dejo algunas opciones."
      />
      <Reveal className="mx-auto max-w-2xl">
        <Card className="divide-y divide-(--border) overflow-hidden">
          {gifts.map((gift, index) => {
            const Icon = GIFT_ICONS[gift.kind];
            const isOpen = open === index;
            return (
              <div key={`${gift.kind}-${gift.title}`}>
                <h3>
                  <button
                    type="button"
                    id={`gift-trigger-${index}`}
                    aria-expanded={isOpen}
                    aria-controls={`gift-content-${index}`}
                    onClick={() => setOpen(isOpen ? null : index)}
                    className="flex w-full cursor-pointer items-center gap-4 px-5 py-5 text-left outline-none hover:bg-(--muted) focus-visible:ring-[3px] focus-visible:ring-(--ring)/50 focus-visible:ring-inset sm:px-7"
                  >
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-(--secondary) text-(--secondary-foreground)">
                      <Icon className="size-6" />
                    </span>
                    <span className="flex-1 text-base font-bold">{gift.title}</span>
                    <ChevronDown className={cn('size-5 shrink-0 text-(--muted-foreground) transition-transform duration-200', isOpen && 'rotate-180')} aria-hidden="true" />
                  </button>
                </h3>
                <div
                  id={`gift-content-${index}`}
                  role="region"
                  aria-labelledby={`gift-trigger-${index}`}
                  hidden={!isOpen}
                  className="px-5 pb-6 sm:px-7 sm:pl-[88px]"
                >
                  {gift.description && <p className="leading-relaxed text-(--muted-foreground)">{gift.description}</p>}
                  {gift.details?.length ? (
                    <dl className="mt-4 grid gap-2 text-sm">
                      {gift.details.map((detail) => (
                        <div key={detail.label} className="flex justify-between gap-4 rounded-[calc(var(--radius)-6px)] bg-(--muted) px-4 py-2.5">
                          <dt className="text-(--muted-foreground)">{detail.label}</dt>
                          <dd className="font-semibold break-all tabular-nums">{detail.value}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}
                  {(gift.copy || gift.link) && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {gift.copy && <CopyButton value={gift.copy.value} label={gift.copy.label} />}
                      {gift.link && (
                        <a className={buttonClass('outline', 'default', 'rounded-full')} href={gift.link.url} target="_blank" rel="noopener noreferrer">
                          {gift.link.label ?? 'Ver mesa de regalos'}
                          <ExternalLink aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </Card>
        <RibbonDivider className="mt-12" />
      </Reveal>
    </Section>
  );
}
