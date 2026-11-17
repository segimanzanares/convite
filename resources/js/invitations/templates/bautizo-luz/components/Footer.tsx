import { Link } from '@inertiajs/react';
import logoHorizontal from '../../../assets/images/logo-horizontal.png';

interface FooterProps {
  name: string;
  monogram: string;
  dateLabel: string;
  tagline: string | null;
}

/** The monogram in an arch, the name and the date, at night. */
export function Footer({ name, monogram, dateLabel, tagline }: FooterProps) {
  return (
    <footer className="ui-dark border-t border-(--border) px-5 pt-20 pb-28 text-center">
      <span className="mx-auto flex h-20 w-16 items-center justify-center rounded-t-full border border-(--primary)/60 font-newsreader text-2xl text-(--primary) italic">
        {monogram}
      </span>
      <p className="mt-6 font-newsreader text-5xl font-light italic">{name}</p>
      {dateLabel && <p className="mt-3 text-sm tracking-[0.3em] text-(--muted-foreground) tabular-nums">{dateLabel}</p>}
      <p className="mx-auto mt-6 max-w-sm text-sm text-pretty text-(--muted-foreground)">{tagline || 'Gracias por ser parte de mi primer paso en la fe.'}</p>
      <div className="mx-auto mt-12 h-px max-w-xs bg-(--border)" />
      <p className="mt-6 text-xs text-(--muted-foreground)">Hecho con cariño en</p>
      <Link href="/" className="mx-auto mt-2 block w-fit">
        <img src={logoHorizontal} alt="Convite" className="h-7 opacity-60 brightness-0 invert" />
      </Link>
    </footer>
  );
}
