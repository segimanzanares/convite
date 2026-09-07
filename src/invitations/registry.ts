import { lazy } from 'react';

export const invitations = {
  'mati-nayith': lazy(() => import('./matilde-nayith/InvitationPage')),
} as const;

export type InvitationSlug = keyof typeof invitations;
