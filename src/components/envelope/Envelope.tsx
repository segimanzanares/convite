import { useEffect, useState } from 'react';
import type { CoupleInfo } from '../../types/wedding';
import '../../styles/envelope.css';

interface EnvelopeProps {
  couple: CoupleInfo;
  onOpen?: () => void;
}

export function Envelope({ couple, onOpen }: EnvelopeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [firstName, secondName] = couple.names;
  const initials = `${firstName.charAt(0)}${secondName.charAt(0)}`;

  useEffect(() => {
    document.body.style.overflow = isHidden ? '' : 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isHidden]);

  useEffect(() => {
    if (!isOpen) return;
    const timer = window.setTimeout(() => setIsHidden(true), 1800);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  if (isHidden) return null;

  return (
    <div
      className={`envelope-overlay ${isOpen ? 'is-open' : ''}`}
      aria-hidden={isOpen}
    >
      <div className="envelope-scene">
        <button
          type="button"
          className="envelope"
          onClick={() => {
            setIsOpen(true);
            onOpen?.();
          }}
          aria-label={`Abrir la invitación de ${firstName} y ${secondName}`}
        >
          <span className="envelope-pocket">
            <span className="envelope-back" />
            <span className="envelope-fold-left" />
            <span className="envelope-fold-right" />
            <span className="envelope-fold-bottom" />
            <span className="envelope-letter">
              <span className="envelope-letter-monogram">{initials}</span>
              <span className="envelope-letter-text">
                {firstName} &amp; {secondName}
              </span>
            </span>
          </span>
          <span className="envelope-flap" />
          <span className="envelope-seal">{initials}</span>
        </button>
        <p className="envelope-hint">
          {isOpen ? 'Abriendo…' : 'Toca el sobre para abrir'}
        </p>
      </div>
    </div>
  );
}
