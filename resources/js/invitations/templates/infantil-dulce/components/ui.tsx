import type { CSSProperties, ReactNode } from 'react';
import { Reveal } from '../../../components/shared/Reveal';
import { cn } from '../../../components/ui/styles';

interface SectionTitleProps {
  eyebrow: string;
  title: string;
  description?: ReactNode;
}

/** A mint pill as the eyebrow, a round Fredoka title and a lead, centered. */
export function SectionTitle({ eyebrow, title, description }: SectionTitleProps) {
  return (
    <Reveal className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
      <span className="inline-block rounded-full bg-(--secondary) px-4 py-1 font-fredoka text-sm font-semibold text-(--secondary-foreground)">{eyebrow}</span>
      <h2 className="mt-4 font-fredoka text-[clamp(36px,6vw,56px)] leading-[1.02] font-semibold text-balance">{title}</h2>
      {description && <p className="mt-4 text-lg leading-relaxed text-pretty text-(--muted-foreground)">{description}</p>}
    </Reveal>
  );
}

const SPRINKLE_COLORS = ['#ff8fc0', '#7fd8c4', '#ffd85e', '#b9a2f0', '#8fc9ff', '#ffffff'];

/** Fixed sprinkle positions (left %, top %, turn), so they render the same every time. */
const SPRINKLES = [
  [4, 10, 20], [12, 42, -40], [20, 18, 70], [27, 70, 10], [35, 34, -60], [43, 8, 35], [50, 58, -15], [57, 24, 80],
  [64, 78, -35], [71, 14, 50], [78, 48, -70], [85, 26, 15], [92, 64, -45], [8, 84, 60], [96, 6, -25], [40, 88, 40],
] as const;

/** Scattered candy sprinkles behind a section's content. */
export function Sprinkles({ className }: { className?: string }) {
  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden="true">
      {SPRINKLES.map(([left, top, turn], index) => (
        <span
          key={index}
          className="absolute h-1.5 w-4 rounded-full"
          style={{ left: `${left}%`, top: `${top}%`, transform: `rotate(${turn}deg)`, backgroundColor: SPRINKLE_COLORS[index % SPRINKLE_COLORS.length] } as CSSProperties}
        />
      ))}
    </div>
  );
}

/** A frosting drip edge: the color of the section above, dripping into the one below. */
export function Drip({ color, className }: { color: string; className?: string }) {
  return (
    <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className={cn('block h-14 w-full sm:h-20', className)} aria-hidden="true">
      <path
        d="M0 0 H1440 V40 C1410 40 1405 96 1380 96 C1355 96 1352 40 1320 40 C1280 40 1290 70 1250 70 C1215 70 1220 40 1180 40 C1140 40 1150 110 1110 110 C1072 110 1080 40 1040 40 C1000 40 1012 64 975 64 C940 64 948 40 905 40 C865 40 872 100 832 100 C795 100 800 40 760 40 C720 40 730 76 692 76 C655 76 662 40 622 40 C580 40 590 112 550 112 C512 112 520 40 480 40 C440 40 450 66 412 66 C376 66 384 40 345 40 C305 40 315 98 275 98 C238 98 245 40 205 40 C165 40 175 72 137 72 C100 72 108 40 68 40 C30 40 30 86 0 86 Z"
        fill={color}
      />
    </svg>
  );
}
