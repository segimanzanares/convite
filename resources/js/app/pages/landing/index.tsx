import { Head } from '@inertiajs/react';
import { CookieConsentBanner } from '@/components/cookie-consent-banner';
import type { DemoInvitation } from '@/types/invitation';
import type { OfferedPlan } from '@/types/plan';
import { Cta } from './components/cta';
import { Demos } from './components/demos';
import { Faq } from './components/faq';
import { Features } from './components/features';
import { Footer } from './components/footer';
import { Header } from './components/header';
import { Hero } from './components/hero';
import { Marquee } from './components/marquee';
import { Pricing } from './components/pricing';
import { Services } from './components/services';
import { Steps } from './components/steps';
import { useWhatsappLeadTracking } from './use-whatsapp-link';

export function LandingPage({
    demos,
    plans,
    servicePlans,
}: {
    demos: DemoInvitation[];
    plans: OfferedPlan[];
    /** The active plans of the services, for their summary. */
    servicePlans: OfferedPlan[];
}) {
    useWhatsappLeadTracking();

    return (
        <div className="bg-background text-foreground">
            <Head title="Invitaciones digitales para bodas, XV años y más" />
            <Header />
            <main>
                <Hero plans={plans} demos={demos} />
                <Marquee />
                <Demos demos={demos} />
                <Features />
                <Steps />
                <Services servicePlans={servicePlans} />
                <Pricing plans={plans} demos={demos} />
                <Faq plans={plans} />
                <Cta />
            </main>
            <Footer />
            {/* Google Analytics only measures the landing page (see use-google-analytics) */}
            <CookieConsentBanner />
        </div>
    );
}

export default LandingPage;
