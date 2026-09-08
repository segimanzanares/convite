import { lazy } from 'react';
import { meta as demoMeta } from './demo/meta';
import { meta as matildeNayithMeta } from './matilde-nayith/meta';

export const invitations = {
  'demo': {
    Component: lazy(() => import('./demo/InvitationPage')),
    meta: demoMeta,
  },
  'mati-nayith': {
    Component: lazy(() => import('./matilde-nayith/InvitationPage')),
    meta: matildeNayithMeta,
  },
} as const;

export type InvitationSlug = keyof typeof invitations;
