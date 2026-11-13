import { ArrowDown, CalendarDays, Clock, MapPin } from 'lucide-react';
import type { XvPhoto } from '../../../components/xv/ArchPhoto';
import { Badge } from '../../../components/ui/primitives';
import { buttonClass, capitalize } from '../../../components/ui/styles';
import { formatDate } from '../../../lib/eventContent';
import { scrollToHash } from '../../../utils/scrollToHash';
import { DiscoBall, Equalizer, Spotlights } from './DiscoArt';

interface DiscoHeroProps {
  name: string;
  eventDate: Date | null;
  venueName?: string;
  photo: XvPhoto | null;
  storyHref: string;
  /** Turns true when the ticket is torn, so the mirror ball drops in while the guest watches. */
  play?: boolean;
}

/**
 * The opening screen as a dance floor: spotlights sweeping, a mirror ball dropping in over a huge neon "XV", the
 * celebrant's name painted pink to cyan, the date, time and place as badges, and the portrait in a neon frame.
 */
export function DiscoHero({ name, eventDate, venueName, photo, storyHref, play }: DiscoHeroProps) {
  const badges = [
    { icon: CalendarDays, value: capitalize(formatDate(eventDate, "EEEE d 'de' MMMM")) },
    { icon: Clock, value: formatDate(eventDate, "HH:mm 'hrs'") },
    { icon: MapPin, value: venueName ?? '' },
  ].filter((badge) => badge.value);

  return (
    <header className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 pt-6 pb-20 sm:px-8">
      <Spotlights />
      <div className="disco-floor pointer-events-none absolute inset-x-[-20%] bottom-0 h-[45%]" aria-hidden="true" />
      <DiscoBall play={play} delay={0.2} className="relative -mb-6 w-[min(56vw,240px)]" />

      <div className="relative mx-auto grid w-full max-w-5xl items-center gap-10 md:grid-cols-[0.8fr_1.2fr]">
        {photo && (
          <div className="disco-neon-frame relative mx-auto aspect-[4/5] w-[min(62vw,300px)] -rotate-3 overflow-hidden rounded-[calc(var(--radius)+10px)] p-1.5 animate-[fadeUp_1s_0.6s_both] md:order-none">
            <img
              src={photo.src}
              alt={photo.alt}
              className="size-full rounded-[calc(var(--radius)+4px)] object-cover"
              style={photo.position ? { objectPosition: photo.position } : undefined}
            />
          </div>
        )}
        <div className={photo ? 'text-center md:text-left' : 'text-center md:col-span-2'}>
          <p className="font-unbounded text-[clamp(96px,22vw,200px)] leading-[0.85] font-extrabold tracking-tight disco-gradient-text animate-[fadeUp_0.9s_0.3s_both]">
            XV
          </p>
          <p className="mt-4 text-xs font-semibold tracking-[0.4em] text-(--accent-foreground) uppercase disco-glow-cyan">Mis quince · Noche disco</p>
          <h1 className="mt-3 font-unbounded text-[clamp(34px,6.5vw,64px)] leading-[1.05] font-semibold text-balance disco-glow animate-[fadeUp_0.9s_0.45s_both]">
            {name}
          </h1>
          {badges.length > 0 && (
            <div className={`mt-6 flex flex-wrap gap-2 animate-[fadeUp_0.9s_0.6s_both] ${photo ? 'justify-center md:justify-start' : 'justify-center'}`}>
              {badges.map(({ icon: Icon, value }) => (
                <Badge key={value} className="bg-(--card)/70 px-3.5 py-1.5 text-sm backdrop-blur-sm">
                  <Icon className="text-(--primary)" aria-hidden="true" />
                  {value}
                </Badge>
              ))}
            </div>
          )}
          <div className={`mt-8 flex flex-wrap gap-2 animate-[fadeUp_0.9s_0.75s_both] ${photo ? 'justify-center md:justify-start' : 'justify-center'}`}>
            <a href="#confirmar" onClick={scrollToHash} className={buttonClass('default', 'lg', 'rounded-full font-semibold shadow-[0_0_24px_-4px_var(--neon-pink)]')}>
              Apártame un lugar
            </a>
            <a href={storyHref} onClick={scrollToHash} className={buttonClass('outline', 'lg', 'rounded-full bg-transparent')}>
              Ver la noche
              <ArrowDown aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      <Equalizer bars={36} className="absolute bottom-0 inset-x-0 h-16 opacity-50" />
    </header>
  );
}
