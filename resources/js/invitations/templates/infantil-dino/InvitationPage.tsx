import { useEffect, useRef, useState } from 'react';
import { MusicPlayer, type MusicPlayerHandle } from '../../components/music/MusicPlayer';
import { useAutoScroll } from '../../hooks/useAutoScroll';
import { eventDates, toCelebrant } from '../../lib/eventContent';
import type { BirthdayContent } from '../../types/invitation';
import { DinoHero } from './components/DinoHero';
import { GallerySection, GiftsSection } from './components/DetailSections';
import { EggIntro } from './components/EggIntro';
import { CountdownSection, MessageSection, ProgramSection, VenuesSection } from './components/EventSections';
import { Footer } from './components/Footer';
import { RsvpSection } from './components/RsvpSection';
import './theme.css';

/**
 * A jurassic kids' birthday on shadcn/ui's tokens, drawn chunky: an egg that hatches as the intro, a jungle hero with
 * a volcano and a dinosaur, the program as a trail of footprints, polaroid photos and colorful countdown tiles.
 */
export function InvitationPage({ invitation }: { invitation: BirthdayContent }) {
  const musicPlayerRef = useRef<MusicPlayerHandle>(null);
  const [autoScrollActive, setAutoScrollActive] = useState(false);
  const celebrant = toCelebrant(invitation);
  const { eventDate } = eventDates(invitation);
  const calendar = {
    dateTime: celebrant.eventDateTime,
    name: `Cumpleaños de ${celebrant.firstName}`,
    fileName: 'cumpleanos.ics',
  };

  useEffect(() => {
    document.title = `${celebrant.name} — ${celebrant.age} años`;
  }, [celebrant.name, celebrant.age]);

  useAutoScroll({ active: autoScrollActive, speed: 70 });

  return (
    <div className="theme-infantil-dino min-h-screen">
      <EggIntro
        firstName={celebrant.firstName}
        onOpen={() => musicPlayerRef.current?.play()}
        onOpened={() => setAutoScrollActive(true)}
      />
      <MusicPlayer ref={musicPlayerRef} src={celebrant.musicFile} position="bottom-right" />
      <DinoHero
        firstName={celebrant.firstName}
        age={celebrant.age}
        eventDate={eventDate}
        photoUrl={invitation.cover}
        place={invitation.venues[0]?.addressLines.at(-1)}
      />
      <MessageSection firstName={celebrant.firstName} age={celebrant.age} message={invitation.message} hosts={celebrant.hosts} />
      {invitation.venues.length > 0 && <VenuesSection venues={invitation.venues} />}
      {invitation.program.length > 0 && <ProgramSection items={invitation.program} />}
      {invitation.eventAt && <CountdownSection targetDateTime={invitation.eventAt} calendar={calendar} venues={invitation.venues} />}
      {invitation.gallery.length > 0 && <GallerySection images={invitation.gallery} firstName={celebrant.firstName} />}
      {invitation.gifts.length > 0 && <GiftsSection gifts={invitation.gifts} firstName={celebrant.firstName} />}
      <RsvpSection
        whatsappNumber={celebrant.rsvpWhatsappNumber}
        deadlineLabel={celebrant.rsvpDeadlineLabel}
        calendar={calendar}
        venues={invitation.venues}
      />
      <Footer name={celebrant.name} dateLabel={celebrant.footerDateLabel} tagline={invitation.tagline} />
    </div>
  );
}

export default InvitationPage;
