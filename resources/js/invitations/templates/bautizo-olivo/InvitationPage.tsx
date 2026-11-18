import { useEffect, useRef, useState } from 'react';
import { StoryCover } from '../../components/xv/StoryCover';
import { ChapterNav, type ChapterLink } from '../../components/xv/ChapterNav';
import { StoryChapter } from '../../components/xv/StoryChapter';
import { HonorSection } from '../../components/xv/HonorSection';
import { FloatingPetals } from '../../components/hero/FloatingPetals';
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
import { Lamb, SprigDivider } from './components/OliveArt';
import { OlivoClosing } from './components/OlivoClosing';
import { OlivoHero } from './components/OlivoHero';
import './theme.css';

/** Leaves drifting down the page in place of the floral templates' petals. */
const LEAVES = ['❦', '❧', '✿', '·'];

const CHAPTERS: (ChapterLink & { section?: 'story' | 'gallery' | 'gifts' })[] = [
  { href: '#historia', label: 'Mi historia', section: 'story' },
  { href: '#celebracion', label: 'El día' },
  { href: '#galeria', label: 'Fotos', section: 'gallery' },
  { href: '#regalos', label: 'Regalos', section: 'gifts' },
  { href: '#confirmar', label: 'Confirmar' },
];
// Sections get a top offset so the fixed chapter bar doesn't cover their heading.
const ANCHOR = 'scroll-mt-12';

/**
 * A baptism on linen among olive trees: a book opens onto an olive wreath that grows around the baby's portrait, olive
 * sprigs separate the sections, leaves drift down the page and a little lamb waits at the closing words.
 */
export function InvitationPage({ invitation }: { invitation: BaptismContent }) {
  const musicPlayerRef = useRef<MusicPlayerHandle>(null);
  const [autoScrollActive, setAutoScrollActive] = useState(false);
  const [coverOpen, setCoverOpen] = useState(false);
  const celebrant = toCelebrant(invitation);
  const { eventDate } = eventDates(invitation);
  const monogram = invitation.monogram || initials(...celebrant.name.split(/\s+/).slice(0, 2));
  /** e.g. "21 · marzo · 2027" */
  const heroDate = formatDate(eventDate, "dd '·' MMMM '·' yyyy");
  const hasSection = { story: invitation.story !== null, gallery: invitation.gallery.length > 0, gifts: invitation.gifts.length > 0 };
  const chapters = CHAPTERS.filter((chapter) => !chapter.section || hasSection[chapter.section]);

  useEffect(() => {
    document.title = `${celebrant.name} — Mi Bautizo`;
  }, [celebrant.name]);

  useAutoScroll({ active: autoScrollActive, speed: 70 });

  return (
    <div className="theme-bautizo-olivo bg-ivory text-ink">
      <StoryCover
        monogram={monogram}
        name={celebrant.name}
        subtitle={`Bautizo · ${formatDate(eventDate, 'dd.MM.yyyy')}`}
        kicker="Una nueva vida en la fe"
        coverEyebrow="Un regalo de Dios"
        firstPageLine="Con amor y fe…"
        firstPageCaption="Un nuevo comienzo"
        ariaName={celebrant.name}
        onOpen={() => {
          setCoverOpen(true);
          musicPlayerRef.current?.play();
        }}
        onOpened={() => setAutoScrollActive(true)}
      />
      <ChapterNav monogram={monogram} links={chapters} />
      <MusicPlayer ref={musicPlayerRef} src={celebrant.musicFile} position="bottom-center" />
      <FloatingPetals symbols={LEAVES} />

      <div id="inicio">
        <OlivoHero name={celebrant.name} monogram={monogram} dateLabel={heroDate} photo={invitation.heroPhoto} play={coverOpen} />
      </div>

      {invitation.story && (
        <StoryChapter id="historia" {...invitation.story} photo={invitation.story.photo ?? undefined} />
      )}

      {invitation.parents && (
        <>
          <SprigDivider className="bg-ivory pb-4" />
          <HonorSection
            eyebrow="Con la bendición de Dios"
            title="Quienes me acompañan"
            intro="Mis papás y mis padrinos me presentarán ante Dios, y será una alegría que estés con nosotros."
            featured={invitation.parents}
            groups={invitation.godparents}
          />
        </>
      )}

      <div id="celebracion" className={ANCHOR}>
        {invitation.venues.length > 0 && (
          <>
            <SprigDivider className="bg-ivory pt-16" />
            <VenuesSection
              venues={invitation.venues}
              eyebrow="Dónde"
              title="La ceremonia y el festejo"
              intro="Primero en la parroquia, después a la mesa: aquí te esperamos."
            />
          </>
        )}
        {invitation.program.length > 0 && (
          <ProgramTimeline
            items={invitation.program}
            eyebrow="El día"
            title="Así lo viviremos"
            intro="Del agua bendita al último brindis, cada momento con ustedes."
          />
        )}
      </div>

      {invitation.eventAt && (
        <Countdown targetDateTime={invitation.eventAt} eyebrow="Faltan" title="Para mi gran día" headingTone="dark" />
      )}

      {hasSection.gallery && (
        <div id="galeria" className={ANCHOR}>
          <StoryGallery
            images={invitation.gallery}
            eyebrow="Mis primeros meses"
            title="Creciendo con amor"
            intro="Algunos momentos de mis primeros días en esta familia."
          />
        </div>
      )}

      {invitation.dressCode && (
        <>
          <div className="bg-ivory pt-16">
            <Lamb className="mx-auto w-[min(180px,52vw)]" />
          </div>
          <DressCodeSection dressCode={invitation.dressCode} eyebrow="Para la ocasión" title="Código de vestimenta" />
        </>
      )}

      {hasSection.gifts && (
        <div id="regalos" className={ANCHOR}>
          <SprigDivider className="bg-ivory pt-16" />
          <GiftsSection
            gifts={invitation.gifts}
            eyebrow="Un detalle"
            title="Si deseas obsequiarme algo"
            intro={[
              'Tu presencia y tus oraciones son lo más valioso que puedes darme.',
              'Si aun así quieres tener un detalle conmigo, puedes hacerlo a través de:',
            ]}
          />
        </div>
      )}

      <div id="confirmar" className={ANCHOR}>
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
      </div>

      <WishesSection />

      <OlivoClosing
        message={
          invitation.closingMessage ||
          'Hoy comienzo mi camino en la fe junto a las personas que más me quieren. Gracias por ser parte de este día.'
        }
        signature={celebrant.firstName}
        dateLabel={celebrant.footerDateLabel}
      />

      <Footer
        title={celebrant.name}
        dateLabel={celebrant.footerDateLabel}
        tagline={invitation.tagline || 'Mi bautizo · Con amor y fe'}
      />
    </div>
  );
}

export default InvitationPage;
