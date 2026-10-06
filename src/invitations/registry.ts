import { lazy } from 'react';
import { meta as demoMeta } from './demo/meta';
import { meta as matildeNayithMeta } from './matilde-nayith/meta';
import { meta as floraMeta } from './flora/meta';

export const invitations = {
  'demo': {
    Component: lazy(() => import('./demo/InvitationPage')),
    meta: demoMeta,
  },
  'mati-nayith': {
    Component: lazy(() => import('./matilde-nayith/InvitationPage')),
    meta: matildeNayithMeta,
  },
  'flora': {
    Component: lazy(() => import('./flora/InvitationPage')),
    meta: floraMeta,
  },
} as const;

export type InvitationSlug = keyof typeof invitations;
