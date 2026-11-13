import { Link } from '@inertiajs/react';
import logoHorizontal from '../../../assets/images/logo-horizontal.png';
import { Drip, Sprinkles } from './ui';

interface FooterProps {
  name: string;
  dateLabel: string;
  tagline: string | null;
}

export function Footer({ name, dateLabel, tagline }: FooterProps) {
  return (
    <footer className="bg-(--gold-deep) text-center text-white">
      <Drip color="var(--frosting)" />
      <div className="relative overflow-hidden px-5 pt-10 pb-28">
        <Sprinkles className="opacity-40" />
        <p className="relative font-pacifico text-[clamp(44px,8vw,72px)] leading-[1.3]">{name}</p>
        {dateLabel && <p className="relative mt-2 font-fredoka text-lg font-medium tabular-nums opacity-85">{dateLabel}</p>}
        <p className="relative mx-auto mt-3 max-w-sm text-pretty opacity-85">{tagline || '¡Gracias por endulzar este cumpleaños!'}</p>
        <p className="relative mt-10 text-sm opacity-75">Hecho con cariño en</p>
        <Link href="/" className="relative mx-auto mt-2 block w-fit">
          <img src={logoHorizontal} alt="Convite" className="h-7 opacity-70 brightness-0 invert" />
        </Link>
      </div>
    </footer>
  );
}
