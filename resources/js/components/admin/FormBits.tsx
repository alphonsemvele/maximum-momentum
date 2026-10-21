import type { ReactNode } from 'react';

export function Field({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: ReactNode }) {
    return (
        <label className="grid gap-1.5">
            <span className="text-sm font-medium text-forest-800">{label}</span>
            {children}
            {hint && <span className="text-[0.75rem] text-forest-800/50">{hint}</span>}
            {error && <span className="text-sm text-rose-brand-700">{error}</span>}
        </label>
    );
}

export function SubmitButton({ processing, children }: { processing: boolean; children: ReactNode }) {
    return (
        <button
            type="submit"
            disabled={processing}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-forest-800 px-6 py-2.5 text-sm font-semibold text-cream-50 transition-colors hover:bg-forest-700 disabled:opacity-60"
        >
            {children}
        </button>
    );
}
