import { useEffect, useState, type ComponentType } from 'react';
import { Check, Copy, ExternalLink, Info, Shirt } from 'lucide-react';
import { Lightbox } from '../../../components/gallery/Lightbox';
import { BankIcon, EnvelopeIcon, GiftBoxIcon } from '../../../components/gifts/GiftIcons';
import { Reveal } from '../../../components/shared/Reveal';
import { Card, Section } from '../../../components/ui/primitives';
import { buttonClass, cn } from '../../../components/ui/styles';
import { copyToClipboard } from '../../../utils/clipboard';
import type { ColorSwatchData, DressCodeData, GalleryImage, GiftKind, GiftOption } from '../../../types/wedding';
import { SectionTitle } from './ui';

/**
 * The photos as a masonry of rounded tiles (every third one taller) that open the shared lightbox, with the caption
 * as a badge.
 */
export function GallerySection({ images, firstName, age }: { images: GalleryImage[]; firstName: string; age: number }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <Section id="galeria">
      <SectionTitle
        eyebrow="Álbum"
        title="Momentos favoritos"
        description={age ? `Un vistazo a los ${age} años de ${firstName}.` : `Un vistazo a la vida de ${firstName}.`}
      />
      <Reveal className="columns-2 gap-3 sm:gap-4 md:columns-3">
        {images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setOpenIndex(index)}
            aria-label={`Ver la foto${image.caption ? `: ${image.caption}` : ` ${index + 1}`}`}
            className={cn(
              'group relative mb-3 block w-full cursor-zoom-in break-inside-avoid overflow-hidden rounded-(--radius) border border-(--border) bg-(--muted) outline-none sm:mb-4',
              'focus-visible:ring-[3px] focus-visible:ring-(--ring)/50',
              index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-square',
            )}
          >
            <img
              src={image.src}
              alt={image.alt}
              loading="lazy"
              className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {image.caption && (
              <span className="absolute bottom-3 left-3 max-w-[calc(100%-24px)] truncate rounded-full bg-(--card)/90 px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur-sm">
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
        onNavigate={(direction) =>
          setOpenIndex((index) => (index === null ? null : (index + direction + images.length) % images.length))
        }
      />
    </Section>
  );
}

interface DressCodeSectionProps {
  dressCode: DressCodeData | null;
  swatches: ColorSwatchData[];
}

/** The attire on one card, the palette as color tiles on another and the reserved color as an alert. */
export function DressCodeSection({ dressCode, swatches }: DressCodeSectionProps) {
  const looks = [
    { label: 'Ellas', value: dressCode?.women },
    { label: 'Ellos', value: dressCode?.men },
  ].filter((look): look is { label: string; value: string } => Boolean(look.value));

  return (
    <Section id="vestimenta" className="bg-(--muted)">
      <SectionTitle eyebrow="Look de la noche" title="¿Qué me pongo?" />
      <Reveal className={cn('mx-auto grid max-w-4xl gap-4', dressCode && swatches.length > 0 && 'md:grid-cols-2')}>
        {dressCode && (
          <Card className="p-6 sm:p-8">
            <span className="flex size-11 items-center justify-center rounded-full bg-(--secondary) text-(--secondary-foreground)">
              <Shirt className="size-5" aria-hidden="true" />
            </span>
            <p className="mt-5 text-sm font-medium text-(--muted-foreground)">Código de vestimenta</p>
            <p className="mt-1 font-dm-serif text-4xl leading-tight">{dressCode.type}</p>
            {dressCode.description && <p className="mt-3 leading-relaxed text-(--muted-foreground)">{dressCode.description}</p>}
            {looks.length > 0 && (
              <dl className="mt-6 grid gap-3">
                {looks.map((look) => (
                  <div key={look.label} className="rounded-[calc(var(--radius)-6px)] bg-(--muted) px-4 py-3 text-sm">
                    <dt className="font-semibold">{look.label}</dt>
                    <dd className="mt-0.5 text-(--muted-foreground)">{look.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            {dressCode.reservedColor && (
              <div
                role="note"
                className="mt-6 flex gap-3 rounded-[calc(var(--radius)-6px)] border border-(--accent) bg-(--accent) p-4 text-sm text-(--accent-foreground)"
              >
                <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <p className="leading-relaxed">
                  Te pedimos no usar{' '}
                  {dressCode.reservedColor.hex && (
                    <span
                      className="mx-0.5 inline-block size-3 rounded-full border border-current/30 align-[-1px]"
                      style={{ backgroundColor: dressCode.reservedColor.hex }}
                    />
                  )}{' '}
                  <strong className="font-semibold">{dressCode.reservedColor.name}</strong>. {dressCode.reservedColor.description}
                </p>
              </div>
            )}
          </Card>
        )}
        {swatches.length > 0 && (
          <Card className="p-6 sm:p-8">
            <p className="font-dm-serif text-3xl leading-tight">Colores que nos encantan</p>
            <p className="mt-2 text-sm text-(--muted-foreground)">Una paleta para inspirarte; no es obligatoria.</p>
            <ul className="mt-6 grid grid-cols-3 gap-3">
              {swatches.map((swatch) => (
                <li key={`${swatch.hex}-${swatch.label}`} className="text-center">
                  <span
                    className="block aspect-square rounded-[calc(var(--radius)-4px)] border border-(--border) shadow-sm"
                    style={{ backgroundColor: swatch.hex }}
                    aria-hidden="true"
                  />
                  <span className="mt-2 block text-xs font-medium">{swatch.label}</span>
                </li>
              ))}
            </ul>
          </Card>
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

function GiftPanel({ gift }: { gift: GiftOption }) {
  const Icon = GIFT_ICONS[gift.kind];

  return (
    <Card className="p-6 text-center sm:p-10">
      <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-(--secondary) text-(--secondary-foreground)">
        <Icon className="size-8" />
      </span>
      <h3 className="mt-5 font-dm-serif text-3xl">{gift.title}</h3>
      {gift.description && <p className="mx-auto mt-2 max-w-md leading-relaxed text-(--muted-foreground)">{gift.description}</p>}
      {gift.details?.length ? (
        <dl className="mx-auto mt-6 grid max-w-md gap-2 text-sm">
          {gift.details.map((detail) => (
            <div key={detail.label} className="flex justify-between gap-4 rounded-full bg-(--muted) px-4 py-2.5">
              <dt className="text-(--muted-foreground)">{detail.label}</dt>
              <dd className="font-semibold break-all tabular-nums">{detail.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {(gift.copy || gift.link) && (
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {gift.copy && <CopyButton value={gift.copy.value} label={gift.copy.label} />}
          {gift.link && (
            <a className={buttonClass('outline', 'default', 'rounded-full')} href={gift.link.url} target="_blank" rel="noopener noreferrer">
              {gift.link.label ?? 'Ver mesa de regalos'}
              <ExternalLink aria-hidden="true" />
            </a>
          )}
        </div>
      )}
    </Card>
  );
}

/** One tab per gift option, as shadcn/ui's Tabs; with a single option the tab list is left out. */
export function GiftsSection({ gifts, firstName }: { gifts: GiftOption[]; firstName: string }) {
  const [selected, setSelected] = useState(0);
  const gift = gifts[Math.min(selected, gifts.length - 1)];

  return (
    <Section id="regalos">
      <SectionTitle
        eyebrow="Regalos"
        title="Tu presencia es el mejor regalo"
        description={`Pero si quieres consentir a ${firstName}, aquí tienes algunas ideas.`}
      />
      <Reveal className="mx-auto max-w-2xl">
        {gifts.length > 1 && (
          <div className="mb-4 flex justify-center">
            <div role="tablist" aria-label="Opciones de regalo" className="inline-flex max-w-full gap-1 overflow-x-auto rounded-full bg-(--muted) p-1">
              {gifts.map((item, index) => (
                <button
                  key={`${item.kind}-${item.title}`}
                  type="button"
                  role="tab"
                  id={`gift-tab-${index}`}
                  aria-selected={index === selected}
                  aria-controls="gift-panel"
                  onClick={() => setSelected(index)}
                  className={cn(
                    'shrink-0 cursor-pointer rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition-[background-color,color,box-shadow]',
                    'outline-none focus-visible:ring-[3px] focus-visible:ring-(--ring)/50',
                    index === selected ? 'bg-(--card) text-(--foreground) shadow-sm' : 'text-(--muted-foreground) hover:text-(--foreground)',
                  )}
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>
        )}
        <div id="gift-panel" role={gifts.length > 1 ? 'tabpanel' : undefined} aria-labelledby={gifts.length > 1 ? `gift-tab-${selected}` : undefined}>
          <GiftPanel key={selected} gift={gift} />
        </div>
      </Reveal>
    </Section>
  );
}
