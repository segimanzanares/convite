import { useEffect, useRef, useState } from 'react';
import {
  DiapersSection,
  DressCodeSection,
  GallerySection,
  GiftsSection,
  HostsSection,
  ProgramSection,
  RsvpSection,
  VenuesSection,
} from '../../components/baby-shower/Sections';
import { MusicPlayer, type MusicPlayerHandle } from '../../components/music/MusicPlayer';
import { UiWishesSection } from '../../components/wishes/UiWishesSection';
import { useAutoScroll } from '../../hooks/useAutoScroll';
import { formatDate, toParentsToBe } from '../../lib/eventContent';
import type { BabyShowerContent } from '../../types/invitation';
import { Elephant } from './components/SafariArt';
import { Hero } from './components/Hero';
import { IntroScreen } from './components/IntroScreen';
import { CountdownSection, EYEBROW, Footer, SectionTitle } from './components/Sections';
import './theme.css';

const TITLE = 'font-grandstander font-bold';

/**
 * A baby shower on a savanna, built on shadcn/ui's tokens: the visitor parts two curtains of leaves, a baby elephant
 * blows bubbles through its trunk next to a giraffe that peeks in, the giraffe looks over the countdown and the
 * elephant says goodbye among the leaves of the footer.
 */
export function InvitationPage({ invitation }: { invitation: BabyShowerContent }) {
  const musicPlayerRef = useRef<MusicPlayerHandle>(null);
  const [autoScrollActive, setAutoScrollActive] = useState(false);
  const parents = toParentsToBe(invitation);
  const calendar = {
    dateTime: parents.eventDateTime,
    name: `Baby shower · ${parents.namesLabel}`,
    fileName: 'baby-shower.ics',
  };

  useEffect(() => {
    document.title = `${parents.namesLabel} — Baby shower`;
  }, [parents.namesLabel]);

  useAutoScroll({ active: autoScrollActive, speed: 70 });

  return (
    <div className="theme-baby-shower-safari min-h-screen">
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
        babyName={invitation.babyName}
        dueLabel={invitation.dueLabel}
        message={invitation.message}
      />

      {invitation.eventAt && <CountdownSection targetDateTime={invitation.eventAt} calendar={calendar} venues={invitation.venues} />}

      <div id="detalles" className="scroll-mt-4">
        {invitation.venues.length > 0 && (
          <VenuesSection
            venues={invitation.venues}
            titleClassName={TITLE}
            heading={<SectionTitle eyebrow="Punto de encuentro" title="Dónde será la aventura" description="Toca «Cómo llegar» para abrir la ruta en tu teléfono." />}
          />
        )}
        {invitation.program.length > 0 && (
          <ProgramSection
            items={invitation.program}
            fallbackIcon="🐘"
            titleClassName={TITLE}
            className="bg-(--muted)"
            heading={<SectionTitle eyebrow="El itinerario" title="Así será la tarde" description="Juegos, antojos y muchas sorpresas para recibir al bebé." />}
          />
        )}
      </div>
      {invitation.hosts.length > 0 && (
        <HostsSection
          groups={invitation.hosts}
          titleClassName={TITLE}
          heading={<SectionTitle eyebrow="Te invitan" title="Los guías de la expedición" description="Quienes preparan con mucho cariño esta celebración." />}
        />
      )}
      {invitation.diapers && (
        <DiapersSection
          diapers={invitation.diapers}
          titleClassName={TITLE}
          className="bg-(--muted)"
          heading={<SectionTitle eyebrow="Para la pañalera" title="Lluvia de pañales" description="Un detalle que siempre hace falta y que los papás agradecerán mucho." />}
        />
      )}
      {invitation.gallery.length > 0 && (
        <GallerySection
          images={invitation.gallery}
          heading={<SectionTitle eyebrow="Nuestro diario de viaje" title="Mientras te esperamos" description="Pequeños recuerdos de estos meses tan especiales." />}
        />
      )}
      {invitation.dressCode && (
        <DressCodeSection
          dressCode={invitation.dressCode}
          titleClassName={TITLE}
          className="bg-(--muted)"
          heading={<SectionTitle eyebrow="Qué ponerte" title="Código de vestimenta" />}
        />
      )}
      {invitation.gifts.length > 0 && (
        <GiftsSection
          gifts={invitation.gifts}
          titleClassName={TITLE}
          heading={
            <SectionTitle
              eyebrow="Para su llegada"
              title="Mesa de regalos"
              description="Tu compañía es el mejor regalo; si quieres consentir al bebé, aquí van algunas ideas."
            />
          }
        />
      )}

      <div id="confirmar" className="scroll-mt-4">
        <RsvpSection
          className="bg-(--muted)"
          whatsappNumber={parents.rsvpWhatsappNumber}
          deadlineLabel={parents.rsvpDeadlineLabel}
          calendar={calendar}
          venues={invitation.venues}
          titleClassName={TITLE}
          eyebrowClassName={EYEBROW}
          doneArt={<Elephant />}
          emojis={{ yes: '🐘', no: '💌' }}
        />
      </div>

      <UiWishesSection titleClassName={TITLE} eyebrowClassName={`mx-auto w-fit ${EYEBROW}`} />

      <Footer
        names={parents.namesLabel}
        dateLabel={parents.footerDateLabel}
        closingMessage={invitation.closingMessage || 'Gracias por ser parte de esta pequeña gran aventura. Con tu cariño, el bebé llega a un mundo lleno de amor.'}
        tagline={invitation.tagline}
      />
    </div>
  );
}

export default InvitationPage;
