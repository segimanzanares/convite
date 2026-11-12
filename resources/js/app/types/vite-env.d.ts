/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_NAME?: string;
    /** WhatsApp number of the business, for the landing page's contact links. */
    readonly VITE_CONTACT_WHATSAPP: string;
    /** Google Analytics of the landing page. */
    readonly VITE_GA_ID: string;
}
