import { useEffect, useState, type ComponentType } from 'react';
import { Check, Copy, ExternalLink } from 'lucide-react';
import { Lightbox } from '../../../components/gallery/Lightbox';
import { BankIcon, EnvelopeIcon, GiftBoxIcon } from '../../../components/gifts/GiftIcons';
import { Reveal } from '../../../components/shared/Reveal';
import { Section } from '../../../components/ui/primitives';
import { buttonClass, cn } from '../../../components/ui/styles';
import { copyToClipboard } from '../../../utils/clipboard';
import type { GalleryImage, GiftKind, GiftOption } from '../../../types/wedding';
import { Fern, Pterodactyl } from './Illustrations';
import { CHUNKY, CHUNKY_SM, SectionTitle } from './ui';

const TILTS = ['-rotate-3', 'rotate-2', '-rotate-1', 'rotate-3', '-rotate-2', 'rotate-1'];

/** The photos as tilted chunky polaroids with the caption written below, opening the shared lightbox. */
export function GallerySection({ images, firstName }: { images: GalleryImage[]; firstName: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <Section id="galeria" className="dino-dots relative overflow-hidden bg-(--muted)">
      <SectionTitle eyebrow="Fósiles de recuerdos" title="Huellas de su historia" description={`Así ha crecido nuestro pequeño explorador ${firstName}.`} />
      <Reveal className="grid grid-cols-2 gap-5 sm:gap-8 md:grid-cols-3">
        {images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setOpenIndex(index)}
            aria-label={`Ver la foto${image.caption ? `: ${image.caption}` : ` ${index + 1}`}`}
            className={cn(
              'cursor-zoom-in rounded-md bg-(--card) p-2.5 pb-3 text-center transition-transform duration-300 outline-none hover:rotate-0 hover:scale-[1.03] sm:p-3',
              'focus-visible:ring-[3px] focus-visible:ring-(--ring)/50',
              CHUNKY,
              TILTS[index % TILTS.length],
            )}
          >
            <img src={image.src} alt={image.alt} loading="lazy" className="aspect-square w-full rounded-sm border-2 border-(--foreground) object-cover" />
            {image.caption && <span className="mt-2 block truncate text-sm font-bold sm:text-base">{image.caption}</span>}
          </button>
        ))}
      </Reveal>
      <Lightbox
        images={images}
        currentIndex={openIndex ?? 0}
        isOpen={openIndex !== null}
        onClose={() => setOpenIndex(null)}
        onNavigate={(direction) => setOpenIndex((index) => (index === null ? null : (index + direction + images.length) % images.length))}
      />
      <Fern className="pointer-events-none absolute bottom-0 left-2 hidden w-16 md:block lg:w-20" />
      <Fern className="pointer-events-none absolute right-2 bottom-0 hidden w-14 -scale-x-100 md:block lg:w-16" />
    </Section>
  );
}

const GIFT_ICONS: Record<GiftKind, ComponentType<{ className?: string }>> = {
  bank: BankIcon,
  registry: GiftBoxIcon,
  envelope: EnvelopeIcon,
};

const GIFT_COLORS = ['bg-(--accent)', 'bg-(--secondary)', 'bg-(--sky)'];

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
      className={buttonClass('default', 'default', cn('rounded-full font-bold', CHUNKY_SM))}
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

/** One chunky card per gift option, each with its icon on a colored tile. */
export function GiftsSection({ gifts, firstName }: { gifts: GiftOption[]; firstName: string }) {
  return (
    <Section id="regalos" className="relative overflow-hidden">
      <SectionTitle
        eyebrow="Regalos"
        title="Tesoros para el explorador"
        description={`Tu compañía es el mejor regalo para ${firstName}. Si quieres traerle algo, aquí hay algunas ideas.`}
      />
      <Reveal className={cn('grid gap-6', gifts.length > 1 ? 'md:grid-cols-2' : 'mx-auto max-w-md', gifts.length > 2 && 'lg:grid-cols-3')}>
        {gifts.map((gift, index) => {
          const Icon = GIFT_ICONS[gift.kind];
          return (
            <div key={`${gift.kind}-${gift.title}`} className={cn('flex flex-col rounded-[calc(var(--radius)+4px)] bg-(--card) p-6', CHUNKY)}>
              <span className={cn('flex size-14 items-center justify-center rounded-(--radius)', CHUNKY_SM, GIFT_COLORS[index % GIFT_COLORS.length])}>
                <Icon className="size-8" />
              </span>
              <h3 className="mt-5 text-2xl font-extrabold">{gift.title}</h3>
              {gift.description && <p className="mt-1 text-base text-(--muted-foreground)">{gift.description}</p>}
              {gift.details?.length ? (
                <dl className="mt-4 grid gap-1.5 rounded-(--radius) border-2 border-dashed border-(--foreground)/40 p-3 text-sm">
                  {gift.details.map((detail) => (
                    <div key={detail.label} className="flex justify-between gap-4">
                      <dt className="text-(--muted-foreground)">{detail.label}</dt>
                      <dd className="text-right font-bold break-all tabular-nums">{detail.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
              {(gift.copy || gift.link) && (
                <div className="mt-auto flex flex-wrap gap-2 pt-5">
                  {gift.copy && <CopyButton value={gift.copy.value} label={gift.copy.label} />}
                  {gift.link && (
                    <a className={buttonClass('outline', 'default', cn('rounded-full bg-(--card) font-bold', CHUNKY_SM))} href={gift.link.url} target="_blank" rel="noopener noreferrer">
                      {gift.link.label ?? 'Ver mesa de regalos'}
                      <ExternalLink aria-hidden="true" />
                    </a>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </Reveal>
      <Pterodactyl className="dino-flight pointer-events-none absolute top-8 left-0 w-14 [animation-delay:-6s] sm:w-20" />
    </Section>
  );
}
