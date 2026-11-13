import { useEffect, useRef, useState } from 'react';
import { Envelope } from '../../components/envelope/Envelope';
import { FloatingPetals } from '../../components/hero/FloatingPetals';
import { InvitationMessage } from '../../components/message/InvitationMessage';
import { FullDivider } from '../../components/divider/FullDivider';
import { ProgramTimeline } from '../../components/program/ProgramTimeline';
import { Countdown } from '../../components/countdown/Countdown';
import { StoryGallery } from '../../components/gallery/StoryGallery';
import { DressCodePalette } from '../../components/dresscode/DressCodePalette';
import { DressCodeSection } from '../../components/dresscode/DressCodeSection';
import { GiftsSection } from '../../components/gifts/GiftsSection';
import { VenuesSection } from '../../components/venues/VenuesSection';
import { RsvpSection } from '../../components/rsvp/RsvpSection';
import { Footer } from '../../components/footer/Footer';
import { MusicPlayer, type MusicPlayerHandle } from '../../components/music/MusicPlayer';
import { useAutoScroll } from '../../hooks/useAutoScroll';
import { initials, toCelebrant } from '../../lib/eventContent';
import type { BirthdayContent } from '../../types/invitation';
import { DecoFrame } from './components/DecoFrame';
import { ReservaHero } from './components/ReservaHero';
import './theme.css';

/** Brass sparks in place of the floral template's petals. */
const SPARKS = ['✦', '✧', '◆', '·'];

export function InvitationPage({ invitation }: { invitation: BirthdayContent }) {
  const musicPlayerRef = useRef<MusicPlayerHandle>(null);
  const [autoScrollActive, setAutoScrollActive] = useState(false);
  const celebrant = toCelebrant(invitation);

  useEffect(() => {
    document.title = `${celebrant.name} — ${celebrant.age} años`;
  }, [celebrant.name, celebrant.age]);

  useAutoScroll({ active: autoScrollActive, speed: 60 });

  return (
    <div className="theme-cumpleanos-reserva bg-ivory text-ink">
      <Envelope
        monogram={initials(...celebrant.name.split(/\s+/).slice(0, 2))}
        title={`${celebrant.firstName} · ${celebrant.age} años`}
        ariaName={celebrant.name}
        onOpen={() => musicPlayerRef.current?.play()}
        onOpened={() => setAutoScrollActive(true)}
      />
      <MusicPlayer ref={musicPlayerRef} src={celebrant.musicFile} position="bottom-center" />
      <DecoFrame />
      <FloatingPetals symbols={SPARKS} />
      <ReservaHero celebrant={celebrant} backgroundImageUrl={invitation.cover} />
      <InvitationMessage
        eyebrow="La invitación"
        title="Un brindis por sus años"
        message={
          invitation.message ||
          `Hay cosas que mejoran con el tiempo, y ${celebrant.firstName} es la mejor prueba. Queremos invitarte a levantar la copa con nosotros para celebrar su vida, sus historias y todo lo que todavía viene.`
        }
        signature={celebrant.hosts}
      />
      <FullDivider text={`${celebrant.age} y contando`} />
      {invitation.venues.length > 0 && (
        <VenuesSection
          venues={invitation.venues}
          eyebrow="Punto de encuentro"
          title="Dónde celebramos"
          intro="Te esperamos aquí para brindar, conversar y celebrar como se debe."
        />
      )}
      {invitation.program.length > 0 && (
        <ProgramTimeline
          items={invitation.program}
          eyebrow="La velada"
          title="Programa"
          intro="Así correrá la celebración, de la primera copa al último brindis."
        />
      )}
      {invitation.eventAt && (
        <Countdown targetDateTime={invitation.eventAt} eyebrow="Se sirve en" title="Cuenta regresiva" headingTone="dark" />
      )}
      {invitation.gallery.length > 0 && (
        <StoryGallery
          images={invitation.gallery}
          eyebrow="Cosecha de recuerdos"
          title="Años bien vividos"
          intro={`Algunos de los momentos que han hecho de ${celebrant.firstName} quien es hoy.`}
        />
      )}
      {invitation.dressCode && <DressCodeSection dressCode={invitation.dressCode} title="Cómo vestir" />}
      {invitation.swatches.length > 0 && (
        <DressCodePalette
          swatches={invitation.swatches}
          title="Tonos de la noche"
          intro="Tonos profundos, como la madera, el cuero y un buen añejo: así nos gustaría vernos esa noche."
        />
      )}
      {invitation.gifts.length > 0 && (
        <GiftsSection
          gifts={invitation.gifts}
          eyebrow="Un detalle"
          title="Si quieres sumar al brindis"
          intro={[
            `Lo que más le importa a ${celebrant.firstName} es compartir la noche contigo.`,
            'Si aun así quieres tener un detalle con él, puedes hacerlo a través de:',
          ]}
        />
      )}
      <RsvpSection
        whatsappNumber={celebrant.rsvpWhatsappNumber}
        deadlineLabel={celebrant.rsvpDeadlineLabel}
        calendar={{
          dateTime: celebrant.eventDateTime,
          name: `Cumpleaños ${celebrant.age} de ${celebrant.name}`,
          fileName: 'cumpleanos.ics',
        }}
        venues={invitation.venues}
      />
      <Footer
        title={celebrant.name}
        dateLabel={celebrant.footerDateLabel}
        tagline={invitation.tagline || `${celebrant.age} años · Gran reserva`}
      />
    </div>
  );
}

export default InvitationPage;
