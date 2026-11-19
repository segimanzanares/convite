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
import { Cupcake } from './components/DulceArt';
import { Hero } from './components/Hero';
import { IntroScreen } from './components/IntroScreen';
import { CountdownSection, EYEBROW, Footer, SectionTitle } from './components/Sections';
import './theme.css';

const TITLE = 'font-shrikhand';

/**
 * A gender reveal in a bakery, built on shadcn/ui's tokens: the visitor opens a bakery box, the hero's cake waits for
 * the knife ("la respuesta está dentro del pastel"), each team has its cupcake in the picks, a kitchen timer turns in
 * the countdown and frosting drips between the hero and the page. Once the party begins and the answer is captured,
 * a slice slides out of the cake showing the sponge's color and the title says it.
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
    <div className="theme-revelacion-dulce min-h-screen">
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
              eyebrow="¿Fresa o mora azul?"
              title={reveal ? 'Así quedaron los equipos' : 'Elige tu cupcake'}
              description={reveal ? undefined : 'Fresa si crees que es niña, mora azul si crees que es niño. ¿De qué color será el pan?'}
            />
          }
          babyNames={invitation.babyNames}
          reveal={reveal}
          art={{ girl: <Cupcake gender="girl" />, boy: <Cupcake gender="boy" /> }}
          labels={{ girl: 'Equipo niña', boy: 'Equipo niño' }}
          titleClassName={TITLE}
        />
      </div>

      {invitation.eventAt && !reveal && <CountdownSection targetDateTime={invitation.eventAt} calendar={calendar} venues={invitation.venues} />}

      {invitation.venues.length > 0 && (
        <VenuesSection
          venues={invitation.venues}
          titleClassName={TITLE}
          heading={<SectionTitle eyebrow="Dónde" title="La pastelería" description="Toca «Cómo llegar» para abrir la ruta en tu teléfono." />}
        />
      )}
      {invitation.program.length > 0 && (
        <ProgramSection
          items={invitation.program}
          fallbackIcon="🧁"
          titleClassName={TITLE}
          className="bg-(--muted)"
          heading={<SectionTitle eyebrow="La receta" title="Paso a paso" description="Los ingredientes de una tarde muy dulce." />}
        />
      )}
      {invitation.grandparents.length > 0 && (
        <GrandparentsSection
          groups={invitation.grandparents}
          titleClassName={TITLE}
          heading={<SectionTitle eyebrow="Los más consentidores" title="Futuros abuelos" description="Listos para llenar de dulces (y de amor) a su nieto o nieta." />}
        />
      )}
      {invitation.gallery.length > 0 && (
        <GallerySection
          images={invitation.gallery}
          className="bg-(--muted)"
          heading={<SectionTitle eyebrow="Recuerdos" title="Nuestra dulce espera" description="Algunos momentos de estos meses." />}
        />
      )}
      {invitation.dressCode && (
        <DressCodeSection
          dressCode={invitation.dressCode}
          teamColors={{ girl: 'Rosa fresa', boy: 'Azul mora' }}
          titleClassName={TITLE}
          heading={<SectionTitle eyebrow="Qué ponerte" title="Del color de tu antojo" />}
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
              title="Regalos para el bebé"
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
          doneArt={<Cupcake gender="girl" />}
          emojis={{ yes: '🧁', no: '💌' }}
        />
      </div>

      <UiWishesSection titleClassName={TITLE} eyebrowClassName={`mx-auto w-fit ${EYEBROW}`} />

      <Footer
        names={parents.namesLabel}
        dateLabel={parents.footerDateLabel}
        closingMessage={invitation.closingMessage || 'Gracias por endulzar esta espera con nosotros. Fresa o mora azul, lo mejor es que ya viene en camino.'}
        tagline={invitation.tagline}
      />
    </div>
  );
}

export default InvitationPage;
