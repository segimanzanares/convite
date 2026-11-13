import type { CSSProperties } from 'react';
import './motion.css';

/*
 * The unicorn party's own illustrations, drawn flat in pastels: a front-facing unicorn, a rainbow, clouds, a
 * bunting garland and a star. Their parts move on their own (motion.css): the unicorn twitches its ears, its curls
 * bounce and its horn shines, the rainbow paints itself band by band (once its hero turns `is-playing`) and the
 * pennants swing.
 */

const MANE = ['#f7a8d4', '#c9a7f0', '#9fe0cf', '#ffe08a', '#a8d8f7'];

export function Unicorn({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 220" className={className} aria-hidden="true">
      <path d="M100 10 L86 78 L114 78 Z" fill="#ffd36e" />
      <path d="M92 50 L108 44 M90 62 L111 55 M88 73 L113 66" stroke="#f0b33f" strokeWidth="4" strokeLinecap="round" />
      <g className="unicornio-ear-left">
        <path d="M52 52 L66 102 L88 84 Z" fill="#ffffff" stroke="#ead7f2" strokeWidth="3" strokeLinejoin="round" />
        <path d="M58 64 L68 94 L80 84 Z" fill="#f7b9de" />
      </g>
      <g className="unicornio-ear-right">
        <path d="M148 52 L134 102 L112 84 Z" fill="#ffffff" stroke="#ead7f2" strokeWidth="3" strokeLinejoin="round" />
        <path d="M142 64 L132 94 L120 84 Z" fill="#f7b9de" />
      </g>
      {[
        [62, 96, 18], [48, 118, 17], [44, 142, 16], [50, 166, 15], [80, 84, 15], [120, 84, 14],
      ].map(([cx, cy, r], index) => (
        <circle key={index} className="unicornio-curl" cx={cx} cy={cy} r={r} fill={MANE[index % MANE.length]} style={{ animationDelay: `${index * -0.35}s` }} />
      ))}
      <ellipse cx="104" cy="138" rx="54" ry="58" fill="#ffffff" stroke="#ead7f2" strokeWidth="3" />
      <ellipse cx="104" cy="176" rx="38" ry="25" fill="#ffd9ec" />
      <ellipse cx="91" cy="176" rx="4.5" ry="6" fill="#d67fb0" />
      <ellipse cx="117" cy="176" rx="4.5" ry="6" fill="#d67fb0" />
      <path d="M74 132 Q84 142 94 132" fill="none" stroke="#43255a" strokeWidth="4" strokeLinecap="round" />
      <path d="M114 132 Q124 142 134 132" fill="none" stroke="#43255a" strokeWidth="4" strokeLinecap="round" />
      <path d="M74 132 L69 127 M94 132 L99 127 M114 132 L109 127 M134 132 L139 127" stroke="#43255a" strokeWidth="3" strokeLinecap="round" />
      <circle className="unicornio-blush" cx="72" cy="152" r="8" fill="#f7a8d4" opacity="0.6" />
      <circle className="unicornio-blush" cx="136" cy="152" r="8" fill="#f7a8d4" opacity="0.6" />
      {[
        [70, 70, 14], [100, 80, 12], [58, 82, 11],
      ].map(([cx, cy, r], index) => (
        <circle key={index} className="unicornio-curl" cx={cx} cy={cy} r={r} fill={MANE[(index + 2) % MANE.length]} style={{ animationDelay: `${-2.1 - index * 0.35}s` }} />
      ))}
      <path
        className="unicornio-shine"
        d="M100 0 C 101 6, 102 7, 108 8 C 102 9, 101 10, 100 16 C 99 10, 98 9, 92 8 C 98 7, 99 6, 100 0 Z"
        fill="#ffffff"
      />
    </svg>
  );
}

const RAINBOW = ['#f7a8d4', '#ffc9a8', '#ffe08a', '#a8e6cf', '#a8d8f7', '#c9a7f0'];

export function Rainbow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 210" className={className} aria-hidden="true">
      {RAINBOW.map((color, index) => {
        const radius = 190 - index * 18;
        return (
          <path
            key={color}
            className="unicornio-band"
            pathLength={1}
            d={`M${200 - radius} 205 A${radius} ${radius} 0 0 1 ${200 + radius} 205`}
            fill="none"
            stroke={color}
            strokeWidth="18"
            style={{ animationDelay: `${0.3 + index * 0.18}s` }}
          />
        );
      })}
    </svg>
  );
}

export function Cloud({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 80" className={className} aria-hidden="true">
      <g fill="#ffffff">
        <circle cx="48" cy="48" r="26" />
        <circle cx="84" cy="36" r="32" />
        <circle cx="118" cy="50" r="22" />
        <rect x="24" y="48" width="118" height="26" rx="13" />
      </g>
    </svg>
  );
}

const FLAGS = ['#f7a8d4', '#c9a7f0', '#9fe0cf', '#ffe08a', '#a8d8f7'];

/** A string of pennants hanging across the top of the hero. */
export function Bunting({ className }: { className?: string }) {
  const count = 14;
  return (
    <svg viewBox="0 0 1400 90" preserveAspectRatio="none" overflow="visible" className={className} aria-hidden="true">
      <path d="M0 8 Q700 70 1400 8" fill="none" stroke="#c2549f" strokeWidth="2.5" opacity="0.6" />
      {Array.from({ length: count }, (_, index) => {
        const x = 40 + index * (1320 / (count - 1));
        const t = x / 1400;
        const y = 8 + 4 * 62 * t * (1 - t) * 1.0;
        return (
          <path
            key={index}
            className="unicornio-flag"
            d={`M${x - 26} ${y} L${x + 26} ${y} L${x} ${y + 52} Z`}
            fill={FLAGS[index % FLAGS.length]}
            style={{ animationDelay: `${index * -0.3}s` }}
          />
        );
      })}
    </svg>
  );
}

export function Star({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden="true">
      <path
        d="M12 2.5 L14.6 8.8 L21.4 9.3 L16.2 13.7 L17.8 20.3 L12 16.8 L6.2 20.3 L7.8 13.7 L2.6 9.3 L9.4 8.8 Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
