import { Link } from '@inertiajs/react';
import logoHorizontal from '../../../assets/images/logo-horizontal.png';
import { Footprint, Hills } from './Illustrations';

interface FooterProps {
  name: string;
  dateLabel: string;
  tagline: string | null;
}

export function Footer({ name, dateLabel, tagline }: FooterProps) {
  return (
    <footer className="relative bg-[#5cb85c] pb-28 text-center">
      <Hills className="relative -mb-px h-24 w-full bg-(--accent) sm:h-32" />
      <div className="px-5 pt-6">
        <div className="dino-steps flex justify-center gap-3 text-(--foreground)/35" aria-hidden="true">
          <Footprint className="size-7 -rotate-12" />
          <Footprint className="size-7 translate-y-3 rotate-12" />
          <Footprint className="size-7 -rotate-12" />
        </div>
        <p className="mt-6 text-[clamp(40px,7vw,64px)] leading-none font-extrabold text-white [text-shadow:3px_3px_0_var(--foreground)]">{name}</p>
        {dateLabel && <p className="mt-3 text-lg font-bold tabular-nums">{dateLabel}</p>}
        <p className="mx-auto mt-3 max-w-sm text-base font-semibold text-pretty">{tagline || '¡Gracias por venir a la fiesta jurásica!'}</p>
        <p className="mt-10 text-sm font-semibold">Hecho con cariño en</p>
        <Link href="/" className="mx-auto mt-2 block w-fit">
          <img src={logoHorizontal} alt="Convite" className="h-7 opacity-70 brightness-0" />
        </Link>
      </div>
    </footer>
  );
}
