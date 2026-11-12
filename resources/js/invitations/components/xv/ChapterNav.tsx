import { useEffect, useState } from 'react';
import { scrollToHash } from '../../utils/scrollToHash';

export interface ChapterLink {
  /** In-page anchor, e.g. "#historia". */
  href: string;
  label: string;
}

interface ChapterNavProps {
  monogram: string;
  links: ChapterLink[];
}

/** Slim top bar with chapter links; slides in once the visitor scrolls past the hero. */
export function ChapterNav({ monogram, links }: ChapterNavProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const update = () => setIsVisible(window.scrollY > window.innerHeight * 0.75);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <nav
      aria-label="Secciones de la invitación"
      className={[
        'fixed top-0 inset-x-0 z-[1100] transition-[transform,opacity] duration-500',
        'bg-[color-mix(in_srgb,var(--dark-from)_88%,transparent)] backdrop-blur-md border-b border-gold/25',
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none',
      ].join(' ')}
    >
      <div className="max-w-[1000px] mx-auto flex items-center gap-4 h-12 pl-5 pr-2 sm:px-6">
        <a
          href="#inicio"
          onClick={scrollToHash}
          className="font-script text-[26px] leading-none text-gold-light shrink-0"
          aria-label="Volver al inicio"
        >
          {monogram}
        </a>
        <span className="h-5 w-px bg-gold/30 shrink-0" aria-hidden="true" />
        <ul className="flex items-center gap-5 sm:gap-7 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:ml-auto pr-3">
          {links.map((link) => (
            <li key={link.href} className="shrink-0">
              <a
                href={link.href}
                onClick={scrollToHash}
                tabIndex={isVisible ? undefined : -1}
                className="font-display text-[9px] tracking-[0.3em] uppercase text-gold-light/85 hover:text-gold-light transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
