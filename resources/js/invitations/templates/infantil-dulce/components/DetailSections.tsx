import { useEffect, useState, type ComponentType } from 'react';
import { Check, ChevronDown, Copy, ExternalLink } from 'lucide-react';
import { Lightbox } from '../../../components/gallery/Lightbox';
import { BankIcon, EnvelopeIcon, GiftBoxIcon } from '../../../components/gifts/GiftIcons';
import { Reveal } from '../../../components/shared/Reveal';
import { Card, Section } from '../../../components/ui/primitives';
import { buttonClass, cn } from '../../../components/ui/styles';
import { copyToClipboard } from '../../../utils/clipboard';
import type { GalleryImage, GiftKind, GiftOption } from '../../../types/wedding';
import { Candy, Donut, IcePop } from './Illustrations';
import { SectionTitle } from './ui';

const FRAMES = ['ring-(--frosting)', 'ring-(--secondary)', 'ring-(--accent)', 'ring-(--lilac)'];

/** The photos as arches framed in candy colors, with the caption below, opening the shared lightbox. */
export function GallerySection({ images, firstName }: { images: GalleryImage[]; firstName: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <Section id="galeria" className="relative overflow-hidden bg-(--muted)">
      <SectionTitle eyebrow="Momentos dulces" title="Así ha crecido" description={`Algunas de las fotos favoritas de ${firstName}.`} />
      <Reveal className="grid grid-cols-2 gap-x-5 gap-y-8 sm:gap-x-8 md:grid-cols-3">
        {images.map((image, index) => (
          <figure key={image.src} className="m-0 text-center">
            <button
              type="button"
              onClick={() => setOpenIndex(index)}
              aria-label={`Ver la foto${image.caption ? `: ${image.caption}` : ` ${index + 1}`}`}
              className={cn(
                'group block w-full cursor-zoom-in overflow-hidden rounded-t-full rounded-b-3xl bg-(--card) ring-8 outline-none',
                'focus-visible:ring-(--ring)',
                FRAMES[index % FRAMES.length],
              )}
            >
              <img src={image.src} alt={image.alt} loading="lazy" className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </button>
            {image.caption && <figcaption className="mt-4 font-fredoka text-lg font-medium">{image.caption}</figcaption>}
          </figure>
        ))}
      </Reveal>
      <Lightbox
        images={images}
        currentIndex={openIndex ?? 0}
        isOpen={openIndex !== null}
        onClose={() => setOpenIndex(null)}
        onNavigate={(direction) => setOpenIndex((index) => (index === null ? null : (index + direction + images.length) % images.length))}
      />
      <Candy className="dulce-candy pointer-events-none absolute top-10 left-[4%] w-12 sm:w-16" />
      <IcePop className="pointer-events-none absolute right-[4%] bottom-4 hidden w-12 sm:block lg:w-16" />
    </Section>
  );
}

const GIFT_ICONS: Record<GiftKind, ComponentType<{ className?: string }>> = {
  bank: BankIcon,
  registry: GiftBoxIcon,
  envelope: EnvelopeIcon,
};

const GIFT_COLORS = ['bg-(--frosting)', 'bg-(--secondary)', 'bg-(--accent)'];

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
      className={buttonClass('default', 'default', 'rounded-full font-fredoka font-semibold')}
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

/** The gift options as shadcn/ui's Accordion of round cards, the first one open. */
export function GiftsSection({ gifts, firstName }: { gifts: GiftOption[]; firstName: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Section id="regalos" className="relative overflow-hidden">
      <SectionTitle
        eyebrow="Regalos"
        title="Un detalle dulce"
        description={`Lo más importante es que vengas. Si quieres consentir a ${firstName}, aquí hay algunas ideas.`}
      />
      <Reveal className="mx-auto flex max-w-2xl flex-col gap-4">
        {gifts.map((gift, index) => {
          const Icon = GIFT_ICONS[gift.kind];
          const isOpen = openIndex === index;
          const panelId = `gift-panel-${index}`;
          return (
            <Card key={`${gift.kind}-${gift.title}`} className="overflow-hidden border-0 shadow-[0_20px_50px_-30px_oklch(0.45_0.15_355/0.5)]">
              <h3>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full cursor-pointer items-center gap-4 px-5 py-4 text-left outline-none focus-visible:bg-(--muted) sm:px-6"
                >
                  <span className={cn('flex size-12 shrink-0 items-center justify-center rounded-full', GIFT_COLORS[index % GIFT_COLORS.length])}>
                    <Icon className="size-7" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-fredoka text-xl font-semibold">{gift.title}</span>
                    {gift.description && <span className="block text-sm text-(--muted-foreground)">{gift.description}</span>}
                  </span>
                  <ChevronDown className={cn('size-5 shrink-0 text-(--primary) transition-transform duration-200', isOpen && 'rotate-180')} aria-hidden="true" />
                </button>
              </h3>
              <div id={panelId} className={cn('grid transition-[grid-template-rows] duration-300 ease-out', isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
                <div className="overflow-hidden" inert={!isOpen}>
                  <div className="px-5 pb-6 sm:px-6 sm:pl-[88px]">
                    {gift.details?.length ? (
                      <dl className="grid gap-2 rounded-(--radius) bg-(--muted) p-4 text-sm">
                        {gift.details.map((detail) => (
                          <div key={detail.label} className="flex justify-between gap-4">
                            <dt className="text-(--muted-foreground)">{detail.label}</dt>
                            <dd className="text-right font-bold break-all tabular-nums">{detail.value}</dd>
                          </div>
                        ))}
                      </dl>
                    ) : null}
                    {(gift.copy || gift.link) && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {gift.copy && <CopyButton value={gift.copy.value} label={gift.copy.label} />}
                        {gift.link && (
                          <a className={buttonClass('outline', 'default', 'rounded-full font-fredoka font-semibold')} href={gift.link.url} target="_blank" rel="noopener noreferrer">
                            {gift.link.label ?? 'Ver mesa de regalos'}
                            <ExternalLink aria-hidden="true" />
                          </a>
                        )}
                      </div>
                    )}
                    {!gift.details?.length && !gift.copy && !gift.link && (
                      <p className="text-sm text-(--muted-foreground)">No necesitas hacer nada más: te esperamos ese día.</p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </Reveal>
      <Donut className="dulce-float pointer-events-none absolute bottom-8 left-[3%] hidden w-16 [animation-delay:-2s] sm:block lg:w-20" />
    </Section>
  );
}
