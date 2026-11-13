import { useEffect, useState } from 'react';
import { buttonClass, cn } from '../../../components/ui/styles';
import { Ampersand } from './ui';

export interface NavLink {
  href: string;
  label: string;
}

interface TopNavProps {
  names: [string, string];
  links: NavLink[];
}

/**
 * A sticky shadcn/ui-style navbar that slides in once the hero is behind: the couple's initials, a link per section
 * the invitation has (scrollable on phones) and the RSVP button.
 */
export function TopNav({ names, links }: TopNavProps) {
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
        'fixed inset-x-0 top-0 z-[900] border-b border-(--border) bg-(--background)/85 backdrop-blur-md transition-transform duration-300',
        isVisible ? 'translate-y-0' : '-translate-y-full',
      )}
    >
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-4 px-5 sm:px-8">
        <a href="#inicio" className="shrink-0 font-fraunces text-lg font-medium tracking-tight no-underline" aria-label="Volver al inicio">
          {names[0].charAt(0)}
          <Ampersand className="mx-0.5 text-(--primary)" />
          {names[1].charAt(0)}
        </a>
        <div className="-mx-1 flex min-w-0 flex-1 gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="shrink-0 rounded-full px-3 py-1.5 text-sm font-medium text-(--muted-foreground) no-underline transition-colors hover:bg-(--accent) hover:text-(--accent-foreground)"
            >
              {link.label}
            </a>
          ))}
        </div>
        <a href="#rsvp" className={buttonClass('default', 'sm', 'shrink-0 rounded-full')}>
          Confirmar
        </a>
      </div>
    </nav>
  );
}
