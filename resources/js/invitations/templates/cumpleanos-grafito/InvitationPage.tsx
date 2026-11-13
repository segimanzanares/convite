import { useEffect, useRef, useState } from 'react';
import { MusicPlayer, type MusicPlayerHandle } from '../../components/music/MusicPlayer';
import { useAutoScroll } from '../../hooks/useAutoScroll';
import { eventDates, formatDate, toCelebrant } from '../../lib/eventContent';
import type { BirthdayContent } from '../../types/invitation';
import { CommandIntro } from './components/CommandIntro';
import { DressCodeSection, GallerySection, GiftsSection } from './components/DetailSections';
import { CountdownSection, MessageSection, ProgramSection, VenuesSection } from './components/EventSections';
import { Footer } from './components/Footer';
import { GrafitoHero } from './components/GrafitoHero';
import { RsvpSection } from './components/RsvpSection';
import './theme.css';

/**
 * A birthday in shadcn/ui's dark theme, graphite with an amber accent: a command palette as the intro, a hero with
 * the age as an outline and stat cards, the program as a table, a snapping photo strip, the dress code as a spec
 * sheet and the gifts as cards.
 */
export function InvitationPage({ invitation }: { invitation: BirthdayContent }) {
  const musicPlayerRef = useRef<MusicPlayerHandle>(null);
  const [autoScrollActive, setAutoScrollActive] = useState(false);
  const celebrant = toCelebrant(invitation);
  const { eventDate } = eventDates(invitation);
  const place = invitation.venues[0]?.addressLines.at(-1);
  const calendar = {
    dateTime: celebrant.eventDateTime,
    name: `Cumpleaños de ${celebrant.name}`,
    fileName: 'cumpleanos.ics',
  };

  useEffect(() => {
    document.title = `${celebrant.name} — ${celebrant.age} años`;
  }, [celebrant.name, celebrant.age]);

  useAutoScroll({ active: autoScrollActive, speed: 70 });

  // The sections are numbered in order ("01", "02"...), skipping the ones without content.
  let sectionCount = 0;
  const next = () => String(++sectionCount).padStart(2, '0');
  const hasDressCode = invitation.dressCode !== null || invitation.swatches.length > 0;

  return (
    <div className="theme-cumpleanos-grafito min-h-screen">
      <CommandIntro
        firstName={celebrant.firstName}
        age={celebrant.age}
        dateLabel={formatDate(eventDate, "EEEE d 'de' MMMM · HH:mm 'hrs'")}
        place={place}
        onOpen={() => musicPlayerRef.current?.play()}
        onOpened={() => setAutoScrollActive(true)}
      />
      <MusicPlayer ref={musicPlayerRef} src={celebrant.musicFile} position="bottom-right" />
      <GrafitoHero
        name={celebrant.name}
        firstName={celebrant.firstName}
        age={celebrant.age}
        eventDate={eventDate}
        photoUrl={invitation.cover}
        place={place}
      />
      <MessageSection index={next()} firstName={celebrant.firstName} age={celebrant.age} message={invitation.message} hosts={celebrant.hosts} />
      {invitation.venues.length > 0 && <VenuesSection index={next()} venues={invitation.venues} />}
      {invitation.program.length > 0 && <ProgramSection index={next()} items={invitation.program} />}
      {invitation.eventAt && (
        <CountdownSection index={next()} targetDateTime={invitation.eventAt} calendar={calendar} venues={invitation.venues} />
      )}
      {invitation.gallery.length > 0 && <GallerySection index={next()} images={invitation.gallery} firstName={celebrant.firstName} />}
      {hasDressCode && <DressCodeSection index={next()} dressCode={invitation.dressCode} swatches={invitation.swatches} />}
      {invitation.gifts.length > 0 && <GiftsSection index={next()} gifts={invitation.gifts} firstName={celebrant.firstName} />}
      <RsvpSection
        index={next()}
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
