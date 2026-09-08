import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

interface MusicPlayerProps {
    src?: string;
}

export interface MusicPlayerHandle {
    play: () => void;
}

export const MusicPlayer = forwardRef<MusicPlayerHandle, MusicPlayerProps>(({ src }, ref) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

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

    return (
        src ? <div className="fixed bottom-5 right-5 z-[1000]">
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
        : null
    );
});

MusicPlayer.displayName = 'MusicPlayer';
