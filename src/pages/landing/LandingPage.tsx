import { useEffect } from 'react';
import { Header } from '../../components/landing/Header';
import { Hero } from '../../components/landing/Hero';
import { Features } from '../../components/landing/Features';
import { Steps } from '../../components/landing/Steps';
import { Cta } from '../../components/landing/Cta';
import { Footer } from '../../components/landing/Footer';
import { FullDivider } from '../../components/divider/FullDivider';

export function LandingPage() {
  useEffect(() => {
    document.title = 'Convite — Invitaciones digitales de boda a medida';
  }, []);

  return (
    <div>
      <Header />
      <Hero />
      <Features />
      <FullDivider text="Su boda, su invitación" />
      <Steps />
      <Cta />
      <Footer />
    </div>
  );
}

export default LandingPage;
