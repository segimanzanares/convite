interface IconProps {
  className?: string;
}

export function SuitIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M17 7 10 10 6 16l2 26h32l2-26-4-6-7-3" />
      <path d="M17 7l-3 9 5 3 5 5 5-5 5-3-3-9" />
      <path d="M21 7l3 5 3-5" />
      <path d="M24 12l-1.5 9 1.5 2 1.5-2z" />
      <path d="M24 24v18" />
      <circle cx="26.5" cy="30" r=".6" fill="currentColor" />
      <circle cx="26.5" cy="35" r=".6" fill="currentColor" />
      <path d="M11 30h5" />
    </svg>
  );
}

export function DressIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M19 4v8M29 4v8" />
      <path d="M19 12q5 4 10 0l-1 10h-8z" />
      <path d="M20 22 9 44h30L28 22" />
      <path d="M20 22q4 2 8 0" />
      <path d="M19 30l-4 14M29 30l4 14M24 28v16" opacity=".55" />
    </svg>
  );
}
