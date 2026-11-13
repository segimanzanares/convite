import { useEffect, useRef, useState } from 'react';
import { MusicPlayer, type MusicPlayerHandle } from '../../components/music/MusicPlayer';
import { useAutoScroll } from '../../hooks/useAutoScroll';
import { eventDates, formatDate, initials, toCelebrant } from '../../lib/eventContent';
import type { XvContent } from '../../types/invitation';
import { AuroraHero } from './components/AuroraHero';
import { DressCodeSection, GallerySection, GiftsSection } from './components/DetailSections';
import { CountdownSection, ProgramSection, VenuesSection } from './components/EventSections';
import { Footer } from './components/Footer';
import { IntroSheet } from './components/IntroSheet';
import { RsvpSection } from './components/RsvpSection';
import { ClosingSection, HonorSection, StorySection } from './components/StorySections';
import { TopNav, type NavLink } from './components/TopNav';
import './theme.css';

const LINKS: (NavLink & { section?: 'story' | 'gallery' | 'gifts' })[] = [
  { href: '#historia', label: 'Mi historia', section: 'story' },
  { href: '#celebracion', label: 'La fiesta' },
  { href: '#galeria', label: 'Fotos', section: 'gallery' },
  { href: '#regalos', label: 'Regalos', section: 'gifts' },
];

/**
 * A XV in shadcn/ui's violet theme with soft auroras: a sheet that rises to open the invitation, a two-column hero with
 * a tiara that draws itself, the letter on a card, the program as a timeline, the photos in a carousel, the gifts in
 * an accordion and an RSVP with a toggle group.
 */
export function InvitationPage({ invitation }: { invitation: XvContent }) {
  const musicPlayerRef = useRef<MusicPlayerHandle>(null);
  const [autoScrollActive, setAutoScrollActive] = useState(false);
  const [introOpen, setIntroOpen] = useState(false);
  const celebrant = toCelebrant(invitation);
  const { eventDate } = eventDates(invitation);
  const monogram = invitation.monogram || initials(...celebrant.name.split(/\s+/).slice(0, 2));
  const calendar = {
    dateTime: celebrant.eventDateTime,
    name: `XV años de ${celebrant.name}`,
    fileName: 'xv-anos.ics',
  };
  const hasSection = { story: invitation.story !== null, gallery: invitation.gallery.length > 0, gifts: invitation.gifts.length > 0 };
  const links = LINKS.filter((link) => !link.section || hasSection[link.section]);

  useEffect(() => {
    document.title = `${celebrant.name} — Mis XV Años`;
  }, [celebrant.name]);

  useAutoScroll({ active: autoScrollActive, speed: 80 });

  return (
    <div className="theme-xv-aurora min-h-screen">
      <IntroSheet
        name={celebrant.name}
        dateLabel={formatDate(eventDate, "d 'de' MMMM")}
        onOpen={() => {
          setIntroOpen(true);
          musicPlayerRef.current?.play();
        }}
        onOpened={() => setAutoScrollActive(true)}
      />
      <TopNav monogram={monogram} links={links} />
      <MusicPlayer ref={musicPlayerRef} src={celebrant.musicFile} position="bottom-right" />

      <div id="inicio">
        <AuroraHero
          name={celebrant.name}
          eventDate={eventDate}
          venueName={invitation.venues.at(-1)?.name}
          photo={invitation.heroPhoto}
          storyHref={invitation.story ? '#historia' : '#celebracion'}
          play={introOpen}
        />
      </div>

      {invitation.story && <StorySection story={invitation.story} />}
      {invitation.parents && <HonorSection parents={invitation.parents} godparents={invitation.godparents} />}

      <div id="celebracion" className="scroll-mt-16">
        {invitation.venues.length > 0 && <VenuesSection venues={invitation.venues} />}
        {invitation.program.length > 0 && <ProgramSection items={invitation.program} />}
      </div>

      {invitation.eventAt && <CountdownSection targetDateTime={invitation.eventAt} calendar={calendar} venues={invitation.venues} />}

      {hasSection.gallery && (
        <div id="galeria" className="scroll-mt-16">
          <GallerySection images={invitation.gallery} />
        </div>
      )}

      {invitation.dressCode && <DressCodeSection dressCode={invitation.dressCode} />}

      {hasSection.gifts && (
        <div id="regalos" className="scroll-mt-16">
          <GiftsSection gifts={invitation.gifts} />
        </div>
      )}

      <div id="confirmar" className="scroll-mt-16">
        <RsvpSection
          whatsappNumber={celebrant.rsvpWhatsappNumber}
          deadlineLabel={celebrant.rsvpDeadlineLabel}
          calendar={calendar}
          venues={invitation.venues}
        />
      </div>

      <ClosingSection
        message={
          invitation.closingMessage ||
          'Hoy cierro un capítulo y abro otro lleno de sueños. Gracias por estar aquí para verlo comenzar.'
        }
        signature={celebrant.firstName}
        dateLabel={celebrant.footerDateLabel}
      />

      <Footer name={celebrant.name} monogram={monogram} dateLabel={celebrant.footerDateLabel} tagline={invitation.tagline} />
    </div>
  );
}

export default InvitationPage;
