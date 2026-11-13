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
import { BalloonDivider, CastleDivider, RainbowDivider } from './components/MagicDividers';
import { MagicHero } from './components/MagicHero';
import './theme.css';

/** Hearts and stars drifting down the first screen, in place of the floral templates' petals. */
const SPARKS = ['♥', '★', '✿', '✦'];

/**
 * A magical kids' birthday in pastels, on the classic templates' shared sections: a unicorn on a rainbow, bunting,
 * clouds and stars, Pacifico titles and lilac, pink and grape.
 */
export function InvitationPage({ invitation }: { invitation: BirthdayContent }) {
  const musicPlayerRef = useRef<MusicPlayerHandle>(null);
  const [autoScrollActive, setAutoScrollActive] = useState(false);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const celebrant = toCelebrant(invitation);
  const { firstName, age } = celebrant;

  useEffect(() => {
    document.title = `${celebrant.name} — ${age} años`;
  }, [celebrant.name, age]);

  useAutoScroll({ active: autoScrollActive, speed: 60 });

  return (
    <div className="theme-infantil-unicornio bg-ivory text-ink">
      <Envelope
        monogram={initials(...celebrant.name.split(/\s+/).slice(0, 2))}
        title={`${firstName} · ${age} años`}
        ariaName={celebrant.name}
        onOpen={() => {
          setEnvelopeOpen(true);
          musicPlayerRef.current?.play();
        }}
        onOpened={() => setAutoScrollActive(true)}
      />
      <MusicPlayer ref={musicPlayerRef} src={celebrant.musicFile} position="bottom-center" />
      <FloatingPetals symbols={SPARKS} />
      <MagicHero celebrant={celebrant} photoUrl={invitation.cover} play={envelopeOpen} />
      <InvitationMessage
        eyebrow="Una invitación mágica"
        title="¡Celebremos con magia!"
        message={
          invitation.message ||
          `${firstName} cumple ${age} años y queremos celebrarlo con un día lleno de magia, arcoíris y mucha diversión. Trae tu sonrisa más brillante: ¡la fiesta no está completa sin ti!`
        }
        signature={celebrant.hosts}
      />
      <FullDivider text={`¡${age} años mágicos!`} />
      {invitation.venues.length > 0 && (
        <VenuesSection
          venues={invitation.venues}
          eyebrow="El reino de la fiesta"
          title="¿Dónde será?"
          intro="Te esperamos en este lugar mágico; toca el mapa para ver cómo llegar."
        />
      )}
      {invitation.program.length > 0 && <BalloonDivider className="pt-14" />}
      {invitation.program.length > 0 && (
        <ProgramTimeline
          items={invitation.program}
          eyebrow="Un día mágico"
          title="Lo que haremos"
          intro="Juegos, pastel y muchas sorpresas, momento a momento."
        />
      )}
      {invitation.eventAt && (
        <Countdown targetDateTime={invitation.eventAt} eyebrow="Faltan" title="Para la magia" headingTone="dark" />
      )}
      {invitation.gallery.length > 0 && (
        <StoryGallery
          images={invitation.gallery}
          eyebrow="Sus momentos"
          title="Pequeños grandes recuerdos"
          intro={`Así de rápido ha crecido nuestra pequeña ${firstName}.`}
        />
      )}
      {invitation.gifts.length > 0 && <RainbowDivider className="pt-16" />}
      {invitation.gifts.length > 0 && (
        <GiftsSection
          gifts={invitation.gifts}
          eyebrow="Regalos"
          title="Un detalle mágico"
          intro={[`Tu compañía es el mejor regalo para ${firstName}.`, 'Si quieres traerle algo, aquí van algunas ideas:']}
        />
      )}
      <CastleDivider className="pt-10" />
      <RsvpSection
        whatsappNumber={celebrant.rsvpWhatsappNumber}
        deadlineLabel={celebrant.rsvpDeadlineLabel}
        calendar={{ dateTime: celebrant.eventDateTime, name: `Cumpleaños de ${firstName}`, fileName: 'cumpleanos.ics' }}
        venues={invitation.venues}
      />
      <Footer
        title={celebrant.name}
        dateLabel={celebrant.footerDateLabel}
        tagline={invitation.tagline || `${age} años de magia · ¡Gracias por venir!`}
      />
    </div>
  );
}

export default InvitationPage;
