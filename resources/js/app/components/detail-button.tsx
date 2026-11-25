import { Link } from '@inertiajs/react';
import { EyeIcon } from 'lucide-react';
import type { ComponentProps } from 'react';
import { Button } from '@/components/ui/button';

/**
 * The icon button of a table row's actions that opens the row's detail page.
 */
export default function DetailButton({
    href,
    label,
}: {
    href: ComponentProps<typeof Link>['href'];
    /** Accessible name, e.g. "Ver detalle de Ana". */
    label: string;
}) {
    return (
        <Button variant="outline" size="icon" asChild>
            <Link href={href} aria-label={label} title="Ver detalle">
                <EyeIcon />
            </Link>
        </Button>
    );
}
