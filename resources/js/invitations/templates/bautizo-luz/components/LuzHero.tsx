import { ArrowDown } from 'lucide-react';
import type { XvPhoto } from '../../../components/xv/ArchPhoto';
import { buttonClass, capitalize } from '../../../components/ui/styles';
import { formatDate } from '../../../lib/eventContent';
import { scrollToHash } from '../../../utils/scrollToHash';
import { Candle, DescendingDove, RoseWindow } from './LuzArt';

interface LuzHeroProps {
  name: string;
  monogram: string;
  eventDate: Date | null;
  venueName?: string;
  photo: XvPhoto | null;
  storyHref: string;
  /** Turns true once the candle is lit, so the rose window and the dove play while the guest watches. */
  play?: boolean;
}

/**
 * The opening screen at night: a rose window turns behind the baby's portrait in an arch, flanked by two lit candles,
 * the dove hovers above among rays, and the name, in Newsreader italic, leads to the date, the time and the place
 * split by hairlines.
 */
export function LuzHero({ name, monogram, eventDate, venueName, photo, storyHref, play }: LuzHeroProps) {
  const facts = [
    { label: 'Fecha', value: capitalize(formatDate(eventDate, "EEEE d 'de' MMMM")) },
    { label: 'Hora', value: formatDate(eventDate, "HH:mm 'hrs'") },
    { label: 'Lugar', value: venueName ?? '' },
  ].filter((fact) => fact.value);

  return (
    <header className="ui-dark relative overflow-hidden px-5 pt-16 pb-24 text-center sm:px-8 sm:pt-20">
      <div className="luz-halo pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto max-w-4xl">
        <DescendingDove play={play} delay={0.2} className="mx-auto w-[min(150px,40vw)]" />

        <div className="relative mx-auto mt-2 flex items-end justify-center gap-[clamp(12px,4vw,40px)]">
          <Candle wait={-0.8} className="mb-2 h-[clamp(110px,22vw,170px)] w-auto animate-[fadeUp_1s_0.6s_both]" />
          <div className="relative w-[min(250px,52vw)]">
            <RoseWindow play={play} delay={0.4} className="absolute top-[-22%] left-1/2 w-[150%] max-w-none -translate-x-1/2 opacity-45" />
            <div className="relative aspect-[3/4] overflow-hidden rounded-t-full border border-(--primary)/50 bg-(--card) p-1.5 shadow-[0_30px_80px_-30px_oklch(0.84_0.15_75/0.55)] animate-[fadeUp_1s_0.3s_both]">
              {photo ? (
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="size-full rounded-t-full object-cover"
                  style={photo.position ? { objectPosition: photo.position } : undefined}
                />
              ) : (
                <span className="flex size-full items-center justify-center rounded-t-full bg-(--secondary) font-newsreader text-7xl italic text-(--primary)">{monogram}</span>
              )}
            </div>
          </div>
          <Candle wait={-1.7} className="mb-2 h-[clamp(110px,22vw,170px)] w-auto animate-[fadeUp_1s_0.8s_both]" />
        </div>

        <p className="mt-10 text-xs font-semibold tracking-[0.35em] text-(--primary) uppercase animate-[fadeUp_0.9s_0.9s_both]">Mi bautizo</p>
        <h1 className="mt-3 font-newsreader text-[clamp(52px,11vw,112px)] leading-[0.95] font-light italic text-balance animate-[fadeUp_0.9s_1s_both]">
          {name}
        </h1>
        <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-pretty text-(--muted-foreground) animate-[fadeUp_0.9s_1.1s_both]">
          Recibiré la luz de Cristo en el agua del bautismo, y quiero que estés ahí para verla encenderse.
        </p>

        {facts.length > 0 && (
          <dl className="mx-auto mt-9 flex max-w-2xl flex-col divide-y divide-(--border) border-y border-(--border) sm:flex-row sm:divide-x sm:divide-y-0 animate-[fadeUp_0.9s_1.2s_both]">
            {facts.map(({ label, value }) => (
              <div key={label} className="flex-1 px-4 py-3 sm:py-4">
                <dt className="text-[11px] font-semibold tracking-[0.3em] text-(--muted-foreground) uppercase">{label}</dt>
                <dd className="mt-1 font-newsreader text-lg italic">{value}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-9 flex flex-wrap justify-center gap-2 animate-[fadeUp_0.9s_1.3s_both]">
          <a href="#confirmar" onClick={scrollToHash} className={buttonClass('default', 'lg', 'rounded-full')}>
            Confirmar asistencia
          </a>
          <a href={storyHref} onClick={scrollToHash} className={buttonClass('outline', 'lg', 'rounded-full bg-transparent')}>
            Leer más
            <ArrowDown aria-hidden="true" />
          </a>
        </div>
      </div>
    </header>
  );
}
