import { useEffect, useState, type ComponentType } from 'react';
import { Check, ChevronDown, ChevronLeft, ChevronRight, Copy, ExternalLink, TriangleAlert } from 'lucide-react';
import { Lightbox } from '../../../components/gallery/Lightbox';
import { BankIcon, EnvelopeIcon, GiftBoxIcon } from '../../../components/gifts/GiftIcons';
import { Reveal } from '../../../components/shared/Reveal';
import { Card, Section } from '../../../components/ui/primitives';
import { buttonClass, cn } from '../../../components/ui/styles';
import { useCoverflow } from '../../../hooks/useCoverflow';
import { copyToClipboard } from '../../../utils/clipboard';
import type { ColorSwatchData, DressCodeData, GalleryImage, GiftKind, GiftOption } from '../../../types/wedding';
import { SectionTitle } from './ui';

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * The coverflow carousel of the other templates (hooks/useCoverflow): rounded photos with a white ring, the active
 * caption under the stage and a pill-shaped button group for the controls.
 */
export function GallerySection({ images, autoplayMs = 5000 }: { images: GalleryImage[]; autoplayMs?: number }) {
  const count = images.length;
  const { active, go, stageProps, slide, lightbox } = useCoverflow(count, autoplayMs);
  const caption = images[active]?.caption;

  return (
    <Section id="galeria" className="overflow-hidden border-t border-(--border) bg-(--muted)">
      <SectionTitle
        eyebrow="Instantes"
        title="Un poco de nosotros"
        description="Algunos de los momentos que nos trajeron hasta aquí."
        centered
      />
      <Reveal className="relative -mx-5 sm:-mx-8">
        <div
          {...stageProps}
          className={cn(
            'relative h-[470px] touch-pan-y overflow-hidden outline-none select-none sm:h-[560px]',
            'sm:[mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]',
            '[--step:min(210px,54vw)] [--step-far:min(380px,100vw)] sm:[--step:300px] sm:[--step-far:530px]',
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
                  'absolute top-4 left-1/2 m-0 h-[400px] w-[min(250px,66vw)] sm:top-6 sm:h-[480px] sm:w-[320px]',
                  'overflow-hidden rounded-[calc(var(--radius)+12px)] bg-(--card) shadow-2xl ring-[6px] ring-(--card)',
                  'transition-[transform,opacity,filter] duration-[850ms] [transition-timing-function:cubic-bezier(0.19,1,0.22,1)]',
                  isNear ? 'cursor-pointer' : 'pointer-events-none',
                  isActive && 'cursor-zoom-in',
                )}
                style={style}
              >
                <img src={image.src} alt={image.alt} loading="lazy" draggable={false} className="size-full object-cover" />
              </figure>
            );
          })}
        </div>

        <p className="mt-1 min-h-7 text-center font-fraunces text-xl italic" aria-live="polite">
          {caption}
        </p>
        <div className="mt-5 flex justify-center">
          <div className="inline-flex items-center rounded-full border border-(--border) bg-(--background) p-1 shadow-sm">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Fotografía anterior"
              className={buttonClass('ghost', 'icon', 'size-9 rounded-full')}
            >
              <ChevronLeft aria-hidden="true" />
            </button>
            <span className="px-4 text-sm font-medium tabular-nums">
              {pad(active + 1)}
              <span className="px-1 text-(--muted-foreground)" aria-hidden="true">
                de
              </span>
              <span className="sr-only"> de </span>
              {pad(count)}
            </span>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Fotografía siguiente"
              className={buttonClass('ghost', 'icon', 'size-9 rounded-full')}
            >
              <ChevronRight aria-hidden="true" />
            </button>
          </div>
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

interface DressCodeSectionProps {
  dressCode: DressCodeData | null;
  swatches: ColorSwatchData[];
}

