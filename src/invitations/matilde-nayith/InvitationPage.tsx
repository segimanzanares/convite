import { useEffect, useRef } from 'react';
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
import {
  COUPLE,
  DRESS_CODE_SWATCHES,
  EVENT_DETAILS,
  GALLERY_IMAGES,
  VENUES,
} from './data';
import bgHero from './images/bg-hero.jpeg';
import './theme.css';

export function InvitationPage() {
  const musicPlayerRef = useRef<MusicPlayerHandle>(null);

  useEffect(() => {
    document.title = `${COUPLE.names[0]} & ${COUPLE.names[1]} — Nuestra Boda`;
  }, []);

  return (
    <div className="theme-matilde-nayith">
      <Envelope couple={COUPLE} onOpen={() => musicPlayerRef.current?.play()} />
      <MusicPlayer ref={musicPlayerRef} src={COUPLE.musicFile} />
      <PageOrnamentBorder />
      <FloatingPetals />
      <Hero couple={COUPLE} backgroundImageUrl={bgHero} />
      <CoupleMessage couple={COUPLE} />
      <FullDivider text={`${COUPLE.names[0]} & ${COUPLE.names[1]}`} />
      <EventDetails details={EVENT_DETAILS} />
      <Countdown targetDateTime={COUPLE.weddingDateTime} />
      <Gallery images={GALLERY_IMAGES} />
      <DressCodePalette swatches={DRESS_CODE_SWATCHES} />
      <VenuesSection venues={VENUES} />
      <RsvpSection couple={COUPLE} />
      <Footer couple={COUPLE} />
    </div>
  );
}

export default InvitationPage;
