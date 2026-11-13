import { Link } from '@inertiajs/react';
import logoHorizontal from '../../../assets/images/logo-horizontal.png';

interface FooterProps {
  name: string;
  initials: string;
  dateLabel: string;
  tagline: string | null;
}

export function Footer({ name, initials, dateLabel, tagline }: FooterProps) {
  return (
    <footer className="ui-dark px-5 pt-20 pb-28 text-center">
      <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--primary),var(--confetti-lilac))] font-dm-serif text-2xl text-(--primary-foreground)">
        {initials}
      </span>
      <p className="mt-6 font-dm-serif text-5xl">{name}</p>
      {dateLabel && (
        <p className="mt-3 text-sm tracking-[0.2em] text-(--muted-foreground) tabular-nums">
          {dateLabel}
        </p>
      )}
      <p className="mx-auto mt-6 max-w-sm text-sm text-pretty text-(--muted-foreground)">
        {tagline || 'Gracias por ser parte de este cumpleaños tan especial.'}
      </p>
      <div className="mx-auto mt-12 h-px max-w-xs bg-(--border)" />
      <p className="mt-6 text-xs text-(--muted-foreground)">Hecho con cariño en</p>
      <Link href="/" className="mx-auto mt-2 block w-fit">
        <img src={logoHorizontal} alt="Convite" className="h-7 opacity-60 brightness-0 invert" />
      </Link>
    </footer>
  );
}
