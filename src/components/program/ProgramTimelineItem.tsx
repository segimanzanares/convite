import { Reveal } from '../shared/Reveal';
import type { ProgramItem } from '../../types/wedding';

interface ProgramTimelineItemProps {
  item: ProgramItem;
  /** Which side of the line the card sits on from tablet width up; on phones it is always on the right. */
  side: 'left' | 'right';
}

export function ProgramTimelineItem({ item, side }: ProgramTimelineItemProps) {
  const isLeft = side === 'left';

  return (
    <li
      className={[
        'relative pl-16 pb-12 last:pb-0 min-[641px]:w-1/2',
        isLeft ? 'min-[641px]:pl-0 min-[641px]:pr-14 min-[641px]:text-right' : 'min-[641px]:ml-[50%] min-[641px]:pl-14',
      ].join(' ')}
    >
      <span
        className={[
          'absolute top-0 left-0 w-11 h-11 rounded-full z-[1]',
          'flex items-center justify-center text-[18px]',
          'bg-ivory border border-gold/50 shadow-[0_4px_18px_color-mix(in_srgb,var(--color-gold)_18%,transparent)]',
          isLeft ? 'min-[641px]:left-auto min-[641px]:right-[-22px]' : 'min-[641px]:left-[-22px]',
        ].join(' ')}
        aria-hidden="true"
      >
        {item.icon ?? <span className="w-2 h-2 bg-gold rotate-45" />}
      </span>
      <Reveal>
        <p className="font-display text-[11px] tracking-[0.35em] text-gold uppercase pt-3">{item.time}</p>
        <h3 className="font-script text-[32px] text-gold-deep leading-[1.2] mt-1">{item.title}</h3>
        {item.description && (
          <p className="text-[15px] font-light leading-[1.75] text-[var(--text-body)] italic mt-1">
            {item.description}
          </p>
        )}
      </Reveal>
    </li>
  );
}
