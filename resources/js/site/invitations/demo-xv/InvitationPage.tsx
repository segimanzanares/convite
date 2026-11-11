import { useEffect, useRef, useState } from 'react';
import { StoryCover } from '../../components/xv/StoryCover';
import { ChapterNav } from '../../components/xv/ChapterNav';
import { XvHero } from '../../components/xv/XvHero';
import { StoryChapter } from '../../components/xv/StoryChapter';
import { HonorSection } from '../../components/xv/HonorSection';
import { ClosingChapter } from '../../components/xv/ClosingChapter';
import { StoryGallery } from '../../components/xv/StoryGallery';
import { StoryRsvp } from '../../components/xv/StoryRsvp';
import { FloatingPetals } from '../../components/hero/FloatingPetals';
import { FullDivider } from '../../components/divider/FullDivider';
import { VenuesSection } from '../../components/venues/VenuesSection';
import { ProgramTimeline } from '../../components/program/ProgramTimeline';
import { Countdown } from '../../components/countdown/Countdown';
import { DressCodeSection } from '../../components/dresscode/DressCodeSection';
import { GiftsSection } from '../../components/gifts/GiftsSection';
import { Footer } from '../../components/footer/Footer';
import { MusicPlayer, type MusicPlayerHandle } from '../../components/music/MusicPlayer';
import { useAutoScroll } from '../../hooks/useAutoScroll';
import { eventDates, formatDate, initials, toCelebrant } from '../../lib/eventContent';
import type { XvContent } from '../../types/invitation';
import type { ChapterLink } from '../../components/xv/ChapterNav';
import './theme.css';

const FALLING_SPARKLES = ['✦', '❀', '✧', '❦', '✿'];

const CHAPTERS: (ChapterLink & { section?: 'story' | 'gallery' | 'gifts' })[] = [
  { href: '#historia', label: 'Mi historia', section: 'story' },
  { href: '#celebracion', label: 'La celebración' },
  { href: '#galeria', label: 'Galería', section: 'gallery' },
  { href: '#deseos', label: 'Mis deseos', section: 'gifts' },
  { href: '#confirmar', label: 'Confirmar' },
];
// Sections get a top offset so the fixed chapter bar doesn't cover their heading.
const ANCHOR = 'scroll-mt-12';

