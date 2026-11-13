import { useEffect, useRef, useState } from 'react';
import { StoryCover } from '../../components/xv/StoryCover';
import { ChapterNav, type ChapterLink } from '../../components/xv/ChapterNav';
import { StoryChapter } from '../../components/xv/StoryChapter';
import { HonorSection } from '../../components/xv/HonorSection';
import { ClosingChapter } from '../../components/xv/ClosingChapter';
import { StoryRsvp } from '../../components/xv/StoryRsvp';
import { StoryGallery } from '../../components/gallery/StoryGallery';
import { FloatingPetals } from '../../components/hero/FloatingPetals';
import { FullDivider } from '../../components/divider/FullDivider';
import { VenuesSection } from '../../components/venues/VenuesSection';
import { ProgramTimeline } from '../../components/program/ProgramTimeline';
import { Countdown } from '../../components/countdown/Countdown';
import { DressCodeSection } from '../../components/dresscode/DressCodeSection';
import { GiftsSection } from '../../components/gifts/GiftsSection';
import { Footer } from '../../components/footer/Footer';
import { MusicPlayer, type MusicPlayerHandle } from '../../components/music/MusicPlayer';
import { useAutoScroll } from '../../hooks/useAutoScroll';
import { eventDates, formatDate, initials, toCelebrant } from '../../lib/eventContent';
import type { XvContent } from '../../types/invitation';
import { HangingStars, MoonPhasesDivider } from './components/CelestialArt';
import { CelestialHero } from './components/CelestialHero';
import './theme.css';

/** Falling stars in place of the garden's petals. */
const FALLING_STARS = ['✦', '✧', '⋆', '☾', '·'];

const CHAPTERS: (ChapterLink & { section?: 'story' | 'gallery' | 'gifts' })[] = [
  { href: '#historia', label: 'Mi historia', section: 'story' },
  { href: '#celebracion', label: 'La noche' },
  { href: '#galeria', label: 'Recuerdos', section: 'gallery' },
  { href: '#deseos', label: 'Un detalle', section: 'gifts' },
  { href: '#confirmar', label: 'Confirmar' },
];
// Sections get a top offset so the fixed chapter bar doesn't cover their heading.
const ANCHOR = 'scroll-mt-12';

/**
 * A XV under the stars, built from the same storybook sections as xv-jardin: midnight indigo and moonlit silver, a
 * night-sky hero with a crescent moon and a tiara-shaped constellation, the phases of the moon between chapters and
 * stars hanging over the RSVP card.
 */
