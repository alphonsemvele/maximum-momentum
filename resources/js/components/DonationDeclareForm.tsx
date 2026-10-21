import { useForm, usePage } from '@inertiajs/react';
import { CheckCircle2, Send } from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';
import { campaignsCopy } from '@/lib/content';
import { useLanguage } from '@/lib/i18n';

/** Lets a donor tell us about the transfer they made; it lands as "pending" in the admin. */
export default function DonationDeclareForm({ slug }: { slug: string }) {
    const { t } = useLanguage();
    const copy = campaignsCopy.declare;
    const { flash } = usePage<{ flash: { donation: string | null } }>().props;
    const form = useForm({
        name: '',
        phone: '',
        email: '',
        amount: '',
        method: 'mtn',
        reference: '',
        message: '',
        anonymous: false,
        website: '',
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.post(`/campagnes/${slug}/dons`, { preserveScroll: true, onSuccess: () => form.reset() });
    };

    if (flash.donation === 'declared' && form.wasSuccessful) {
        return (
            <div className="flex gap-3 rounded-xl bg-forest-800 p-5 text-[0.875rem] leading-relaxed text-cream-100">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold-300" />
                <p>{t(copy.thanks)}</p>
            </div>
        );
    }

    return (
        <form onSubmit={submit} className="grid gap-3">
            <div>
                <h3 className="font-display text-lg font-semibold text-white">{t(copy.title)}</h3>
                <p className="mt-1 text-[0.8125rem] leading-relaxed text-cream-100/60">{t(copy.intro)}</p>
            </div>

            {/* honeypot — hidden from people, tempting for bots */}
            <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={form.data.website}
                onChange={(e) => form.setData('website', e.target.value)}
                className="hidden"
                aria-hidden="true"
            />

            <Input label={t(copy.name)} error={form.errors.name}>
                <input required value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} className="public-input" autoComplete="name" />
            </Input>
            <div className="grid gap-3 sm:grid-cols-2">
                <Input label={t(copy.amount)} error={form.errors.amount}>
                    <input required type="number" min={100} value={form.data.amount} onChange={(e) => form.setData('amount', e.target.value)} className="public-input" />
                </Input>
                <Input label={t(copy.method)} error={form.errors.method}>
                    <select value={form.data.method} onChange={(e) => form.setData('method', e.target.value)} className="public-input">
                        {Object.entries(campaignsCopy.methods).map(([key, label]) => (
                            <option key={key} value={key}>
                                {t(label)}
                            </option>
                        ))}
                    </select>
                </Input>
            </div>
            <Input label={t(copy.phone)} error={form.errors.phone}>
                <input required type="tel" value={form.data.phone} onChange={(e) => form.setData('phone', e.target.value)} className="public-input" autoComplete="tel" />
            </Input>
            <Input label={t(copy.reference)} error={form.errors.reference}>
                <input value={form.data.reference} onChange={(e) => form.setData('reference', e.target.value)} className="public-input" />
            </Input>
            <Input label={t(copy.email)} error={form.errors.email}>
                <input type="email" value={form.data.email} onChange={(e) => form.setData('email', e.target.value)} className="public-input" autoComplete="email" />
            </Input>
            <Input label={t(copy.message)} error={form.errors.message}>
                <textarea rows={2} value={form.data.message} onChange={(e) => form.setData('message', e.target.value)} className="public-input" />
            </Input>
            <label className="flex items-center gap-2 text-[0.8125rem] text-cream-100/75">
                <input type="checkbox" checked={form.data.anonymous} onChange={(e) => form.setData('anonymous', e.target.checked)} className="h-4 w-4 accent-gold-400" />
                {t(copy.anonymous)}
            </label>

            <button
                type="submit"
                disabled={form.processing}
                className="mt-1 inline-flex items-center justify-center gap-2 rounded-full border border-gold-400/60 px-6 py-3 text-sm font-semibold text-gold-200 transition-colors hover:bg-gold-400 hover:text-forest-950 disabled:opacity-60"
            >
                <Send className="h-4 w-4" />
                {t(copy.submit)}
            </button>
        </form>
    );
}

function Input({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
    return (
        <label className="grid gap-1">
            <span className="text-[0.75rem] font-medium text-cream-100/70">{label}</span>
            {children}
            {error && <span className="text-[0.75rem] text-rose-brand-300">{error}</span>}
        </label>
    );
}
