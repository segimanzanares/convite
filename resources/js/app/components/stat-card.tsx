import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

/** A headline figure of the dashboard, with an optional line of context under it. */
export default function StatCard({
    label,
    value,
    hint,
    icon: Icon,
}: {
    label: string;
    value: ReactNode;
    hint?: ReactNode;
    icon?: LucideIcon;
}) {
    return (
        <div className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4">
            <dt className="text-muted-foreground flex items-center justify-between gap-2 text-sm">
                {label}
                {Icon && <Icon className="size-4" aria-hidden />}
            </dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums">
                {value}
            </dd>
            {hint && (
                <dd className="text-muted-foreground mt-1 text-xs">{hint}</dd>
            )}
        </div>
    );
}
