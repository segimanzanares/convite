import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { CardOrnaments, PrintPage } from './PrintShared';
import './GuestPasses.css';

export interface GuestPassesProps {
  themeClassName: string;
  documentTitle: string;
  /** Script-font headline, joined by an ampersand. */
  names: string[];
  eyebrow?: string;
  dateLabel: string;
  /** localStorage key for the guest list typed on the page. */
  storageKey: string;
  /** Prefilled list shown until the user types their own (one guest per line). */
  sampleGuests: string;
}

interface Guest {
  name: string;
  seats: number;
  table?: string;
}

/** 8 passes of 90×55 mm per US-letter sheet (2 columns × 4 rows). */
const PASSES_PER_SHEET = 8;
const SHEET_WIDTH_PX = 816; // 215.9mm at 96dpi

const isCount = (value: string) => /^\d+$/.test(value);

/**
 * One guest per line: "Nombre, pases[, mesa]". Names may contain commas;
 * the trailing numeric fields are read from the right.
 */
function parseGuests(text: string): Guest[] {
  return text
    .split('\n')
    .map((line) => line.split(',').map((part) => part.trim()))
    .filter((parts) => parts[0])
    .map((parts) => {
      if (parts.length >= 3 && isCount(parts[parts.length - 2])) {
        const table = parts.pop();
        const seats = Number(parts.pop());
        return { name: parts.join(', '), seats, table };
      }
      if (parts.length >= 2 && isCount(parts[parts.length - 1])) {
        const seats = Number(parts.pop());
        return { name: parts.join(', '), seats };
      }
      return { name: parts.join(', '), seats: 1 };
    })
    .filter((guest) => guest.seats > 0);
}

function readStored(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** Screen-only scale so a whole sheet fits narrow viewports (16px gutters). */
const computeSheetZoom = () => Math.min(1, (window.innerWidth - 32) / SHEET_WIDTH_PX);

function useSheetZoom() {
  const [zoom, setZoom] = useState(computeSheetZoom);
  useEffect(() => {
    const onResize = () => setZoom(computeSheetZoom());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return zoom;
}

/** Crop marks in the sheet margins, aligned to the pass grid (all units in mm). */
function CropMarks({ passCount }: { passCount: number }) {
  const cols = [17.95, 107.95, 197.95];
  const rowCount = Math.ceil(passCount / 2);
  const rows = Array.from({ length: rowCount + 1 }, (_, i) => 29.7 + i * 55);
  const bottom = rows[rows.length - 1];
  return (
    <svg className="guest-sheet__marks" viewBox="0 0 215.9 279.4" aria-hidden="true">
      {cols.map((x) => (
        <g key={`x${x}`}>
          <line x1={x} y1={18} x2={x} y2={27} />
          <line x1={x} y1={bottom + 2.7} x2={x} y2={bottom + 11.7} />
        </g>
      ))}
      {rows.map((y) => (
        <g key={`y${y}`}>
          <line x1={6} y1={y} x2={15} y2={y} />
          <line x1={200.9} y1={y} x2={209.9} y2={y} />
        </g>
      ))}
    </svg>
  );
}

function GuestPass({ guest, names, eyebrow, dateLabel }: { guest: Guest; names: string[]; eyebrow: string; dateLabel: string }) {
  return (
    <article className="guest-pass">
      <CardOrnaments marks={false} />
      <div className="guest-pass__content">
        <div className="guest-pass__main">
          <p className="guest-pass__eyebrow">{eyebrow}</p>
          <p className="guest-pass__names">
            {names.map((name, i) => (
              <span key={name}>
                {i > 0 && <span className="guest-pass__amp">&amp;</span>}
                {name}
              </span>
            ))}
          </p>
          <div className="guest-pass__rule" />
          <p className="guest-pass__label">Invitado(s)</p>
          <p className="guest-pass__guest">{guest.name}</p>
          <p className="guest-pass__date">{dateLabel}</p>
        </div>
        <div className="guest-pass__side">
          <div className="guest-pass__badge">
            <span className="guest-pass__seats">{guest.seats}</span>
            <span className="guest-pass__unit">{guest.seats === 1 ? 'Persona' : 'Personas'}</span>
          </div>
          {guest.table && <p className="guest-pass__table">Mesa {guest.table}</p>}
        </div>
      </div>
    </article>
  );
}

export function GuestPasses({
  themeClassName,
  documentTitle,
  names,
  eyebrow = 'Pase de acceso',
  dateLabel,
  storageKey,
  sampleGuests,
}: GuestPassesProps) {
  const [text, setText] = useState(() => readStored(storageKey) ?? sampleGuests);
  const guests = useMemo(() => parseGuests(text), [text]);
  const zoom = useSheetZoom();

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, text);
    } catch {
      // Private mode or blocked storage: the list just won't survive a reload.
    }
  }, [storageKey, text]);

  const sheets: Guest[][] = [];
  for (let i = 0; i < guests.length; i += PASSES_PER_SHEET) {
    sheets.push(guests.slice(i, i + PASSES_PER_SHEET));
  }
  const totalSeats = guests.reduce((sum, guest) => sum + guest.seats, 0);

  return (
    <PrintPage
      themeClassName={themeClassName}
      documentTitle={documentTitle}
      pageSize="letter"
      hint="Imprime en hoja carta, escala 100 % (sin «Ajustar a la página»), márgenes «Ninguno» y con «Gráficos de fondo» para que cada pase mida 9 × 5.5 cm. Recorta siguiendo las marcas."
      controls={
        <div className="guest-editor">
          <label htmlFor="guest-list" className="guest-editor__label">
            Invitados — uno por línea: <code>Nombre, pases, mesa</code> (la mesa es opcional)
          </label>
          <textarea
            id="guest-list"
            className="guest-editor__input"
            rows={8}
            value={text}
            onChange={(event) => setText(event.target.value)}
            spellCheck={false}
          />
          <div className="guest-editor__footer">
            <span>
              {guests.length} {guests.length === 1 ? 'pase' : 'pases'} · {totalSeats}{' '}
              {totalSeats === 1 ? 'persona' : 'personas'} · {sheets.length} {sheets.length === 1 ? 'hoja' : 'hojas'}
            </span>
            <button type="button" onClick={() => setText(sampleGuests)} className="print-card-toolbar__link">
              Restaurar ejemplo
            </button>
          </div>
          <p className="guest-editor__note">La lista se guarda solo en este navegador; no se envía a ningún lado.</p>
        </div>
      }
    >
      {sheets.map((sheet, index) => (
        <section key={index} className="guest-sheet" style={{ '--sheet-zoom': zoom } as CSSProperties}>
          <CropMarks passCount={sheet.length} />
          <div className="guest-sheet__grid">
            {sheet.map((guest, i) => (
              <GuestPass key={i} guest={guest} names={names} eyebrow={eyebrow} dateLabel={dateLabel} />
            ))}
          </div>
        </section>
      ))}
    </PrintPage>
  );
}
