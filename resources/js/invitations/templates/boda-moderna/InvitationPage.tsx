import { useEffect, useRef, useState } from 'react';
import { MusicPlayer, type MusicPlayerHandle } from '../../components/music/MusicPlayer';
import { useAutoScroll } from '../../hooks/useAutoScroll';
import { toCouple } from '../../lib/eventContent';
import type { WeddingContent } from '../../types/invitation';
import { DressCodeSection, GallerySection, GiftsSection } from './components/DetailSections';
import { CountdownSection, MessageSection, ProgramSection, VenuesSection } from './components/EventSections';
import { Footer } from './components/Footer';
import { IntroDialog } from './components/IntroDialog';
import { ModernHero } from './components/ModernHero';
import { RsvpSection } from './components/RsvpSection';
import './theme.css';

/**
 * A minimal wedding in the style of shadcn/ui: zinc neutrals, cards with hairline borders, Geist type and an
 * inverted dark band for the countdown and the RSVP.
 */
export function InvitationPage({ invitation }: { invitation: WeddingContent }) {
  const musicPlayerRef = useRef<MusicPlayerHandle>(null);
  const [autoScrollActive, setAutoScrollActive] = useState(false);
  const couple = toCouple(invitation);
  const coupleTitle = `${couple.names[0]} & ${couple.names[1]}`;

  useEffect(() => {
    document.title = `${coupleTitle} — Nuestra Boda`;
  }, [coupleTitle]);

  useAutoScroll({ active: autoScrollActive, speed: 70 });

  return (
    <div className="theme-boda-moderna min-h-screen">
      <IntroDialog
        names={couple.names}
        dateLabel={couple.dateLabel}
        onOpen={() => musicPlayerRef.current?.play()}
        onOpened={() => setAutoScrollActive(true)}
      />
      <MusicPlayer ref={musicPlayerRef} src={couple.musicFile} position="bottom-center" />
      <ModernHero
        couple={couple}
        photoUrl={invitation.cover ?? invitation.gallery[0]?.src ?? null}
        place={invitation.venues[0]?.addressLines.at(-1)}
      />
      <MessageSection message={invitation.message} families={couple.families} />
      <div id="detalles" className="scroll-mt-6" />
      {invitation.venues.length > 0 && <VenuesSection venues={invitation.venues} />}
      {invitation.program.length > 0 && <ProgramSection items={invitation.program} />}
      {invitation.eventAt && <CountdownSection targetDateTime={invitation.eventAt} />}
      {invitation.gallery.length > 0 && <GallerySection images={invitation.gallery} />}
      {(invitation.dressCode || invitation.swatches.length > 0) && (
        <DressCodeSection dressCode={invitation.dressCode} swatches={invitation.swatches} />
      )}
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
