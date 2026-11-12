import { useEffect, useRef, useState } from 'react';
import { Envelope } from '../../components/envelope/Envelope';
import { FloatingPetals } from '../../components/hero/FloatingPetals';
import { Hero } from '../../components/hero/Hero';
import { CoupleMessage } from '../../components/message/CoupleMessage';
import { FullDivider } from '../../components/divider/FullDivider';
import { Countdown } from '../../components/countdown/Countdown';
import { Gallery } from '../../components/gallery/Gallery';
import { DressCodePalette } from '../../components/dresscode/DressCodePalette';
import { DressCodeSection } from '../../components/dresscode/DressCodeSection';
import { VenuesSection } from '../../components/venues/VenuesSection';
import { GiftsSection } from '../../components/gifts/GiftsSection';
import { RsvpSection } from '../../components/rsvp/RsvpSection';
import { Footer } from '../../components/footer/Footer';
import { MusicPlayer, type MusicPlayerHandle } from '../../components/music/MusicPlayer';
import { ProgramTimeline } from '../../components/program/ProgramTimeline';
import { useAutoScroll } from '../../hooks/useAutoScroll';
import { initials, toCouple } from '../../lib/eventContent';
import type { WeddingContent } from '../../types/invitation';
import bgHero from './images/bg-hero.jpeg';
import './theme.css';
import { FloralPageOrnamentBorder } from '../../components/layout/FloralPageOrnamentBorder';

export function InvitationPage({ invitation }: { invitation: WeddingContent }) {
  const musicPlayerRef = useRef<MusicPlayerHandle>(null);
  const [autoScrollActive, setAutoScrollActive] = useState(false);
  const couple = toCouple(invitation);
  const coupleTitle = `${couple.names[0]} & ${couple.names[1]}`;

  useEffect(() => {
    document.title = `${coupleTitle} — Nuestra Boda`;
  }, [coupleTitle]);

  useAutoScroll({ active: autoScrollActive, speed: 100 });

  return (
    <div className="theme-boda-clasica">
      <Envelope
        monogram={initials(...couple.names)}
        title={coupleTitle}
        ariaName={`${couple.names[0]} y ${couple.names[1]}`}
        onOpen={() => musicPlayerRef.current?.play()}
        onOpened={() => setAutoScrollActive(true)}
      />
      <MusicPlayer ref={musicPlayerRef} src={couple.musicFile} position="bottom-center" />
      <FloralPageOrnamentBorder />
      <FloatingPetals />
      <Hero couple={couple} backgroundImageUrl={invitation.cover ?? bgHero} />
      <CoupleMessage couple={couple} message={invitation.message} />
      <FullDivider text={coupleTitle} />
      {invitation.venues.length > 0 && <VenuesSection venues={invitation.venues} />}
      {invitation.program.length > 0 && (
        <ProgramTimeline items={invitation.program} intro="Así viviremos este día tan especial, momento a momento." />
      )}
      {invitation.eventAt && <Countdown targetDateTime={invitation.eventAt} />}
      {invitation.gallery.length > 0 && <Gallery images={invitation.gallery} />}
      {invitation.dressCode && <DressCodeSection dressCode={invitation.dressCode} />}
      {invitation.swatches.length > 0 && <DressCodePalette swatches={invitation.swatches} />}
      {invitation.gifts.length > 0 && <GiftsSection gifts={invitation.gifts} />}
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
