import { useEffect } from 'react';
import { Header } from './components/header';
import { Hero } from './components/hero';
import { Features } from './components/features';
import { Steps } from './components/steps';
import { Pricing } from './components/pricing';
import { Faq } from './components/faq';
import { Cta } from './components/cta';
import { Footer } from './components/footer';
import { FullDivider } from './components/full-divider';
import type { OfferedPlan } from '@/types/plan';

export function LandingPage({ plans }: { plans: OfferedPlan[] }) {
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