export function InvitationPage({ invitation }: { invitation: XvContent }) {
  const musicPlayerRef = useRef<MusicPlayerHandle>(null);
  const [autoScrollActive, setAutoScrollActive] = useState(false);
  const [coverOpen, setCoverOpen] = useState(false);
  const celebrant = toCelebrant(invitation);
  const { eventDate } = eventDates(invitation);
  const monogram = invitation.monogram || initials(...celebrant.name.split(/\s+/).slice(0, 2));
  /** e.g. "sábado 12 de junio de 2027" */
  const dateLabel = formatDate(eventDate, "EEEE dd 'de' MMMM 'de' yyyy");
  /** e.g. "12 · JUN · 2027" */
  const shortDate = formatDate(eventDate, "dd '·' MMM '·' yyyy").replace('.', '').toUpperCase();
  /** e.g. "12.06.2027" */
  const dottedDate = formatDate(eventDate, 'dd.MM.yyyy');
  /** e.g. "Sábado · 12 junio 2027" */
  const cardDate = formatDate(eventDate, "EEEE '·' dd MMMM yyyy").replace(/^./, (c) => c.toUpperCase());
  const hasSection = { story: invitation.story !== null, gallery: invitation.gallery.length > 0, gifts: invitation.gifts.length > 0 };
  const chapters = CHAPTERS.filter((chapter) => !chapter.section || hasSection[chapter.section]);

  useEffect(() => {
    document.title = `${celebrant.name} — Mis XV Años`;
  }, [celebrant.name]);

  useAutoScroll({ active: autoScrollActive, speed: 100 });

  return (
    <div className="theme-xv-celestial bg-ivory text-ink">
      <StoryCover
        monogram={monogram}
        name={celebrant.name}
        subtitle={`Mis XV años · ${dottedDate}`}
        kicker="Esta noche, las estrellas tienen algo que contarte"
        coverEyebrow="Bajo un cielo de estrellas"
        firstPageLine="Había una vez una estrella…"
        ariaName={celebrant.name}
        onOpen={() => {
          setCoverOpen(true);
          musicPlayerRef.current?.play();
        }}
        onOpened={() => setAutoScrollActive(true)}
      />
      <ChapterNav monogram={monogram} links={chapters} />
      <MusicPlayer ref={musicPlayerRef} src={celebrant.musicFile} position="bottom-center" />
      <FloatingPetals symbols={FALLING_STARS} />

      <div id="inicio">
        <CelestialHero
          name={celebrant.name}
          eyebrow="Bajo un cielo de estrellas"
          shortDate={shortDate}
          dateLabel={dateLabel}
          storyHref={invitation.story ? '#historia' : '#celebracion'}
          rsvpHref="#confirmar"
          photo={invitation.heroPhoto ?? undefined}
          play={coverOpen}
        />
      </div>

      {invitation.story && (
        <StoryChapter id="historia" {...invitation.story} photo={invitation.story.photo ?? undefined} />
      )}

      {invitation.parents && (
        <HonorSection
          eyebrow="Mi constelación"
          title="Quienes iluminan mi camino"
          intro="Con la bendición de Dios y de la mano de quienes más quiero, te invito a compartir esta noche conmigo."
          featured={invitation.parents}
          groups={invitation.godparents}
        />
      )}

      <FullDivider text={`${celebrant.firstName} · XV`} />

      <div id="celebracion" className={ANCHOR}>
        {invitation.venues.length > 0 && (
          <VenuesSection
            venues={invitation.venues}
            eyebrow="Donde brillará la noche"
            title="La celebración"
            intro="Aquí comenzará y seguirá la noche más especial de mis quince años."
          />
        )}
        {invitation.program.length > 0 && (
          <>
            <MoonPhasesDivider className="pt-4 bg-ivory" />
            <ProgramTimeline
              items={invitation.program}
              eyebrow="Hora a hora"
              title="Itinerario de la noche"
              intro="De la primera estrella hasta el último baile."
            />
          </>
        )}
      </div>

      {invitation.eventAt && (
        <Countdown
          targetDateTime={invitation.eventAt}
          eyebrow="Faltan"
          title="Contando estrellas hasta esa noche"
          headingTone="dark"
        />
      )}

      {hasSection.gallery && (
        <div id="galeria" className={ANCHOR}>
          <StoryGallery
            images={invitation.gallery}
            eyebrow="Polvo de estrellas"
            title="Quince años en fotos"
            intro="Pequeños destellos de todo lo que me trajo hasta esta noche."
          />
        </div>
      )}

      {invitation.dressCode && (
        <>
          <MoonPhasesDivider className="pt-16 bg-ivory" />
          <DressCodeSection dressCode={invitation.dressCode} eyebrow="Para brillar juntos" title="Código de vestimenta" />
        </>
      )}

      {hasSection.gifts && (
        <div id="deseos" className={ANCHOR}>
          <GiftsSection
            gifts={invitation.gifts}
            eyebrow="Pide un deseo"
            title="Un detalle para mí"
            intro={[
              'Que compartas esta noche conmigo ya es el deseo cumplido.',
              'Si además quieres regalarme algo, aquí te dejo cómo:',
            ]}
          />
        </div>
      )}

      <div id="confirmar" className={ANCHOR}>
        <StoryRsvp
          whatsappNumber={celebrant.rsvpWhatsappNumber}
          celebrantName={celebrant.name}
          dateLabel={cardDate}
          deadlineLabel={celebrant.rsvpDeadlineLabel}
          signature={`Con cariño, ${celebrant.firstName}`}
          calendar={{
            dateTime: celebrant.eventDateTime,
            name: `XV años de ${celebrant.name}`,
            fileName: 'xv-anos.ics',
          }}
          venues={invitation.venues}
          ornament={
            <>
              <HangingStars className="absolute -z-10 top-0 left-[2%] w-[clamp(150px,22vw,280px)] opacity-80" />
              <HangingStars flip delay={0.4} className="absolute -z-10 top-0 right-[2%] w-[clamp(130px,19vw,240px)] opacity-70" />
            </>
          }
        />
      </div>

      <ClosingChapter
        kicker="Y así, bajo las estrellas…"
        message={
          invitation.closingMessage ||
          '…pediré un deseo al cielo: que esta noche brille para siempre en la memoria de todos los que la compartimos.'
        }
        signature={celebrant.name}
        dateLabel={celebrant.footerDateLabel}
      />

      <Footer
        title={celebrant.name}
        dateLabel={celebrant.footerDateLabel}
        tagline={invitation.tagline || 'Una noche escrita en las estrellas'}
      />
    </div>
  );
}

export default InvitationPage;
