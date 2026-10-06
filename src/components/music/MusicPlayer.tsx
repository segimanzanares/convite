import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

interface MusicPlayerProps {
    src?: string;
    /** Tiempo en milisegundos para ocultar el reproductor tras inactividad (por defecto 3000ms) */
    hideTimeout?: number;
}

export interface MusicPlayerHandle {
    play: () => void;
}

export const MusicPlayer = forwardRef<MusicPlayerHandle, MusicPlayerProps>(({ src, hideTimeout = 3000 }, ref) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const play = () => {
        audioRef.current?.play()
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
    };

    useImperativeHandle(ref, () => ({ play }));

    const togglePlayback = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (audio.paused) {
            play();
        } else {
            audio.pause();
        }
    };

    // Control de visibilidad según la interacción del usuario
    useEffect(() => {
        const handleInteraction = () => {
            setIsVisible(true);

            // Limpiamos el temporizador previo si existe
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            // Ocultamos el reproductor tras el tiempo configurado sin interacción
            timeoutRef.current = setTimeout(() => {
                setIsVisible(false);
            }, hideTimeout);
        };

        const events = ['scroll', 'click', 'mousemove', 'keydown', 'touchstart'];
        events.forEach((event) => window.addEventListener(event, handleInteraction, { passive: true }));

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            events.forEach((event) => window.removeEventListener(event, handleInteraction));
        };
    }, [hideTimeout]);

    // Escuchadores de eventos nativos de audio
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);

        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);

        return () => {
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
        };
    }, []);

    if (!src) return null;

    return (
        <div
            className={`fixed bottom-5 right-5 z-[1000] transition-opacity duration-500 ${
                isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
        >
            <audio ref={audioRef} loop src={src} />
            <button
                type="button"
                className="flex items-center justify-center w-12 h-12 rounded-full border-none cursor-pointer text-gold bg-transparent shadow-[0_0_10px_var(--color-gold)]"
                onClick={togglePlayback}
                aria-label={isPlaying ? 'Pausar música' : 'Reproducir música'}
                aria-pressed={isPlaying}
            >
                {isPlaying ? (
                    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                        <rect x="6" y="5" width="4" height="14" fill="currentColor" />
                        <rect x="14" y="5" width="4" height="14" fill="currentColor" />
                    </svg>
                ) : (
                    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                        <polygon points="7,5 19,12 7,19" fill="currentColor" />
                    </svg>
                )}
            </button>
        </div>
    );
});

MusicPlayer.displayName = 'MusicPlayer';