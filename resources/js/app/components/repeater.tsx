import { ArrowDownIcon, ArrowUpIcon, PlusIcon, TrashIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

type Props<T> = {
    items: T[];
    onChange: (items: T[]) => void;
    /** A new, empty item. */
    create: () => T;
    addLabel: string;
    max?: number;
    renderItem: (item: T, index: number) => ReactNode;
};

/** An editable list: add, remove and reorder items, each rendered by the caller. */
export default function Repeater<T>({
    items,
    onChange,
    create,
    addLabel,
    max,
    renderItem,
}: Props<T>) {
    const move = (from: number, to: number) => {
        const next = [...items];
        const [item] = next.splice(from, 1);
        next.splice(to, 0, item);
        onChange(next);
    };

    return (
        <div className="space-y-3">
            {items.map((item, index) => (
                <div key={index} className="flex gap-2 rounded-lg border p-3">
                    <div className="min-w-0 flex-1">
                        {renderItem(item, index)}
                    </div>
                    <div className="flex flex-col gap-1">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            disabled={index === 0}
                            onClick={() => move(index, index - 1)}
                            aria-label="Subir"
                        >
                            <ArrowUpIcon />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            disabled={index === items.length - 1}
                            onClick={() => move(index, index + 1)}
                            aria-label="Bajar"
                        >
                            <ArrowDownIcon />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                                onChange(items.filter((_, i) => i !== index))
                            }
                            aria-label="Quitar"
                        >
                            <TrashIcon />
                        </Button>
                    </div>
                </div>
            ))}
            {(max === undefined || items.length < max) && (
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onChange([...items, create()])}
                >
                    <PlusIcon />
                    {addLabel}
                </Button>
            )}
        </div>
    );
}
