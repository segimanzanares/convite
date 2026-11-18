import { useId, useRef } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type ContentTab = {
    value: string;
    label: string;
    /** Whether any field in the tab failed validation. */
    invalid?: boolean;
    content: ReactNode;
};

/**
 * The content form's sections as tabs. Every panel stays mounted (only hidden),
 * so an upload in progress or a field's local state survives switching tabs.
 */
export function ContentTabs({
    tabs,
    value,
    onChange,
}: {
    tabs: ContentTab[];
    value: string;
    onChange: (value: string) => void;
}) {
    const id = useId();
    const buttons = useRef<(HTMLButtonElement | null)[]>([]);

    const focusTab = (index: number) => {
        const tab = tabs[(index + tabs.length) % tabs.length];

        onChange(tab.value);
        buttons.current[tabs.indexOf(tab)]?.focus();
    };

    const onKeyDown = (event: KeyboardEvent, index: number) => {
        const target = {
            ArrowRight: index + 1,
            ArrowLeft: index - 1,
            Home: 0,
            End: tabs.length - 1,
        }[event.key];

        if (target !== undefined) {
            event.preventDefault();
            focusTab(target);
        }
    };

    return (
        <div className="space-y-6">
            <div
                role="tablist"
                aria-label="Secciones del contenido"
                className="-mx-4 overflow-x-auto px-4"
            >
                <div className="inline-flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
                    {tabs.map((tab, index) => {
                        const selected = tab.value === value;

                        return (
                            <button
                                key={tab.value}
                                ref={(element) => {
                                    buttons.current[index] = element;
                                }}
                                type="button"
                                role="tab"
                                id={`${id}-tab-${tab.value}`}
                                aria-selected={selected}
                                aria-controls={`${id}-panel-${tab.value}`}
                                tabIndex={selected ? 0 : -1}
                                onClick={() => onChange(tab.value)}
                                onKeyDown={(event) => onKeyDown(event, index)}
                                className={cn(
                                    'flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-sm whitespace-nowrap transition-colors',
                                    selected
                                        ? 'bg-white shadow-xs dark:bg-neutral-700 dark:text-neutral-100'
                                        : 'text-neutral-500 hover:bg-neutral-200/60 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-700/60 dark:hover:text-neutral-100',
                                )}
                            >
                                {tab.label}
                                {tab.invalid && (
                                    <span
                                        className="bg-destructive size-1.5 rounded-full"
                                        aria-label="con errores"
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {tabs.map((tab) => (
                <div
                    key={tab.value}
                    role="tabpanel"
                    id={`${id}-panel-${tab.value}`}
                    aria-labelledby={`${id}-tab-${tab.value}`}
                    hidden={tab.value !== value}
                    className="space-y-6"
                >
                    {tab.content}
                </div>
            ))}
        </div>
    );
}
