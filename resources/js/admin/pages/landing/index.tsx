import { Head } from '@inertiajs/react';
import { CookieConsentBanner } from '@/components/cookie-consent-banner';
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
    return (
        <div>
            <Head title="Invitaciones digitales para bodas, XV años y eventos" />
            <Header />
            <Hero plans={plans} />
            <Features />
            <FullDivider text="Su evento, su invitación" />
            <Steps />
            <Pricing plans={plans} />
            <Faq plans={plans} />
            <Cta />
            <Footer />
            {/* Google Analytics only measures the landing page (see use-google-analytics) */}
            <CookieConsentBanner />
        </div>
    );
}

export default LandingPage;
