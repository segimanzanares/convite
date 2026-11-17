import { useEffect, useRef, useState } from 'react';
import { MusicPlayer, type MusicPlayerHandle } from '../../components/music/MusicPlayer';
import { useAutoScroll } from '../../hooks/useAutoScroll';
import { eventDates, formatDate, initials, toCelebrant } from '../../lib/eventContent';
import type { BaptismContent } from '../../types/invitation';
import { DressCodeSection, GallerySection, GiftsSection } from './components/DetailSections';
import { CountdownSection, ProgramSection, VenuesSection } from './components/EventSections';
import { Footer } from './components/Footer';
import { IntroDialog } from './components/IntroDialog';
import { NubeHero } from './components/NubeHero';
import { RsvpSection } from './components/RsvpSection';
import { ClosingSection, HonorSection, StorySection } from './components/StorySections';
import './theme.css';

/**
 * A baptism in a nursery built on shadcn/ui's tokens: a dialog with a crib mobile opens the invitation, the hero hangs
 * the mobile over the baby's portrait among balloons and clouds, the parents and godparents sit in tabs, the program
 * is a set of numbered steps, sheep hop over a fence in the countdown, the photos make a masonry and a rainbow closes.
 */
export function InvitationPage({ invitation }: { invitation: BaptismContent }) {
  const musicPlayerRef = useRef<MusicPlayerHandle>(null);
  const [autoScrollActive, setAutoScrollActive] = useState(false);
  const [introOpen, setIntroOpen] = useState(false);
  const celebrant = toCelebrant(invitation);
  const { eventDate } = eventDates(invitation);
  const monogram = invitation.monogram || initials(...celebrant.name.split(/\s+/).slice(0, 2));
  const calendar = {
    dateTime: celebrant.eventDateTime,
    name: `Bautizo de ${celebrant.name}`,
    fileName: 'bautizo.ics',
  };

  useEffect(() => {
    document.title = `${celebrant.name} — Mi Bautizo`;
  }, [celebrant.name]);

  useAutoScroll({ active: autoScrollActive, speed: 70 });

  return (
    <div className="theme-bautizo-nube min-h-screen">
      <IntroDialog
        name={celebrant.name}
        dateLabel={formatDate(eventDate, "d 'de' MMMM")}
        onOpen={() => {
          setIntroOpen(true);
          musicPlayerRef.current?.play();
        }}
        onOpened={() => setAutoScrollActive(true)}
      />
      <MusicPlayer ref={musicPlayerRef} src={celebrant.musicFile} position="bottom-right" />

      <NubeHero
        name={celebrant.name}
        monogram={monogram}
        eventDate={eventDate}
        venueName={invitation.venues[0]?.name}
        photo={invitation.heroPhoto}
        storyHref={invitation.story ? '#historia' : '#celebracion'}
        play={introOpen}
      />

      {invitation.story && <StorySection story={invitation.story} />}
      {invitation.parents && <HonorSection parents={invitation.parents} godparents={invitation.godparents} />}

      <div id="celebracion" className="scroll-mt-4">
        {invitation.venues.length > 0 && <VenuesSection venues={invitation.venues} />}
        {invitation.program.length > 0 && <ProgramSection items={invitation.program} />}
      </div>

      {invitation.eventAt && <CountdownSection targetDateTime={invitation.eventAt} calendar={calendar} venues={invitation.venues} />}
      {invitation.gallery.length > 0 && <GallerySection images={invitation.gallery} />}
      {invitation.dressCode && <DressCodeSection dressCode={invitation.dressCode} />}
      {invitation.gifts.length > 0 && <GiftsSection gifts={invitation.gifts} />}

      <div id="confirmar" className="scroll-mt-4">
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
          'Gracias por acompañarnos en este día tan especial y por llenar de amor el comienzo de mi camino.'
        }
        signature={celebrant.firstName}
        dateLabel={celebrant.footerDateLabel}
      />

      <Footer name={celebrant.name} monogram={monogram} dateLabel={celebrant.footerDateLabel} tagline={invitation.tagline} />
    </div>
  );
}

export default InvitationPage;
