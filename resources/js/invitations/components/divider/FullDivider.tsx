interface FullDividerProps {
  text: string;
}

export function FullDivider({ text }: FullDividerProps) {
  return (
    <div className="bg-[linear-gradient(to_bottom,var(--card),var(--surface),var(--card))] py-20 px-10 text-center border-t border-b border-(--primary)/15">
      <span className="font-script text-[clamp(60px,10vw,100px)] text-(--primary) leading-none block pointer-events-none my-[-20px]">
        {text}
      </span>
    </div>
  );
}
