import { useEffect, useState, type ComponentType } from 'react';
import { Check, Copy, ExternalLink, Shirt, TriangleAlert } from 'lucide-react';
import { Lightbox } from '../../../components/gallery/Lightbox';
import { BankIcon, EnvelopeIcon, GiftBoxIcon } from '../../../components/gifts/GiftIcons';
import { Reveal } from '../../../components/shared/Reveal';
import { Card, Section } from '../../../components/ui/primitives';
import { buttonClass, cn } from '../../../components/ui/styles';
import { copyToClipboard } from '../../../utils/clipboard';
import type { DressCodeData, GalleryImage, GiftKind, GiftOption } from '../../../types/wedding';
import { SectionTitle } from './ui';

/** The photos as a bento grid: the first one big, the rest square, glowing on hover. Each opens the shared lightbox. */
export function GallerySection({ images }: { images: GalleryImage[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <Section>
      <SectionTitle eyebrow="Flashback" title="Quince años en fotos" description="Algunos de los momentos que me trajeron hasta esta pista." />
      <Reveal className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setOpenIndex(index)}
            aria-label={`Ver la foto${image.caption ? `: ${image.caption}` : ` ${index + 1}`}`}
            className={cn(
              'group relative aspect-square cursor-zoom-in overflow-hidden rounded-(--radius) border border-(--border) bg-(--muted) outline-none',
              'transition-shadow hover:shadow-[0_0_28px_-6px_var(--neon-pink)] focus-visible:ring-[3px] focus-visible:ring-(--ring)/50',
              index === 0 && 'col-span-2 row-span-2',
            )}
          >
            <img src={image.src} alt={image.alt} loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
            {image.caption && (
              <span className="absolute inset-x-0 bottom-0 bg-[linear-gradient(to_top,oklch(0.12_0.03_300/0.85),transparent)] px-3 pt-8 pb-3 text-left text-xs font-semibold sm:text-sm">
                {image.caption}
              </span>
            )}
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
    </Section>
  );
}

/** The attire in big neon type, a card per look and the reserved color as a warning. */
export function DressCodeSection({ dressCode }: { dressCode: DressCodeData }) {
  const looks = [
    { label: 'Ellas', value: dressCode.women },
    { label: 'Ellos', value: dressCode.men },
  ].filter((look): look is { label: string; value: string } => Boolean(look.value));

  return (
    <Section className="bg-(--surface)">
      <SectionTitle eyebrow="Dress code" title="Ven lista para brillar" />
      <Reveal className="mx-auto max-w-3xl text-center">
        <Shirt className="mx-auto size-8 text-(--accent-foreground)" aria-hidden="true" />
        <p className="mt-4 font-unbounded text-[clamp(36px,7vw,64px)] leading-none font-extrabold uppercase disco-gradient-text">{dressCode.type}</p>
        {dressCode.description && <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-(--muted-foreground)">{dressCode.description}</p>}
        {looks.length > 0 && (
          <dl className={cn('mt-10 grid gap-4 text-left', looks.length > 1 && 'sm:grid-cols-2')}>
            {looks.map((look) => (
              <Card key={look.label} className="p-5">
                <dt className="text-xs font-semibold tracking-[0.3em] text-(--primary) uppercase">{look.label}</dt>
                <dd className="mt-2 font-unbounded text-lg font-semibold">{look.value}</dd>
              </Card>
            ))}
          </dl>
        )}
        {dressCode.reservedColor && (
          <div role="note" className="mt-4 flex gap-3 rounded-(--radius) border border-(--neon-gold)/40 bg-(--neon-gold)/10 p-4 text-left text-sm">
            <TriangleAlert className="mt-0.5 size-4 shrink-0 text-(--neon-gold)" aria-hidden="true" />
            <p className="leading-relaxed">
              {dressCode.reservedColor.hex && (
                <span
                  className="mr-1.5 inline-block size-3 rounded-full border border-white/30 align-[-1px]"
                  style={{ backgroundColor: dressCode.reservedColor.hex }}
                />
              )}
              <strong className="font-semibold">{dressCode.reservedColor.name}</strong>{' '}
              <span className="text-(--muted-foreground)">{dressCode.reservedColor.description}</span>
            </p>
          </div>
        )}
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
      className={buttonClass('default', 'default', 'rounded-full font-semibold')}
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

/** A card per gift option, side by side. */
export function GiftsSection({ gifts }: { gifts: GiftOption[] }) {
  return (
    <Section>
      <SectionTitle
        eyebrow="Regalos"
        title="Tu presencia es el mejor regalo"
        description="Pero si quieres tener un detalle conmigo, aquí van algunas ideas."
      />
      <Reveal className={cn('grid gap-5', gifts.length > 1 ? 'md:grid-cols-2' : 'mx-auto max-w-xl')}>
        {gifts.map((gift) => {
          const Icon = GIFT_ICONS[gift.kind];
          return (
            <Card key={`${gift.kind}-${gift.title}`} className="flex flex-col p-6 sm:p-8">
              <span className="flex size-14 items-center justify-center rounded-full bg-(--accent) text-(--accent-foreground) shadow-[0_0_20px_-6px_var(--neon-cyan)]">
                <Icon className="size-7" />
              </span>
              <h3 className="mt-5 font-unbounded text-xl font-semibold">{gift.title}</h3>
              {gift.description && <p className="mt-2 leading-relaxed text-(--muted-foreground)">{gift.description}</p>}
              {gift.details?.length ? (
                <dl className="mt-5 grid gap-2 text-sm">
                  {gift.details.map((detail) => (
                    <div key={detail.label} className="flex justify-between gap-4 rounded-[calc(var(--radius)-6px)] bg-(--muted) px-4 py-2.5">
                      <dt className="text-(--muted-foreground)">{detail.label}</dt>
                      <dd className="font-semibold break-all tabular-nums">{detail.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
              {(gift.copy || gift.link) && (
                <div className="mt-auto flex flex-wrap gap-2 pt-6">
                  {gift.copy && <CopyButton value={gift.copy.value} label={gift.copy.label} />}
                  {gift.link && (
                    <a className={buttonClass('outline', 'default', 'rounded-full bg-transparent')} href={gift.link.url} target="_blank" rel="noopener noreferrer">
                      {gift.link.label ?? 'Ver mesa de regalos'}
                      <ExternalLink aria-hidden="true" />
                    </a>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </Reveal>
    </Section>
  );
}
