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
import { Onesie } from './components/TendederoArt';
import { Hero } from './components/Hero';
import { IntroScreen } from './components/IntroScreen';
import { CountdownSection, EYEBROW, Footer, SectionTitle } from './components/Sections';
import './theme.css';

const TITLE = 'font-yeseva';

/**
 * A boho baby shower, built on shadcn/ui's tokens: the visitor lifts away a wooden hanger with a onesie, baby clothes
 * sway on a clothesline across the hero (the onesie wears the baby's initial), pennants divide the sections, two socks
 * hang over the countdown and the closing words are handwritten.
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
    <div className="theme-baby-shower-tendedero min-h-screen">
      <IntroScreen
        names={parents.namesLabel}
        dateLabel={formatDate(parents.eventDate, "d 'de' MMMM")}
        letter={invitation.babyName?.charAt(0) ?? null}
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
            heading={<SectionTitle eyebrow="te esperamos en" title="Dónde será" description="Toca «Cómo llegar» para abrir la ruta en tu teléfono." />}
          />
        )}
        {invitation.program.length > 0 && (
          <ProgramSection
            items={invitation.program}
            fallbackIcon="🧺"
            titleClassName={TITLE}
            className="bg-(--muted)"
            heading={<SectionTitle eyebrow="el programa" title="Así será el día" description="Sin prisas, con buena comida y mucho cariño para el bebé." />}
          />
        )}
      </div>
      {invitation.hosts.length > 0 && (
        <HostsSection
          groups={invitation.hosts}
          titleClassName={TITLE}
          heading={<SectionTitle eyebrow="te invitan" title="Con todo el cariño" description="Quienes nos ayudan a preparar el nido." />}
        />
      )}
      {invitation.diapers && (
        <DiapersSection
          diapers={invitation.diapers}
          titleClassName={TITLE}
          className="bg-(--muted)"
          heading={<SectionTitle eyebrow="para la pañalera" title="Lluvia de pañales" description="Un detalle que siempre hace falta y que los papás agradecerán mucho." />}
        />
      )}
      {invitation.gallery.length > 0 && (
        <GallerySection
          images={invitation.gallery}
          heading={<SectionTitle eyebrow="nuestro álbum" title="Mientras te esperamos" description="Pequeños recuerdos de estos meses tan especiales." />}
        />
      )}
      {invitation.dressCode && (
        <DressCodeSection
          dressCode={invitation.dressCode}
          titleClassName={TITLE}
          className="bg-(--muted)"
          heading={<SectionTitle eyebrow="qué ponerte" title="Código de vestimenta" />}
        />
      )}
      {invitation.gifts.length > 0 && (
        <GiftsSection
          gifts={invitation.gifts}
          titleClassName={TITLE}
          heading={
            <SectionTitle
              eyebrow="para su llegada"
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
          doneArt={
            <svg viewBox="-40 -16 80 90">
              <Onesie color="--rose" letter={invitation.babyName?.charAt(0)} />
            </svg>
          }
          emojis={{ yes: '🧺', no: '💌' }}
        />
      </div>

      <UiWishesSection titleClassName={TITLE} eyebrowClassName={`mx-auto w-fit ${EYEBROW}`} />

      <Footer
        names={parents.namesLabel}
        dateLabel={parents.footerDateLabel}
        closingMessage={invitation.closingMessage || 'Gracias por ayudarnos a preparar el nido con tanto cariño. Nos vemos pronto, ya con el bebé en brazos.'}
        tagline={invitation.tagline}
      />
    </div>
  );
}

export default InvitationPage;
