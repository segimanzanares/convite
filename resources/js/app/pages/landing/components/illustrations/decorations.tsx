import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils';

/** A petal of the brand's mark, for the illustrations. */
export function Petal({ className, style }: { className?: string; style?: CSSProperties }) {
    return (
        <svg viewBox="0 0 24 32" className={className} style={style} aria-hidden="true">
            <path d="M12 0C20 8 21 20 12 32C3 20 4 8 12 0Z" fill="currentColor" />
            <path d="M12 4V28" stroke="white" strokeOpacity="0.35" strokeWidth="1" />
        </svg>
    );
}

/** A four-point twinkle. */
export function Sparkle({ className, style }: { className?: string; style?: CSSProperties }) {
    return (
        <svg
            viewBox="0 0 24 24"
            className={cn('motion-safe:animate-twinkle', className)}
            style={style}
            aria-hidden="true"
        >
            <path d="M12 0C13 8 16 11 24 12C16 13 13 16 12 24C11 16 8 13 0 12C8 11 11 8 12 0Z" fill="currentColor" />
        </svg>
    );
}

const FALLING_PETALS = [
    { left: '6%', delay: '0s', duration: '16s', size: 'w-4', color: 'text-rose/50' },
    { left: '18%', delay: '5s', duration: '19s', size: 'w-3', color: 'text-gold/60' },
    { left: '34%', delay: '9s', duration: '15s', size: 'w-5', color: 'text-terracotta/40' },
    { left: '52%', delay: '2s', duration: '21s', size: 'w-3', color: 'text-teal/40' },
    { left: '68%', delay: '7s', duration: '17s', size: 'w-4', color: 'text-rose/40' },
    { left: '84%', delay: '11s', duration: '18s', size: 'w-3.5', color: 'text-gold/50' },
    { left: '94%', delay: '3s', duration: '14s', size: 'w-3', color: 'text-terracotta/50' },
];

/** Petals drifting down a section; hidden for visitors who prefer reduced motion. */
export function FallingPetals() {
    return (
        <div className="pointer-events-none absolute inset-0 hidden overflow-hidden motion-safe:block" aria-hidden="true">
            {FALLING_PETALS.map((petal) => (
                <Petal
                    key={petal.left}
                    className={cn('absolute -top-10 animate-petal', petal.size, petal.color)}
                    style={{ left: petal.left, animationDelay: petal.delay, animationDuration: petal.duration }}
                />
            ))}
        </div>
    );
}
