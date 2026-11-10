import { useEffect, useRef, useState } from 'react';
import { StoryCover } from '../../components/xv/StoryCover';
import { ChapterNav } from '../../components/xv/ChapterNav';
import { XvHero } from '../../components/xv/XvHero';
import { StoryChapter } from '../../components/xv/StoryChapter';
import { HonorSection } from '../../components/xv/HonorSection';
import { ClosingChapter } from '../../components/xv/ClosingChapter';
import { FloatingPetals } from '../../components/hero/FloatingPetals';
import { FullDivider } from '../../components/divider/FullDivider';
import { VenuesSection } from '../../components/venues/VenuesSection';
import { ProgramTimeline } from '../../components/program/ProgramTimeline';
import { Countdown } from '../../components/countdown/Countdown';
import { Gallery } from '../../components/gallery/Gallery';
import { DressCodeSection } from '../../components/dresscode/DressCodeSection';
import { DressCodePalette } from '../../components/dresscode/DressCodePalette';
import { GiftsSection } from '../../components/gifts/GiftsSection';
import { RsvpSection } from '../../components/rsvp/RsvpSection';
import { Footer } from '../../components/footer/Footer';
import { MusicPlayer, type MusicPlayerHandle } from '../../components/music/MusicPlayer';
import { useAutoScroll } from '../../hooks/useAutoScroll';
import {
  CELEBRANT,
  CHAPTERS,
  DOTTED_DATE,
  DRESS_CODE,
  DRESS_CODE_SWATCHES,
  GALLERY_IMAGES,
  GIFTS,
  GODPARENTS,
  HERO_PHOTO,
  MONOGRAM,
  PARENTS,
  PROGRAM,
  SHORT_DATE,
  STORY,
  VENUES,
} from './data';
import './theme.css';

const FALLING_SPARKLES = ['✦', '❀', '✧', '❦', '✿'];
// Sections get a top offset so the fixed chapter bar doesn't cover their heading.
const ANCHOR = 'scroll-mt-12';

export function InvitationPage() {
  const musicPlayerRef = useRef<MusicPlayerHandle>(null);
  const [autoScrollActive, setAutoScrollActive] = useState(false);

  useEffect(() => {
    document.title = `${CELEBRANT.name} — Mis XV Años`;
  }, []);

  useAutoScroll({ active: autoScrollActive, speed: 100 });

  return (
    <div className="theme-demo-xv bg-ivory text-ink">
      <StoryCover
        monogram={MONOGRAM}
        name={CELEBRANT.name}
        subtitle={`Mis XV años · ${DOTTED_DATE}`}
        ariaName={CELEBRANT.name}
        onOpen={() => musicPlayerRef.current?.play()}
        onOpened={() => setAutoScrollActive(true)}
      />
      <ChapterNav monogram={MONOGRAM} links={CHAPTERS} />
      <MusicPlayer ref={musicPlayerRef} src={CELEBRANT.musicFile} position="bottom-center" />
      <FloatingPetals symbols={FALLING_SPARKLES} />

      <div id="inicio">
        <XvHero
          name={CELEBRANT.name}
          eyebrow="Una noche en el jardín encantado"
          shortDate={SHORT_DATE}
          dateLabel={CELEBRANT.dateLabel}
          storyHref="#historia"
          rsvpHref="#confirmar"
          photo={HERO_PHOTO}
        />
      </div>

      <StoryChapter id="historia" {...STORY} />

      <HonorSection
        eyebrow="Una noche más especial"
        title="Junto a quienes amo"
        intro="Con la bendición de Dios y el amor de mi familia, tengo el honor de invitarte a celebrar conmigo."
        featured={PARENTS}
        groups={GODPARENTS}
      />

      <FullDivider text={`${CELEBRANT.firstName} · XV`} />

      <div id="celebracion" className={ANCHOR}>
        <VenuesSection
          venues={VENUES}
          eyebrow="La gran noche"
          title="La celebración"
          intro="Estos son los lugares donde comenzará y continuará nuestro cuento."
        />
        <ProgramTimeline
          items={PROGRAM}
          eyebrow="Así será la noche"
          title="Programa"
          intro="Cada momento ha sido pensado para compartirlo contigo."
        />
      </div>

      <Countdown
        targetDateTime={CELEBRANT.eventDateTime}
        eyebrow="Faltan"
        title="Cada segundo, más cerca del sueño"
        headingTone="dark"
      />

      <div id="galeria" className={ANCHOR}>
        <Gallery
          images={GALLERY_IMAGES}
          eyebrow="Fragmentos de mi historia"
          title="Mis recuerdos"
          intro="Quince años de momentos que me trajeron hasta aquí."
        />
      </div>

      <DressCodeSection dressCode={DRESS_CODE} />
      <DressCodePalette
        swatches={DRESS_CODE_SWATCHES}
        intro="Inspirados en un jardín al anochecer, te sugerimos estos tonos para tu vestimenta."
      />

      <div id="deseos" className={ANCHOR}>
        <GiftsSection
          gifts={GIFTS}
          eyebrow="Mis deseos"
          title="Un detalle para mí"
          intro={[
            'Tu presencia es el regalo más bonito de esta noche.',
            'Si además deseas obsequiarme algo, puedes hacerlo así:',
          ]}
        />
      </div>

      <div id="confirmar" className={ANCHOR}>
        <RsvpSection
          whatsappNumber={CELEBRANT.rsvpWhatsappNumber}
          deadlineLabel={CELEBRANT.rsvpDeadlineLabel}
          calendar={{
            dateTime: CELEBRANT.eventDateTime,
            name: `XV años de ${CELEBRANT.name}`,
            fileName: 'xv-anos.ics',
          }}
          venues={VENUES}
        />
      </div>

      <ClosingChapter
        message="…este cuento apenas comienza, y no hay mejor forma de escribir su siguiente página que a tu lado."
        signature={CELEBRANT.name}
        dateLabel={CELEBRANT.footerDateLabel}
      />

      <Footer title={CELEBRANT.name} dateLabel={CELEBRANT.footerDateLabel} tagline="Una noche para recordar" />
    </div>
  );
}

export default InvitationPage;
