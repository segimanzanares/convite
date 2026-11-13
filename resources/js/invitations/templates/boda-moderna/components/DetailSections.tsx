import { useEffect, useState, type ComponentType } from 'react';
import { Check, ChevronLeft, ChevronRight, Copy, ExternalLink, Gift, Images, Info, Shirt } from 'lucide-react';
import { Reveal } from '../../../components/shared/Reveal';
import { Lightbox } from '../../../components/gallery/Lightbox';
import { DressIcon, SuitIcon } from '../../../components/dresscode/AttireIcons';
import { BankIcon, EnvelopeIcon, GiftBoxIcon } from '../../../components/gifts/GiftIcons';
import { copyToClipboard } from '../../../utils/clipboard';
import { useCoverflow } from '../../../hooks/useCoverflow';
import type { ColorSwatchData, DressCodeData, GalleryImage, GiftKind, GiftOption } from '../../../types/wedding';
import { buttonClass, cn } from './styles';
import { Card, Section, SectionHeader } from './ui';

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * The coverflow carousel of the other templates (hooks/useCoverflow) in this template's look: rounded cards with a
 * hairline border, the caption in a badge and outline buttons.
 */
export function GallerySection({ images, autoplayMs = 4500 }: { images: GalleryImage[]; autoplayMs?: number }) {
  const count = images.length;
  const { active, setActive, go, stageProps, slide, lightbox } = useCoverflow(count, autoplayMs);

  return (
    <Section className="overflow-hidden border-t border-(--border) bg-(--muted)/40">
      <SectionHeader
        badge={
          <>
            <Images aria-hidden="true" />
            Galería
          </>
        }
        title="Nuestra historia"
        description="Cada imagen guarda un instante; cada instante, una promesa."
      />
      <Reveal className="relative -mx-5 sm:-mx-8">
        <div
          {...stageProps}
          className={cn(
            'relative h-[500px] touch-pan-y overflow-hidden outline-none select-none sm:h-[600px]',
            'sm:[mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]',
            '[--step:min(220px,56vw)] [--step-far:min(390px,100vw)] sm:[--step:320px] sm:[--step-far:560px]',
            'focus-visible:ring-[3px] focus-visible:ring-(--ring)/50',
          )}
        >
          {images.map((image, index) => {
            const { style, isActive, isNear, onClick } = slide(index);
            return (
              <figure
                key={image.src}
                onClick={onClick}
                aria-hidden={!isActive}
                className={cn(
                  'absolute top-4 left-1/2 m-0 h-[430px] w-[min(260px,68vw)] sm:top-6 sm:h-[510px] sm:w-[340px]',
                  'overflow-hidden rounded-[calc(var(--radius)+6px)] border border-(--border) bg-(--card) p-1.5 shadow-xl',
                  'transition-[transform,opacity,filter] duration-[850ms] [transition-timing-function:cubic-bezier(0.19,1,0.22,1)]',
                  isNear ? 'cursor-pointer' : 'pointer-events-none',
                  isActive && 'cursor-zoom-in',
                )}
                style={style}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  draggable={false}
                  className="size-full rounded-(--radius) object-cover"
                />
                {image.caption && (
                  <figcaption className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-white/20 bg-black/55 px-3 py-1 text-xs font-medium whitespace-nowrap text-white backdrop-blur-sm">
                    {image.caption}
                  </figcaption>
                )}
              </figure>
            );
          })}
        </div>

        <div className="mx-auto mt-2 flex max-w-xs items-center justify-between gap-4 px-5">
          <button type="button" onClick={() => go(-1)} aria-label="Fotografía anterior" className={buttonClass('outline', 'icon', 'rounded-full')}>
            <ChevronLeft aria-hidden="true" />
          </button>
          <div className="flex-1 text-center" aria-live="polite">
            <p className="font-geist-mono text-sm font-medium">
              {pad(active + 1)}
              <span className="px-1.5 text-(--muted-foreground)" aria-hidden="true">
                /
              </span>
              <span className="sr-only"> de </span>
              <span className="text-(--muted-foreground)">{pad(count)}</span>
            </p>
            <div className="mx-auto mt-2 h-1 w-24 overflow-hidden rounded-full bg-(--border)" aria-hidden="true">
              <span className="block h-full rounded-full bg-(--primary) transition-[width] duration-500" style={{ width: `${((active + 1) / count) * 100}%` }} />
            </div>
          </div>
          <button type="button" onClick={() => go(1)} aria-label="Fotografía siguiente" className={buttonClass('outline', 'icon', 'rounded-full')}>
            <ChevronRight aria-hidden="true" />
          </button>
        </div>

        <div className="mt-5 flex justify-center gap-1.5" role="group" aria-label="Seleccionar fotografía">
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Ver foto ${index + 1}`}
              aria-current={index === active}
              className={cn(
                'h-1.5 cursor-pointer rounded-full p-0 transition-[width,background-color] duration-300',
                index === active ? 'w-5 bg-(--primary)' : 'w-1.5 bg-(--border) hover:bg-(--muted-foreground)',
              )}
            />
          ))}
        </div>
      </Reveal>
      <Lightbox
        images={images}
        currentIndex={lightbox.currentIndex}
        isOpen={lightbox.isOpen}
        onClose={lightbox.close}
        onNavigate={lightbox.navigate}
      />
    </Section>
  );
}

function AttireCard({ Icon, label, attire }: { Icon: ComponentType<{ className?: string }>; label: string; attire: string }) {
  return (
    <Card className="flex items-center gap-4 p-5">
      <span className="flex size-14 shrink-0 items-center justify-center rounded-[calc(var(--radius)-4px)] border border-(--border) bg-(--muted)">
        <Icon className="size-9" />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-medium text-(--muted-foreground)">{label}</p>
        <p className="mt-0.5 font-medium">{attire}</p>
      </div>
    </Card>
  );
}

interface DressCodeSectionProps {
  dressCode: DressCodeData | null;
  swatches: ColorSwatchData[];
}

/** The dress code and its suggested palette; either one may come alone. */
export function DressCodeSection({ dressCode, swatches }: DressCodeSectionProps) {
  return (
    <Section className="border-t border-(--border) bg-(--muted)/40">
      <SectionHeader
        badge={
          <>
            <Shirt aria-hidden="true" />
            Código de vestimenta
          </>
        }
        title={dressCode?.type ?? 'Paleta sugerida'}
        description={dressCode?.description}
      />
      <Reveal className="mx-auto flex max-w-2xl flex-col gap-4">
        {(dressCode?.men || dressCode?.women) && (
          <div className="grid gap-4 sm:grid-cols-2">
            {dressCode.men && <AttireCard Icon={SuitIcon} label="Hombres" attire={dressCode.men} />}
            {dressCode.women && <AttireCard Icon={DressIcon} label="Mujeres" attire={dressCode.women} />}
          </div>
        )}
        {dressCode?.reservedColor && (
          <div role="note" className="flex gap-3 rounded-(--radius) border border-(--border) bg-(--background) p-4 text-sm">
            <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <div>
              <p className="font-medium">Color reservado</p>
              <p className="mt-1 leading-relaxed text-(--muted-foreground)">
                {dressCode.reservedColor.hex && (
                  <span
                    className="mr-1.5 inline-block size-3 rounded-full border border-(--border) align-[-1px]"
                    style={{ backgroundColor: dressCode.reservedColor.hex }}
                  />
                )}
                El color <strong className="font-medium text-(--foreground)">{dressCode.reservedColor.name}</strong>{' '}
                {dressCode.reservedColor.description}
              </p>
            </div>
          </div>
        )}
        {swatches.length > 0 && (
          <Card className="p-5">
            <p className="text-sm font-medium">Paleta sugerida</p>
            <p className="mt-1 text-sm text-(--muted-foreground)">Te sugerimos estos tonos para tu atuendo.</p>
            <ul className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-6">
              {swatches.map((swatch) => (
                <li key={`${swatch.hex}-${swatch.label}`} className="text-center">
                  <span
                    className="block aspect-square w-full rounded-[calc(var(--radius)-4px)] border border-(--border) shadow-inner"
                    style={{ backgroundColor: swatch.hex }}
                  />
                  <span className="mt-2 block text-xs font-medium">{swatch.label}</span>
                  <span className="block font-geist-mono text-[10px] text-(--muted-foreground) uppercase">{swatch.hex}</span>
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

function GiftCard({ gift }: { gift: GiftOption }) {
  const [copied, setCopied] = useState(false);
  const Icon = GIFT_ICONS[gift.kind];

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  const handleCopy = async () => {
    if (!gift.copy) return;
    try {
      await copyToClipboard(gift.copy.value);
      setCopied(true);
    } catch {
      // Clipboard access denied; the details remain visible for manual copying.
    }
  };

  return (
    <Card className="flex flex-col p-6">
      <span className="flex size-12 items-center justify-center rounded-[calc(var(--radius)-4px)] border border-(--border) bg-(--muted)">
        <Icon className="size-7" />
      </span>
      <h3 className="mt-5 text-lg font-semibold tracking-tight">{gift.title}</h3>
      {gift.description && <p className="mt-1.5 text-sm leading-relaxed text-(--muted-foreground)">{gift.description}</p>}
      {gift.details?.length ? (
        <dl className="mt-5 divide-y divide-(--border) rounded-[calc(var(--radius)-4px)] border border-(--border) text-sm">
          {gift.details.map((detail) => (
            <div key={detail.label} className="flex flex-wrap justify-between gap-x-4 gap-y-0.5 px-3.5 py-2.5">
              <dt className="text-(--muted-foreground)">{detail.label}</dt>
              <dd className="font-geist-mono break-all">{detail.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {(gift.copy || gift.link) && (
        <div className="mt-auto flex flex-wrap gap-2 pt-6">
          {gift.copy && (
            <button type="button" className={buttonClass('default', 'default', 'flex-1')} onClick={handleCopy} aria-live="polite">
              {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
              {copied ? '¡Copiado!' : (gift.copy.label ?? 'Copiar número')}
            </button>
          )}
          {gift.link && (
            <a className={buttonClass('outline', 'default', 'flex-1')} href={gift.link.url} target="_blank" rel="noopener noreferrer">
              {gift.link.label ?? 'Ver mesa de regalos'}
              <ExternalLink aria-hidden="true" />
            </a>
          )}
        </div>
      )}
    </Card>
  );
}

export function GiftsSection({ gifts }: { gifts: GiftOption[] }) {
  return (
    <Section className="border-t border-(--border)">
      <SectionHeader
        badge={
          <>
            <Gift aria-hidden="true" />
            Regalos
          </>
        }
        title="Mesa de regalos"
        description="Tu presencia es nuestro mejor regalo. Si además deseas tener un detalle con nosotros, aquí te dejamos algunas opciones."
      />
      <Reveal className={`grid gap-6 ${gifts.length > 1 ? 'md:grid-cols-2' : 'mx-auto max-w-md'} ${gifts.length > 2 ? 'lg:grid-cols-3' : ''}`}>
        {gifts.map((gift) => (
          <GiftCard key={`${gift.kind}-${gift.title}`} gift={gift} />
        ))}
      </Reveal>
    </Section>
  );
}
