import { useEffect, useRef, useState } from 'react';
import { Envelope } from '../../components/envelope/Envelope';
import { FloatingPetals } from '../../components/hero/FloatingPetals';
import { InvitationMessage } from '../../components/message/InvitationMessage';
import { FullDivider } from '../../components/divider/FullDivider';
import { ProgramTimeline } from '../../components/program/ProgramTimeline';
import { Countdown } from '../../components/countdown/Countdown';
import { StoryGallery } from '../../components/gallery/StoryGallery';
import { GiftsSection } from '../../components/gifts/GiftsSection';
import { VenuesSection } from '../../components/venues/VenuesSection';
import { RsvpSection } from '../../components/rsvp/RsvpSection';
import { Footer } from '../../components/footer/Footer';
import { MusicPlayer, type MusicPlayerHandle } from '../../components/music/MusicPlayer';
import { useAutoScroll } from '../../hooks/useAutoScroll';
import { initials, toCelebrant } from '../../lib/eventContent';
import type { BirthdayContent } from '../../types/invitation';
import { SpaceHero } from './components/SpaceHero';
import './theme.css';

/** Stars drifting down the first screen, in place of the floral templates' petals. */
const STARS = ['★', '✦', '✧', '·'];

/**
 * A kids' birthday in outer space, on the classic templates' shared sections: an indigo night with a rocket, planets
 * and stars, chunky Luckiest Guy titles and rocket orange as the accent.
 */
export function InvitationPage({ invitation }: { invitation: BirthdayContent }) {
  const musicPlayerRef = useRef<MusicPlayerHandle>(null);
  const [autoScrollActive, setAutoScrollActive] = useState(false);
  const celebrant = toCelebrant(invitation);
  const { firstName, age } = celebrant;

  useEffect(() => {
    document.title = `${celebrant.name} — ${age} años`;
  }, [celebrant.name, age]);

  useAutoScroll({ active: autoScrollActive, speed: 60 });

  return (
    <div className="theme-infantil-espacial bg-ivory text-ink">
      <Envelope
        monogram={initials(...celebrant.name.split(/\s+/).slice(0, 2))}
        title={`${firstName} · ${age} años`}
        ariaName={celebrant.name}
        onOpen={() => musicPlayerRef.current?.play()}
        onOpened={() => setAutoScrollActive(true)}
      />
      <MusicPlayer ref={musicPlayerRef} src={celebrant.musicFile} position="bottom-center" />
      <FloatingPetals symbols={STARS} />
      <SpaceHero celebrant={celebrant} photoUrl={invitation.cover} />
      <InvitationMessage
        eyebrow="Misión cumpleaños"
        title="¡Prepárate para despegar!"
        message={
          invitation.message ||
          `${firstName} cumple ${age} años y queremos celebrarlo con una fiesta fuera de este mundo. Ponte tu casco de astronauta, trae tu mejor sonrisa y acompáñanos en esta aventura espacial.`
        }
        signature={celebrant.hosts}
      />
      <FullDivider text={`¡${age} años!`} />
      {invitation.venues.length > 0 && (
        <VenuesSection
          venues={invitation.venues}
          eyebrow="Base de lanzamiento"
          title="¿Dónde aterrizamos?"
          intro="Aquí será la fiesta: toca el mapa para trazar la ruta de tu nave."
        />
      )}
      {invitation.program.length > 0 && (
        <ProgramTimeline
          items={invitation.program}
          eyebrow="Plan de vuelo"
          title="Bitácora de la misión"
          intro="Cada parada de esta aventura, de la cuenta regresiva al último pedazo de pastel."
        />
      )}
      {invitation.eventAt && (
        <Countdown targetDateTime={invitation.eventAt} eyebrow="Cuenta regresiva" title="Despegamos en…" headingTone="dark" />
      )}
      {invitation.gallery.length > 0 && (
        <StoryGallery
          images={invitation.gallery}
          eyebrow="Fotos desde la Tierra"
          title="Su bitácora de recuerdos"
          intro={`Así ha crecido nuestro pequeño astronauta ${firstName}.`}
        />
      )}
      {invitation.gifts.length > 0 && (
        <GiftsSection
          gifts={invitation.gifts}
          eyebrow="Regalos"
          title="Carga para la nave"
          intro={[`Tu compañía es el mejor regalo para ${firstName}.`, 'Si quieres traerle algo, aquí van algunas ideas:']}
        />
      )}
      <RsvpSection
        whatsappNumber={celebrant.rsvpWhatsappNumber}
        deadlineLabel={celebrant.rsvpDeadlineLabel}
        calendar={{ dateTime: celebrant.eventDateTime, name: `Cumpleaños de ${firstName}`, fileName: 'cumpleanos.ics' }}
        venues={invitation.venues}
      />
      <Footer
        title={celebrant.name}
        dateLabel={celebrant.footerDateLabel}
        tagline={invitation.tagline || `${age} años · ¡Gracias por sumarte a la misión!`}
      />
    </div>
  );
}

export default InvitationPage;
