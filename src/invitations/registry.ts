import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import type { InvitationMeta } from './types';
import { meta as demoMeta } from './demo/meta';
import { meta as matildeNayithMeta } from './matilde-nayith/meta';
import { meta as floraMeta } from './flora/meta';

export interface InvitationEntry {
  Component: LazyExoticComponent<ComponentType>;
  /** Printable 5×7 card, served at /i/<slug>/tarjeta. Optional per invitation. */
  PrintCard?: LazyExoticComponent<ComponentType>;
  /** Printable guest passes (8 per letter sheet), served at /i/<slug>/pases. */
  GuestPasses?: LazyExoticComponent<ComponentType>;
  meta: InvitationMeta;
}

export const invitations = {
  'demo': {
    Component: lazy(() => import('./demo/InvitationPage')),
    PrintCard: lazy(() => import('./demo/PrintCardPage')),
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
} as const satisfies Record<string, InvitationEntry>;

export type InvitationSlug = keyof typeof invitations;
