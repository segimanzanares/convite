import { useEffect, type ReactNode } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowLeft, House } from 'lucide-react';
import logoHorizontal from '../../assets/images/logo-horizontal.png';
import { Badge, Card } from '../ui/primitives';
import { buttonClass } from '../ui/styles';
import './theme.css';

interface ErrorScreenProps {
  /** The HTTP status, shown large behind the card. */
  status: number;
  /** The document title. */
  pageTitle: string;
  badge: string;
  title: string;
  icon: ReactNode;
  children: ReactNode;
  /** Shows a "Regresar" button that goes back in the browser's history. */
  showBack?: boolean;
}

/** The shared layout of the 404 and 410 pages, built on shadcn/ui's tokens (see theme.css). */
export function ErrorScreen({ status, pageTitle, badge, title, icon, children, showBack = false }: ErrorScreenProps) {
  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  return (
    <main className="theme-error relative isolate flex min-h-svh flex-col items-center justify-center overflow-hidden px-5 py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,var(--gold-pale),transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35] [background-image:radial-gradient(var(--border)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
      />

      <Link href="/" className="mb-10 rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-(--ring)/50">
        <img src={logoHorizontal} alt="Convite" className="h-8" />
      </Link>

      <div className="relative w-full max-w-md">
        <p
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-24 select-none text-center font-body text-[9rem] font-medium italic leading-none text-(--gold)/25 sm:-top-28 sm:text-[11rem]"
        >
          {status}
        </p>

        <Card className="relative px-6 py-10 text-center sm:px-10">
          <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-full bg-(--secondary) text-(--secondary-foreground) [&_svg]:size-5">
            {icon}
          </div>
          <Badge className="mb-4 bg-(--muted) text-(--muted-foreground)">{badge}</Badge>
          <h1 className="font-body text-4xl font-medium italic leading-tight tracking-tight sm:text-[2.6rem]">{title}</h1>
          <div className="mx-auto mt-4 max-w-sm text-[15px] leading-relaxed text-(--muted-foreground)">{children}</div>

          <div className="mt-8 flex flex-col-reverse justify-center gap-3 sm:flex-row">
            {showBack && (
              <button type="button" onClick={() => window.history.back()} className={buttonClass('outline')}>
                <ArrowLeft />
                Regresar
              </button>
            )}
            <Link href="/" className={buttonClass()}>
              <House />
              Ir al inicio
            </Link>
          </div>
        </Card>
      </div>

      <p className="mt-10 text-xs text-(--muted-foreground)">Invitaciones digitales hechas con cariño</p>
    </main>
  );
}
