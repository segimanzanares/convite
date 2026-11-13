import { useEffect, useRef, useState } from 'react';
import { MusicPlayer, type MusicPlayerHandle } from '../../components/music/MusicPlayer';
import { useAutoScroll } from '../../hooks/useAutoScroll';
import { eventDates, formatDate, toCouple } from '../../lib/eventContent';
import type { WeddingContent } from '../../types/invitation';
import { DressCodeSection, GallerySection, GiftsSection } from './components/DetailSections';
import { CountdownBand, ProgramSection, StorySection, VenuesSection } from './components/EventSections';
import { Footer } from './components/Footer';
import { IntroDrawer } from './components/IntroDrawer';
import { RsvpSection } from './components/RsvpSection';
import { SerenaHero } from './components/SerenaHero';
import { TopNav, type NavLink } from './components/TopNav';
import './theme.css';

/**
 * A serene wedding in shadcn/ui's slate and blue: a full-height photo, a sticky navbar, venues in tabs, the program
 * as a timeline, the countdown on a blue band, the gifts in an accordion and a two-panel RSVP card.
 */
export function InvitationPage({ invitation }: { invitation: WeddingContent }) {
  const musicPlayerRef = useRef<MusicPlayerHandle>(null);
  const [autoScrollActive, setAutoScrollActive] = useState(false);
  const couple = toCouple(invitation);
  const coupleTitle = `${couple.names[0]} & ${couple.names[1]}`;
  const { eventDate } = eventDates(invitation);
  const hasDressCode = invitation.dressCode !== null || invitation.swatches.length > 0;

  useEffect(() => {
    document.title = `${coupleTitle} — Nos casamos`;
  }, [coupleTitle]);

  useAutoScroll({ active: autoScrollActive, speed: 70 });

  const navLinks: NavLink[] = [
    { href: '#historia', label: 'Nosotros' },
    invitation.venues.length > 0 && { href: '#lugares', label: 'Lugares' },
    invitation.program.length > 0 && { href: '#programa', label: 'Programa' },
    invitation.gallery.length > 0 && { href: '#galeria', label: 'Galería' },
    hasDressCode && { href: '#vestimenta', label: 'Vestimenta' },
    invitation.gifts.length > 0 && { href: '#regalos', label: 'Regalos' },
  ].filter((link): link is NavLink => Boolean(link));

  return (
    <div id="inicio" className="theme-boda-serena min-h-screen">
      <IntroDrawer
        names={couple.names}
        dateLabel={formatDate(eventDate, "d 'de' MMMM 'de' yyyy")}
        onOpen={() => musicPlayerRef.current?.play()}
        onOpened={() => setAutoScrollActive(true)}
      />
      <MusicPlayer ref={musicPlayerRef} src={couple.musicFile} position="bottom-right" />
      <TopNav names={couple.names} links={navLinks} />
      <SerenaHero
        names={couple.names}
        photoUrl={invitation.cover ?? invitation.gallery[0]?.src ?? null}
        dayLabel={formatDate(eventDate, "EEEE d 'de' MMMM, yyyy")}
        timeLabel={formatDate(eventDate, "HH:mm 'hrs'")}
        place={invitation.venues[0]?.addressLines.at(-1)}
      />
      <StorySection names={couple.names} message={invitation.message} families={couple.families} />
      {invitation.venues.length > 0 && <VenuesSection venues={invitation.venues} />}
      {invitation.program.length > 0 && <ProgramSection items={invitation.program} />}
      {invitation.eventAt && (
        <CountdownBand
          targetDateTime={invitation.eventAt}
          calendar={{ dateTime: couple.weddingDateTime, name: `Boda ${coupleTitle}`, fileName: 'boda.ics' }}
          venues={invitation.venues}
        />
      )}
      {invitation.gallery.length > 0 && <GallerySection images={invitation.gallery} />}
      {hasDressCode && <DressCodeSection dressCode={invitation.dressCode} swatches={invitation.swatches} />}
      {invitation.gifts.length > 0 && <GiftsSection gifts={invitation.gifts} />}
      <RsvpSection
        whatsappNumber={couple.rsvpWhatsappNumber}
        deadlineLabel={couple.rsvpDeadlineLabel}
        calendar={{ dateTime: couple.weddingDateTime, name: `Boda ${coupleTitle}`, fileName: 'boda.ics' }}
        venues={invitation.venues}
      />
      <Footer names={couple.names} dateLabel={couple.footerDateLabel} tagline={invitation.tagline} />
    </div>
  );
}

export default InvitationPage;
