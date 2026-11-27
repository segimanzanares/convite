import { useEffect, useRef, useState } from 'react';
import { Envelope } from '../../components/envelope/Envelope';
import { FloatingPetals } from '../../components/hero/FloatingPetals';
import { StoryChapter } from '../../components/xv/StoryChapter';
import { HonorSection } from '../../components/xv/HonorSection';
import { VenuesSection } from '../../components/venues/VenuesSection';
import { ProgramTimeline } from '../../components/program/ProgramTimeline';
import { Countdown } from '../../components/countdown/Countdown';
import { StoryGallery } from '../../components/gallery/StoryGallery';
import { DressCodeSection } from '../../components/dresscode/DressCodeSection';
import { GiftsSection } from '../../components/gifts/GiftsSection';
import { RsvpSection } from '../../components/rsvp/RsvpSection';
import { WishesSection } from '../../components/wishes/WishesSection';
import { Footer } from '../../components/footer/Footer';
import { MusicPlayer, type MusicPlayerHandle } from '../../components/music/MusicPlayer';
import { useAutoScroll } from '../../hooks/useAutoScroll';
import { eventDates, formatDate, initials, toCelebrant } from '../../lib/eventContent';
import type { BaptismContent } from '../../types/invitation';
import { CrossDivider, FlyingDove, ShellFont } from './components/CelesteArt';
import { CelesteClosing } from './components/CelesteClosing';
import { CelesteHero } from './components/CelesteHero';
import './theme.css';

/** Little stars and drops of light in place of the floral templates' petals. */
const GLINTS = ['✦', '✧', '·', '❋'];

/**
 * A baptism under a morning sky: an envelope opens onto clouds and a dove with an olive sprig, a shell pours water into
 * the font between sections, and a dove flies over the closing words.
 */
export function InvitationPage({ invitation }: { invitation: BaptismContent }) {
  const musicPlayerRef = useRef<MusicPlayerHandle>(null);
  const [autoScrollActive, setAutoScrollActive] = useState(false);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const celebrant = toCelebrant(invitation);
  const { eventDate } = eventDates(invitation);
  const monogram = invitation.monogram || initials(...celebrant.name.split(/\s+/).slice(0, 2));
  /** e.g. "Domingo · 21 de marzo · 2027" */
  const heroDate = formatDate(eventDate, "EEEE '·' d 'de' MMMM '·' yyyy").replace(/^./, (c) => c.toUpperCase());

  useEffect(() => {
    document.title = `${celebrant.name} — Mi Bautizo`;
  }, [celebrant.name]);

  useAutoScroll({ active: autoScrollActive, speed: 70 });

  return (
    <div className="theme-bautizo-celeste bg-(--card) text-(--foreground)">
      <Envelope
        monogram={monogram}
        title={`${celebrant.firstName} · Mi bautizo`}
        ariaName={celebrant.name}
        onOpen={() => {
          setEnvelopeOpen(true);
          musicPlayerRef.current?.play();
        }}
        onOpened={() => setAutoScrollActive(true)}
      />
      <MusicPlayer ref={musicPlayerRef} src={celebrant.musicFile} position="bottom-center" />
      <FloatingPetals symbols={GLINTS} />

      <CelesteHero name={celebrant.name} dateLabel={heroDate} photo={invitation.heroPhoto} play={envelopeOpen} />

      {invitation.story && (
        <StoryChapter id="historia" {...invitation.story} photo={invitation.story.photo ?? undefined} />
      )}

      {invitation.parents && (
        <div className="relative">
          <FlyingDove branch={false} className="absolute top-6 right-[4%] z-[1] w-[90px] sm:right-[10%] sm:w-[120px]" />
          <HonorSection
            eyebrow="Bajo la mirada de Dios"
            title="Mis papás y padrinos"
            intro="Ellos me tomarán de la mano en este primer paso de fe, y quieren que tú también estés ahí."
            featured={invitation.parents}
            groups={invitation.godparents}
          />
        </div>
      )}

      <div className="bg-(--card) py-16">
        <ShellFont className="mx-auto w-[130px] sm:w-[150px]" />
        <p className="mt-4 text-center font-script text-[clamp(40px,7vw,60px)] leading-none text-(--primary)">
          {celebrant.firstName}
        </p>
      </div>

      {invitation.venues.length > 0 && (
        <VenuesSection
          venues={invitation.venues}
          eyebrow="Dónde"
          title="La ceremonia y la celebración"
          intro="Primero recibiré las aguas del bautismo y después lo festejaremos juntos."
        />
      )}
      {invitation.program.length > 0 && (
        <ProgramTimeline
          items={invitation.program}
          eyebrow="El día"
          title="Programa"
          intro="Así viviremos este día tan especial, de la parroquia a la mesa."
        />
      )}

      {invitation.eventAt && (
        <Countdown targetDateTime={invitation.eventAt} eyebrow="Faltan" title="Cada día más cerca" headingTone="dark" />
      )}

      {invitation.gallery.length > 0 && (
        <StoryGallery
          images={invitation.gallery}
          eyebrow="Mis primeros días"
          title="Pequeños momentos"
          intro="Así he ido creciendo, con todo el cariño de mi familia."
        />
      )}

      {invitation.dressCode && (
        <>
          <CrossDivider className="bg-(--card) pt-16" />
          <DressCodeSection dressCode={invitation.dressCode} eyebrow="Para la ocasión" title="Cómo vestir" />
        </>
      )}

      {invitation.gifts.length > 0 && (
        <>
          <CrossDivider className="bg-(--card) pt-16" />
          <GiftsSection
            gifts={invitation.gifts}
            eyebrow="Un detalle"
            title="Mesa de regalos"
            intro={[
              'Tu cariño y tus oraciones son el regalo más bonito que puedo recibir.',
              'Si además deseas tener un detalle conmigo, puedes hacerlo así:',
            ]}
          />
        </>
      )}

      <RsvpSection
        whatsappNumber={celebrant.rsvpWhatsappNumber}
        deadlineLabel={celebrant.rsvpDeadlineLabel}
        calendar={{
          dateTime: celebrant.eventDateTime,
          name: `Bautizo de ${celebrant.name}`,
          fileName: 'bautizo.ics',
        }}
        venues={invitation.venues}
      />

      <WishesSection />

      <CelesteClosing
        message={
          invitation.closingMessage ||
          'Gracias por acompañarme en el día en que comienzo mi camino en la fe. Que la luz de Dios nos acompañe siempre.'
        }
        signature={celebrant.firstName}
        dateLabel={celebrant.footerDateLabel}
      />

      <Footer
        title={celebrant.name}
        dateLabel={celebrant.footerDateLabel}
        tagline={invitation.tagline || 'Mi bautizo · Un regalo del cielo'}
      />
    </div>
  );
}

export default InvitationPage;
