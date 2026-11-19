import { useEffect, useState } from 'react';
import type { BabyGender } from '../types/invitation';

/**
 * The team a visitor of a gender reveal picks ("¿niño o niña?"). It is just for fun: it stays in this browser
 * (per invitation URL) and never reaches the server, so storage errors (private mode, blocked site data) only make
 * the pick forgettable.
 */
export function useTeamGuess() {
  // "/i/{slug}", so the open invitation and a guest's personalized link share the pick
  const key = typeof window === 'undefined' ? '' : `convite:team:${window.location.pathname.split('/').slice(0, 3).join('/')}`;
  const [guess, setGuess] = useState<BabyGender | null>(() => {
    try {
      const stored = key ? window.localStorage.getItem(key) : null;
      return stored === 'boy' || stored === 'girl' ? stored : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!key || !guess) return;
    try {
      window.localStorage.setItem(key, guess);
    } catch {
      // The pick still works for this visit.
    }
  }, [key, guess]);

  return { guess, setGuess };
}
