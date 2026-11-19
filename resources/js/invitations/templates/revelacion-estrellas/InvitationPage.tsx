import { useEffect, useRef, useState } from 'react';
import { DressCodeSection, GallerySection, GiftsSection, GrandparentsSection } from '../../components/gender-reveal/DetailSections';
import { ProgramSection, VenuesSection } from '../../components/gender-reveal/EventSections';
import { RsvpSection } from '../../components/gender-reveal/RsvpSection';
import { TeamSection } from '../../components/gender-reveal/TeamSection';
import { MusicPlayer, type MusicPlayerHandle } from '../../components/music/MusicPlayer';
import { UiWishesSection } from '../../components/wishes/UiWishesSection';
import { useAutoScroll } from '../../hooks/useAutoScroll';
import { formatDate, toParentsToBe } from '../../lib/eventContent';
import type { GenderRevealContent } from '../../types/invitation';
import { Stork, TeamStar } from './components/EstrellasArt';
import { Hero } from './components/Hero';
import { IntroScreen } from './components/IntroScreen';
import { CountdownSection, EYEBROW, Footer, SectionTitle } from './components/Sections';
import './theme.css';

const TITLE = 'font-gloock';

/**
 * A gender reveal under the stars, built on shadcn/ui's tokens: the visitor opens the stork's message on a starry
 * night, the hero's stork crosses the sky with its bundle swinging, each team has its little star in the picks, the
 * countdown counts stars under a shooting star and the night returns in the footer. Once the party begins and the
 * answer is captured, the bundle takes that team's color and the title says it.
 */
export function InvitationPage({ invitation }: { invitation: GenderRevealContent }) {
  const musicPlayerRef = useRef<MusicPlayerHandle>(null);
  const [autoScrollActive, setAutoScrollActive] = useState(false);
  const parents = toParentsToBe(invitation);
  const { reveal } = invitation;
  const calendar = {
    dateTime: parents.eventDateTime,
    name: `Revelación de género · ${parents.namesLabel}`,
    fileName: 'revelacion.ics',
  };

  useEffect(() => {
    document.title = `${parents.namesLabel} — ¿Niño o niña?`;
  }, [parents.namesLabel]);

  useAutoScroll({ active: autoScrollActive, speed: 70 });

  return (
    <div className="theme-revelacion-estrellas min-h-screen">
      <IntroScreen
        names={parents.namesLabel}
        dateLabel={formatDate(parents.eventDate, "d 'de' MMMM")}
        onOpen={() => musicPlayerRef.current?.play()}
        onOpened={() => setAutoScrollActive(true)}
      />
      <MusicPlayer ref={musicPlayerRef} src={parents.musicFile} position="bottom-right" />

      <Hero
        names={parents.namesLabel}
        eventDate={parents.eventDate}
        venueName={invitation.venues[0]?.name}
        dueLabel={invitation.dueLabel}
        message={invitation.message}
        reveal={reveal}
        babyName={reveal ? invitation.babyNames[reveal] : null}
      />

      <div id="equipos" className="scroll-mt-4">
        <TeamSection
          heading={
            <SectionTitle
              eyebrow="Pide tu deseo"
              title={reveal ? 'Así quedaron los deseos' : '¿Qué trae la cigüeña?'}
              description={reveal ? undefined : 'Elige la estrella de tu corazonada: rosa si crees que es niña, azul si crees que es niño.'}
            />
          }
          babyNames={invitation.babyNames}
          reveal={reveal}
          art={{ girl: <TeamStar gender="girl" />, boy: <TeamStar gender="boy" /> }}
          labels={{ girl: 'Equipo niña', boy: 'Equipo niño' }}
          titleClassName={TITLE}
        />
      </div>

      {invitation.eventAt && !reveal && <CountdownSection targetDateTime={invitation.eventAt} calendar={calendar} venues={invitation.venues} />}

      {invitation.venues.length > 0 && (
        <VenuesSection
          venues={invitation.venues}
          titleClassName={TITLE}
          heading={<SectionTitle eyebrow="Dónde" title="Bajo este cielo" description="Toca «Cómo llegar» para abrir la ruta en tu teléfono." />}
        />
      )}
      {invitation.program.length > 0 && (
        <ProgramSection
          items={invitation.program}
          fallbackIcon="✨"
          titleClassName={TITLE}
          className="bg-(--muted)"
          heading={<SectionTitle eyebrow="Cuándo" title="Así será la noche" description="De la primera estrella al gran momento." />}
        />
      )}
      {invitation.grandparents.length > 0 && (
        <GrandparentsSection
          groups={invitation.grandparents}
          titleClassName={TITLE}
          heading={<SectionTitle eyebrow="Con todo el amor" title="Los futuros abuelos" description="Los primeros en contar los días para conocer a su nieto o nieta." />}
        />
      )}
      {invitation.gallery.length > 0 && (
        <GallerySection
          images={invitation.gallery}
          className="bg-(--muted)"
          heading={<SectionTitle eyebrow="Recuerdos" title="Mientras llega la cigüeña" description="Algunos momentos de esta espera." />}
        />
      )}
      {invitation.dressCode && (
        <DressCodeSection
          dressCode={invitation.dressCode}
          teamColors={{ girl: 'Rosa', boy: 'Azul' }}
          titleClassName={TITLE}
          heading={<SectionTitle eyebrow="Qué ponerte" title="Código de vestimenta" />}
        />
      )}
      {invitation.gifts.length > 0 && (
        <GiftsSection
          gifts={invitation.gifts}
          titleClassName={TITLE}
          className="bg-(--muted)"
          heading={
            <SectionTitle
              eyebrow="Un detalle"
              title="Para el bebé"
              description="Tu compañía es el mejor regalo; si además quieres consentir al bebé, aquí van algunas ideas."
            />
          }
        />
      )}

      <div id="confirmar" className="scroll-mt-4">
        <RsvpSection
          whatsappNumber={parents.rsvpWhatsappNumber}
          deadlineLabel={parents.rsvpDeadlineLabel}
          calendar={calendar}
          venues={invitation.venues}
          titleClassName={TITLE}
          eyebrowClassName={EYEBROW}
          doneArt={<Stork />}
          emojis={{ yes: '✨', no: '💌' }}
        />
      </div>

      <UiWishesSection titleClassName={TITLE} eyebrowClassName={`mx-auto w-fit ${EYEBROW}`} />

      <Footer
        names={parents.namesLabel}
        dateLabel={parents.footerDateLabel}
        closingMessage={invitation.closingMessage || 'Gracias por acompañarnos en esta noche tan especial. Niño o niña, ya es la estrella más brillante de nuestro cielo.'}
        tagline={invitation.tagline}
      />
    </div>
  );
}

export default InvitationPage;
