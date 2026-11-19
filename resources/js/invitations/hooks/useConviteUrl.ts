import { usePage } from '@inertiajs/react';
import type { InvitationPageProps } from '../types/rsvp';

/** Where the "made with Convite" credit in a template's footer links: the landing page, tagged as a visit from this
    invitation (see App\Services\ReferralService::invitationCreditUrl). */
export function useConviteUrl(): string {
  return usePage<InvitationPageProps>().props.conviteUrl ?? '/';
}
