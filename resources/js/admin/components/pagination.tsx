import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import type { Paginated } from '@/types';

/** Page links of a paginated resource collection. Hidden when there is a single page. */
export default function Pagination({
    meta,
}: {
    meta: Paginated<unknown>['meta'];
}) {
    if (meta.last_page <= 1) {
        return null;
    }

    return (
        <div className="flex flex-wrap gap-1">
            {meta.links.map((link, index) => (
                <Button
                    key={index}
                    variant={link.active ? 'default' : 'outline'}
                    size="sm"
                    disabled={!link.url}
                    asChild={!!link.url}
                >
                    {link.url ? (
                        <Link
                            href={link.url}
                            preserveScroll
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ) : (
                        <span
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    )}
                </Button>
            ))}
        </div>
    );
}
