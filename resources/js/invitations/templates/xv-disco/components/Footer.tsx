import { Link } from '@inertiajs/react';
import logoHorizontal from '../../../assets/images/logo-horizontal.png';
import { Equalizer } from './DiscoArt';

interface FooterProps {
  name: string;
  dateLabel: string;
  tagline: string | null;
}

export function Footer({ name, dateLabel, tagline }: FooterProps) {
  return (
    <footer className="border-t border-(--border) bg-(--surface) px-5 pt-16 pb-28 text-center">
      <Equalizer bars={14} className="h-8 opacity-80" />
      <p className="mt-6 font-unbounded text-[clamp(28px,6vw,44px)] font-semibold">{name}</p>
      {dateLabel && <p className="mt-3 text-sm tracking-[0.3em] text-(--muted-foreground) tabular-nums">{dateLabel}</p>}
      <p className="mx-auto mt-6 max-w-sm text-sm text-pretty text-(--muted-foreground)">{tagline || 'Gracias por bailar conmigo mis quince.'}</p>
      <div className="mx-auto mt-12 h-px max-w-xs bg-(--border)" />
      <p className="mt-6 text-xs text-(--muted-foreground)">Hecho con cariño en</p>
      <Link href="/" className="mx-auto mt-2 block w-fit">
        <img src={logoHorizontal} alt="Convite" className="h-7 opacity-60 brightness-0 invert" />
      </Link>
    </footer>
  );
}
