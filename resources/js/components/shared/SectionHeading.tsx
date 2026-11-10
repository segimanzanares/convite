interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  tone?: 'light' | 'dark';
}

export function SectionHeading({ eyebrow, title, tone = 'light' }: SectionHeadingProps) {
  const labelColor = tone === 'dark' ? 'text-gold-light' : 'text-gold';
  const titleColor = tone === 'dark' ? 'text-gold-light' : 'text-gold-deep';
  const ruleOpacity = tone === 'dark' ? 'opacity-40' : '';

  return (
    <>
      <p className={`font-display text-[10px] tracking-[0.6em] uppercase mb-4 ${labelColor}`}>{eyebrow}</p>
      <h2 className={`font-script text-[clamp(42px,6vw,64px)] leading-[1.2] mb-4 ${titleColor}`}>{title}</h2>
      <div
        className={`flex items-center justify-center gap-3 my-6 mx-auto before:content-[''] before:flex-1 before:max-w-[100px] before:h-px before:bg-[linear-gradient(to_right,transparent,var(--color-gold))] after:content-[''] after:flex-1 after:max-w-[100px] after:h-px after:bg-[linear-gradient(to_left,transparent,var(--color-gold))] ${ruleOpacity}`}
      >
        <div className="w-1.5 h-1.5 bg-gold rotate-45" />
      </div>
    </>
  );
}
