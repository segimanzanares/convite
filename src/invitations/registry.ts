import { lazy } from 'react';
import { meta as matildeNayithMeta } from './matilde-nayith/meta';

export const invitations = {
  'mati-nayith': {
    Component: lazy(() => import('./matilde-nayith/InvitationPage')),
    meta: matildeNayithMeta,
  },
} as const;

export type InvitationSlug = keyof typeof invitations;
