interface GardenVineProps {
  className?: string;
  /** Mirror horizontally, so one drawing serves both top corners. */
  flip?: boolean;
}

/**
 * A hanging vine with leaves and small blossoms, drawn as line art so it
 * picks up the theme colors: leaves use --gold-deep (forest green in the XV
 * theme) and blossoms use --gold.
 */
export function GardenVine({ className = '', flip = false }: GardenVineProps) {
  return (
    <svg
      viewBox="0 0 220 260"
      fill="none"
      className={className}
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
      aria-hidden="true"
    >
      <g stroke="var(--color-gold-deep)" strokeWidth="1.1" strokeLinecap="round" opacity="0.75">
        {/* main stem */}
        <path d="M0 8 C60 14 96 40 112 86 C126 128 118 176 140 214 C150 232 164 244 178 252" />
        {/* secondary stem */}
        <path d="M0 40 C34 46 52 66 58 98 C64 128 56 150 64 176" />
        <path d="M30 10 C34 30 30 52 22 70" />
      </g>
      <g fill="var(--color-gold-deep)" opacity="0.55">
        {/* leaves along the main stem */}
        <path d="M40 14 C52 2 70 4 76 12 C64 20 50 22 40 14Z" />
        <path d="M78 34 C94 26 108 32 110 42 C96 46 84 44 78 34Z" />
        <path d="M102 62 C92 48 94 32 102 28 C110 40 110 54 102 62Z" />
        <path d="M116 102 C132 96 144 104 144 114 C130 116 120 112 116 102Z" />
        <path d="M112 132 C98 124 92 110 96 102 C108 110 114 120 112 132Z" />
        <path d="M124 170 C140 166 150 176 148 186 C134 186 126 180 124 170Z" />
        <path d="M134 206 C120 202 112 190 114 182 C126 186 134 196 134 206Z" />
        <path d="M156 236 C170 230 182 238 182 248 C168 250 160 244 156 236Z" />
        {/* leaves along the secondary stem */}
        <path d="M30 50 C38 38 52 38 56 46 C46 54 36 56 30 50Z" />
        <path d="M58 86 C70 80 80 88 78 96 C68 98 60 94 58 86Z" />
        <path d="M56 120 C44 114 40 102 44 96 C54 102 58 110 56 120Z" />
        <path d="M60 150 C72 146 80 154 78 162 C68 164 62 158 60 150Z" />
        <path d="M20 34 C10 26 10 16 16 12 C22 20 24 28 20 34Z" />
      </g>
      <g stroke="var(--color-gold)" strokeWidth="0.9" fill="var(--color-ivory)">
        {/* five-petal blossoms */}
        {[
          [92, 22],
          [130, 140],
          [64, 178],
          [178, 252],
          [22, 72],
        ].map(([cx, cy]) => (
          <g key={`${cx}-${cy}`} transform={`translate(${cx} ${cy})`}>
            {[0, 72, 144, 216, 288].map((angle) => (
              <ellipse key={angle} cx="0" cy="-4.5" rx="2.6" ry="4.2" transform={`rotate(${angle})`} />
            ))}
            <circle r="1.6" fill="var(--color-gold)" stroke="none" />
          </g>
        ))}
      </g>
      <g fill="var(--color-gold)" opacity="0.7">
        <circle cx="146" cy="96" r="1.6" />
        <circle cx="88" cy="58" r="1.2" />
        <circle cx="160" cy="200" r="1.4" />
        <circle cx="44" cy="140" r="1.2" />
      </g>
    </svg>
  );
}
