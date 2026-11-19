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
import { TeamBear, Teddy } from './components/OsitoArt';
import { Hero } from './components/Hero';
import { IntroScreen } from './components/IntroScreen';
import { CountdownSection, EYEBROW, Footer, SectionTitle } from './components/Sections';
import './theme.css';

const TITLE = 'font-lora font-medium';

/**
 * A gender reveal with a teddy bear, built on shadcn/ui's tokens: the visitor opens a gift box and the bear peeks out,
 * the hero shows it tilting its head with a rose and a blue balloon, each team has its bear (with a bow or a bow tie)
 * in the picks, a bear sleeps on the moon in the countdown and the closing words are handwritten. Once the party
 * begins and the answer is captured, the bear keeps that team's balloon and the title says it.
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
    document.title = `${parents.namesLabel} — ¿Osito u osita?`;
  }, [parents.namesLabel]);

  useAutoScroll({ active: autoScrollActive, speed: 70 });

  return (
    <div className="theme-revelacion-osito min-h-screen">
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
              eyebrow="Haz tu apuesta"
              title={reveal ? 'Así quedaron las apuestas' : '¿Osito u osita?'}
              description={reveal ? undefined : 'Elige al osito de tu corazonada. ¡Después de la fiesta veremos quién le atinó!'}
            />
          }
          babyNames={invitation.babyNames}
          reveal={reveal}
          art={{ girl: <TeamBear gender="girl" />, boy: <TeamBear gender="boy" /> }}
          labels={{ girl: 'Equipo osita', boy: 'Equipo osito' }}
          titleClassName={TITLE}
        />
      </div>

      {invitation.eventAt && !reveal && <CountdownSection targetDateTime={invitation.eventAt} calendar={calendar} venues={invitation.venues} />}

      {invitation.venues.length > 0 && (
        <VenuesSection
          venues={invitation.venues}
          titleClassName={TITLE}
          heading={<SectionTitle eyebrow="Te esperamos en" title="Dónde será" description="Toca «Cómo llegar» para abrir la ruta en tu teléfono." />}
        />
      )}
      {invitation.program.length > 0 && (
        <ProgramSection
          items={invitation.program}
          fallbackIcon="🧸"
          titleClassName={TITLE}
          className="bg-(--muted)"
          heading={<SectionTitle eyebrow="Paso a pasito" title="Así será el día" description="Sin prisas, hasta abrir la caja sorpresa." />}
        />
      )}
      {invitation.grandparents.length > 0 && (
        <GrandparentsSection
          groups={invitation.grandparents}
          titleClassName={TITLE}
          heading={<SectionTitle eyebrow="Los más emocionados" title="Futuros abuelos" description="Ya tienen listos los brazos (y los mimos) para su nieto o nieta." />}
        />
      )}
      {invitation.gallery.length > 0 && (
        <GallerySection
          images={invitation.gallery}
          className="bg-(--muted)"
          heading={<SectionTitle eyebrow="Nuestro álbum" title="Mientras te esperamos" description="Pequeños recuerdos de estos meses." />}
        />
      )}
      {invitation.dressCode && (
        <DressCodeSection
          dressCode={invitation.dressCode}
          teamColors={{ girl: 'Rosa palo', boy: 'Azul cielo' }}
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
              eyebrow="Para su llegada"
              title="Mesa de regalos"
              description="Lo más importante es que estés con nosotros; si quieres traer algo para el bebé, aquí van algunas ideas."
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
          doneArt={<Teddy />}
          emojis={{ yes: '🧸', no: '💌' }}
        />
      </div>

      <UiWishesSection titleClassName={TITLE} eyebrowClassName={`mx-auto w-fit ${EYEBROW}`} />

      <Footer
        names={parents.namesLabel}
        dateLabel={parents.footerDateLabel}
        closingMessage={invitation.closingMessage || 'Gracias por acompañarnos con tanto cariño. Sea osito u osita, ya tiene una familia que lo espera con los brazos abiertos.'}
        tagline={invitation.tagline}
      />
    </div>
  );
}

export default InvitationPage;
