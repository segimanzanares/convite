interface FullDividerProps {
  text: string;
}

export function FullDivider({ text }: FullDividerProps) {
  return (
    <div className="bg-[linear-gradient(to_bottom,var(--color-ivory),var(--color-cream),var(--color-ivory))] py-20 px-10 text-center border-t border-b border-gold/15">
      <span className="font-script text-[clamp(60px,10vw,100px)] text-gold leading-none block pointer-events-none my-[-20px]">
        {text}
      </span>
    </div>
  );
}
