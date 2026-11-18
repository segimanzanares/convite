import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import type { ReactNode } from 'react';
import type { WishesState } from '../../hooks/useWishes';

/** Class names a template family gives the book, so it takes the template's look. */
export interface WishesTheme {
  /** The frame around the three panels. */
  frame: string;
  /** The dark panel that opens the book, and its texts. */
  intro: string;
  introEyebrow: string;
  introTitle: string;
  introText: string;
  introOrnament: string;
  /** The light panels: the form and the book. */
  panel: string;
  eyebrow: string;
  panelTitle: string;
  /** The italic word of the panel titles ("Deja tu *huella*"). */
  accent: string;
  /** Hairline under the book panel's heading, and the ornaments' color. */
  rule: string;
  ornament: string;
  label: string;
  input: string;
  note: string;
  error: string;
  button: string;
  /** The book's "Anterior / Siguiente" and the secondary actions. */
  navButton: string;
  pill: string;
  /** The live preview of the message being written. */
  preview: string;
  previewText: string;
  previewSignature: string;
  /** The book's cover and its texts. */
  cover: string;
  coverFrame: string;
  coverMonogram: string;
  coverOccasion: string;
  coverTitle: string;
  coverScript: string;
  coverDate: string;
  ribbon: string;
  /** A page of the book (one message) and its texts. */
  page: string;
  pageHeader: string;
  pageAuthor: string;
  pageMessage: string;
  pageDate: string;
  thanks: string;
}

interface WishesBookProps {
  wishes: WishesState;
  theme: WishesTheme;
}

/** Four petals around a dot, the book's ornament. */
function Ornament({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <circle cx="16" cy="8.5" r="4.5" />
      <circle cx="16" cy="23.5" r="4.5" />
      <circle cx="8.5" cy="16" r="4.5" />
      <circle cx="23.5" cy="16" r="4.5" />
      <circle cx="16" cy="16" r="1.6" fill="currentColor" />
    </svg>
  );
}

function PenIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16.86 3.49a2.1 2.1 0 0 1 2.97 2.97L8.25 18.04 4 19.5l1.46-4.25L16.86 3.49Z" />
      <path d="m14.5 6 3.5 3.5" />
    </svg>
  );
}

