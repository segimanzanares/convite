import { useEffect, useRef, useState } from 'react';
import { Envelope } from '../../components/envelope/Envelope';
import { FloatingPetals } from '../../components/hero/FloatingPetals';
import { BirthdayHero } from '../../components/hero/BirthdayHero';
import { InvitationMessage } from '../../components/message/InvitationMessage';
import { FullDivider } from '../../components/divider/FullDivider';
import { ProgramTimeline } from '../../components/program/ProgramTimeline';
import { Countdown } from '../../components/countdown/Countdown';
import { StoryGallery } from '../../components/gallery/StoryGallery';
import { DressCodePalette } from '../../components/dresscode/DressCodePalette';
import { DressCodeSection } from '../../components/dresscode/DressCodeSection';
import { VenuesSection } from '../../components/venues/VenuesSection';
import { RsvpSection } from '../../components/rsvp/RsvpSection';
import { Footer } from '../../components/footer/Footer';
import { MusicPlayer, type MusicPlayerHandle } from '../../components/music/MusicPlayer';
import { useAutoScroll } from '../../hooks/useAutoScroll';
import { initials, toCelebrant } from '../../lib/eventContent';
import type { BirthdayContent } from '../../types/invitation';
import bgHero from './images/bg-hero.jpeg';
import './theme.css';
import { FloralPageOrnamentBorder } from '../../components/layout/FloralPageOrnamentBorder';

export function InvitationPage({ invitation }: { invitation: BirthdayContent }) {
  const musicPlayerRef = useRef<MusicPlayerHandle>(null);
  const [autoScrollActive, setAutoScrollActive] = useState(false);
  const celebrant = toCelebrant(invitation);

  useEffect(() => {
    document.title = `${celebrant.name} — ${celebrant.age} años`;
  }, [celebrant.name, celebrant.age]);

  useAutoScroll({ active: autoScrollActive, speed: 60 });

  return (
    <div className="theme-cumpleanos-floral bg-ivory text-ink">
      <Envelope
        monogram={initials(...celebrant.name.split(/\s+/).slice(0, 2))}
        title={`${celebrant.firstName} · ${celebrant.age} años`}
        ariaName={celebrant.name}
        onOpen={() => musicPlayerRef.current?.play()}
        onOpened={() => setAutoScrollActive(true)}
      />
      <MusicPlayer ref={musicPlayerRef} src={celebrant.musicFile} position="bottom-center" />
      <FloralPageOrnamentBorder />
      <FloatingPetals />
      <BirthdayHero celebrant={celebrant} backgroundImageUrl={invitation.cover ?? bgHero} />
      <InvitationMessage
        eyebrow="La invitación"
        title="Celebremos su vida"
        message={
          invitation.message ||
          `Con el corazón lleno de gratitud, queremos invitarte a celebrar junto a ${celebrant.firstName} un día para agradecer, abrazarla y seguir sembrando recuerdos en familia.`
        }
        signature={celebrant.hosts}
      />
      <FullDivider text={`${celebrant.firstName} · ${celebrant.age}`} />
      {invitation.venues.length > 0 && (
        <VenuesSection
          venues={invitation.venues}
          eyebrow="La celebración"
          intro="Con mucho cariño, les compartimos los lugares donde celebraremos juntos este día tan especial."
        />
      )}
      {invitation.program.length > 0 && (
        <ProgramTimeline items={invitation.program} intro="Así viviremos este día tan especial, momento a momento." />
      )}
      {invitation.eventAt && <Countdown targetDateTime={invitation.eventAt} headingTone="dark" />}
      {invitation.gallery.length > 0 && (
        <StoryGallery
          images={invitation.gallery}
          eyebrow="Momentos de su vida"
          title="Recuerdos que florecen"
          intro={`Algunos de los momentos que ${celebrant.firstName} ha compartido con quienes más la quieren.`}
        />
      )}
      {invitation.dressCode && <DressCodeSection dressCode={invitation.dressCode} />}
      {invitation.swatches.length > 0 && (
        <DressCodePalette
          swatches={invitation.swatches}
          intro="Inspirados en las flores que siempre la han acompañado, sugerimos los siguientes tonos para su vestimenta."
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
        tagline={invitation.tagline || `${celebrant.age} años de amor · Gracias por tanto`}
      />
    </div>
  );
}

export default InvitationPage;
