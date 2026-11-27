import { useEffect, useRef, useState } from 'react';
import { Envelope } from '../../components/envelope/Envelope';
import { FloatingPetals } from '../../components/hero/FloatingPetals';
import { FamilySection } from '../../components/family/FamilySection';
import { CoupleMessage } from '../../components/message/CoupleMessage';
import { FullDivider } from '../../components/divider/FullDivider';
import { Countdown } from '../../components/countdown/Countdown';
import { StoryGallery } from '../../components/gallery/StoryGallery';
import { GiftsSection } from '../../components/gifts/GiftsSection';
import { DressCodePalette } from '../../components/dresscode/DressCodePalette';
import { DressCodeSection } from '../../components/dresscode/DressCodeSection';
import { VenuesSection } from '../../components/venues/VenuesSection';
import { ProgramTimeline } from '../../components/program/ProgramTimeline';
import { RsvpSection } from '../../components/rsvp/RsvpSection';
import { WishesSection } from '../../components/wishes/WishesSection';
import { Footer } from '../../components/footer/Footer';
import { MusicPlayer, type MusicPlayerHandle } from '../../components/music/MusicPlayer';
import { useAutoScroll } from '../../hooks/useAutoScroll';
import { initials, toCouple } from '../../lib/eventContent';
import type { WeddingContent } from '../../types/invitation';
import { FloralHero } from './components/FloralHero';
import { CornerBouquet, FloralSpray } from './components/Flowers';
import './theme.css';

export function InvitationPage({ invitation }: { invitation: WeddingContent }) {
  const musicPlayerRef = useRef<MusicPlayerHandle>(null);
  const [autoScrollActive, setAutoScrollActive] = useState(false);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const couple = toCouple(invitation);
  const coupleTitle = `${couple.names[0]} & ${couple.names[1]}`;

  useEffect(() => {
    document.title = `${coupleTitle} — Nuestra Boda`;
  }, [coupleTitle]);

  useAutoScroll({ active: autoScrollActive, speed: 60 });

  return (
    <div className="theme-boda-floral bg-(--card) text-(--foreground)">
      <Envelope
        monogram={initials(...couple.names)}
        title={coupleTitle}
        ariaName={`${couple.names[0]} y ${couple.names[1]}`}
        onOpen={() => {
          setEnvelopeOpen(true);
          musicPlayerRef.current?.play();
        }}
        onOpened={() => setAutoScrollActive(true)}
      />
      <MusicPlayer ref={musicPlayerRef} src={couple.musicFile} position="bottom-center" />
      <FloatingPetals symbols={['❀', '✿', '❁']} />
      <FloralHero couple={couple} coverUrl={invitation.cover} bloom={envelopeOpen} />
      <CoupleMessage couple={couple} message={invitation.message} />
      {invitation.parents.length > 0 && (
        <FamilySection
          eyebrow="Con la bendición de Dios"
          title="Y de nuestros padres"
          intro="Con el amor que nos dieron y la guía de quienes nos acompañan en este camino, unimos nuestras vidas."
          parents={invitation.parents}
          godparents={invitation.godparents}
          godparentsTitle="Nuestros padrinos"
          ornament={<FloralSpray className="mb-4" />}
        />
      )}
      <FullDivider text={coupleTitle} />
      {invitation.venues.length > 0 && (
        <>
          <FloralSpray className="pt-16" />
          <VenuesSection venues={invitation.venues} />
        </>
      )}
      {invitation.program.length > 0 && (
        <ProgramTimeline items={invitation.program} intro="Así viviremos este día tan especial, momento a momento." />
      )}
      {invitation.eventAt && <Countdown targetDateTime={invitation.eventAt} headingTone="dark" />}
      {invitation.gallery.length > 0 && (
        <StoryGallery
          images={invitation.gallery}
          eyebrow="Momentos juntos"
          title="Nuestra Historia"
          intro="Cada imagen guarda un instante, cada instante una promesa de eternidad."
        />
      )}
      {invitation.dressCode && (
        <>
          <FloralSpray className="pt-16" />
          <DressCodeSection dressCode={invitation.dressCode} />
        </>
      )}
      {invitation.swatches.length > 0 && <DressCodePalette swatches={invitation.swatches} />}
      {invitation.gifts.length > 0 && (
        <>
          <FloralSpray />
          <GiftsSection gifts={invitation.gifts} />
        </>
      )}
      <div className="relative overflow-hidden">
        <RsvpSection
          whatsappNumber={couple.rsvpWhatsappNumber}
          deadlineLabel={couple.rsvpDeadlineLabel}
          calendar={{ dateTime: couple.weddingDateTime, name: `Boda ${coupleTitle}`, fileName: 'boda.ics' }}
          venues={invitation.venues}
        />
        <CornerBouquet className="absolute -top-3 -left-3 w-[150px] sm:w-[240px] h-auto opacity-60 pointer-events-none" />
        <CornerBouquet className="absolute -bottom-3 -right-3 w-[150px] sm:w-[240px] h-auto opacity-60 rotate-180 pointer-events-none" />
      </div>
      <WishesSection />
      <FloralSpray className="pt-14 bg-(--card)" />
      <Footer title={coupleTitle} dateLabel={couple.footerDateLabel} tagline={invitation.tagline ?? undefined} />
    </div>
  );
}

export default InvitationPage;
