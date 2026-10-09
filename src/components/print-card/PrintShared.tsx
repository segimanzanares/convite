import { useEffect, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { FloralCornerSvg } from '../layout/FloralCornerOrnament';
import './PrintCard.css';

interface PrintPageProps {
  /** Wrapper class that scopes the invitation's theme tokens, e.g. "theme-demo". */
  themeClassName: string;
  /** Used for the page title, which browsers also suggest as the PDF file name. */
  documentTitle: string;
  /** CSS @page size, e.g. "127mm 178mm" or "letter". */
  pageSize: string;
  hint: string;
  /** Extra screen-only controls rendered under the toolbar. */
  controls?: ReactNode;
  children: ReactNode;
}

/** Screen/print shell shared by the printable pages of an invitation. */
export function PrintPage({ themeClassName, documentTitle, pageSize, hint, controls, children }: PrintPageProps) {
  useEffect(() => {
    document.title = documentTitle;
  }, [documentTitle]);

  return (
    <div className={`${themeClassName} print-card-page`}>
      {/* Rendered only while this page is mounted, so the page size never
          leaks into printing other pages of the SPA. */}
      <style>{`@page { size: ${pageSize}; margin: 0; }`}</style>

      <div className="print-card-toolbar">
        <button type="button" onClick={() => window.print()} className="print-card-toolbar__primary">
          Imprimir / Descargar PDF
        </button>
        <Link to=".." relative="path" className="print-card-toolbar__link">
          Ver invitación digital
        </Link>
        <p className="print-card-toolbar__hint">{hint}</p>
        {controls}
      </div>

      {children}
    </div>
  );
}

/** Double frame + floral corners; sized by the --frame-inset / --corner-* custom properties. */
export function CardOrnaments({ marks = true }: { marks?: boolean }) {
  return (
    <>
      <div className="print-card__frame" />
      {(['tl', 'tr', 'bl', 'br'] as const).map((pos) => (
        <FloralCornerSvg key={pos} className={`print-card__corner print-card__corner--${pos}`} />
      ))}
      {marks &&
        (['top', 'bottom'] as const).map((pos) => (
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
