import { useEffect, useRef, useState } from 'react';
import { MusicPlayer, type MusicPlayerHandle } from '../../components/music/MusicPlayer';
import { useAutoScroll } from '../../hooks/useAutoScroll';
import { eventDates, formatDate, initials, toCelebrant } from '../../lib/eventContent';
import type { XvContent } from '../../types/invitation';
import { DiscoHero } from './components/DiscoHero';
import { DressCodeSection, GallerySection, GiftsSection } from './components/DetailSections';
import { CountdownSection, ProgramSection, VenuesSection } from './components/EventSections';
import { Footer } from './components/Footer';
import { RsvpSection } from './components/RsvpSection';
import { ClosingSection, HonorSection, StorySection } from './components/StorySections';
import { TicketIntro } from './components/TicketIntro';
import { TopNav, type NavLink } from './components/TopNav';
import './theme.css';

const LINKS: (NavLink & { section?: 'story' | 'gallery' | 'gifts' })[] = [
  { href: '#historia', label: 'Lado A', section: 'story' },
  { href: '#celebracion', label: 'La fiesta' },
  { href: '#galeria', label: 'Fotos', section: 'gallery' },
  { href: '#regalos', label: 'Regalos', section: 'gifts' },
];

/**
 * A XV on the dance floor, in shadcn/ui's dark theme with neon pink and cyan: a VIP ticket to open the invitation, a
 * mirror ball over a huge "XV", the letter as the liner notes of a record, the parents as a festival line-up, the
 * program as a setlist and an RSVP to get on the guest list.
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
    <div className="theme-xv-disco min-h-screen">
      <TicketIntro
        firstName={celebrant.firstName}
        monogram={monogram}
        dateLabel={formatDate(eventDate, 'dd.MM.yyyy')}
        onOpen={() => {
          setIntroOpen(true);
          musicPlayerRef.current?.play();
        }}
        onOpened={() => setAutoScrollActive(true)}
      />
      <TopNav links={links} />
      <MusicPlayer ref={musicPlayerRef} src={celebrant.musicFile} position="bottom-right" />

      <div id="inicio">
        <DiscoHero
          name={celebrant.name}
          eventDate={eventDate}
          venueName={invitation.venues.at(-1)?.name}
          photo={invitation.heroPhoto}
          storyHref={invitation.story ? '#historia' : '#celebracion'}
          play={introOpen}
        />
      </div>

      {invitation.story && (
        <div id="historia" className="scroll-mt-14">
          <StorySection story={invitation.story} monogram={monogram} />
        </div>
      )}
      {invitation.parents && <HonorSection parents={invitation.parents} godparents={invitation.godparents} />}

      <div id="celebracion" className="scroll-mt-14">
        {invitation.venues.length > 0 && <VenuesSection venues={invitation.venues} />}
        {invitation.program.length > 0 && <ProgramSection items={invitation.program} />}
      </div>

      {invitation.eventAt && <CountdownSection targetDateTime={invitation.eventAt} calendar={calendar} venues={invitation.venues} />}

      {hasSection.gallery && (
        <div id="galeria" className="scroll-mt-14">
          <GallerySection images={invitation.gallery} />
        </div>
      )}

      {invitation.dressCode && <DressCodeSection dressCode={invitation.dressCode} />}

      {hasSection.gifts && (
        <div id="regalos" className="scroll-mt-14">
          <GiftsSection gifts={invitation.gifts} />
        </div>
      )}

      <div id="confirmar" className="scroll-mt-14">
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
          'Quince años se celebran una sola vez, y quiero que suenen fuerte. Gracias por venir a bailarlos conmigo.'
        }
        signature={celebrant.firstName}
        dateLabel={celebrant.footerDateLabel}
      />

      <Footer name={celebrant.name} dateLabel={celebrant.footerDateLabel} tagline={invitation.tagline} />
    </div>
  );
}

export default InvitationPage;
