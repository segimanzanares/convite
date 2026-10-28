interface IconProps {
  className?: string;
}

export function BankIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M6 16 24 6l18 10z" />
      <path d="M8 16h32v3H8z" />
      <path d="M11 19v16M37 19v16M16 19v16M32 19v16" />
      <path d="M7 35h34v3H7zM5 38h38v4H5z" />
      <circle cx="24" cy="27" r="5" />
      <path d="M25.5 25h-2a1 1 0 0 0 0 2h1a1 1 0 0 1 0 2h-2M24 24v1M24 29v1" />
    </svg>
  );
}

export function GiftBoxIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M7 16h34v7H7zM10 23h28v19H10z" />
      <path d="M24 16v26" />
      <path d="M24 16c-3-6-11-8-11-3s8 3 11 3c3 0 11 2 11-3s-8-3-11 3" />
    </svg>
  );
}

export function EnvelopeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M6 12h36v26H6z" />
      <path d="m6 12 18 15 18-15" />
      <path d="m6 38 13-14M42 38 29 24" opacity=".55" />
    </svg>
  );
}

