import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { useState, type ReactNode } from 'react';

const numberFormat = new Intl.NumberFormat('fr-FR');

export const formatNumber = (value: number) => numberFormat.format(value);

const shortDate = (iso: string) =>
    new Date(`${iso}T00:00:00`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

const longDate = (iso: string) =>
    new Date(`${iso}T00:00:00`).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

/* ------------------------------- stat tile ------------------------------- */

/** Change vs the previous period, as a whole percentage. Null when there is nothing to compare to. */
function percentChange(current: number, previous: number) {
    if (previous === 0) return current === 0 ? 0 : null;
    return Math.round(((current - previous) / previous) * 100);
}

export function StatTile({
    label,
    value,
    previous,
    hint,
    icon,
}: {
    label: string;
    value: string;
    /** Raw current/previous numbers; renders the trend line when given. */
    previous?: { current: number; previous: number };
    hint?: string;
    icon?: ReactNode;
}) {
    const change = previous ? percentChange(previous.current, previous.previous) : undefined;

    return (
        <div className="rounded-2xl border border-forest-200/70 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
                <p className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-forest-800/55">{label}</p>
                {icon && <span className="text-forest-500">{icon}</span>}
            </div>
            <p className="mt-3 font-display text-3xl font-semibold leading-none text-forest-900">{value}</p>

            {change !== undefined && (
                <p className="mt-3 flex items-center gap-1.5 text-[0.75rem] text-forest-800/60">
                    {change === null ? (
                        <span>Nouveau sur la période</span>
                    ) : (
                        <>
                            {change > 0 ? (
                                <ArrowUpRight className="h-3.5 w-3.5 text-forest-600" />
                            ) : change < 0 ? (
                                <ArrowDownRight className="h-3.5 w-3.5 text-rose-brand-600" />
                            ) : (
                                <Minus className="h-3.5 w-3.5" />
                            )}
                            <strong className="font-semibold text-forest-900">
                                {change > 0 ? '+' : ''}
                                {change} %
                            </strong>
                            <span>vs période précédente</span>
                        </>
                    )}
                </p>
            )}
            {hint && change === undefined && <p className="mt-3 text-[0.75rem] text-forest-800/55">{hint}</p>}
        </div>
    );
}

/* ------------------------------ daily chart ------------------------------ */

export type DailyPoint = { date: string; views: number; visitors: number };

/**
 * Single-series column chart of one metric per day. Each column is its own
 * hover/focus target; the same numbers are available as a table.
 */
export function DailyChart({ data, metric, label }: { data: DailyPoint[]; metric: 'views' | 'visitors'; label: string }) {
    const [active, setActive] = useState<number | null>(null);
    const [showTable, setShowTable] = useState(false);

    const values = data.map((point) => point[metric]);
    const max = Math.max(...values, 0);
    // A round top for the scale so the gridline labels read cleanly.
    const scaleTop = max === 0 ? 1 : niceCeil(max);
    const total = values.reduce((sum, value) => sum + value, 0);
    const tickIndexes = [0, Math.floor((data.length - 1) / 2), data.length - 1];
    const activePoint = active !== null ? data[active] : null;

    return (
        <div>
            <div className="relative">
                {/* recessive gridlines */}
                <div className="pointer-events-none absolute inset-0 bottom-6 flex flex-col justify-between">
                    {[scaleTop, scaleTop / 2, 0].map((tick) => (
                        <div key={tick} className="flex items-center gap-2">
                            <span className="w-8 shrink-0 text-right text-[0.625rem] tabular-nums text-forest-800/45">
                                {formatNumber(Math.round(tick))}
                            </span>
                            <span className="h-px flex-1 bg-forest-100" />
                        </div>
                    ))}
                </div>

                <div className="relative ml-10 flex h-56 items-end gap-[2px] pb-6" onPointerLeave={() => setActive(null)}>
                    {data.map((point, index) => {
                        const value = point[metric];
                        const height = (value / scaleTop) * 100;

                        return (
                            <button
                                key={point.date}
                                type="button"
                                onPointerEnter={() => setActive(index)}
                                onFocus={() => setActive(index)}
                                onBlur={() => setActive(null)}
                                aria-label={`${longDate(point.date)} : ${formatNumber(value)} ${label.toLowerCase()}`}
                                className="group relative flex h-full flex-1 items-end outline-none"
                            >
                                <span
                                    className={`block w-full rounded-t-[4px] transition-colors ${
                                        active === index ? 'bg-forest-700' : 'bg-forest-500 group-focus-visible:bg-forest-700'
                                    }`}
                                    style={{ height: value === 0 ? 0 : `max(${height}%, 3px)` }}
                                />
                            </button>
                        );
                    })}

                    {/* x-axis ticks */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-5">
                        {tickIndexes.map((index, position) => (
                            <span
                                key={`${index}-${position}`}
                                className="absolute text-[0.625rem] text-forest-800/50"
                                style={{
                                    left: `${((index + 0.5) / data.length) * 100}%`,
                                    transform: position === 0 ? 'translateX(-20%)' : position === 2 ? 'translateX(-80%)' : 'translateX(-50%)',
                                }}
                            >
                                {data[index] && shortDate(data[index].date)}
                            </span>
                        ))}
                    </div>

                    {activePoint && active !== null && (
                        <div
                            role="status"
                            className="pointer-events-none absolute -top-2 z-10 -translate-y-full whitespace-nowrap rounded-lg bg-forest-950 px-3 py-2 text-[0.75rem] text-cream-100 shadow-lift"
                            style={{
                                left: `${((active + 0.5) / data.length) * 100}%`,
                                transform: `translate(${active < data.length / 3 ? '-15%' : active > (data.length * 2) / 3 ? '-85%' : '-50%'}, -100%)`,
                            }}
                        >
                            <strong className="block text-sm font-semibold text-white">
                                {formatNumber(activePoint[metric])} {label.toLowerCase()}
                            </strong>
                            <span className="text-cream-100/60">{longDate(activePoint.date)}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[0.75rem] text-forest-800/60">
                <span>
                    Total : <strong className="font-semibold text-forest-900">{formatNumber(total)}</strong>
                </span>
                <button type="button" onClick={() => setShowTable((shown) => !shown)} className="font-medium text-forest-700 underline">
                    {showTable ? 'Masquer le tableau' : 'Voir en tableau'}
                </button>
            </div>

            {showTable && (
                <div className="mt-3 max-h-72 overflow-auto rounded-lg border border-forest-100">
                    <table className="w-full text-left text-[0.8125rem]">
                        <thead className="sticky top-0 bg-forest-50 text-forest-800/70">
                            <tr>
                                <th className="px-3 py-2 font-medium">Jour</th>
                                <th className="px-3 py-2 text-right font-medium">Vues</th>
                                <th className="px-3 py-2 text-right font-medium">Visiteurs</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...data].reverse().map((point) => (
                                <tr key={point.date} className="border-t border-forest-100">
                                    <td className="px-3 py-1.5 capitalize">{longDate(point.date)}</td>
                                    <td className="px-3 py-1.5 text-right tabular-nums">{formatNumber(point.views)}</td>
                                    <td className="px-3 py-1.5 text-right tabular-nums">{formatNumber(point.visitors)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

function niceCeil(value: number) {
    const magnitude = 10 ** Math.floor(Math.log10(value));
    const steps = [1, 2, 2.5, 5, 10];
    const step = steps.find((candidate) => candidate * magnitude >= value) ?? 10;
    return step * magnitude;
}

/* -------------------------------- bar list ------------------------------- */

export type BarItem = { label: string; value: number; href?: string; note?: string };

/** Ranked horizontal bars: label above, bar scaled to the largest value, number at the end. */
export function BarList({ items, empty = 'Aucune donnée sur la période.', unit = 'vues' }: { items: BarItem[]; empty?: string; unit?: string }) {
    const max = Math.max(...items.map((item) => item.value), 0);
    const total = items.reduce((sum, item) => sum + item.value, 0);

    if (items.length === 0 || max === 0) {
        return <p className="py-6 text-center text-sm text-forest-800/50">{empty}</p>;
    }

    return (
        <ul className="grid gap-3.5">
            {items.map((item) => {
                const share = total > 0 ? Math.round((item.value / total) * 100) : 0;

                return (
                    <li key={item.label} title={`${formatNumber(item.value)} ${unit} · ${share} %`}>
                        <div className="flex items-baseline justify-between gap-3 text-[0.8125rem]">
                            <span className="min-w-0 truncate text-forest-900">
                                {item.href ? (
                                    <a href={item.href} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                        {item.label}
                                    </a>
                                ) : (
                                    item.label
                                )}
                                {item.note && <span className="ml-2 text-[0.7rem] text-forest-800/45">{item.note}</span>}
                            </span>
                            <span className="shrink-0 tabular-nums text-forest-800/70">
                                <strong className="font-semibold text-forest-900">{formatNumber(item.value)}</strong>
                                <span className="ml-1.5 text-[0.7rem] text-forest-800/45">{share} %</span>
                            </span>
                        </div>
                        <div className="mt-1.5 h-2 rounded-full bg-forest-50">
                            <div
                                className="h-full rounded-full bg-forest-500"
                                style={{ width: `${Math.max((item.value / max) * 100, item.value > 0 ? 2 : 0)}%` }}
                            />
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}

/* ---------------------------------- card --------------------------------- */

export function Card({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
    return (
        <section className="rounded-2xl border border-forest-200/70 bg-white p-5 sm:p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-display text-lg font-semibold text-forest-900">{title}</h2>
                {action}
            </div>
            {children}
        </section>
    );
}
