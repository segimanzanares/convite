import { Sparkles } from 'lucide-react';
import { Confetti } from '../../../components/gender-reveal/Confetti';
import { useIntro } from '../../../components/gender-reveal/useIntro';
import { buttonClass, cn } from '../../../components/ui/styles';
import { Moon, StarrySky, Stork } from './EstrellasArt';

interface IntroScreenProps {
  names: string;
  dateLabel: string;
  onOpen?: () => void;
  /** Fires once the screen has gone and page scroll is unlocked. */
  onOpened?: () => void;
}

const CLOSE_MS = 1200;

/**
 * The first screen: a starry night where the stork waits under the moon with its bundle. "Abrir el mensaje" (the
 * visitor's tap that lets the music start) bursts the sky into pink, blue and starlight sparks and fades it away.
 */
export function IntroScreen({ names, dateLabel, onOpen, onOpened }: IntroScreenProps) {
  const { isOpen, isHidden, open } = useIntro(CLOSE_MS, onOpened);

  if (isHidden) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="estrellas-intro-title"
      className={cn(
        'ui-dark fixed inset-0 z-[3000] flex flex-col items-center justify-center overflow-hidden px-6 text-center transition-opacity delay-500 duration-600',
        isOpen && 'opacity-0',
      )}
    >
      <StarrySky count={70} />
      {isOpen && <Confetti colors={['--girl', '--boy', '--starlight', '--peach']} count={60} mode="burst" />}
      <Moon className="absolute top-[7%] right-[10%] w-16 sm:w-20" />
      <div className="estrellas-glide relative w-[min(260px,70vw)]">
        <Stork className="w-full" />
      </div>
      <p className="relative mt-6 text-xs font-bold tracking-[0.3em] text-(--muted-foreground) uppercase">Un mensaje de la cigüeña</p>
      <h1 id="estrellas-intro-title" className="relative mt-3 font-gloock text-[clamp(34px,8.5vw,52px)] leading-tight">
        {names}
      </h1>
      <p className="relative mx-auto mt-2 max-w-xs text-pretty text-(--muted-foreground)">
        Ábrelo para saber qué trae en su paquete{dateLabel ? ` y qué pasará el ${dateLabel}` : ''}.
      </p>
      <button
        type="button"
        autoFocus
        disabled={isOpen}
        className={buttonClass('default', 'lg', 'relative mt-8 rounded-full px-8')}
        onClick={() => {
          open();
          onOpen?.();
        }}
      >
        <Sparkles aria-hidden="true" />
        Abrir el mensaje
      </button>
    </div>
  );
}
