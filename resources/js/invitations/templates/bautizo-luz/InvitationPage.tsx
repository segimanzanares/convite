import { useEffect, useRef, useState } from 'react';
import { MusicPlayer, type MusicPlayerHandle } from '../../components/music/MusicPlayer';
import { useAutoScroll } from '../../hooks/useAutoScroll';
import { eventDates, formatDate, initials, toCelebrant } from '../../lib/eventContent';
import type { BaptismContent } from '../../types/invitation';
import { CandleIntro } from './components/CandleIntro';
import { DressCodeSection, GallerySection, GiftsSection } from './components/DetailSections';
import { CountdownSection, ProgramSection, VenuesSection } from './components/EventSections';
import { Footer } from './components/Footer';
import { LuzHero } from './components/LuzHero';
import { RsvpSection } from './components/RsvpSection';
import { UiWishesSection } from '../../components/wishes/UiWishesSection';
import { ClosingSection, HonorSection, StorySection } from './components/StorySections';
import './theme.css';

/**
 * A baptism by candlelight, built on shadcn/ui's tokens in an editorial key: the guest lights the baptismal candle to
 * open the invitation, a rose window turns behind the baby's portrait under the dove, the family reads as a table, the
 * program as an order of the day, a candle burns through the countdown and drops ripple the water at the close.
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
    <div className="theme-bautizo-luz min-h-screen">
      <CandleIntro
        name={celebrant.name}
        dateLabel={formatDate(eventDate, "d 'de' MMMM")}
        onOpen={() => {
          setIntroOpen(true);
          musicPlayerRef.current?.play();
        }}
        onOpened={() => setAutoScrollActive(true)}
      />
      <MusicPlayer ref={musicPlayerRef} src={celebrant.musicFile} position="bottom-right" />

      <LuzHero
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

      <UiWishesSection titleClassName="font-newsreader font-light italic" />

      <ClosingSection
        message={
          invitation.closingMessage ||
          'Que la luz que hoy se enciende en mí ilumine siempre a quienes me acompañan. Gracias por estar aquí.'
        }
        signature={celebrant.firstName}
        dateLabel={celebrant.footerDateLabel}
      />

      <Footer name={celebrant.name} monogram={monogram} dateLabel={celebrant.footerDateLabel} tagline={invitation.tagline} />
    </div>
  );
}

export default InvitationPage;