/** The dress code as a two-column data table, the reserved color as an alert and the palette as chips. */
export function DressCodeSection({ dressCode, swatches }: DressCodeSectionProps) {
  const rows = [
    { label: 'Código', value: dressCode?.type },
    { label: 'Ellos', value: dressCode?.men },
    { label: 'Ellas', value: dressCode?.women },
  ].filter((row): row is { label: string; value: string } => Boolean(row.value));

  return (
    <Section id="vestimenta" className="border-t border-(--border)">
      <div className="grid gap-10 md:grid-cols-[1fr_1.3fr] md:gap-16">
        <SectionTitle
          eyebrow="Qué ponerse"
          title="Vístete para celebrar"
          description={dressCode?.description || 'Te compartimos algunas ideas para que elijas tu atuendo.'}
        />
        <Reveal className="flex flex-col gap-4">
          {rows.length > 0 && (
            <Card className="overflow-hidden">
              <table className="w-full text-left text-sm">
                <tbody className="divide-y divide-(--border)">
                  {rows.map((row) => (
                    <tr key={row.label}>
                      <th scope="row" className="w-28 bg-(--muted) px-5 py-4 font-medium text-(--muted-foreground)">
                        {row.label}
                      </th>
                      <td className="px-5 py-4 font-medium">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}
          {dressCode?.reservedColor && (
            <div
              role="note"
              className="flex gap-3 rounded-(--radius) border border-(--accent) bg-(--accent) p-4 text-sm text-(--accent-foreground)"
            >
              <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <p className="leading-relaxed">
                <span className="font-semibold">Un favor: </span>
                el color{' '}
                {dressCode.reservedColor.hex && (
                  <span
                    className="mx-0.5 inline-block size-3 rounded-full border border-current/30 align-[-1px]"
                    style={{ backgroundColor: dressCode.reservedColor.hex }}
                  />
                )}{' '}
                <strong className="font-semibold">{dressCode.reservedColor.name}</strong> {dressCode.reservedColor.description}
              </p>
            </div>
          )}
          {swatches.length > 0 && (
            <div>
              <p className="mt-2 mb-3 text-sm font-medium text-(--muted-foreground)">Tonos que nos encantaría ver</p>
              <ul className="flex flex-wrap gap-2">
                {swatches.map((swatch) => (
                  <li
                    key={`${swatch.hex}-${swatch.label}`}
                    className="inline-flex items-center gap-2 rounded-full border border-(--border) bg-(--card) py-1.5 pr-3.5 pl-1.5 text-sm font-medium shadow-sm"
                  >
                    <span
                      className="size-6 rounded-full border border-(--border)"
                      style={{ backgroundColor: swatch.hex }}
                      aria-hidden="true"
                    />
                    {swatch.label}
                  </li>
                ))}
              </ul>
            </div>
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
      {copied ? '¡Listo, copiado!' : (label ?? 'Copiar cuenta')}
    </button>
  );
}

function GiftItem({ gift, index, isOpen, onToggle }: { gift: GiftOption; index: number; isOpen: boolean; onToggle: () => void }) {
  const Icon = GIFT_ICONS[gift.kind];
  const panelId = `gift-panel-${index}`;

  return (
    <div>
      <h3>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full cursor-pointer items-center gap-4 px-5 py-5 text-left outline-none focus-visible:bg-(--muted) sm:px-6"
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-(--accent) text-(--accent-foreground)">
            <Icon className="size-6" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-semibold">{gift.title}</span>
            {gift.description && (
              <span className="mt-0.5 block text-sm text-(--muted-foreground)">{gift.description}</span>
            )}
          </span>
          <ChevronDown
            className={cn('size-4 shrink-0 text-(--muted-foreground) transition-transform duration-200', isOpen && 'rotate-180')}
            aria-hidden="true"
          />
        </button>
      </h3>
      <div
        id={panelId}
        className={cn(
          'grid transition-[grid-template-rows] duration-300 ease-out',
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="overflow-hidden" inert={!isOpen}>
          <div className="px-5 pb-6 sm:px-6 sm:pl-[84px]">
            {gift.details?.length ? (
              <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                {gift.details.map((detail) => (
                  <div key={detail.label}>
                    <dt className="text-(--muted-foreground)">{detail.label}</dt>
                    <dd className="mt-0.5 font-medium break-all tabular-nums">{detail.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
            {(gift.copy || gift.link) && (
              <div className="mt-5 flex flex-wrap gap-2">
                {gift.copy && <CopyButton value={gift.copy.value} label={gift.copy.label} />}
                {gift.link && (
                  <a
                    className={buttonClass('outline', 'default', 'rounded-full')}
                    href={gift.link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {gift.link.label ?? 'Ir a la mesa de regalos'}
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
    </div>
  );
}

/** The gift options as shadcn/ui's Accordion, the first one open. */
export function GiftsSection({ gifts }: { gifts: GiftOption[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Section id="regalos" className="border-t border-(--border) bg-(--muted)">
      <div className="grid gap-10 md:grid-cols-[1fr_1.3fr] md:gap-16">
        <SectionTitle
          eyebrow="Si quieres tener un detalle"
          title="Lo más importante es que estés"
          description="Tu compañía ya es el mejor regalo. Si aun así deseas obsequiarnos algo, aquí tienes algunas opciones."
        />
        <Reveal>
          <Card className="divide-y divide-(--border)">
            {gifts.map((gift, index) => (
              <GiftItem
                key={`${gift.kind}-${gift.title}`}
                gift={gift}
                index={index}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex(openIndex === index ? null : index)}
              />
            ))}
          </Card>
        </Reveal>
      </div>
    </Section>
  );
}
