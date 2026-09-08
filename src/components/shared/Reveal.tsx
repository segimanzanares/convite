import type { ReactNode } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

interface RevealProps {
  children: ReactNode;
  className?: string;
}

export function Reveal({ children, className }: RevealProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();
  const classes = [
    'transition-[opacity,transform] duration-[0.9s] ease',
    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={ref} className={classes}>
      {children}
    </div>
  );
}
