/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_NAME?: string;
    /** WhatsApp number of the business, for the landing page's contact links. */
    readonly VITE_CONTACT_WHATSAPP: string;
    /** Google Analytics of the landing page. */
    readonly VITE_GA_ID: string;
    /** Prices of the services besides the invitations, in MXN (see lib/services, which holds their defaults). */
    readonly VITE_PRICE_TRIBUTE_VIDEO?: string;
    readonly VITE_PRICE_TRIBUTE_VIDEO_PREMIUM?: string;
    readonly VITE_PRICE_VIDEO_INVITATION?: string;
    readonly VITE_PRICE_CARD?: string;
    readonly VITE_PRICE_PASSES?: string;
    readonly VITE_PRICE_CARD_AND_PASSES?: string;
    /** How many passes the passes' price covers, and the price of each further block of as many. */
    readonly VITE_PASSES_INCLUDED?: string;
    readonly VITE_PRICE_EXTRA_PASSES?: string;
}
