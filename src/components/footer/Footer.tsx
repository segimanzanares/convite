import logoHorizontal from '../../assets/images/logo-horizontal.png';
import { NavLink } from 'react-router-dom';

interface FooterProps {
  title: string;
  dateLabel: string;
  tagline?: string;
}

export function Footer({ title, dateLabel, tagline = 'Con amor eterno · Para siempre' }: FooterProps) {
  return (
    <footer className="text-center py-[60px] px-10 bg-ivory">
      <div className="flex items-center justify-center gap-3 mx-auto mb-[30px] before:content-[''] before:flex-1 before:max-w-[100px] before:h-px before:bg-[linear-gradient(to_right,transparent,var(--color-gold))] after:content-[''] after:flex-1 after:max-w-[100px] after:h-px after:bg-[linear-gradient(to_left,transparent,var(--color-gold))]">
        <div className="w-1.5 h-1.5 bg-gold rotate-45" />
      </div>
      <p className="font-script text-[44px] text-gold">
        {title}
      </p>
      <div className="font-display text-[10px] tracking-[0.4em] text-gold mt-2.5">{dateLabel}</div>
      <div className="w-[120px] h-px mx-auto bg-[linear-gradient(to_right,transparent,var(--color-gold),transparent)] animate-[fadeUp_1.2s_0.5s_forwards] mt-[30px]" />
      <p className="font-display text-[9px] tracking-[0.5em] text-gold uppercase mt-3">{tagline}</p>
      <p className="font-display text-[8px] tracking-[0.3em] text-gold/70 uppercase mt-[30px] mb-2">Invitación creada con</p>
      <NavLink to="/" className="block w-fit mx-auto" end>
        <img src={logoHorizontal} alt="Logo" className="h-8 opacity-50" />
      </NavLink>
    </footer>
  );
}
