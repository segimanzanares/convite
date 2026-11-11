import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';

/** Set by InvitationController when a panel user opens an invitation the public cannot see yet (or anymore). */
type PreviewStatus = 'draft' | 'archived' | null;

const MESSAGES: Record<Exclude<PreviewStatus, null>, string> = {
  draft: 'Borrador: esta invitación aún no es pública. Solo tú puedes verla.',
  archived: 'Archivada: los invitados ya no pueden abrir esta invitación.',
};

const previewOf = (props: Record<string, unknown>) => (props.preview as PreviewStatus | undefined) ?? null;

/**
 * Rendered next to the Inertia app, outside its pages, so every invitation template shows it without changes. It
 * follows the current page through the router's navigate event.
 */
export function PreviewBanner({ initialProps }: { initialProps: Record<string, unknown> }) {
  const [preview, setPreview] = useState<PreviewStatus>(() => previewOf(initialProps));

  useEffect(() => router.on('navigate', (event) => setPreview(previewOf(event.detail.page.props))), []);

  if (!preview) return null;

  return (
    <div
      role="status"
      className="fixed inset-x-0 top-0 z-[1000] print:hidden bg-ink/90 text-white text-center px-4 py-2 font-jost text-[12px] tracking-[0.05em]"
    >
      <span className="uppercase tracking-[0.2em] text-gold mr-2">Vista previa</span>
      {MESSAGES[preview]}
    </div>
  );
}
