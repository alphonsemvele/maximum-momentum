import { router, useForm } from '@inertiajs/react';
import { FileText, Plus, Trash2 } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Card } from '@/components/admin/Charts';
import { Field, SubmitButton } from '@/components/admin/FormBits';
import { fcfa, shortDate, today, type AdminExpense, type Options } from '@/components/admin/types';

export default function ExpensesTab({ campaignId, expenses, options }: { campaignId: number; expenses: AdminExpense[]; options: Options }) {
    const [open, setOpen] = useState(false);
    const form = useForm<{ label: string; category: string; amount: string; spentAt: string; notes: string; receipt: File | null }>({
        label: '',
        category: 'materiel',
        amount: '',
        spentAt: today(),
        notes: '',
        receipt: null,
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.post(`/admin/campagnes/${campaignId}/depenses`, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                setOpen(false);
            },
        });
    };

    const destroy = (expense: AdminExpense) => {
        if (window.confirm(`Supprimer la dépense « ${expense.label} » ?`)) {
            router.delete(`/admin/depenses/${expense.id}`, { preserveScroll: true });
        }
    };

    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    return (
        <Card
            title={`Dépenses (${expenses.length}) — ${fcfa(total)}`}
            action={
                <button
                    type="button"
                    onClick={() => setOpen((value) => !value)}
                    className="inline-flex items-center gap-2 rounded-full border border-forest-300 px-4 py-2 text-[0.8125rem] font-semibold text-forest-800 hover:border-forest-600"
                >
                    <Plus className="h-4 w-4" />
                    Ajouter une dépense
                </button>
            }
        >
            {open && (
                <form onSubmit={submit} className="mb-6 grid gap-4 rounded-xl border border-forest-100 bg-forest-50/50 p-5 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="sm:col-span-2">
                        <Field label="Libellé *" error={form.errors.label}>
                            <input value={form.data.label} onChange={(e) => form.setData('label', e.target.value)} className="admin-input" placeholder="Ex. : 200 paquets de serviettes" />
                        </Field>
                    </div>
                    <Field label="Montant (FCFA) *" error={form.errors.amount}>
                        <input type="number" min={1} value={form.data.amount} onChange={(e) => form.setData('amount', e.target.value)} className="admin-input" />
                    </Field>
                    <Field label="Date *" error={form.errors.spentAt}>
                        <input type="date" value={form.data.spentAt} onChange={(e) => form.setData('spentAt', e.target.value)} className="admin-input" />
                    </Field>
                    <Field label="Catégorie" error={form.errors.category}>
                        <select value={form.data.category} onChange={(e) => form.setData('category', e.target.value)} className="admin-input">
                            {Object.entries(options.categories).map(([key, label]) => (
                                <option key={key} value={key}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </Field>
                    <Field label="Justificatif (facture, reçu)" error={form.errors.receipt} hint="PDF ou photo, 10 Mo max.">
                        <input type="file" accept=".pdf,image/*" onChange={(e) => form.setData('receipt', e.target.files?.[0] ?? null)} className="text-sm" />
                    </Field>
                    <div className="sm:col-span-2">
                        <Field label="Note" error={form.errors.notes}>
                            <input value={form.data.notes} onChange={(e) => form.setData('notes', e.target.value)} className="admin-input" />
                        </Field>
                    </div>
                    <div className="flex justify-end sm:col-span-2 lg:col-span-4">
                        <SubmitButton processing={form.processing}>Enregistrer la dépense</SubmitButton>
                    </div>
                </form>
            )}

            {expenses.length === 0 ? (
                <p className="py-8 text-center text-sm text-forest-800/50">Aucune dépense enregistrée.</p>
            ) : (
                <div className="-mx-5 overflow-x-auto sm:-mx-6">
                    <table className="w-full min-w-[38rem] text-left text-sm">
                        <thead className="border-b border-forest-100 text-[0.7rem] uppercase tracking-wider text-forest-800/55">
                            <tr>
                                <th className="px-5 py-2.5 font-medium sm:px-6">Date</th>
                                <th className="px-3 py-2.5 font-medium">Libellé</th>
                                <th className="px-3 py-2.5 font-medium">Catégorie</th>
                                <th className="px-3 py-2.5 text-right font-medium">Montant</th>
                                <th className="px-5 py-2.5 text-right font-medium sm:px-6">Justificatif</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map((expense) => (
                                <tr key={expense.id} className="border-b border-forest-50 last:border-0">
                                    <td className="whitespace-nowrap px-5 py-3 text-forest-800/70 sm:px-6">{shortDate(expense.spentAt)}</td>
                                    <td className="px-3 py-3">
                                        <p className="font-medium text-forest-900">{expense.label}</p>
                                        {expense.notes && <p className="text-[0.75rem] text-forest-800/55">{expense.notes}</p>}
                                    </td>
                                    <td className="px-3 py-3 text-[0.8125rem] text-forest-800/70">{options.categories[expense.category] ?? expense.category}</td>
                                    <td className="whitespace-nowrap px-3 py-3 text-right font-semibold tabular-nums">{fcfa(expense.amount)}</td>
                                    <td className="px-5 py-3 sm:px-6">
                                        <div className="flex items-center justify-end gap-1.5">
                                            {expense.receiptUrl ? (
                                                <a href={expense.receiptUrl} target="_blank" rel="noopener noreferrer" className="admin-icon-button h-8 w-8" title={expense.receiptName ?? 'Justificatif'}>
                                                    <FileText className="h-3.5 w-3.5" />
                                                </a>
                                            ) : (
                                                <span className="text-[0.75rem] text-forest-800/40">—</span>
                                            )}
                                            <button type="button" onClick={() => destroy(expense)} className="admin-icon-button h-8 w-8 hover:border-rose-brand-300 hover:text-rose-brand-700" title="Supprimer">
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </Card>
    );
}
