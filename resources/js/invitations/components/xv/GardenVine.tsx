import { type ArtProps, delayStyle, useArt } from '../floral/art';

interface GardenVineProps extends ArtProps {
  /** Mirror horizontally, so one drawing serves both top corners. */
  flip?: boolean;
}

const MAIN_LEAVES = [
  'M40 14 C52 2 70 4 76 12 C64 20 50 22 40 14Z',
  'M78 34 C94 26 108 32 110 42 C96 46 84 44 78 34Z',
  'M102 62 C92 48 94 32 102 28 C110 40 110 54 102 62Z',
  'M116 102 C132 96 144 104 144 114 C130 116 120 112 116 102Z',
  'M112 132 C98 124 92 110 96 102 C108 110 114 120 112 132Z',
  'M124 170 C140 166 150 176 148 186 C134 186 126 180 124 170Z',
  'M134 206 C120 202 112 190 114 182 C126 186 134 196 134 206Z',
  'M156 236 C170 230 182 238 182 248 C168 250 160 244 156 236Z',
];

const SIDE_LEAVES = [
  'M20 34 C10 26 10 16 16 12 C22 20 24 28 20 34Z',
  'M30 50 C38 38 52 38 56 46 C46 54 36 56 30 50Z',
  'M58 86 C70 80 80 88 78 96 C68 98 60 94 58 86Z',
  'M56 120 C44 114 40 102 44 96 C54 102 58 110 56 120Z',
  'M60 150 C72 146 80 154 78 162 C68 164 62 158 60 150Z',
];

/** The blossoms, with the delay after which each one opens (they follow the stems down). */
const BLOSSOMS: [number, number, number][] = [
  [92, 22, 0.7],
  [22, 72, 1],
  [130, 140, 1.4],
  [64, 178, 1.6],
  [178, 252, 2],
];

/**
 * A hanging vine with leaves and small blossoms, drawn as line art so it picks up the theme colors: leaves use
 * --gold-deep (forest green in the XV theme) and blossoms use --gold. When it comes into view (or once `play` turns
 * true) the stems grow down from the corner, the leaves sprout along them and the blossoms open; then the whole
 * vine sways from its corner (floral/floral-art.css).
 */
export function GardenVine({ className = '', flip = false, ...art }: GardenVineProps) {
  const { ref, artClass, artStyle } = useArt<SVGSVGElement>(art);

  return (
    <svg
      ref={ref}
      viewBox="0 0 220 260"
      fill="none"
      className={`${className} ${artClass}`}
      style={{ ...artStyle, ...(flip ? { transform: 'scaleX(-1)' } : {}) }}
      aria-hidden="true"
    >
      <g className="floral-sway">
        <g stroke="var(--color-gold-deep)" strokeWidth="1.1" strokeLinecap="round" opacity="0.75">
          {/* main stem */}
          <path className="floral-stem" pathLength={1} style={delayStyle(0)} d="M0 8 C60 14 96 40 112 86 C126 128 118 176 140 214 C150 232 164 244 178 252" />
          {/* secondary stems */}
          <path className="floral-stem" pathLength={1} style={delayStyle(0.2)} d="M0 40 C34 46 52 66 58 98 C64 128 56 150 64 176" />
          <path className="floral-stem" pathLength={1} style={delayStyle(0.35)} d="M30 10 C34 30 30 52 22 70" />
        </g>
        <g fill="var(--color-gold-deep)" opacity="0.55">
          {MAIN_LEAVES.map((leaf, index) => (
            <path key={leaf} className="floral-pop" style={delayStyle(0.3 + index * 0.2)} d={leaf} />
          ))}
          {SIDE_LEAVES.map((leaf, index) => (
            <path key={leaf} className="floral-pop" style={delayStyle(0.4 + index * 0.22)} d={leaf} />
          ))}
        </g>
        <g stroke="var(--color-gold)" strokeWidth="0.9" fill="var(--color-ivory)">
          {/* five-petal blossoms */}
          {BLOSSOMS.map(([cx, cy, delay]) => (
            <g key={`${cx}-${cy}`} transform={`translate(${cx} ${cy})`}>
              <g className="floral-bloom" style={delayStyle(delay)}>
                {[0, 72, 144, 216, 288].map((angle) => (
                  <ellipse key={angle} cx="0" cy="-4.5" rx="2.6" ry="4.2" transform={`rotate(${angle})`} />
                ))}
                <circle r="1.6" fill="var(--color-gold)" stroke="none" />
              </g>
            </g>
          ))}
        </g>
        <g fill="var(--color-gold)" opacity="0.7">
          {[
            [146, 96, 1.6, 1.1],
            [88, 58, 1.2, 0.9],
            [160, 200, 1.4, 1.8],
            [44, 140, 1.2, 1.3],
          ].map(([cx, cy, r, delay]) => (
            <circle key={`${cx}-${cy}`} className="floral-pop" style={delayStyle(delay)} cx={cx} cy={cy} r={r} />
          ))}
        </g>
      </g>
    </svg>
  );
}
