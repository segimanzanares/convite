import { useEffect, useState, type ComponentType } from 'react';
import { BankIcon, EnvelopeIcon, GiftBoxIcon } from './GiftIcons';
import type { GiftKind, GiftOption } from '../../types/wedding';

const GIFT_ICONS: Record<GiftKind, ComponentType<{ className?: string }>> = {
  bank: BankIcon,
  registry: GiftBoxIcon,
  envelope: EnvelopeIcon,
};

const BUTTON_CLASS =
  'inline-block bg-gold text-ivory font-display text-[11px] tracking-[0.3em] uppercase no-underline py-3.5 px-7 rounded-md cursor-pointer border-none transition-colors duration-300 hover:bg-gold-deep';

async function copyToClipboard(text: string) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  // Fallback for non-secure contexts (e.g. testing over plain http on a phone).
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  textarea.remove();
}

interface GiftCardProps {
  gift: GiftOption;
}

export function GiftCard({ gift }: GiftCardProps) {
  const [copied, setCopied] = useState(false);
  const Icon = GIFT_ICONS[gift.kind];

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  const handleCopy = async () => {
    if (!gift.copy) return;
    try {
      await copyToClipboard(gift.copy.value);
      setCopied(true);
    } catch {
      // Clipboard access denied; the details remain visible for manual copying.
    }
  };

  return (
    <div className="flex flex-col items-center border-2 border-gold/60 rounded-2xl bg-[linear-gradient(160deg,var(--color-ivory),var(--color-cream))] py-10 px-8 max-[640px]:px-6 shadow-[0_12px_40px_color-mix(in_srgb,var(--color-gold)_12%,transparent)]">
      <h3 className="font-script text-[clamp(34px,5vw,42px)] text-gold-deep leading-[1.15]">{gift.title}</h3>
      <div className="w-[88px] h-[88px] rounded-2xl border-2 border-gold flex items-center justify-center text-gold-deep mt-7">
        <Icon className="w-12 h-12" />
      </div>
      {gift.description && (
        <p className="text-[16px] font-light leading-[1.7] text-[var(--text-body)] italic mt-6">{gift.description}</p>
      )}
      {gift.details?.length ? (
        <dl className="mt-6 flex flex-col gap-3">
          {gift.details.map((detail) => (
            <div key={detail.label}>
              <dt className="text-[17px] font-light text-[var(--text-muted)]">{detail.label}:</dt>
              <dd className="text-[19px] tracking-[0.04em] text-[var(--text-body)] break-words">{detail.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {(gift.copy || gift.link) && (
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          {gift.copy && (
            <button className={BUTTON_CLASS} type="button" onClick={handleCopy} aria-live="polite">
              {copied ? '¡Copiado!' : (gift.copy.label ?? 'Copiar número')}
            </button>
          )}
          {gift.link && (
            <a className={BUTTON_CLASS} href={gift.link.url} target="_blank" rel="noopener noreferrer">
              {gift.link.label ?? 'Ver mesa de regalos'}
            </a>
          )}
        </div>
      )}
    </div>
  );
}
