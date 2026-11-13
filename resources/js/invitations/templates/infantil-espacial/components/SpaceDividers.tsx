/*
 * Little space scenes that sit between the sections of the space party: a satellite going round its orbit, a UFO
 * beaming up a present and a small rocket lifting off. They move on their own (motion.css).
 */
import type { ReactNode } from 'react';
import { Rocket } from './Illustrations';

function Divider({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`flex justify-center px-6 pointer-events-none ${className}`} aria-hidden="true">
      {children}
    </div>
  );
}

/** A dotted orbit from a little planet to a star, with a satellite travelling along it. */
export function OrbitDivider({ className }: { className?: string }) {
  return (
    <Divider className={className}>
      <svg viewBox="0 0 300 80" className="w-[min(380px,86vw)] h-auto">
        <path d="M14 60 Q150 10 286 60" fill="none" stroke="#c9d1ff" strokeWidth="2.5" strokeDasharray="2 8" strokeLinecap="round" />
        <circle cx="18" cy="60" r="12" fill="#8b7cf6" />
        <path d="M8 56 Q18 52 28 56" stroke="#a99cff" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="282" cy="60" r="9" fill="#ffc36b" />
        <circle cx="282" cy="60" r="14" fill="#ffc36b" opacity="0.25" className="espacial-pulse" />
        <g className="espacial-satellite">
          <g transform="rotate(-12)">
            <rect x="-24" y="-6" width="16" height="12" rx="1.5" fill="#5b8def" stroke="#2c2f91" strokeWidth="2" />
            <rect x="8" y="-6" width="16" height="12" rx="1.5" fill="#5b8def" stroke="#2c2f91" strokeWidth="2" />
            <path d="M-16 -6 V6 M16 -6 V6 M-8 0 H8" stroke="#2c2f91" strokeWidth="1.5" />
            <rect x="-7" y="-8" width="14" height="16" rx="3" fill="#f4f6ff" stroke="#2c2f91" strokeWidth="2" />
            <path d="M0 -8 L0 -15" stroke="#2c2f91" strokeWidth="2" strokeLinecap="round" />
            <circle className="espacial-blink" cx="0" cy="-16" r="2.5" fill="#ec6a2c" />
          </g>
        </g>
        <g transform="translate(96 18)">
          <path
            className="espacial-twinkle"
            d="M0 -9 C1 -1 1 -1 9 0 C1 1 1 1 0 9 C-1 1 -1 1 -9 0 C-1 -1 -1 -1 0 -9 Z"
            fill="#ffc36b"
          />
        </g>
      </svg>
    </Divider>
  );
}

/** A flying saucer whose tractor beam lifts a present up and lets it down again. */
export function UfoDivider({ className }: { className?: string }) {
  return (
    <Divider className={className}>
      <svg viewBox="0 0 200 160" className="w-[min(200px,52vw)] h-auto">
        <defs>
          <linearGradient id="espacial-beam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffe9a8" stopOpacity="0.9" />
            <stop offset="1" stopColor="#ffe9a8" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <ellipse cx="100" cy="152" rx="46" ry="6" fill="#2c2f91" opacity="0.12" />
        <path className="espacial-beam" d="M86 56 L114 56 L146 150 L54 150 Z" fill="url(#espacial-beam)" />
        <g className="espacial-lift">
          <rect x="88" y="118" width="24" height="20" rx="3" fill="#ec6a2c" stroke="#2c2f91" strokeWidth="2.5" />
          <path d="M100 118 V138 M88 126 H112" stroke="#ffc36b" strokeWidth="3" />
          <path d="M100 118 C94 110 88 114 92 118 M100 118 C106 110 112 114 108 118" fill="none" stroke="#ffc36b" strokeWidth="2.5" />
        </g>
        <g className="espacial-hover">
          <path d="M76 38 C76 14 124 14 124 38 Z" fill="#a8e6ff" stroke="#2c2f91" strokeWidth="3" opacity="0.95" />
          <path d="M88 24 C92 20 98 19 102 20" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none" />
          <ellipse cx="100" cy="44" rx="58" ry="15" fill="#8b7cf6" stroke="#2c2f91" strokeWidth="3" />
          <ellipse cx="100" cy="40" rx="40" ry="7" fill="#a99cff" />
          {[56, 78, 100, 122, 144].map((cx, index) => (
            <circle key={cx} className="espacial-blink" cx={cx} cy="48" r="4" fill="#ffc36b" style={{ animationDelay: `${index * 0.25}s` }} />
          ))}
        </g>
      </svg>
    </Divider>
  );
}

/** A small rocket lifting off from a puff of smoke. */
export function LaunchDivider({ className }: { className?: string }) {
  return (
    <Divider className={className}>
      <div className="relative h-36 w-40">
        <svg viewBox="0 0 160 40" className="absolute inset-x-0 bottom-0 h-auto w-full">
          {[
            [44, 26, 16],
            [80, 22, 20],
            [116, 26, 16],
          ].map(([cx, cy, r], index) => (
            <circle key={cx} className="espacial-cloud" cx={cx} cy={cy} r={r} fill="#dfe4fb" style={{ animationDelay: `${index * -0.4}s` }} />
          ))}
        </svg>
        <Rocket className="espacial-launch absolute bottom-4 left-[calc(50%-20px)] w-10" />
      </div>
    </Divider>
  );
}
