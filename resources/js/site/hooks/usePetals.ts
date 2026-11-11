export interface Petal {
  id: number;
  symbol: string;
  left: number;
  animationDelay: number;
  animationDuration: number;
  fontSize: number;
}

const PETAL_SYMBOLS = ['✿', '❀', '✾', '⚘', '❁'];
const PETAL_COUNT = 14;

function generatePetals(): Petal[] {
  return Array.from({ length: PETAL_COUNT }, (_, id) => ({
    id,
    symbol: PETAL_SYMBOLS[Math.floor(Math.random() * PETAL_SYMBOLS.length)],
    left: Math.random() * 100,
    animationDelay: Math.random() * 12,
    animationDuration: 10 + Math.random() * 8,
    fontSize: 10 + Math.random() * 10,
  }));
}

// Generated once at module load: the decoration is static for the page's
// lifetime, so this must not be recomputed inside a component's render pass.
const PETALS = generatePetals();

export function usePetals(): Petal[] {
  return PETALS;
}
