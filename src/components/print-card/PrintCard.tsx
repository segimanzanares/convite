import { useEffect, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { FloralCornerSvg } from '../layout/FloralCornerOrnament';
import type { ColorSwatchData } from '../../types/wedding';
import './PrintCard.css';

export interface PrintCardEvent {
  label: string;
  title: string;
  lines: string[];
  time?: string;
}

export interface PrintCardProps {
  /** Wrapper class that scopes the invitation's theme tokens, e.g. "theme-demo". */
  themeClassName: string;
  /** Used for the page title, which browsers also suggest as the PDF file name. */
  documentTitle: string;
  front: {
    eyebrow: string;
    /** Script-font headline: one line per entry, joined by an ampersand. */
    names: string[];
    subtitle?: string;
    message: string;
    dateLabel: string;
    place?: string;
    signature?: string;
  };
  back: {
    monogram: string;
    events: PrintCardEvent[];
    dressCode?: { title: string; note?: string; swatches?: ColorSwatchData[] };
    rsvpDeadlineLabel: string;
  };
}

/** 5×7 in card, matching the @page size below. */
const CARD_PAGE_STYLE = '@page { size: 127mm 178mm; margin: 0; }';

/** The digital invitation lives one segment up from /i/<slug>/tarjeta. */
function useInvitationUrl() {
  const url = new URL(window.location.href);
  url.pathname = url.pathname.replace(/\/tarjeta\/?$/, '');
  url.search = '';
  url.hash = '';
  return url.toString();
}

function CardOrnaments() {
  return (
    <>
      <div className="print-card__frame" />
      {(['tl', 'tr', 'bl', 'br'] as const).map((pos) => (
        <FloralCornerSvg key={pos} className={`print-card__corner print-card__corner--${pos}`} />
      ))}
      {(['top', 'bottom'] as const).map((pos) => (
        <svg
          key={pos}
          className={`print-card__mark print-card__mark--${pos}`}
          width="60"
          height="12"
          viewBox="0 0 60 12"
          fill="none"
        >
          <path d="M0 6 H22 M38 6 H60" stroke="currentColor" strokeWidth="0.6" />
          <circle cx="30" cy="6" r="2.5" stroke="currentColor" strokeWidth="0.8" />
          <circle cx="24" cy="6" r="1" fill="currentColor" />
          <circle cx="36" cy="6" r="1" fill="currentColor" />
        </svg>
      ))}
    </>
  );
}

function Card({ className, children }: { className: string; children: ReactNode }) {
  return (
    <section className={`print-card ${className}`}>
      <CardOrnaments />
      <div className="print-card__content">{children}</div>
    </section>
  );
}

export function PrintCard({ themeClassName, documentTitle, front, back }: PrintCardProps) {
  const invitationUrl = useInvitationUrl();
  const displayUrl = invitationUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');

  useEffect(() => {
    document.title = documentTitle;
  }, [documentTitle]);

  return (
    <div className={`${themeClassName} print-card-page`}>
      {/* Rendered only while this page is mounted, so the card size never
          leaks into printing other pages of the SPA. */}
      <style>{CARD_PAGE_STYLE}</style>

      <div className="print-card-toolbar">
        <button type="button" onClick={() => window.print()} className="print-card-toolbar__primary">
          Imprimir / Descargar PDF
        </button>
        <Link to=".." relative="path" className="print-card-toolbar__link">
          Ver invitación digital
        </Link>
        <p className="print-card-toolbar__hint">
          Para PDF elige «Guardar como PDF», márgenes «Ninguno» y activa «Gráficos de fondo».
        </p>
      </div>

      <Card className="print-card--front">
        <p className="print-card__eyebrow">{front.eyebrow}</p>
        <div className="print-card__rule" />
        <h1 className="print-card__names">
          {front.names.map((name, i) => (
            <span key={name}>
              {i > 0 && <span className="print-card__amp">&amp;</span>}
              {name}
            </span>
          ))}
        </h1>
        <div className="print-card__rule" />
        {front.subtitle && <p className="print-card__subtitle">{front.subtitle}</p>}
        <p className="print-card__lead">{front.message}</p>
        <div className="print-card__rule" />
        <p className="print-card__date">{front.dateLabel}</p>
        {front.place && <p className="print-card__place">{front.place}</p>}
        {front.signature && <p className="print-card__signature">{front.signature}</p>}
      </Card>

      <Card className="print-card--back">
        <div className="print-card__monogram">{back.monogram}</div>

        <div className="print-card__events">
          {back.events.map((event) => (
            <div key={event.label} className="print-card__event">
              <p className="print-card__label">{event.label}</p>
              <h3>{event.title}</h3>
              {event.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
              {event.time && <p className="print-card__time">{event.time}</p>}
            </div>
          ))}
        </div>

        {back.dressCode && (
          <div className="print-card__dress">
            <p className="print-card__label">Código de vestimenta</p>
            <h3>{back.dressCode.title}</h3>
            {back.dressCode.note && <p className="print-card__note">{back.dressCode.note}</p>}
            {back.dressCode.swatches && (
              <div className="print-card__swatches">
                {back.dressCode.swatches.map((swatch) => (
                  <span key={swatch.hex} title={swatch.label} style={{ background: swatch.hex }} />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="print-card__rsvp">
          <div className="print-card__qr">
            <QRCodeSVG value={invitationUrl} level="M" marginSize={0} fgColor="#2c1f0a" bgColor="#fdfaf4" />
          </div>
          <div>
            <p className="print-card__label">Confirma tu asistencia</p>
            <p>
              Antes del <strong>{back.rsvpDeadlineLabel}</strong>.
              <br />
              Escanea el código para ver la invitación digital, ubicaciones y confirmar.
            </p>
            <p className="print-card__url">{displayUrl}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
