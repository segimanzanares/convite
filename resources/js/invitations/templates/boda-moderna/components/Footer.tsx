import { Link } from '@inertiajs/react';
import logoHorizontal from '../../../assets/images/logo-horizontal.png';
import { Ampersand } from './ui';

interface FooterProps {
  names: [string, string];
  dateLabel: string;
  tagline: string | null;
}

export function Footer({ names, dateLabel, tagline }: FooterProps) {
  return (
    <footer className="ui-dark border-t border-(--border) px-5 pt-16 pb-24 text-center">
      <p className="text-3xl font-semibold tracking-tight">
        {names[0]} <Ampersand /> {names[1]}
      </p>
      {dateLabel && <p className="mt-2 font-geist-mono text-sm text-(--muted-foreground)">{dateLabel}</p>}
      <p className="mt-6 text-sm text-(--muted-foreground)">{tagline || 'Gracias por ser parte de nuestra historia.'}</p>
      <div className="mx-auto mt-12 h-px max-w-xs bg-(--border)" />
      <p className="mt-6 text-xs text-(--muted-foreground)">Invitación creada con</p>
      <Link href="/" className="mx-auto mt-2 block w-fit">
        <img src={logoHorizontal} alt="Convite" className="h-7 opacity-60 brightness-0 invert" />
      </Link>
    </footer>
  );
}
