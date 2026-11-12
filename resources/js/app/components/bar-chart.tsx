type Series = {
    name: string;
    /** Tailwind background class of the series' bars and legend swatch, e.g. "bg-chart-2". */
    className: string;
};

type Point = {
    label: string;
    /** One value per series, in the same order. */
    values: number[];
};

/**
 * A small bar chart drawn with plain elements, so the panel needs no chart library. Series sit side by side, or on top
 * of each other when stacked. Screen readers get the figures as a table.
 */
export default function BarChart({
    title,
    series,
    data,
    stacked = false,
    format = (value) => String(value),
}: {
    title: string;
    series: Series[];
    data: Point[];
    stacked?: boolean;
    format?: (value: number) => string;
}) {
    const max = Math.max(
        1,
        ...data.map((point) =>
            stacked
                ? point.values.reduce((sum, value) => sum + value, 0)
                : Math.max(...point.values),
        ),
    );
    const height = (value: number) => `${(value / max) * 100}%`;

    return (
        <figure className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <figcaption className="text-sm font-medium">{title}</figcaption>
                <ul className="text-muted-foreground flex flex-wrap gap-4 text-xs">
                    {series.map((item) => (
                        <li
                            key={item.name}
                            className="flex items-center gap-1.5"
                        >
                            <span
                                className={`size-2.5 rounded-sm ${item.className}`}
                                aria-hidden
                            />
                            {item.name}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="flex h-40 items-end gap-1 border-b" aria-hidden>
                {data.map((point) => (
                    <div
                        key={point.label}
                        className="group flex h-full flex-1 items-end justify-center gap-0.5"
                        title={`${point.label}\n${series.map((item, index) => `${item.name}: ${format(point.values[index])}`).join('\n')}`}
                    >
                        {stacked ? (
                            <div className="flex h-full w-full max-w-10 flex-col-reverse">
                                {series.map((item, index) => (
                                    <div
                                        key={item.name}
                                        className={`${item.className} last:rounded-t-sm group-hover:opacity-80`}
                                        style={{
                                            height: height(point.values[index]),
                                        }}
                                    />
                                ))}
                            </div>
                        ) : (
                            series.map((item, index) => (
                                <div
                                    key={item.name}
                                    className={`${item.className} w-full max-w-6 rounded-t-sm group-hover:opacity-80`}
                                    style={{
                                        height: height(point.values[index]),
                                    }}
                                />
                            ))
                        )}
                    </div>
                ))}
            </div>

            <div
                className="text-muted-foreground flex gap-1 text-xs"
                aria-hidden
            >
                {data.map((point) => (
                    <span
                        key={point.label}
                        className="flex-1 truncate text-center"
                    >
                        {point.label}
                    </span>
                ))}
            </div>

            <table className="sr-only">
                <caption>{title}</caption>
                <thead>
                    <tr>
                        <th scope="col">Periodo</th>
                        {series.map((item) => (
                            <th key={item.name} scope="col">
                                {item.name}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((point) => (
                        <tr key={point.label}>
                            <th scope="row">{point.label}</th>
                            {point.values.map((value, index) => (
                                <td key={series[index].name}>
                                    {format(value)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </figure>
    );
}
