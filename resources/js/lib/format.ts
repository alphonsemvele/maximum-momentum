import type { Lang } from '@/lib/i18n';

export function formatFcfa(amount: number, lang: Lang) {
    return `${amount.toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US')} FCFA`;
}

export function formatDate(iso: string, lang: Lang) {
    return new Date(`${iso}T00:00:00`).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

/** Share of the goal reached, clamped to 0–100. Null when no goal is set. */
export function progressPercent(raised: number, goal: number | null) {
    if (!goal) return null;
    return Math.min(100, Math.round((raised / goal) * 100));
}
