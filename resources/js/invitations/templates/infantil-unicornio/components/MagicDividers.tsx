/*
 * Little scenes that sit between the sections of the unicorn party: a hot-air balloon over drifting clouds, a small
 * rainbow that paints itself when it comes into view and a castle with waving flags and glowing windows. They move
 * on their own (motion.css; the rainbow through the shared components/floral/floral-art.css).
 */
import type { ReactNode } from 'react';
import { delayStyle, useArt } from '../../../components/floral/art';
import { Cloud, Star } from './Illustrations';

const RAINBOW = ['#f7a8d4', '#ffc9a8', '#ffe08a', '#a8e6cf', '#a8d8f7', '#c9a7f0'];
const OUTLINE = '#e3c4ef';

function Divider({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`flex justify-center px-6 pointer-events-none ${className}`} aria-hidden="true">
      <div className="relative">{children}</div>
    </div>
  );
}

/** A striped hot-air balloon floating over two drifting clouds. */
export function BalloonDivider({ className }: { className?: string }) {
  return (
    <Divider className={className}>
      <svg viewBox="0 0 120 160" className="unicornio-balloon mx-auto w-24 sm:w-28">
        <path d="M44 104 L50 122 M76 104 L70 122" stroke="#c8a2c8" strokeWidth="2" />
        <rect x="48" y="120" width="24" height="18" rx="4" fill="#f5c08f" stroke="#d99a66" strokeWidth="2.5" />
        <path d="M48 126 H72" stroke="#d99a66" strokeWidth="2" />
        <path d="M60 6 C26 6 12 34 16 60 C20 84 40 96 46 106 L74 106 C80 96 100 84 104 60 C108 34 94 6 60 6 Z" fill="#f7a8d4" />
        <path d="M60 6 C42 22 40 70 48 106 L72 106 C80 70 78 22 60 6 Z" fill="#c9a7f0" />
        <path d="M60 6 C54 30 54 76 56 106 L64 106 C66 76 66 30 60 6 Z" fill="#ffe08a" />
        <path d="M16 58 C40 66 80 66 104 58" stroke="#ffffff" strokeWidth="5" fill="none" opacity="0.7" />
        <path d="M60 6 C26 6 12 34 16 60 C20 84 40 96 46 106 L74 106 C80 96 100 84 104 60 C108 34 94 6 60 6 Z" fill="none" stroke={OUTLINE} strokeWidth="3" />
        <path d="M30 34 C34 24 40 18 48 14" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.8" />
      </svg>
      <Cloud className="unicornio-drift absolute drop-shadow-[0_4px_8px_rgba(111,58,156,0.15)] -bottom-2 -left-24 w-24 sm:-left-32 sm:w-28" />
      <Cloud className="unicornio-drift absolute drop-shadow-[0_4px_8px_rgba(111,58,156,0.15)] -right-20 bottom-8 w-20 [animation-delay:-3s] sm:-right-28 sm:w-24" />
    </Divider>
  );
}

/** A small rainbow that paints itself band by band when it scrolls into view, between twinkling stars. */
export function RainbowDivider({ className }: { className?: string }) {
  const { ref, artClass, artStyle } = useArt<SVGSVGElement>({});

  return (
    <Divider className={className}>
      <svg ref={ref} viewBox="0 0 240 110" className={`w-[min(260px,70vw)] h-auto ${artClass}`} style={artStyle}>
        {RAINBOW.map((color, index) => {
          const radius = 84 - index * 9;
          return (
            <path
              key={color}
              className="floral-stem"
              pathLength={1}
              style={delayStyle(0.15 + index * 0.15)}
              d={`M${120 - radius} 100 A${radius} ${radius} 0 0 1 ${120 + radius} 100`}
              fill="none"
              stroke={color}
              strokeWidth="9"
              strokeLinecap="round"
            />
          );
        })}
      </svg>
      <Cloud className="unicornio-drift absolute drop-shadow-[0_4px_8px_rgba(111,58,156,0.15)] -bottom-1 -left-6 w-20" />
      <Cloud className="unicornio-drift absolute drop-shadow-[0_4px_8px_rgba(111,58,156,0.15)] -right-6 -bottom-2 w-24 [animation-delay:-2.5s]" />
      <Star className="unicornio-twinkle absolute -top-1 -left-10 size-4 text-[#ffd36e]" />
      <Star className="unicornio-twinkle absolute top-6 -right-12 size-5 text-[#f7b9de] [animation-delay:-1.2s]" />
    </Divider>
  );
}

/** A fairy-tale castle whose flags wave and whose windows light up one after another. */
export function CastleDivider({ className }: { className?: string }) {
  const windows = [
    [47, 78], [153, 78], [88, 96], [112, 96],
  ];

  return (
    <Divider className={className}>
      <svg viewBox="0 0 200 150" className="w-[min(220px,60vw)] h-auto">
        {[
          [47, 14, '#ffe08a'],
          [153, 14, '#9fe0cf'],
          [100, 30, '#f7a8d4'],
        ].map(([x, y, color]) => (
          <g key={String(x)}>
            <path d={`M${x} ${Number(y) + 18} V${y}`} stroke="#c8a2c8" strokeWidth="2.5" strokeLinecap="round" />
            <path className="unicornio-wave" d={`M${x} ${y} L${Number(x) + 18} ${Number(y) + 4} L${x} ${Number(y) + 9} Z`} fill={String(color)} />
          </g>
        ))}
        <g stroke={OUTLINE} strokeWidth="3" strokeLinejoin="round">
          <rect x="64" y="66" width="72" height="76" fill="#fff4fb" />
          <path d="M64 66 V58 H74 V66 M84 66 V58 H94 V66 M106 66 V58 H116 V66 M126 66 V58 H136 V66" fill="#fff4fb" />
          <path d="M100 48 L72 66 L128 66 Z" fill="#c9a7f0" />
          <rect x="32" y="56" width="30" height="86" fill="#fff4fb" />
          <rect x="138" y="56" width="30" height="86" fill="#fff4fb" />
          <path d="M47 30 L28 58 L66 58 Z" fill="#f7a8d4" />
          <path d="M153 30 L134 58 L172 58 Z" fill="#f7a8d4" />
          <path d="M86 142 V118 C86 106 114 106 114 118 V142 Z" fill="#c9a7f0" />
        </g>
        {windows.map(([x, y], index) => (
          <rect
            key={`${x}-${y}`}
            className="unicornio-window"
            x={x - 5}
            y={y - 8}
            width="10"
            height="14"
            rx="5"
            fill="#ffe08a"
            style={{ animationDelay: `${index * 0.6}s` }}
          />
        ))}
        <path d="M14 142 H186" stroke={OUTLINE} strokeWidth="3" strokeLinecap="round" />
      </svg>
      <Star className="unicornio-twinkle absolute top-2 -left-8 size-5 text-[#ffd36e]" />
      <Star className="unicornio-twinkle absolute top-10 -right-8 size-4 text-[#c9a7f0] [animation-delay:-1s]" />
    </Divider>
  );
}
