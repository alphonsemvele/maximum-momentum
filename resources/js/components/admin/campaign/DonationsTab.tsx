import { useForm } from '@inertiajs/react';
import { Info, Plus } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Card } from '@/components/admin/Charts';
import DonationsTable from '@/components/admin/DonationsTable';
import { Field, SubmitButton } from '@/components/admin/FormBits';
import { today, type AdminDonation, type Options } from '@/components/admin/types';

export default function DonationsTab({ campaignId, donations, options }: { campaignId: number; donations: AdminDonation[]; options: Options }) {
    const [open, setOpen] = useState(false);
    const form = useForm({
        donorName: '',
        donorPhone: '',
        donorEmail: '',
        anonymous: false,
        amount: '',
        method: 'mtn',
        reference: '',
        message: '',
        donatedAt: today(),
        confirmed: true,
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.post(`/admin/campagnes/${campaignId}/dons`, {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                setOpen(false);
            },
        });
    };

    return (
        <div className="grid gap-6">
            <div className="flex gap-3 rounded-2xl border border-gold-200 bg-gold-50 p-5 text-[0.8125rem] leading-relaxed text-forest-900">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold-700" />
                <div>
                    <p className="font-semibold">Comment un don est crédité</p>
                    <p className="mt-1 text-forest-800/75">
                        Tous les dons passent par WhatsApp : le donateur envoie l’argent par Mobile Money puis la capture de son transfert
                        sur WhatsApp. Vérifiez la réception sur le téléphone MTN / Orange, puis cliquez sur « Enregistrer un don » avec
                        <strong> Montant reçu</strong> coché : il est aussitôt ajouté au total collecté affiché sur le site. Décochez-le pour
                        garder un don <strong>en attente</strong> le temps de la vérification, puis cliquez sur <strong>Confirmer</strong>.
                    </p>
                </div>
            </div>

            <Card
                title={`Dons (${donations.length})`}
                action={
                    <button
                        type="button"
                        onClick={() => setOpen((value) => !value)}
                        className="inline-flex items-center gap-2 rounded-full border border-forest-300 px-4 py-2 text-[0.8125rem] font-semibold text-forest-800 hover:border-forest-600"
                    >
                        <Plus className="h-4 w-4" />
                        Enregistrer un don
                    </button>
                }
            >
                {open && (
                    <form onSubmit={submit} className="mb-6 grid gap-4 rounded-xl border border-forest-100 bg-forest-50/50 p-5 sm:grid-cols-2 lg:grid-cols-3">
                        <Field label="Montant (FCFA) *" error={form.errors.amount}>
                            <input type="number" min={1} value={form.data.amount} onChange={(e) => form.setData('amount', e.target.value)} className="admin-input" />
                        </Field>
                        <Field label="Moyen de paiement *" error={form.errors.method}>
                            <select value={form.data.method} onChange={(e) => form.setData('method', e.target.value)} className="admin-input">
                                {Object.entries(options.methods).map(([key, label]) => (
                                    <option key={key} value={key}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <Field label="Date du don *" error={form.errors.donatedAt}>
                            <input type="date" value={form.data.donatedAt} onChange={(e) => form.setData('donatedAt', e.target.value)} className="admin-input" />
                        </Field>
                        <Field label="Nom du donateur" error={form.errors.donorName}>
                            <input value={form.data.donorName} onChange={(e) => form.setData('donorName', e.target.value)} className="admin-input" />
                        </Field>
                        <Field label="Téléphone" error={form.errors.donorPhone}>
                            <input value={form.data.donorPhone} onChange={(e) => form.setData('donorPhone', e.target.value)} className="admin-input" />
                        </Field>
                        <Field label="Référence de transaction" error={form.errors.reference}>
                            <input value={form.data.reference} onChange={(e) => form.setData('reference', e.target.value)} className="admin-input" />
                        </Field>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 sm:col-span-2 lg:col-span-3">
                            <label className="flex items-center gap-2 text-sm text-forest-800">
                                <input type="checkbox" checked={form.data.confirmed} onChange={(e) => form.setData('confirmed', e.target.checked)} className="h-4 w-4 accent-forest-700" />
                                Montant reçu : créditer tout de suite
                            </label>
                            <label className="flex items-center gap-2 text-sm text-forest-800">
                                <input type="checkbox" checked={form.data.anonymous} onChange={(e) => form.setData('anonymous', e.target.checked)} className="h-4 w-4 accent-forest-700" />
                                Anonyme sur le site
                            </label>
                            <div className="ml-auto">
                                <SubmitButton processing={form.processing}>Enregistrer le don</SubmitButton>
                            </div>
                        </div>
                    </form>
                )}

                <DonationsTable donations={donations} methods={options.methods} />
            </Card>
        </div>
    );
}
