import type { MouseEvent } from 'react';

/** Click handler for in-page anchors: scrolls smoothly to the `#id` target instead of jumping. */
export function scrollToHash(event: MouseEvent<HTMLAnchorElement>) {
  const { hash } = event.currentTarget;
  const target = hash ? document.querySelector(hash) : null;
  if (!target) return;
  event.preventDefault();
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