export function InvitationPage({ invitation }: { invitation: XvContent }) {
  const musicPlayerRef = useRef<MusicPlayerHandle>(null);
  const [autoScrollActive, setAutoScrollActive] = useState(false);
  const celebrant = toCelebrant(invitation);
  const { eventDate } = eventDates(invitation);
  const monogram = invitation.monogram || initials(...celebrant.name.split(/\s+/).slice(0, 2));
  /** e.g. "sábado 05 de diciembre de 2026" */
  const dateLabel = formatDate(eventDate, "EEEE dd 'de' MMMM 'de' yyyy");
  /** e.g. "05 · DIC · 2026" */
  const shortDate = formatDate(eventDate, "dd '·' MMM '·' yyyy").replace('.', '').toUpperCase();
  /** e.g. "05.12.2026" */
  const dottedDate = formatDate(eventDate, 'dd.MM.yyyy');
  /** e.g. "Sábado · 09 enero 2027" */
  const cardDate = formatDate(eventDate, "EEEE '·' dd MMMM yyyy").replace(/^./, (c) => c.toUpperCase());
  const hasSection = { story: invitation.story !== null, gallery: invitation.gallery.length > 0, gifts: invitation.gifts.length > 0 };
  const chapters = CHAPTERS.filter((chapter) => !chapter.section || hasSection[chapter.section]);

  useEffect(() => {
    document.title = `${celebrant.name} — Mis XV Años`;
  }, [celebrant.name]);

  useAutoScroll({ active: autoScrollActive, speed: 100 });

  return (
    <div className="theme-demo-xv bg-ivory text-ink">
      <StoryCover
        monogram={monogram}
        name={celebrant.name}
        subtitle={`Mis XV años · ${dottedDate}`}
        ariaName={celebrant.name}
        onOpen={() => musicPlayerRef.current?.play()}
        onOpened={() => setAutoScrollActive(true)}
      />
      <ChapterNav monogram={monogram} links={chapters} />
      <MusicPlayer ref={musicPlayerRef} src={celebrant.musicFile} position="bottom-center" />
      <FloatingPetals symbols={FALLING_SPARKLES} />

      <div id="inicio">
        <XvHero
          name={celebrant.name}
          eyebrow="Una noche en el jardín encantado"
          shortDate={shortDate}
          dateLabel={dateLabel}
          storyHref={invitation.story ? '#historia' : '#celebracion'}
          rsvpHref="#confirmar"
          photo={invitation.heroPhoto ?? undefined}
        />
      </div>

      {invitation.story && (
        <StoryChapter id="historia" {...invitation.story} photo={invitation.story.photo ?? undefined} />
      )}

      {invitation.parents && (
        <HonorSection
          eyebrow="Una noche más especial"
          title="Junto a quienes amo"
          intro="Con la bendición de Dios y el amor de mi familia, tengo el honor de invitarte a celebrar conmigo."
          featured={invitation.parents}
          groups={invitation.godparents}
        />
      )}

      <FullDivider text={`${celebrant.firstName} · XV`} />

      <div id="celebracion" className={ANCHOR}>
        {invitation.venues.length > 0 && (
          <VenuesSection
            venues={invitation.venues}
            eyebrow="La gran noche"
            title="La celebración"
            intro="Estos son los lugares donde comenzará y continuará nuestro cuento."
          />
        )}
        {invitation.program.length > 0 && (
          <ProgramTimeline
            items={invitation.program}
            eyebrow="Así será la noche"
            title="Programa"
            intro="Cada momento ha sido pensado para compartirlo contigo."
          />
        )}
      </div>

      {invitation.eventAt && (
        <Countdown
          targetDateTime={invitation.eventAt}
          eyebrow="Faltan"
          title="Cada segundo, más cerca del sueño"
          headingTone="dark"
        />
      )}

      {hasSection.gallery && (
        <div id="galeria" className={ANCHOR}>
          <StoryGallery
            images={invitation.gallery}
            eyebrow="Fragmentos de mi historia"
            title="Mis momentos favoritos"
            intro="Quince años de momentos que me trajeron hasta aquí."
          />
        </div>
      )}

      {invitation.dressCode && <DressCodeSection dressCode={invitation.dressCode} />}

      {hasSection.gifts && (
        <div id="deseos" className={ANCHOR}>
          <GiftsSection
            gifts={invitation.gifts}
            eyebrow="Mis deseos"
            title="Un detalle para mí"
            intro={[
              'Tu presencia es el regalo más bonito de esta noche.',
              'Si además deseas obsequiarme algo, puedes hacerlo así:',
            ]}
          />
        </div>
      )}

      <div id="confirmar" className={ANCHOR}>
        <StoryRsvp
          whatsappNumber={celebrant.rsvpWhatsappNumber}
          celebrantName={celebrant.name}
          dateLabel={cardDate}
          deadlineLabel={celebrant.rsvpDeadlineLabel}
          signature={`Con cariño, ${celebrant.firstName}`}
          calendar={{
            dateTime: celebrant.eventDateTime,
            name: `XV años de ${celebrant.name}`,
            fileName: 'xv-anos.ics',
          }}
          venues={invitation.venues}
        />
      </div>

      <ClosingChapter
        message={
          invitation.closingMessage ||
          '…este cuento apenas comienza, y no hay mejor forma de escribir su siguiente página que a tu lado.'
        }
        signature={celebrant.name}
        dateLabel={celebrant.footerDateLabel}
      />

      <Footer
        title={celebrant.name}
        dateLabel={celebrant.footerDateLabel}
        tagline={invitation.tagline || 'Una noche para recordar'}
      />
    </div>
  );
}

export default InvitationPage;
