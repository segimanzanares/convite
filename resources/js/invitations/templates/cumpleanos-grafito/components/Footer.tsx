import { Link } from '@inertiajs/react';
import logoHorizontal from '../../../assets/images/logo-horizontal.png';

interface FooterProps {
  name: string;
  dateLabel: string;
  tagline: string | null;
}

export function Footer({ name, dateLabel, tagline }: FooterProps) {
  return (
    <footer className="border-t border-(--border) bg-(--surface) px-5 pt-20 pb-28 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="font-space-grotesk text-[clamp(44px,9vw,96px)] leading-[0.9] font-bold tracking-tighter">{name}</p>
        <div className="mt-8 flex flex-col gap-6 border-t border-(--border) pt-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-geist-mono text-sm text-(--primary)">
              {dateLabel}
            </p>
            <p className="mt-2 max-w-sm text-sm text-pretty text-(--muted-foreground)">
              {tagline || 'Gracias por estar. Nos vemos en la fiesta.'}
            </p>
          </div>
          <Link href="/" className="flex items-center gap-2 text-xs text-(--muted-foreground)">
            Hecho en
            <img src={logoHorizontal} alt="Convite" className="h-6 opacity-60 brightness-0 invert" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
