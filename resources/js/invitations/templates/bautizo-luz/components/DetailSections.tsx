import { useEffect, useState, type ComponentType } from 'react';
import { Check, Copy, ExternalLink, Info } from 'lucide-react';
import { Lightbox } from '../../../components/gallery/Lightbox';
import { BankIcon, EnvelopeIcon, GiftBoxIcon } from '../../../components/gifts/GiftIcons';
import { Reveal } from '../../../components/shared/Reveal';
import { Card, Section } from '../../../components/ui/primitives';
import { buttonClass, cn } from '../../../components/ui/styles';
import { copyToClipboard } from '../../../utils/clipboard';
import type { DressCodeData, GalleryImage, GiftKind, GiftOption } from '../../../types/wedding';
import { FlameDivider } from './LuzArt';
import { SectionTitle } from './ui';

/**
 * The size of a tile of the bento grid: the first photo takes two columns and two rows, and the last ones widen so the
 * last row has no gaps (two columns on phones, four from tablets up).
 */
function tileClass(index: number, count: number): string {
  if (index === 0) return 'col-span-2 row-span-2';

  const fromEnd = count - 1 - index;
  const leftOnPhones = (count - 1) % 2;
  const leftOnTablets = (count - 1) % 4;
  const classes = [];

  if (leftOnPhones === 1 && fromEnd === 0) classes.push('max-sm:col-span-2');
  if (leftOnTablets === 1 && fromEnd === 0) classes.push('sm:col-span-4');
  if (leftOnTablets === 2 && fromEnd <= 1) classes.push('sm:col-span-2');
  if (leftOnTablets === 3 && fromEnd === 0) classes.push('sm:col-span-2');

  return classes.join(' ');
}

