import { useEffect, useRef, useState } from 'react';
import { Envelope } from '../../components/envelope/Envelope';
import { PageOrnamentBorder } from '../../components/layout/PageOrnamentBorder';
import { FloatingPetals } from '../../components/hero/FloatingPetals';
import { BirthdayHero } from '../../components/hero/BirthdayHero';
import { InvitationMessage } from '../../components/message/InvitationMessage';
import { FullDivider } from '../../components/divider/FullDivider';
import { EventDetails } from '../../components/details/EventDetails';
import { ProgramTimeline } from '../../components/program/ProgramTimeline';
import { Countdown } from '../../components/countdown/Countdown';
import { Gallery } from '../../components/gallery/Gallery';
import { DressCodePalette } from '../../components/dresscode/DressCodePalette';
import { VenuesSection } from '../../components/venues/VenuesSection';
import { RsvpSection } from '../../components/rsvp/RsvpSection';
import { Footer } from '../../components/footer/Footer';
import { MusicPlayer, type MusicPlayerHandle } from '../../components/music/MusicPlayer';
import { useAutoScroll } from '../../hooks/useAutoScroll';
import {
  CELEBRANT,
  DRESS_CODE_SWATCHES,
  EVENT_DETAILS,
  GALLERY_IMAGES,
  PROGRAM,
  VENUES,
} from './data';
import bgHero from './images/bg-hero.jpeg';
import './theme.css';

export function InvitationPage() {
  const musicPlayerRef = useRef<MusicPlayerHandle>(null);
  const [autoScrollActive, setAutoScrollActive] = useState(false);

  useEffect(() => {
    document.title = `${CELEBRANT.name} — ${CELEBRANT.age} años`;
  }, []);

  useAutoScroll({ active: autoScrollActive, speed: 60 });

  return (
    <div className="theme-flora bg-ivory text-ink">
      <Envelope
        monogram="LS"
        title={`${CELEBRANT.firstName} · ${CELEBRANT.age} años`}
        ariaName={CELEBRANT.name}
        onOpen={() => musicPlayerRef.current?.play()}
        onOpened={() => setAutoScrollActive(true)}
      />
      <MusicPlayer ref={musicPlayerRef} src={CELEBRANT.musicFile} />
      <PageOrnamentBorder />
      <FloatingPetals />
      <BirthdayHero celebrant={CELEBRANT} backgroundImageUrl={bgHero} />
      <InvitationMessage
        eyebrow="La invitación"
        title="Celebremos su vida"
        message={`Setenta y seis años de vida, de amor y de historias compartidas. Con el corazón lleno de gratitud, queremos invitarte a celebrar junto a nuestra querida ${CELEBRANT.firstName} un día para agradecer, abrazarla y seguir sembrando recuerdos en familia.`}
        signature={CELEBRANT.hosts}
      />
      <FullDivider text={`${CELEBRANT.firstName} · ${CELEBRANT.age}`} />
      <EventDetails details={EVENT_DETAILS} eyebrow="La celebración" />
      <ProgramTimeline
        items={PROGRAM}
        intro="Así viviremos este día tan especial, momento a momento."
      />
      <Countdown targetDateTime={CELEBRANT.eventDateTime} headingTone="dark" />
      <Gallery
        images={GALLERY_IMAGES}
        eyebrow="Recuerdos"
        title="Una vida en flor"
        intro="Cada fotografía guarda una historia, y cada historia, el cariño de toda una familia."
      />
      <DressCodePalette
        swatches={DRESS_CODE_SWATCHES}
        intro="Inspirados en las flores que siempre la han acompañado, sugerimos los siguientes tonos para su vestimenta."
      />
      <VenuesSection
        venues={VENUES}
        intro="Con mucho cariño, les compartimos los lugares donde celebraremos juntos este día tan especial."
      />
      <RsvpSection
        whatsappNumber={CELEBRANT.rsvpWhatsappNumber}
        deadlineLabel={CELEBRANT.rsvpDeadlineLabel}
        calendar={{
          dateTime: CELEBRANT.eventDateTime,
          name: `Cumpleaños ${CELEBRANT.age} de ${CELEBRANT.name}`,
          fileName: 'cumpleanos.ics',
        }}
        venues={VENUES}
      />
      <Footer
        title={CELEBRANT.name}
        dateLabel={CELEBRANT.footerDateLabel}
        tagline={`${CELEBRANT.age} años de amor · Gracias por tanto`}
      />
    </div>
  );
}

export default InvitationPage;
