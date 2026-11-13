import { useEffect, useState, type ComponentType } from 'react';
import { BankIcon, EnvelopeIcon, GiftBoxIcon } from './GiftIcons';
import { copyToClipboard } from '../../utils/clipboard';
import { buttonClass, CARD_CLASS, ICON_TILE_CLASS } from '../shared/styles';
import type { GiftKind, GiftOption } from '../../types/wedding';

const GIFT_ICONS: Record<GiftKind, ComponentType<{ className?: string }>> = {
  bank: BankIcon,
  registry: GiftBoxIcon,
  envelope: EnvelopeIcon,
};

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
    <div className={`flex flex-col items-center py-10 px-8 max-[640px]:px-6 ${CARD_CLASS}`}>
      <h3 className="font-script text-[clamp(34px,5vw,42px)] text-gold-deep leading-[1.15]">{gift.title}</h3>
      <div className={`mt-7 ${ICON_TILE_CLASS}`}>
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
            <button className={buttonClass()} type="button" onClick={handleCopy} aria-live="polite">
              {copied ? '¡Copiado!' : (gift.copy.label ?? 'Copiar número')}
            </button>
          )}
          {gift.link && (
            <a className={buttonClass()} href={gift.link.url} target="_blank" rel="noopener noreferrer">
              {gift.link.label ?? 'Ver mesa de regalos'}
            </a>
          )}
        </div>
      )}
    </div>
  );
}
