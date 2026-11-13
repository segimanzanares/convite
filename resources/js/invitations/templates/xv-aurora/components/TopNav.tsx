import { useEffect, useState } from 'react';
import { buttonClass, cn } from '../../../components/ui/styles';
import { scrollToHash } from '../../../utils/scrollToHash';

export interface NavLink {
  href: string;
  label: string;
}

interface TopNavProps {
  monogram: string;
  links: NavLink[];
}

/**
 * A floating shadcn/ui-style navbar that drops in once the hero is behind: the monogram, the sections as a tabs list
 * (scrollable on phones) and the RSVP button.
 */
export function TopNav({ monogram, links }: TopNavProps) {
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
      className={cn(
        'fixed inset-x-3 top-3 z-[900] transition-[transform,opacity] duration-300 sm:inset-x-0',
        isVisible ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-[150%] opacity-0',
      )}
    >
      <div className="mx-auto flex h-14 max-w-3xl items-center gap-3 rounded-full border border-(--border) bg-(--card)/85 pr-2 pl-2 shadow-lg backdrop-blur-md">
        <a
          href="#inicio"
          onClick={scrollToHash}
          tabIndex={isVisible ? undefined : -1}
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--primary),var(--aurora-pink))] font-bodoni text-sm text-(--primary-foreground) italic no-underline"
          aria-label="Volver al inicio"
        >
          {monogram}
        </a>
        <div className="flex min-w-0 flex-1 gap-0.5 overflow-x-auto rounded-full bg-(--muted) p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={scrollToHash}
              tabIndex={isVisible ? undefined : -1}
              className="shrink-0 rounded-full px-3 py-1.5 text-sm font-medium text-(--muted-foreground) no-underline transition-colors hover:bg-(--card) hover:text-(--foreground) hover:shadow-sm"
            >
              {link.label}
            </a>
          ))}
        </div>
        <a href="#confirmar" onClick={scrollToHash} tabIndex={isVisible ? undefined : -1} className={buttonClass('default', 'sm', 'shrink-0 rounded-full')}>
          Confirmar
        </a>
      </div>
    </nav>
  );
}