/** The photos as a bento grid: the first one large, the rest around it. Each photo opens the shared lightbox. */
export function GallerySection({ images }: { images: GalleryImage[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <Section>
      <SectionTitle eyebrow="Recuerdos" title="Mis primeros días" description="Pequeños momentos de una vida que apenas comienza." />
      <Reveal>
        <div className="grid auto-rows-[minmax(140px,22vw)] grid-cols-2 gap-3 sm:auto-rows-[200px] sm:grid-cols-4">
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setOpenIndex(index)}
              aria-label={`Ver la foto${image.caption ? `: ${image.caption}` : ` ${index + 1}`}`}
              className={cn(
                'group relative cursor-zoom-in overflow-hidden rounded-(--radius) bg-(--secondary) outline-none focus-visible:ring-[3px] focus-visible:ring-(--ring)/50',
                tileClass(index, images.length),
              )}
            >
              <img src={image.src} alt={image.alt} loading="lazy" className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
              {image.caption && (
                <span className="absolute inset-x-0 bottom-0 bg-[linear-gradient(to_top,oklch(0.19_0.035_265/0.75),transparent)] px-4 pt-10 pb-3 text-left font-newsreader text-base text-white italic">
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

/** The attire on a card split in two: the type and its description, then the looks and the reserved color. */
export function DressCodeSection({ dressCode }: { dressCode: DressCodeData }) {
  const looks = [
    { label: 'Ellas', value: dressCode.women },
    { label: 'Ellos', value: dressCode.men },
  ].filter((look): look is { label: string; value: string } => Boolean(look.value));

  return (
    <Section className="bg-(--muted)">
      <SectionTitle eyebrow="Qué ponerte" title="Código de vestimenta" />
      <Reveal>
        <Card className="grid md:grid-cols-2 md:divide-x md:divide-(--border)">
          <div className="p-7 sm:p-10">
            <p className="font-newsreader text-[clamp(38px,6vw,56px)] leading-none font-light italic">{dressCode.type}</p>
            {dressCode.description && <p className="mt-4 leading-relaxed text-(--muted-foreground)">{dressCode.description}</p>}
          </div>
          <div className="border-t border-(--border) p-7 sm:p-10 md:border-t-0">
            {looks.length > 0 && (
              <dl className="divide-y divide-(--border)">
                {looks.map((look) => (
                  <div key={look.label} className="flex items-baseline justify-between gap-4 py-3 first:pt-0">
                    <dt className="text-xs font-semibold tracking-[0.28em] text-(--muted-foreground) uppercase">{look.label}</dt>
                    <dd className="text-right font-newsreader text-xl italic">{look.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            {dressCode.reservedColor && (
              <div role="note" className="mt-6 flex gap-3 rounded-[calc(var(--radius)-2px)] border border-(--border) bg-(--accent)/60 p-4 text-sm text-(--accent-foreground)">
                <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <p className="leading-relaxed">
                  {dressCode.reservedColor.hex && (
                    <span
                      className="mr-1.5 inline-block size-3 rounded-full border border-current/30 align-[-1px]"
                      style={{ backgroundColor: dressCode.reservedColor.hex }}
                    />
                  )}
                  <strong className="font-semibold">{dressCode.reservedColor.name}</strong> {dressCode.reservedColor.description}
                </p>
              </div>
            )}
          </div>
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

/** The gift options as a shadcn/ui-like Tabs: a trigger per option and its details below. */
export function GiftsSection({ gifts }: { gifts: GiftOption[] }) {
  const [current, setCurrent] = useState(0);

  return (
    <Section>
      <SectionTitle
        eyebrow="Un detalle"
        title="Tu presencia es el regalo"
        description="Pero si quieres tener un detalle conmigo, estas son algunas opciones."
      />
      <Reveal className="mx-auto max-w-2xl">
        {gifts.length > 1 && (
          <div role="tablist" aria-label="Opciones de regalo" className="mb-4 flex gap-1 overflow-x-auto rounded-full bg-(--secondary) p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {gifts.map((gift, index) => (
              <button
                key={`${gift.kind}-${gift.title}`}
                type="button"
                role="tab"
                id={`luz-gift-tab-${index}`}
                aria-selected={current === index}
                aria-controls={`luz-gift-panel-${index}`}
                onClick={() => setCurrent(index)}
                className={cn(
                  'flex-1 shrink-0 cursor-pointer rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-[background-color,color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-(--ring)/50',
                  current === index ? 'bg-(--card) text-(--foreground) shadow-sm' : 'text-(--muted-foreground) hover:text-(--foreground)',
                )}
              >
                {gift.title}
              </button>
            ))}
          </div>
        )}
        {gifts.map((gift, index) => {
          const Icon = GIFT_ICONS[gift.kind];
          return (
            <Card
              key={`${gift.kind}-${gift.title}`}
              role={gifts.length > 1 ? 'tabpanel' : undefined}
              id={`luz-gift-panel-${index}`}
              aria-labelledby={gifts.length > 1 ? `luz-gift-tab-${index}` : undefined}
              hidden={current !== index}
              className="p-7 sm:p-10"
            >
              <div className="flex items-center gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-(--border) text-(--primary)">
                  <Icon className="size-6" />
                </span>
                <h3 className="font-newsreader text-3xl italic">{gift.title}</h3>
              </div>
              {gift.description && <p className="mt-4 leading-relaxed text-(--muted-foreground)">{gift.description}</p>}
              {gift.details?.length ? (
                <dl className="mt-5 divide-y divide-(--border) border-y border-(--border) text-sm">
                  {gift.details.map((detail) => (
                    <div key={detail.label} className="flex justify-between gap-4 py-2.5">
                      <dt className="text-(--muted-foreground)">{detail.label}</dt>
                      <dd className="font-semibold break-all tabular-nums">{detail.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
              {(gift.copy || gift.link) && (
                <div className="mt-6 flex flex-wrap gap-2">
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
        })}
        <FlameDivider className="mt-14" />
      </Reveal>
    </Section>
  );
}
