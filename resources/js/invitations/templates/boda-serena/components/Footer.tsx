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
    <footer className="ui-dark px-5 pt-20 pb-28 text-center">
      <span className="mx-auto flex size-16 items-center justify-center rounded-full border border-(--border) font-fraunces text-2xl font-medium">
        {names[0].charAt(0)}
        <Ampersand className="mx-0.5 text-lg text-(--primary)" />
        {names[1].charAt(0)}
      </span>
      <p className="mt-6 font-fraunces text-4xl font-medium tracking-tight">
        {names[0]} <Ampersand className="text-(--primary)" /> {names[1]}
      </p>
      {dateLabel && <p className="mt-3 text-sm tracking-[0.2em] text-(--muted-foreground) tabular-nums">{dateLabel}</p>}
      <p className="mx-auto mt-6 max-w-sm text-sm text-pretty text-(--muted-foreground)">
        {tagline || 'Gracias por ser parte del comienzo de nuestra historia.'}
      </p>
      <div className="mx-auto mt-12 h-px max-w-xs bg-(--border)" />
      <p className="mt-6 text-xs text-(--muted-foreground)">Hecho con cariño en</p>
      <Link href="/" className="mx-auto mt-2 block w-fit">
        <img src={logoHorizontal} alt="Convite" className="h-7 opacity-60 brightness-0 invert" />
      </Link>
    </footer>
  );
}
