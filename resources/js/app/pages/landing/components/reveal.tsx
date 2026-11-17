import type { ReactNode } from 'react';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { cn } from '@/lib/utils';

interface RevealProps {
    children: ReactNode;
    className?: string;
    /** Milliseconds to wait once visible, to stagger the items of a grid. */
    delay?: number;
}

export function Reveal({ children, className, delay = 0 }: RevealProps) {
    const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

    return (
        <div
            ref={ref}
            style={{ transitionDelay: `${delay}ms` }}
            className={cn(
                'transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none',
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100',
                className,
            )}
        >
            {children}
        </div>
    );
}