function ArrowIcon({ back = false }: { back?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={`size-3.5 ${back ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/** "Deja tu *huella*": the title with its last word in the theme's italic accent. */
function PanelTitle({ text, accent, theme }: { text: string; accent: string; theme: WishesTheme }) {
  return (
    <h3 className={theme.panelTitle}>
      {text} <span className={theme.accent}>{accent}</span>
    </h3>
  );
}

function shortDate(value: string | null): string {
  return value ? format(parseISO(value), "d 'de' MMM yyyy", { locale: es }) : '';
}

/**
 * The wishes book: a panel that introduces it, the form to sign it with a live preview of the message, and the book
 * itself, whose cover opens onto one page per message (only when the invitation makes them public). Templates wrap it
 * in their own section heading (see useWishes, which says whether to render it at all).
 */
export function WishesBook({ wishes: state, theme }: WishesBookProps) {
  return (
    <div className={`grid gap-3 lg:grid-cols-2 xl:grid-cols-[0.8fr_1fr_1.1fr] ${theme.frame}`}>
      <IntroPanel state={state} theme={theme} />
      <FormPanel state={state} theme={theme} />
      <BookPanel state={state} theme={theme} />
    </div>
  );
}

function IntroPanel({ state, theme }: { state: WishesState; theme: WishesTheme }) {
  const { cover } = state;

  return (
    <div className={`relative flex flex-col overflow-hidden lg:col-span-2 xl:col-span-1 ${theme.intro}`}>
      <p className={theme.introEyebrow}>Un recuerdo para {cover.recipient}</p>
      <Ornament className={`mt-6 size-7 ${theme.introOrnament}`} />
      <p className={`mt-5 ${theme.introTitle}`}>Tu mensaje también será parte de esta historia</p>
      <p className={`mt-5 ${theme.introText}`}>
        Cada firma ocupa su propia hoja, con tu nombre y la fecha, y al final del día {cover.recipient}{' '}
        {cover.plural ? 'se llevan' : 'se lleva'} el libro completo de recuerdo.
      </p>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-2 -bottom-10 font-serif text-[180px] leading-none italic opacity-[0.07] select-none"
      >
        {cover.monogram.charAt(0)}
      </span>
    </div>
  );
}

function FormPanel({ state, theme }: { state: WishesState; theme: WishesTheme }) {
  const { form, setField, isOpen, maxLength, sent, cover } = state;

  const audienceNote = state.isModerated
    ? `Tu mensaje aparecerá en el libro cuando ${cover.recipient} ${cover.plural ? 'lo revisen' : 'lo revise'}.`
    : state.isPublic
      ? 'Tu mensaje aparecerá en el libro para todos los invitados.'
      : `Tu mensaje llegará solo a ${cover.recipient}.`;

  let body: ReactNode;

  if (sent) {
    body = (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-10 text-center">
        <Ornament className={`size-8 ${theme.ornament}`} />
        <p className={theme.thanks}>¡Gracias por firmar!</p>
        <p className={theme.note}>
          {state.sentIsPending
            ? `Tu mensaje aparecerá en cuanto ${cover.recipient} ${cover.plural ? 'lo revisen' : 'lo revise'}.`
            : state.isPublic
              ? 'Tu mensaje ya está en la primera hoja del libro.'
              : `Tu mensaje ya está guardado en el libro de ${cover.recipient}.`}
        </p>
        {isOpen && (
          <button type="button" className={theme.navButton} onClick={state.writeAnother}>
            Escribir otro mensaje
          </button>
        )}
      </div>
    );
  } else if (!isOpen) {
    body = (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-10 text-center">
        <Ornament className={`size-8 ${theme.ornament}`} />
        <p className={theme.note}>El libro ya no recibe firmas. ¡Gracias a todos los que escribieron!</p>
      </div>
    );
  } else {
    body = (
      <form className="flex flex-col gap-4" onSubmit={state.submit}>
        <div className="flex flex-col gap-2">
          <label htmlFor="wish-name" className={theme.label}>
            Tu nombre
          </label>
          <input
            id="wish-name"
            className={theme.input}
            type="text"
            required
            maxLength={60}
            autoComplete="name"
            placeholder="Escribe tu nombre"
            value={form.author_name}
            onChange={(event) => setField('author_name', event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between gap-3">
            <label htmlFor="wish-message" className={theme.label}>
              Un mensaje para {cover.recipient}
            </label>
            <span className={`shrink-0 whitespace-nowrap ${theme.label}`} aria-live="polite">
              {form.message.length} / {maxLength}
            </span>
          </div>
          <textarea
            id="wish-message"
            className={`${theme.input} h-auto min-h-32 resize-none`}
            rows={5}
            required
            maxLength={maxLength}
            placeholder="Que cada sueño se haga realidad…"
            value={form.message}
            onChange={(event) => setField('message', event.target.value)}
          />
        </div>
        {/* Hidden from people and screen readers; bots that fill every field in are turned away */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] h-px w-px opacity-0"
          value={form.website}
          onChange={(event) => setField('website', event.target.value)}
        />
        {state.error && <p className={theme.error}>{state.error}</p>}
        <button className={theme.button} type="submit" disabled={state.processing}>
          {state.processing ? 'Firmando…' : 'Firmar el libro'}
          <PenIcon className="size-4" />
        </button>
        <p className={theme.note}>{audienceNote}</p>
      </form>
    );
  }

  return (
    <div className={`flex flex-col ${theme.panel}`}>
      <div className="flex items-start justify-between gap-3">
        <p className={theme.eyebrow}>Escribe un recuerdo</p>
        <PenIcon className={`size-5 ${theme.ornament}`} />
      </div>
      <div className="mt-2 mb-6">
        <PanelTitle text="Deja tu" accent="huella" theme={theme} />
      </div>
      {body}
      {!sent && isOpen && (
        <div className={`relative mt-6 overflow-hidden ${theme.preview}`}>
          <p className={theme.eyebrow}>Vista previa</p>
          <p className={`mt-3 min-h-12 whitespace-pre-line ${theme.previewText}`}>
            {form.message.trim() || 'Tu mensaje aparecerá aquí mientras lo escribes…'}
          </p>
          <p className={`mt-3 text-right ${theme.previewSignature}`}>
            Con cariño, {form.author_name.trim() || 'tu nombre'}
          </p>
        </div>
      )}
    </div>
  );
}

function BookPanel({ state, theme }: { state: WishesState; theme: WishesTheme }) {
  const { cover, wishes, page, isPublic } = state;
  const wish = page >= 0 ? wishes[page] : null;
  const countLabel = wishes.length === 1 ? '1 firma' : `${wishes.length} firmas`;

  return (
    <div className={`flex flex-col ${theme.panel}`}>
      <div className={`flex items-start justify-between gap-3 border-b pb-4 ${theme.rule}`}>
        <div>
          {cover.dateLabel && <p className={theme.eyebrow}>{cover.dateLabel}</p>}
          <h3 className={`mt-1 ${theme.panelTitle}`}>Libro de firmas</h3>
        </div>
        {isPublic && <span className={theme.pill}>{countLabel}</span>}
      </div>

      <div className="flex flex-1 items-center justify-center py-8 [perspective:1400px]">
        <div className="relative aspect-[3/4] w-full max-w-[300px]">
          {wish ? (
            <>
              <div aria-hidden="true" className={`absolute inset-0 translate-x-2.5 translate-y-2 rotate-2 ${theme.page}`} />
              <div aria-hidden="true" className={`absolute inset-0 translate-x-1 translate-y-1 rotate-1 ${theme.page}`} />
              <article
                key={wish.id}
                className={`absolute inset-0 flex flex-col overflow-hidden p-6 text-center animate-[wishPageIn_0.55s_ease-out] origin-left ${theme.page}`}
                aria-live="polite"
              >
                <p className={theme.pageHeader}>{cover.title} · Una hoja, un recuerdo</p>
                <Ornament className={`mx-auto mt-4 size-6 shrink-0 ${theme.ornament}`} />
                <p className={`mt-3 ${theme.pageAuthor}`}>{wish.author_name}</p>
                <p className={`mt-3 min-h-0 flex-1 overflow-y-auto whitespace-pre-line ${theme.pageMessage}`}>
                  {wish.message}
                </p>
                <p className={`mt-3 shrink-0 ${theme.pageDate}`}>
                  {shortDate(wish.created_at)} · {page + 1}
                </p>
              </article>
            </>
          ) : (
            <BookCover state={state} theme={theme} />
          )}
        </div>
      </div>

      {isPublic ? (
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            className={theme.navButton}
            disabled={page < 0}
            onClick={() => state.turnTo(page - 1)}
          >
            <ArrowIcon back />
            {page === 0 ? 'Portada' : 'Anterior'}
          </button>
          <p className={theme.label}>{wish ? `Hoja ${page + 1} de ${wishes.length}` : 'Portada'}</p>
          <button
            type="button"
            className={theme.navButton}
            disabled={page >= wishes.length - 1}
            onClick={() => state.turnTo(page + 1)}
          >
            {page < 0 ? 'Abrir' : 'Siguiente'}
            <ArrowIcon />
          </button>
        </div>
      ) : (
        <p className={`text-center ${theme.note}`}>Las firmas se guardan para {cover.recipient}.</p>
      )}
      {isPublic && wishes.length === 0 && (
        <p className={`mt-3 text-center ${theme.note}`}>Aún no hay firmas. ¡Sé el primero en escribir!</p>
      )}
    </div>
  );
}

function BookCover({ state, theme }: { state: WishesState; theme: WishesTheme }) {
  const { cover } = state;
  const canOpen = state.isPublic && state.wishes.length > 0;

  return (
    <button
      type="button"
      disabled={!canOpen}
      onClick={() => state.turnTo(0)}
      aria-label={canOpen ? 'Abrir el libro de firmas' : 'Libro de firmas'}
      className={`group absolute inset-0 flex flex-col items-center justify-center overflow-hidden p-6 text-center transition-transform duration-500 enabled:cursor-pointer enabled:hover:-rotate-1 enabled:hover:scale-[1.01] disabled:cursor-default ${theme.cover}`}
    >
      <span aria-hidden="true" className={`pointer-events-none absolute inset-3 ${theme.coverFrame}`} />
      <span aria-hidden="true" className={`absolute top-0 right-8 h-20 w-5 [clip-path:polygon(0_0,100%_0,100%_100%,50%_82%,0_100%)] ${theme.ribbon}`} />
      <span className={`flex size-16 items-center justify-center rounded-full ${theme.coverMonogram}`}>{cover.monogram}</span>
      <span className={`mt-4 ${theme.coverOccasion}`}>{cover.occasion}</span>
      <span className={`mt-3 ${theme.coverTitle}`}>{cover.title}</span>
      <span className={`mt-3 ${theme.coverScript}`}>Libro de firmas</span>
      <Ornament className="mt-3 size-5 opacity-70" />
      {cover.dateLabel && <span className={`mt-4 ${theme.coverDate}`}>{cover.dateLabel}</span>}
      {canOpen && (
        <span className="absolute bottom-5 text-[9px] tracking-[0.3em] uppercase opacity-60">Toca para abrir</span>
      )}
    </button>
  );
}
