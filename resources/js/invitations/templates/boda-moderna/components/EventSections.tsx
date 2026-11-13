import { Clock, Heart, MapPin, Navigation, Timer } from 'lucide-react';
import { Reveal } from '../../../components/shared/Reveal';
import { useCountdown } from '../../../hooks/useCountdown';
import type { ProgramItem, Venue } from '../../../types/wedding';
import { buttonClass } from './styles';
import { Badge, Card, Section, SectionHeader } from './ui';

const DEFAULT_MESSAGE =
  'Junto a nuestras familias, tenemos el honor de invitarles a compartir con nosotros el día en que uniremos nuestras vidas. Su presencia hará de este día un recuerdo para siempre.';

export function MessageSection({ message, families }: { message: string | null; families: string }) {
  return (
    <Section className="border-y border-(--border) bg-(--muted)/40">
      <Reveal className="mx-auto max-w-3xl text-center">
        <Heart className="mx-auto size-5 text-(--muted-foreground)" aria-hidden="true" />
        <p className="mt-8 font-instrument text-[clamp(26px,4.2vw,40px)] leading-[1.25] text-balance">
          “{message || DEFAULT_MESSAGE}”
        </p>
        {families && <p className="mt-8 text-sm font-medium tracking-wide text-(--muted-foreground)">— {families}</p>}
      </Reveal>
    </Section>
  );
}

function VenueCard({ venue }: { venue: Venue }) {
  return (
    <Card className="group flex flex-col overflow-hidden">
      {venue.image && (
        <div className="aspect-[16/9] overflow-hidden border-b border-(--border) bg-(--muted)">
          <img
            src={venue.image}
            alt={venue.imageAlt ?? venue.name}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-3">
          <Badge>
            <span aria-hidden="true">{venue.icon}</span>
            {venue.tag}
          </Badge>
          <span className="inline-flex items-center gap-1.5 font-geist-mono text-sm text-(--muted-foreground)">
            <Clock className="size-3.5" aria-hidden="true" />
            {venue.time}
          </span>
        </div>
        <h3 className="mt-4 text-xl font-semibold tracking-tight">{venue.name}</h3>
        <p className="mt-2 flex gap-2 text-sm leading-relaxed text-(--muted-foreground)">
          <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>
            {venue.addressLines.map((line, index) => (
              <span key={`${index}-${line}`} className="block">
                {line}
              </span>
            ))}
          </span>
        </p>
        {venue.mapEmbedUrl && (
          <div className="mt-5 h-48 overflow-hidden rounded-[calc(var(--radius)-4px)] border border-(--border) bg-(--muted)">
            <iframe
              src={venue.mapEmbedUrl}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              title={venue.mapTitle}
              className="size-full border-0 grayscale-[60%]"
            />
          </div>
        )}
        {venue.directionsUrl && (
          <a
            href={venue.directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass('outline', 'default', 'mt-5 w-full')}
          >
            <Navigation aria-hidden="true" />
            Cómo llegar
          </a>
        )}
      </div>
    </Card>
  );
}

export function VenuesSection({ venues }: { venues: Venue[] }) {
  return (
    <Section id="detalles">
      <SectionHeader
        badge={
          <>
            <MapPin aria-hidden="true" />
            Ubicación
          </>
        }
        title="Dónde celebraremos"
        description="Te esperamos en estos lugares. Toca «Cómo llegar» para abrir la ruta en tu teléfono."
      />
      <Reveal className={`grid gap-6 ${venues.length > 1 ? 'md:grid-cols-2' : 'mx-auto max-w-xl'}`}>
        {venues.map((venue) => (
          <VenueCard key={`${venue.tag}-${venue.name}`} venue={venue} />
        ))}
      </Reveal>
    </Section>
  );
}

export function ProgramSection({ items }: { items: ProgramItem[] }) {
  return (
    <Section className="border-t border-(--border)">
      <SectionHeader
        badge={
          <>
            <Clock aria-hidden="true" />
            Itinerario
          </>
        }
        title="El programa del día"
        description="Así viviremos este día tan especial, momento a momento."
      />
      <Reveal className="mx-auto max-w-2xl">
        <Card className="divide-y divide-(--border)">
          {items.map((item, index) => (
            <div key={`${item.time}-${item.title}`} className="flex gap-4 p-5 sm:gap-6 sm:p-6">
              <div className="flex flex-col items-center">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-(--border) bg-(--muted) text-lg">
                  {item.icon || <span className="font-geist-mono text-xs">{index + 1}</span>}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="font-semibold tracking-tight">{item.title}</h3>
                  <span className="font-geist-mono text-sm text-(--muted-foreground)">{item.time}</span>
                </div>
                {item.description && <p className="mt-1.5 text-sm leading-relaxed text-(--muted-foreground)">{item.description}</p>}
              </div>
            </div>
          ))}
        </Card>
      </Reveal>
    </Section>
  );
}

const UNIT_LABELS = ['Días', 'Horas', 'Minutos', 'Segundos'] as const;

export function CountdownSection({ targetDateTime }: { targetDateTime: string }) {
  const { days, hours, minutes, seconds } = useCountdown(targetDateTime);
  const values = [days, hours, minutes, seconds];

  return (
    <Section dark>
      <SectionHeader
        badge={
          <>
            <Timer aria-hidden="true" />
            Cuenta regresiva
          </>
        }
        title="Cada vez falta menos"
      />
      <Reveal className="mx-auto grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
        {UNIT_LABELS.map((label, index) => (
          <Card key={label} className="p-5 text-center sm:p-6">
            <p className="text-xs font-medium text-(--muted-foreground)">{label}</p>
            <p className="mt-2 font-geist-mono text-4xl font-medium tabular-nums tracking-tight sm:text-5xl">
              {String(values[index]).padStart(2, '0')}
            </p>
          </Card>
        ))}
      </Reveal>
    </Section>
  );
}
