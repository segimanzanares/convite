import { useEffect, useState, type ComponentType } from 'react';
import { Check, Copy, ExternalLink, Info, Shirt } from 'lucide-react';
import { Lightbox } from '../../../components/gallery/Lightbox';
import { BankIcon, EnvelopeIcon, GiftBoxIcon } from '../../../components/gifts/GiftIcons';
import { Reveal } from '../../../components/shared/Reveal';
import { Card, Section } from '../../../components/ui/primitives';
import { buttonClass, cn } from '../../../components/ui/styles';
import { copyToClipboard } from '../../../utils/clipboard';
import type { DressCodeData, GalleryImage, GiftKind, GiftOption } from '../../../types/wedding';
import { SectionTitle } from './ui';

/** The photos as a masonry of rounded tiles, each with its caption as a pill; every photo opens the shared lightbox. */
export function GallerySection({ images }: { images: GalleryImage[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <Section>
      <SectionTitle eyebrow="Recuerdos" title="Mis primeros momentos" description="Pequeños instantes de mis primeros días en este mundo." />
      <Reveal>
        <div className="columns-2 gap-3 sm:columns-3 sm:gap-4">
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setOpenIndex(index)}
              aria-label={`Ver la foto${image.caption ? `: ${image.caption}` : ` ${index + 1}`}`}
              className={cn(
                'group relative mb-3 block w-full cursor-zoom-in break-inside-avoid overflow-hidden rounded-[var(--radius)] border border-(--border) bg-(--secondary) outline-none focus-visible:ring-[3px] focus-visible:ring-(--ring)/50 sm:mb-4',
                index % 3 === 0 ? 'aspect-[4/5]' : index % 3 === 1 ? 'aspect-square' : 'aspect-[3/4]',
              )}
            >
              <img src={image.src} alt={image.alt} loading="lazy" className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
              {image.caption && (
                <span className="absolute bottom-3 left-3 max-w-[calc(100%-24px)] truncate rounded-full bg-(--card)/90 px-3 py-1 text-xs font-semibold text-(--foreground) backdrop-blur-sm">
                  {image.caption}
                </span>
              )}
            </button>
          ))}
        </div>
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
    { emoji: '👔', label: 'Ellos', value: dressCode.men },
  ].filter((look): look is { emoji: string; label: string; value: string } => Boolean(look.value));

  return (
    <Section className="bg-(--muted)">
      <SectionTitle eyebrow="Qué ponerte" title="Código de vestimenta" />
      <Reveal className="mx-auto max-w-2xl">
        <Card className="p-7 text-center sm:p-10">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-(--secondary) text-(--secondary-foreground)">
            <Shirt className="size-5" aria-hidden="true" />
          </span>
          <p className="mt-4 font-young-serif text-[clamp(32px,5vw,44px)] leading-none">{dressCode.type}</p>
          {dressCode.description && <p className="mx-auto mt-4 max-w-md leading-relaxed text-(--muted-foreground)">{dressCode.description}</p>}
          {looks.length > 0 && (
            <dl className={cn('mt-8 grid gap-3 text-left', looks.length > 1 && 'sm:grid-cols-2')}>
              {looks.map((look) => (
                <div key={look.label} className="flex items-center gap-3 rounded-[calc(var(--radius)-8px)] bg-(--secondary) px-4 py-3">
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
            <div role="note" className="mt-6 flex gap-3 rounded-[calc(var(--radius)-8px)] bg-(--accent) p-4 text-left text-sm text-(--accent-foreground)">
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

const GIFT_COLORS: Record<GiftKind, string> = {
  bank: '--mint',
  registry: '--blush',
  envelope: '--butter',
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
      className={buttonClass('default', 'sm', 'rounded-full')}
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

/** The gift options as a grid of cards, each with its icon on a pastel, its details and its action. */
export function GiftsSection({ gifts }: { gifts: GiftOption[] }) {
  return (
    <Section>
      <SectionTitle
        eyebrow="Un detalle"
        title="Mesa de regalos"
        description="Tu cariño es el mejor regalo; si además quieres consentirme, aquí van algunas ideas."
      />
      <Reveal className={cn('mx-auto grid max-w-4xl gap-4', gifts.length > 1 && 'sm:grid-cols-2', gifts.length > 2 && 'lg:grid-cols-3')}>
        {gifts.map((gift) => {
          const Icon = GIFT_ICONS[gift.kind];
          return (
            <Card key={`${gift.kind}-${gift.title}`} className="flex flex-col p-6">
              <span className="flex size-14 items-center justify-center rounded-full text-(--foreground)" style={{ backgroundColor: `var(${GIFT_COLORS[gift.kind]})` }}>
                <Icon className="size-7" />
              </span>
              <h3 className="mt-4 font-young-serif text-xl">{gift.title}</h3>
              {gift.description && <p className="mt-1 text-sm leading-relaxed text-(--muted-foreground)">{gift.description}</p>}
              {gift.details?.length ? (
                <dl className="mt-4 grid gap-1.5 text-sm">
                  {gift.details.map((detail) => (
                    <div key={detail.label} className="flex justify-between gap-3 rounded-[calc(var(--radius)-12px)] bg-(--muted) px-3 py-2">
                      <dt className="text-(--muted-foreground)">{detail.label}</dt>
                      <dd className="font-semibold break-all tabular-nums">{detail.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
              {(gift.copy || gift.link) && (
                <div className="mt-auto flex flex-wrap gap-2 pt-5">
                  {gift.copy && <CopyButton value={gift.copy.value} label={gift.copy.label} />}
                  {gift.link && (
                    <a className={buttonClass('outline', 'sm', 'rounded-full')} href={gift.link.url} target="_blank" rel="noopener noreferrer">
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
