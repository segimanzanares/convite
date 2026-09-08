import logoHorizontal from '../../assets/images/logo-horizontal.svg';

export function Footer() {
  return (
    <footer className="text-center py-[60px] px-8 bg-ivory">
      <img src={logoHorizontal} alt="Convite — Invitaciones digitales" className="h-9 mx-auto mb-5" />
      <p className="font-jost text-[9px] tracking-[0.5em] text-gold uppercase">Invitaciones digitales a medida</p>
      <div className="w-[120px] h-px mx-auto bg-[linear-gradient(to_right,transparent,var(--color-gold),transparent)] mt-[30px]" />
    </footer>
  );
}
