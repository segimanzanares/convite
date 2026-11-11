import { useEffect } from 'react';
import { Header } from '../../components/landing/Header';
import { Hero } from '../../components/landing/Hero';
import { Features } from '../../components/landing/Features';
import { Steps } from '../../components/landing/Steps';
import { Pricing } from '../../components/landing/Pricing';
import { Faq } from '../../components/landing/Faq';
import { Cta } from '../../components/landing/Cta';
import { Footer } from '../../components/landing/Footer';
import { FullDivider } from '../../components/divider/FullDivider';
import type { Plan } from '../../types/plan';

export function LandingPage({ plans }: { plans: Plan[] }) {
  useEffect(() => {
    document.title = 'Convite — Invitaciones digitales para bodas, XV años y eventos';
  }, []);

  return (
    <div>
      <Header />
      <Hero plans={plans} />
      <Features />
      <FullDivider text="Su evento, su invitación" />
      <Steps />
      <Pricing plans={plans} />
      <Faq plans={plans} />
      <Cta />
      <Footer />
    </div>
  );
}

export default LandingPage;
