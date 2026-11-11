import { useEffect, useRef, useState } from 'react';
import { Envelope } from '../../components/envelope/Envelope';
import { PageOrnamentBorder } from '../../components/layout/PageOrnamentBorder';
import { FloatingPetals } from '../../components/hero/FloatingPetals';
import { Hero } from '../../components/hero/Hero';
import { CoupleMessage } from '../../components/message/CoupleMessage';
import { FullDivider } from '../../components/divider/FullDivider';
import { Countdown } from '../../components/countdown/Countdown';
import { Gallery } from '../../components/gallery/Gallery';
import { DressCodePalette } from '../../components/dresscode/DressCodePalette';
import { DressCodeSection } from '../../components/dresscode/DressCodeSection';
import { VenuesSection } from '../../components/venues/VenuesSection';
import { RsvpSection } from '../../components/rsvp/RsvpSection';
import { Footer } from '../../components/footer/Footer';
import { MusicPlayer, type MusicPlayerHandle } from '../../components/music/MusicPlayer';
import { useAutoScroll } from '../../hooks/useAutoScroll';
import { initials, toCouple } from '../../lib/eventContent';
import type { WeddingContent } from '../../types/invitation';
import bgHero from './images/bg-hero.jpeg';
import './theme.css';

export function InvitationPage({ invitation }: { invitation: WeddingContent }) {
  const musicPlayerRef = useRef<MusicPlayerHandle>(null);
  const [autoScrollActive, setAutoScrollActive] = useState(false);
  const couple = toCouple(invitation);
  const coupleTitle = `${couple.names[0]} & ${couple.names[1]}`;

  useEffect(() => {
    document.title = `${coupleTitle} — Nuestra Boda`;
  }, [coupleTitle]);

  useAutoScroll({ active: autoScrollActive, speed: 60 });

  return (
    <div className="theme-boda-floral">
      <Envelope
        monogram={initials(...couple.names)}
        title={coupleTitle}
        ariaName={`${couple.names[0]} y ${couple.names[1]}`}
        onOpen={() => musicPlayerRef.current?.play()}
        onOpened={() => setAutoScrollActive(true)}
      />
      <MusicPlayer ref={musicPlayerRef} src={couple.musicFile} />
      <PageOrnamentBorder />
      <FloatingPetals />
      <Hero couple={couple} backgroundImageUrl={invitation.cover ?? bgHero} />
      <CoupleMessage couple={couple} message={invitation.message} />
      <FullDivider text={coupleTitle} />
      {invitation.venues.length > 0 && <VenuesSection venues={invitation.venues} />}
      {invitation.eventAt && <Countdown targetDateTime={invitation.eventAt} />}
      {invitation.gallery.length > 0 && <Gallery images={invitation.gallery} />}
      {invitation.dressCode && <DressCodeSection dressCode={invitation.dressCode} />}
      {invitation.swatches.length > 0 && <DressCodePalette swatches={invitation.swatches} />}
      <RsvpSection
        whatsappNumber={couple.rsvpWhatsappNumber}
        deadlineLabel={couple.rsvpDeadlineLabel}
        calendar={{ dateTime: couple.weddingDateTime, name: `Boda ${coupleTitle}`, fileName: 'boda.ics' }}
        venues={invitation.venues}
      />
      <Footer title={coupleTitle} dateLabel={couple.footerDateLabel} tagline={invitation.tagline ?? undefined} />
    </div>
  );
}

export default InvitationPage;
