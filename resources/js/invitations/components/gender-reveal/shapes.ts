/** A five-pointed star of radius r around (cx, cy), as an SVG path; `inner` is the ratio of the inner radius. */
export function starPath(cx: number, cy: number, r: number, inner = 0.45): string {
  return (
    Array.from({ length: 10 }, (_, index) => {
      const radius = index % 2 ? r * inner : r;
      const angle = (index * Math.PI) / 5 - Math.PI / 2;
      return `${index ? 'L' : 'M'}${(cx + radius * Math.cos(angle)).toFixed(2)} ${(cy + radius * Math.sin(angle)).toFixed(2)}`;
    }).join(' ') + ' Z'
  );
}
