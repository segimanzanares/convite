import { useEffect, useRef, useState, type ComponentType } from 'react';
import { ArrowLeft, ArrowRight, Check, Copy, ExternalLink, Maximize2 } from 'lucide-react';
import { Lightbox } from '../../../components/gallery/Lightbox';
import { BankIcon, EnvelopeIcon, GiftBoxIcon } from '../../../components/gifts/GiftIcons';
import { Reveal } from '../../../components/shared/Reveal';
import { Card, Section } from '../../../components/ui/primitives';
import { buttonClass, cn } from '../../../components/ui/styles';
import { copyToClipboard } from '../../../utils/clipboard';
import type { ColorSwatchData, DressCodeData, GalleryImage, GiftKind, GiftOption } from '../../../types/wedding';
import { SectionTitle } from './ui';

const pad = (n: number) => String(n).padStart(2, '0');

/** The photos as a horizontal strip that snaps card by card, with arrow buttons; a tap opens the shared lightbox. */
export function GallerySection({ index, images, firstName }: { index: string; images: GalleryImage[]; firstName: string }) {
  const stripRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const scrollBy = (direction: 1 | -1) => {
    const strip = stripRef.current;
    if (!strip) return;
    const card = strip.querySelector('figure');
    strip.scrollBy({ left: direction * ((card?.clientWidth ?? 300) + 16), behavior: 'smooth' });
  };

  return (
    <Section id="galeria" className="overflow-hidden border-t border-(--border) bg-(--surface)">
      <div className="flex items-end justify-between gap-6">
        <SectionTitle index={index} eyebrow="Archivo" title="Algunos años en fotos" description={`Momentos que hicieron de ${firstName} quien es hoy.`} />
        <div className="mb-10 hidden gap-2 sm:mb-12 sm:flex">
          <button type="button" onClick={() => scrollBy(-1)} aria-label="Fotos anteriores" className={buttonClass('outline', 'icon', 'bg-transparent')}>
            <ArrowLeft aria-hidden="true" />
          </button>
          <button type="button" onClick={() => scrollBy(1)} aria-label="Fotos siguientes" className={buttonClass('outline', 'icon', 'bg-transparent')}>
            <ArrowRight aria-hidden="true" />
          </button>
        </div>
      </div>
      <Reveal>
        <div ref={stripRef} className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-4 [scrollbar-width:none] sm:-mx-8 sm:scroll-px-8 sm:px-8">
          {images.map((image, imageIndex) => (
            <figure key={image.src} className="m-0 w-[72vw] max-w-[300px] shrink-0 snap-start">
              <button
                type="button"
                onClick={() => setOpenIndex(imageIndex)}
                aria-label={`Ampliar la foto ${imageIndex + 1}`}
                className="group relative block w-full cursor-zoom-in overflow-hidden rounded-(--radius) border border-(--border) outline-none focus-visible:ring-[3px] focus-visible:ring-(--ring)/50"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  draggable={false}
                  className="aspect-[4/5] w-full object-cover grayscale-[40%] transition-[filter,transform] duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
                />
                <span className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-md bg-black/50 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                  <Maximize2 className="size-4" aria-hidden="true" />
                </span>
              </button>
              <figcaption className="mt-3 flex gap-3 text-sm">
                <span className="font-geist-mono text-(--primary)">{pad(imageIndex + 1)}</span>
                <span className="text-(--muted-foreground)">{image.caption}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Reveal>
      <Lightbox
        images={images}
        currentIndex={openIndex ?? 0}
        isOpen={openIndex !== null}
        onClose={() => setOpenIndex(null)}
        onNavigate={(direction) => setOpenIndex((current) => (current === null ? null : (current + direction + images.length) % images.length))}
      />
    </Section>
  );
}

interface DressCodeSectionProps {
  index: string;
  dressCode: DressCodeData | null;
  swatches: ColorSwatchData[];
}

/** The dress code as a spec sheet: one row per field, the reserved color among them and the palette as hex chips. */
export function DressCodeSection({ index, dressCode, swatches }: DressCodeSectionProps) {
  const rows = [
    { label: 'Código', value: dressCode?.type },
    { label: 'Ellos', value: dressCode?.men },
    { label: 'Ellas', value: dressCode?.women },
  ].filter((row): row is { label: string; value: string } => Boolean(row.value));
  const reserved = dressCode?.reservedColor;

  return (
    <Section id="vestimenta" className="border-t border-(--border)">
      <div className="grid gap-10 md:grid-cols-[1fr_1.3fr] md:gap-16">
        <SectionTitle
          index={index}
          eyebrow="Dress code"
          title="Cómo venir vestido"
          description={dressCode?.description || 'Algunas ideas para que elijas tu atuendo.'}
        />
        <Reveal className="flex flex-col gap-4">
          {(rows.length > 0 || reserved) && (
            <Card>
              <dl className="divide-y divide-(--border) text-sm">
                {rows.map((row) => (
                  <div key={row.label} className="grid grid-cols-[96px_1fr] gap-4 px-5 py-4">
                    <dt className="font-geist-mono text-xs tracking-wider text-(--muted-foreground) uppercase">{row.label}</dt>
                    <dd className="font-medium">{row.value}</dd>
                  </div>
                ))}
                {reserved && (
                  <div className="grid grid-cols-[96px_1fr] gap-4 px-5 py-4">
                    <dt className="font-geist-mono text-xs tracking-wider text-(--muted-foreground) uppercase">Evitar</dt>
                    <dd>
                      <span className="inline-flex items-center gap-2 font-medium">
                        {reserved.hex && (
                          <span className="size-3.5 rounded-sm border border-(--border)" style={{ backgroundColor: reserved.hex }} aria-hidden="true" />
                        )}
                        {reserved.name}
                      </span>
                      {reserved.description && <span className="mt-1 block text-(--muted-foreground)">{reserved.description}</span>}
                    </dd>
                  </div>
                )}
              </dl>
            </Card>
          )}
          {swatches.length > 0 && (
            <Card className="p-5">
              <p className="font-geist-mono text-xs tracking-wider text-(--muted-foreground) uppercase">Paleta sugerida</p>
              <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {swatches.map((swatch) => (
                  <li key={`${swatch.hex}-${swatch.label}`} className="flex items-center gap-3 rounded-md border border-(--border) p-2">
                    <span className="size-9 shrink-0 rounded-sm border border-(--border)" style={{ backgroundColor: swatch.hex }} aria-hidden="true" />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{swatch.label}</span>
                      <span className="block font-geist-mono text-[11px] text-(--muted-foreground) uppercase">{swatch.hex}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </Reveal>
      </div>
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
      className={buttonClass('default', 'sm')}
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
      {copied ? 'Copiado' : (label ?? 'Copiar cuenta')}
    </button>
  );
}

/** One card per gift option, side by side: the icon, the details in mono and the copy or link buttons. */
export function GiftsSection({ index, gifts, firstName }: { index: string; gifts: GiftOption[]; firstName: string }) {
  return (
    <Section id="regalos" className="border-t border-(--border) bg-(--surface)">
      <SectionTitle
        index={index}
        eyebrow="Regalos"
        title="Si quieres tener un detalle"
        description={`Lo que más quiere ${firstName} es verte esa noche. Si aun así quieres regalarle algo, aquí van las opciones.`}
      />
      <Reveal className={cn('grid gap-4', gifts.length > 1 && 'md:grid-cols-2', gifts.length > 2 && 'lg:grid-cols-3')}>
        {gifts.map((gift) => {
          const Icon = GIFT_ICONS[gift.kind];
          return (
            <Card key={`${gift.kind}-${gift.title}`} className="flex flex-col p-6">
              <span className="flex size-11 items-center justify-center rounded-md bg-(--accent) text-(--accent-foreground)">
                <Icon className="size-6" />
              </span>
              <h3 className="mt-5 font-space-grotesk text-xl font-semibold tracking-tight">{gift.title}</h3>
              {gift.description && <p className="mt-2 text-sm leading-relaxed text-(--muted-foreground)">{gift.description}</p>}
              {gift.details?.length ? (
                <dl className="mt-5 grid gap-2 rounded-md border border-(--border) bg-(--background) p-3 text-sm">
                  {gift.details.map((detail) => (
                    <div key={detail.label} className="flex justify-between gap-4">
                      <dt className="text-(--muted-foreground)">{detail.label}</dt>
                      <dd className="text-right font-geist-mono break-all">{detail.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
              {(gift.copy || gift.link) && (
                <div className="mt-auto flex flex-wrap gap-2 pt-5">
                  {gift.copy && <CopyButton value={gift.copy.value} label={gift.copy.label} />}
                  {gift.link && (
                    <a className={buttonClass('outline', 'sm', 'bg-transparent')} href={gift.link.url} target="_blank" rel="noopener noreferrer">
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
