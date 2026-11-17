import { useEffect, useState } from 'react';

const DAY = 86_400_000;

export type Countdown = { days: number; hours: number; minutes: number; seconds: number };

/**
 * A live countdown to a sample event the given number of days ahead, for the illustrations: it ticks every second
 * like the one in the invitations.
 */
export function useCountdown(daysAhead: number): Countdown {
    const [target] = useState(() => Date.now() + daysAhead * DAY + 7 * 3_600_000);
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        const interval = window.setInterval(() => setNow(Date.now()), 1000);

        return () => window.clearInterval(interval);
    }, []);

    const remaining = Math.max(0, target - now);

    return {
        days: Math.floor(remaining / DAY),
        hours: Math.floor((remaining % DAY) / 3_600_000),
        minutes: Math.floor((remaining % 3_600_000) / 60_000),
        seconds: Math.floor((remaining % 60_000) / 1000),
    };
}

export const pad = (value: number) => String(value).padStart(2, '0');
