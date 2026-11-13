import { Link } from '@inertiajs/react';
import logoHorizontal from '../../../assets/images/logo-horizontal.png';

interface FooterProps {
  name: string;
  monogram: string;
  dateLabel: string;
  tagline: string | null;
}

export function Footer({ name, monogram, dateLabel, tagline }: FooterProps) {
  return (
    <footer className="ui-dark px-5 pt-20 pb-28 text-center">
      <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--aurora-violet),var(--aurora-pink))] font-bodoni text-2xl text-(--primary-foreground) italic">
        {monogram}
      </span>
      <p className="mt-6 font-bodoni text-5xl italic">{name}</p>
      {dateLabel && <p className="mt-3 text-sm tracking-[0.25em] text-(--muted-foreground) tabular-nums">{dateLabel}</p>}
      <p className="mx-auto mt-6 max-w-sm text-sm text-pretty text-(--muted-foreground)">{tagline || 'Gracias por ser parte de mis quince.'}</p>
      <div className="mx-auto mt-12 h-px max-w-xs bg-(--border)" />
      <p className="mt-6 text-xs text-(--muted-foreground)">Hecho con cariño en</p>
      <Link href="/" className="mx-auto mt-2 block w-fit">
        <img src={logoHorizontal} alt="Convite" className="h-7 opacity-60 brightness-0 invert" />
      </Link>
    </footer>
  );
}
