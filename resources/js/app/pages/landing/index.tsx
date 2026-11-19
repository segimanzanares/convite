import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import { CookieConsentBanner } from '@/components/cookie-consent-banner';
import { trackEvent } from '@/lib/analytics';
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
import { Steps } from './components/steps';
import { useReferral } from './use-whatsapp-link';

export function LandingPage({ demos, plans }: { demos: DemoInvitation[]; plans: OfferedPlan[] }) {
    const referral = useReferral();

    // Sales close over WhatsApp, so opening a chat is the landing's conversion: one listener covers every button
    useEffect(() => {
        const onClick = (event: MouseEvent) => {
            const link = event.target instanceof Element ? event.target.closest('a[href^="https://wa.me/"]') : null;

            if (link) {
                trackEvent('generate_lead', { method: 'whatsapp', referral: referral !== null });
            }
        };

        document.addEventListener('click', onClick);

        return () => document.removeEventListener('click', onClick);
    }, [referral]);

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
                <Pricing plans={plans} />
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
