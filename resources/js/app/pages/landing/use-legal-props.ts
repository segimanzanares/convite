import { usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';

/** Who is responsible for the service (see App\Http\Controllers\LegalController). */
export type LegalEntity = {
    name: string;
    email: string | null;
    address: string | null;
    city: string | null;
};

/** How long each kind of data is kept, in days, as the scheduled purges apply it. */
export type Retention = {
    guests_days: number;
    uploads_days: number;
    backups_days: number;
    wishes_days_after_event: number;
    referral_cookie_days: number;
    partner_cookie_days: number;
};

export type LegalPageProps = {
    legal: LegalEntity;
    retention: Retention;
};

export type LegalSection = {
    /** The section's anchor, for the table of contents. */
    id: string;
    title: string;
    content: ReactNode;
};

export function useLegalProps(): LegalPageProps {
    return usePage<LegalPageProps>().props;
}

/** "1 día" or "N días". */
export function days(count: number): string {
    return count === 1 ? '1 día' : `${count} días`;
}
