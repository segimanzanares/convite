import { useEffect, useRef, useState } from 'react';
import { MusicPlayer, type MusicPlayerHandle } from '../../components/music/MusicPlayer';
import { useAutoScroll } from '../../hooks/useAutoScroll';
import { eventDates, initials, toCelebrant } from '../../lib/eventContent';
import type { BirthdayContent } from '../../types/invitation';
import { ConfetiHero } from './components/ConfetiHero';
import { DressCodeSection, GallerySection, GiftsSection } from './components/DetailSections';
import { CountdownSection, MessageSection, ProgramSection, VenuesSection } from './components/EventSections';
import { Footer } from './components/Footer';
import { IntroCard } from './components/IntroCard';
import { RsvpSection } from './components/RsvpSection';
import './theme.css';

/**
 * A festive birthday in shadcn/ui's rose theme: an alert-dialog intro that bursts into confetti, a bento grid hero,
 * the program as a stepper of cards, a photo mosaic, the gifts in tabs and an RSVP with option cards.
 */
export function InvitationPage({ invitation }: { invitation: BirthdayContent }) {
  const musicPlayerRef = useRef<MusicPlayerHandle>(null);
  const [autoScrollActive, setAutoScrollActive] = useState(false);
  const celebrant = toCelebrant(invitation);
  const { eventDate } = eventDates(invitation);
  const monogram = initials(...celebrant.name.split(/\s+/).slice(0, 2));
  const calendar = {
    dateTime: celebrant.eventDateTime,
    name: `Cumpleaños de ${celebrant.name}`,
    fileName: 'cumpleanos.ics',
  };

  useEffect(() => {
    document.title = `${celebrant.name} — ${celebrant.age} años`;
  }, [celebrant.name, celebrant.age]);

  useAutoScroll({ active: autoScrollActive, speed: 70 });

  return (
    <div className="theme-cumpleanos-confeti min-h-screen">
      <IntroCard
        firstName={celebrant.firstName}
        age={celebrant.age}
        hosts={celebrant.hosts}
        initials={monogram}
        onOpen={() => musicPlayerRef.current?.play()}
        onOpened={() => setAutoScrollActive(true)}
      />
      <MusicPlayer ref={musicPlayerRef} src={celebrant.musicFile} position="bottom-right" />
      <ConfetiHero
        name={celebrant.name}
        age={celebrant.age}
        eventDate={eventDate}
        photoUrl={invitation.cover}
        venueName={invitation.venues[0]?.name}
        place={invitation.venues[0]?.addressLines.at(-1)}
      />
      <MessageSection firstName={celebrant.firstName} age={celebrant.age} message={invitation.message} hosts={celebrant.hosts} />
      {invitation.venues.length > 0 && <VenuesSection venues={invitation.venues} />}
      {invitation.program.length > 0 && <ProgramSection items={invitation.program} />}
      {invitation.eventAt && <CountdownSection targetDateTime={invitation.eventAt} calendar={calendar} venues={invitation.venues} />}
      {invitation.gallery.length > 0 && (
        <GallerySection images={invitation.gallery} firstName={celebrant.firstName} age={celebrant.age} />
      )}
      {(invitation.dressCode || invitation.swatches.length > 0) && (
        <DressCodeSection dressCode={invitation.dressCode} swatches={invitation.swatches} />
      )}
      {invitation.gifts.length > 0 && <GiftsSection gifts={invitation.gifts} firstName={celebrant.firstName} />}
      <RsvpSection
        whatsappNumber={celebrant.rsvpWhatsappNumber}
        deadlineLabel={celebrant.rsvpDeadlineLabel}
        calendar={calendar}
        venues={invitation.venues}
      />
      <Footer
        name={celebrant.name}
        initials={monogram}
        dateLabel={celebrant.footerDateLabel}
        tagline={invitation.tagline}
      />
    </div>
  );
}

export default InvitationPage;
