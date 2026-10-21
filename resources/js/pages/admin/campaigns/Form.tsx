import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, ImagePlus, Save, X } from 'lucide-react';
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { domainLabels, type Domain } from '@/lib/content';
import type { AdminCampaign } from './types';

type FormData = {
    titleFr: string;
    titleEn: string;
    summaryFr: string;
    summaryEn: string;
    descriptionFr: string;
    descriptionEn: string;
    domain: Domain;
    location: string;
    startsAt: string;
    endsAt: string;
    goalAmount: string;
    beneficiaries: string;
    image: File | null;
    removeImage: boolean;
    status: 'draft' | 'published';
    featured: boolean;
};

const numberField = (value: number | null) => (value === null ? '' : String(value));

export default function CampaignForm({ campaign }: { campaign: AdminCampaign | null }) {
    const editing = campaign !== null;

    const form = useForm<FormData>({
        titleFr: campaign?.titleFr ?? '',
        titleEn: campaign?.titleEn ?? '',
        summaryFr: campaign?.summaryFr ?? '',
        summaryEn: campaign?.summaryEn ?? '',
        descriptionFr: campaign?.descriptionFr ?? '',
        descriptionEn: campaign?.descriptionEn ?? '',
        domain: campaign?.domain ?? 'sante',
        location: campaign?.location ?? '',
        startsAt: campaign?.startsAt ?? '',
        endsAt: campaign?.endsAt ?? '',
        goalAmount: numberField(campaign?.goalAmount ?? null),
        beneficiaries: numberField(campaign?.beneficiaries ?? null),
        image: null,
        removeImage: false,
        status: campaign?.status ?? 'draft',
        featured: campaign?.featured ?? false,
    });

    // Preview of the newly picked file, or the stored image unless it is being removed.
    const [preview, setPreview] = useState<string | null>(campaign?.image ?? null);
    const objectUrl = useMemo(() => (form.data.image ? URL.createObjectURL(form.data.image) : null), [form.data.image]);

    useEffect(() => {
        if (objectUrl) setPreview(objectUrl);
        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [objectUrl]);

    const pickImage = (file: File | null) => {
        form.setData((data) => ({ ...data, image: file, removeImage: false }));
    };

    const clearImage = () => {
        form.setData((data) => ({ ...data, image: null, removeImage: true }));
        setPreview(null);
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();

        if (editing) {
            // Files only travel over POST; Laravel reads the real verb from _method.
            form.transform((data) => ({ ...data, _method: 'put' }));
            form.post(`/admin/campagnes/${campaign.id}`, { forceFormData: true, preserveScroll: true });
        } else {
            form.post('/admin/campagnes', { forceFormData: true, preserveScroll: true });
        }
    };

    const { data, setData, errors } = form;

    return (
        <AdminLayout
            title={editing ? 'Modifier la campagne' : 'Nouvelle campagne'}
            actions={
                <Link
                    href={editing ? `/admin/campagnes/${campaign.id}` : '/admin/campagnes'}
                    className="inline-flex items-center gap-2 text-sm font-medium text-forest-700 hover:text-forest-900"
                >
                    <ArrowLeft className="h-4 w-4" />
                    {editing ? 'Retour à la campagne' : 'Retour à la liste'}
                </Link>
            }
        >
            <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_20rem]">
                <div className="grid gap-6">
                    <Panel title="Contenu en français" hint="Obligatoire — c’est la version affichée par défaut.">
                        <Field label="Titre" error={errors.titleFr} required>
                            <input
                                value={data.titleFr}
                                onChange={(event) => setData('titleFr', event.target.value)}
                                className="admin-input"
                                placeholder="Ex. : Journée de dépistage à Mvog-Ada"
                            />
                        </Field>
                        <Field label="Résumé" error={errors.summaryFr} required hint="1 à 2 phrases, affichées sur la carte de la campagne.">
                            <textarea
                                value={data.summaryFr}
                                onChange={(event) => setData('summaryFr', event.target.value)}
                                rows={3}
                                className="admin-input"
                            />
                        </Field>
                        <Field label="Description complète" error={errors.descriptionFr} hint="Laissez une ligne vide entre deux paragraphes.">
                            <textarea
                                value={data.descriptionFr}
                                onChange={(event) => setData('descriptionFr', event.target.value)}
                                rows={8}
                                className="admin-input"
                            />
                        </Field>
                    </Panel>

                    <Panel title="Contenu en anglais" hint="Facultatif — le français est utilisé si un champ reste vide.">
                        <Field label="Title" error={errors.titleEn}>
                            <input
                                value={data.titleEn}
                                onChange={(event) => setData('titleEn', event.target.value)}
                                className="admin-input"
                            />
                        </Field>
                        <Field label="Summary" error={errors.summaryEn}>
                            <textarea
                                value={data.summaryEn}
                                onChange={(event) => setData('summaryEn', event.target.value)}
                                rows={3}
                                className="admin-input"
                            />
                        </Field>
                        <Field label="Full description" error={errors.descriptionEn}>
                            <textarea
                                value={data.descriptionEn}
                                onChange={(event) => setData('descriptionEn', event.target.value)}
                                rows={8}
                                className="admin-input"
                            />
                        </Field>
                    </Panel>

                    <Panel title="Détails">
                        <div className="grid gap-5 sm:grid-cols-2">
                            <Field label="Domaine d’action" error={errors.domain} required>
                                <select
                                    value={data.domain}
                                    onChange={(event) => setData('domain', event.target.value as Domain)}
                                    className="admin-input"
                                >
                                    {(Object.keys(domainLabels) as Domain[]).map((domain) => (
                                        <option key={domain} value={domain}>
                                            {domainLabels[domain].fr}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                            <Field label="Lieu" error={errors.location}>
                                <input
                                    value={data.location}
                                    onChange={(event) => setData('location', event.target.value)}
                                    className="admin-input"
                                    placeholder="Ex. : Yaoundé"
                                />
                            </Field>
                            <Field label="Date de début" error={errors.startsAt}>
                                <input
                                    type="date"
                                    value={data.startsAt}
                                    onChange={(event) => setData('startsAt', event.target.value)}
                                    className="admin-input"
                                />
                            </Field>
                            <Field label="Date de fin" error={errors.endsAt}>
                                <input
                                    type="date"
                                    value={data.endsAt}
                                    onChange={(event) => setData('endsAt', event.target.value)}
                                    className="admin-input"
                                />
                            </Field>
                        </div>
                    </Panel>

                    <Panel
                        title="Collecte"
                        hint="Le montant collecté se calcule tout seul à partir des dons confirmés (onglet « Dons » de la campagne). Laissez l’objectif vide si la campagne ne fait pas d’appel aux dons chiffré."
                    >
                        <div className="grid gap-5 sm:grid-cols-2">
                            <Field label="Objectif (FCFA)" error={errors.goalAmount}>
                                <input
                                    type="number"
                                    min={0}
                                    step={500}
                                    value={data.goalAmount}
                                    onChange={(event) => setData('goalAmount', event.target.value)}
                                    className="admin-input"
                                />
                            </Field>
                            <Field label="Bénéficiaires visés" error={errors.beneficiaries}>
                                <input
                                    type="number"
                                    min={0}
                                    value={data.beneficiaries}
                                    onChange={(event) => setData('beneficiaries', event.target.value)}
                                    className="admin-input"
                                />
                            </Field>
                        </div>
                    </Panel>
                </div>

                {/* ----------------------------- sidebar ----------------------------- */}
                <div className="grid content-start gap-6 lg:sticky lg:top-6">
                    <Panel title="Publication">
                        <div className="grid gap-2">
                            {(['draft', 'published'] as const).map((status) => (
                                <label
                                    key={status}
                                    className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3.5 py-2.5 text-sm ${
                                        data.status === status ? 'border-forest-500 bg-forest-50' : 'border-forest-200'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="status"
                                        checked={data.status === status}
                                        onChange={() => setData('status', status)}
                                        className="accent-forest-700"
                                    />
                                    {status === 'draft' ? 'Brouillon (invisible sur le site)' : 'Publiée sur le site'}
                                </label>
                            ))}
                        </div>

                        <label className="flex items-center gap-2.5 text-sm text-forest-800">
                            <input
                                type="checkbox"
                                checked={data.featured}
                                onChange={(event) => setData('featured', event.target.checked)}
                                className="h-4 w-4 accent-forest-700"
                            />
                            Mettre à la une (affichée en premier)
                        </label>

                        <button
                            type="submit"
                            disabled={form.processing}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest-800 px-6 py-3 text-sm font-semibold text-cream-50 transition-colors hover:bg-forest-700 disabled:opacity-60"
                        >
                            <Save className="h-4 w-4" />
                            {form.processing ? 'Enregistrement…' : editing ? 'Enregistrer les modifications' : 'Créer la campagne'}
                        </button>

                        {form.progress && (
                            <div className="h-1.5 overflow-hidden rounded-full bg-forest-100">
                                <div className="h-full bg-forest-600" style={{ width: `${form.progress.percentage ?? 0}%` }} />
                            </div>
                        )}
                    </Panel>

                    <Panel
                        title="Image de couverture"
                        hint="JPG, PNG ou WebP, 5 Mo maximum. Pour ajouter plusieurs photos, utilisez l’onglet « Images » de la campagne."
                    >
                        {preview ? (
                            <div className="relative overflow-hidden rounded-xl">
                                <img src={preview} alt="" className="aspect-[16/10] w-full object-cover" />
                                <button
                                    type="button"
                                    onClick={clearImage}
                                    className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-forest-950/70 text-white hover:bg-forest-950"
                                    title="Retirer l’image"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex aspect-[16/10] items-center justify-center rounded-xl border border-dashed border-forest-300 bg-forest-50 text-forest-800/40">
                                <ImagePlus className="h-8 w-8" />
                            </div>
                        )}

                        <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-forest-300 px-4 py-2 text-sm font-medium text-forest-800 hover:border-forest-600">
                            <ImagePlus className="h-4 w-4" />
                            {preview ? 'Changer l’image' : 'Choisir une image'}
                            <input
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={(event) => pickImage(event.target.files?.[0] ?? null)}
                            />
                        </label>
                        {errors.image && <p className="text-sm text-rose-brand-700">{errors.image}</p>}
                    </Panel>
                </div>
            </form>
        </AdminLayout>
    );
}

function Panel({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
    return (
        <section className="grid gap-5 rounded-2xl border border-forest-200/70 bg-white p-6">
            <div>
                <h2 className="font-display text-lg font-semibold text-forest-900">{title}</h2>
                {hint && <p className="mt-1 text-[0.8125rem] text-forest-800/55">{hint}</p>}
            </div>
            {children}
        </section>
    );
}

function Field({
    label,
    hint,
    error,
    required,
    children,
}: {
    label: string;
    hint?: string;
    error?: string;
    required?: boolean;
    children: ReactNode;
}) {
    return (
        <label className="grid gap-1.5">
            <span className="text-sm font-medium text-forest-800">
                {label}
                {required && <span className="text-rose-brand-600"> *</span>}
            </span>
            {children}
            {hint && <span className="text-[0.75rem] text-forest-800/50">{hint}</span>}
            {error && <span className="text-sm text-rose-brand-700">{error}</span>}
        </label>
    );
}
