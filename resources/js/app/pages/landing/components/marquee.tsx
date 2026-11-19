import { Baby, Cake, Gem, Heart, PartyPopper, Sparkles, VenusAndMars } from 'lucide-react';
import { Sparkle } from './illustrations/decorations';

const ITEMS = [
    { icon: Heart, label: 'Bodas' },
    { icon: Gem, label: 'XV años' },
    { icon: Baby, label: 'Bautizos' },
    { icon: VenusAndMars, label: 'Revelación de género' },
    { icon: Cake, label: 'Cumpleaños' },
    { icon: PartyPopper, label: 'Fiestas infantiles' },
    { icon: Sparkles, label: 'Diseños exclusivos' },
];

/** A ribbon of the events Convite designs for, scrolling endlessly. */
export function Marquee() {
    return (
        <div className="relative -rotate-1 border-y border-primary/10 bg-primary py-4 text-white shadow-lg">
            <div className="flex overflow-hidden mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
                {/* Two copies, so the loop is seamless at -50% */}
                <div className="flex shrink-0 motion-safe:animate-marquee">
                    {[0, 1].map((copy) => (
                        <ul key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
                            {[...ITEMS, ...ITEMS].map(({ icon: Icon, label }, index) => (
                                <li key={`${label}-${index}`} className="flex items-center gap-3 px-6 text-lg font-medium whitespace-nowrap">
                                    <Icon className="size-5 text-gold" />
                                    {label}
                                    <Sparkle className="ml-6 w-3 text-gold/60" />
                                </li>
                            ))}
                        </ul>
                    ))}
                </div>
            </div>
        </div>
    );
}
