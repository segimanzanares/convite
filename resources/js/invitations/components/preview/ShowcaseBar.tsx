import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';

/** Set by InvitationController when a demo is opened with `?plan=<slug>` (see DemoShowcaseService). */
interface Showcase {
  plan: string;
  print_card_url: string | null;
  guest_passes_url: string | null;
  door_url: string | null;
  gallery_url: string | null;
  wall_url: string | null;
}

const showcaseOf = (props: Record<string, unknown>) => (props.showcase as Showcase | null | undefined) ?? null;

/**
 * Names the plan a demo is showing and links to the printable card and passes (when the template has them) and to the
 * demo door and live gallery, as far as the plan includes them. Like PreviewBanner, it is rendered next to the Inertia
 * app, so every template shows it without changes.
 */
export function ShowcaseBar({ initialProps }: { initialProps: Record<string, unknown> }) {
  const [showcase, setShowcase] = useState<Showcase | null>(() => showcaseOf(initialProps));
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => router.on('navigate', (event) => setShowcase(showcaseOf(event.detail.page.props))), []);

  if (!showcase || isDismissed) return null;

  const links = [
    { label: 'Tarjeta imprimible', url: showcase.print_card_url },
    { label: 'Pases', url: showcase.guest_passes_url },
    { label: 'Registro en la puerta', url: showcase.door_url },
    { label: 'Galería en vivo', url: showcase.gallery_url },
    { label: 'Muro de fotos', url: showcase.wall_url },
  ].filter((link): link is { label: string; url: string } => link.url !== null);

  return (
    <div
      role="status"
      className="fixed inset-x-0 top-0 z-[1000] print:hidden flex items-center justify-center gap-x-3 bg-(--foreground)/90 py-2 pl-4 pr-10 text-center font-jost text-[12px] tracking-[0.05em] text-white"
    >
      <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        <span className="uppercase tracking-[0.2em] text-(--primary)">Demo del plan {showcase.plan}</span>
        <span>Lo que envíes aquí no se guarda.</span>
        {links.length > 0 && (
          <span className="flex flex-wrap justify-center gap-x-3">
            <span className="text-white/70">Prueba también:</span>
            {links.map((link) => (
              <a key={link.label} href={link.url} target="_blank" rel="noopener" className="underline underline-offset-4 hover:text-(--primary)">
                {link.label}
              </a>
            ))}
          </span>
        )}
      </p>
      <button
        type="button"
        onClick={() => setIsDismissed(true)}
        aria-label="Cerrar"
        className="absolute right-3 top-1/2 -translate-y-1/2 px-1 text-base leading-none text-white/70 hover:text-white"
      >
        ×
      </button>
    </div>
  );
}
