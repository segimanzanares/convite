import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
    eyebrow: string;
    title: ReactNode;
    description?: ReactNode;
    tone?: 'light' | 'dark';
    className?: string;
}

export function SectionHeading({ eyebrow, title, description, tone = 'light', className }: SectionHeadingProps) {
    const isDark = tone === 'dark';

    return (
        <div className={cn('mx-auto max-w-2xl text-center', className)}>
            <span
                className={cn(
                    'mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium',
                    isDark ? 'border-white/15 bg-white/5 text-gold-light' : 'border-gold/30 bg-gold-pale/60 text-gold-deep',
                )}
            >
                <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
                {eyebrow}
            </span>
            <h2
                className={cn(
                    'text-[clamp(32px,4.6vw,52px)] leading-[1.08] font-semibold tracking-tight text-balance',
                    isDark ? 'text-white' : 'text-foreground',
                )}
            >
                {title}
            </h2>
            {description && (
                <p
                    className={cn(
                        'mt-5 text-base leading-relaxed text-pretty sm:text-lg',
                        isDark ? 'text-white/70' : 'text-muted-foreground',
                    )}
                >
                    {description}
                </p>
            )}
        </div>
    );
}

/** The word a title stresses, in the brand's script over a gold-to-rose shimmer. */
export function Highlight({ children }: { children: ReactNode }) {
    return (
        <span className="motion-safe:animate-shimmer bg-[linear-gradient(90deg,var(--color-gold-deep),var(--color-rose),var(--color-terracotta),var(--color-gold-deep))] bg-[length:200%_auto] bg-clip-text px-1 font-script font-normal text-transparent">
            {children}
        </span>
    );
}
