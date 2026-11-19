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
import { BalloonBunch, TeamBalloon } from './components/GlobosArt';
import { Hero } from './components/Hero';
import { IntroScreen } from './components/IntroScreen';
import { CountdownSection, EYEBROW, Footer, SectionTitle } from './components/Sections';
import './theme.css';

const TITLE = 'font-sniglet';

/**
 * A gender reveal full of balloons, built on shadcn/ui's tokens: the visitor pops the mystery balloon to open the
 * invitation, the hero keeps it bobbing between two bunches of balloons, each team has its balloon in the "¿tú qué
 * crees?" picks, balloons rise behind the countdown and the program is a pink-to-blue timeline. Once the party begins
 * and the answer is captured, the page says it and rains confetti of its color.
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
    <div className="theme-revelacion-globos min-h-screen">
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
              eyebrow="¿Tú qué crees?"
              title={reveal ? 'Así quedaron los equipos' : 'Elige tu globo'}
              description={reveal ? undefined : 'Rosa si tu corazonada dice niña, azul si dice niño. ¡Que gane el mejor equipo!'}
            />
          }
          babyNames={invitation.babyNames}
          reveal={reveal}
          art={{ girl: <TeamBalloon gender="girl" />, boy: <TeamBalloon gender="boy" /> }}
          labels={{ girl: 'Equipo niña', boy: 'Equipo niño' }}
          titleClassName={TITLE}
        />
      </div>

      {invitation.eventAt && !reveal && <CountdownSection targetDateTime={invitation.eventAt} calendar={calendar} venues={invitation.venues} />}

      {invitation.venues.length > 0 && (
        <VenuesSection
          venues={invitation.venues}
          titleClassName={TITLE}
          heading={<SectionTitle eyebrow="Dónde" title="El lugar de la sorpresa" description="Toca «Cómo llegar» para abrir la ruta en tu teléfono." />}
        />
      )}
      {invitation.program.length > 0 && (
        <ProgramSection
          items={invitation.program}
          fallbackIcon="🎈"
          titleClassName={TITLE}
          className="bg-(--muted)"
          heading={<SectionTitle eyebrow="Cuándo" title="Así será la tarde" description="Del primer globo al gran momento." />}
        />
      )}
      {invitation.grandparents.length > 0 && (
        <GrandparentsSection
          groups={invitation.grandparents}
          titleClassName={TITLE}
          heading={<SectionTitle eyebrow="Con mucho amor" title="Los futuros abuelos" description="Ya están listos para consentir a su nieto… o nieta." />}
        />
      )}
      {invitation.gallery.length > 0 && (
        <GallerySection
          images={invitation.gallery}
          className="bg-(--muted)"
          heading={<SectionTitle eyebrow="Recuerdos" title="Esperándote" description="Algunos momentos de esta dulce espera." />}
        />
      )}
      {invitation.dressCode && (
        <DressCodeSection
          dressCode={invitation.dressCode}
          teamColors={{ girl: 'Rosa', boy: 'Azul' }}
          titleClassName={TITLE}
          heading={<SectionTitle eyebrow="Qué ponerte" title="Viste de tu corazonada" />}
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
          doneArt={<BalloonBunch />}
          emojis={{ yes: '🎈', no: '💌' }}
        />
      </div>

      <UiWishesSection titleClassName={TITLE} eyebrowClassName={`mx-auto w-fit ${EYEBROW}`} />

      <Footer
        names={parents.namesLabel}
        dateLabel={parents.footerDateLabel}
        closingMessage={invitation.closingMessage || 'Gracias por ser parte de esta espera tan bonita. Rosa o azul, este bebé ya llegó a una familia que lo ama.'}
        tagline={invitation.tagline}
      />
    </div>
  );
}

export default InvitationPage;
