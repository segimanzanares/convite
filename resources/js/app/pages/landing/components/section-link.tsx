import { Link, usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { landing } from '@/routes';

interface SectionLinkProps {
    /** The section's anchor on the landing page, e.g. "#planes". */
    href: `#${string}`;
    className?: string;
    children: ReactNode;
}

/**
 * Links to a section of the landing page: a plain anchor there, and a visit to the landing page from the other public
 * pages (e.g. the services page), which shares their header and footer.
 */
export function SectionLink({ href, className, children }: SectionLinkProps) {
    const isOnLanding = usePage().component === 'landing/index';

    return isOnLanding ? (
        <a href={href} className={className}>
            {children}
        </a>
    ) : (
        <Link href={`${landing.url()}${href}`} className={className}>
            {children}
        </Link>
    );
}
