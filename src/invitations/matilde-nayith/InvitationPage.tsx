import { useEffect, useRef, useState } from 'react';
import { Envelope } from '../../components/envelope/Envelope';
import { PageOrnamentBorder } from '../../components/layout/PageOrnamentBorder';
import { FloatingPetals } from '../../components/hero/FloatingPetals';
import { Hero } from '../../components/hero/Hero';
import { CoupleMessage } from '../../components/message/CoupleMessage';
import { FullDivider } from '../../components/divider/FullDivider';
import { EventDetails } from '../../components/details/EventDetails';
import { Countdown } from '../../components/countdown/Countdown';
import { Gallery } from '../../components/gallery/Gallery';
import { DressCodePalette } from '../../components/dresscode/DressCodePalette';
import { VenuesSection } from '../../components/venues/VenuesSection';
import { RsvpSection } from '../../components/rsvp/RsvpSection';
import { Footer } from '../../components/footer/Footer';
import { MusicPlayer, type MusicPlayerHandle } from '../../components/music/MusicPlayer';
import { useAutoScroll } from '../../hooks/useAutoScroll';
import {
  COUPLE,
  DRESS_CODE_SWATCHES,
  EVENT_DETAILS,
  GALLERY_IMAGES,
  VENUES,
} from './data';
import bgHero from './images/bg-hero.jpeg';
import './theme.css';

const COUPLE_TITLE = `${COUPLE.names[0]} & ${COUPLE.names[1]}`;

export function InvitationPage() {
  const musicPlayerRef = useRef<MusicPlayerHandle>(null);
  const [autoScrollActive, setAutoScrollActive] = useState(false);

  useEffect(() => {
    document.title = `${COUPLE_TITLE} — Nuestra Boda`;
  }, []);

  useAutoScroll({ active: autoScrollActive, speed: 60 });

  return (
    <div className="theme-matilde-nayith">
      <Envelope
        monogram={`${COUPLE.names[0].charAt(0)}${COUPLE.names[1].charAt(0)}`}
        title={COUPLE_TITLE}
        ariaName={`${COUPLE.names[0]} y ${COUPLE.names[1]}`}
        onOpen={() => musicPlayerRef.current?.play()}
        onOpened={() => setAutoScrollActive(true)}
      />
      <MusicPlayer ref={musicPlayerRef} src={COUPLE.musicFile} />
      <PageOrnamentBorder />
      <FloatingPetals />
      <Hero couple={COUPLE} backgroundImageUrl={bgHero} />
      <CoupleMessage couple={COUPLE} />
      <FullDivider text={COUPLE_TITLE} />
      <EventDetails details={EVENT_DETAILS} />
      <Countdown targetDateTime={COUPLE.weddingDateTime} />
      <Gallery images={GALLERY_IMAGES} />
      <DressCodePalette swatches={DRESS_CODE_SWATCHES} />
      <VenuesSection venues={VENUES} />
      <RsvpSection
        whatsappNumber={COUPLE.rsvpWhatsappNumber}
        deadlineLabel={COUPLE.rsvpDeadlineLabel}
        calendar={{ dateTime: COUPLE.weddingDateTime, name: `Boda ${COUPLE_TITLE}`, fileName: 'boda.ics' }}
        venues={VENUES}
      />
      <Footer title={COUPLE_TITLE} dateLabel={COUPLE.footerDateLabel} />
    </div>
  );
}

export default InvitationPage;
