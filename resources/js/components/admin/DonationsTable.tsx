import { Link, router } from '@inertiajs/react';
import { Check, Globe, Trash2, UserRound, X } from 'lucide-react';
import { fcfa, shortDate, type AdminDonation, type DonationStatus } from './types';

const statusStyles: Record<DonationStatus, { label: string; className: string }> = {
    pending: { label: 'En attente', className: 'bg-gold-100 text-gold-800' },
    confirmed: { label: 'Confirmé', className: 'bg-forest-100 text-forest-700' },
    rejected: { label: 'Non reçu', className: 'bg-rose-brand-50 text-rose-brand-700' },
};

export function StatusBadge({ status }: { status: DonationStatus }) {
    const style = statusStyles[status];

    return (
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider ${style.className}`}>
            {style.label}
        </span>
    );
}

/**
 * Donation ledger with the confirm / reject / delete actions. Confirming is
 * what credits the amount to the campaign.
 */
export default function DonationsTable({
    donations,
    methods,
    showCampaign = false,
}: {
    donations: AdminDonation[];
    methods: Record<string, string>;
    showCampaign?: boolean;
}) {
    const act = (donation: AdminDonation, action: 'confirmer' | 'rejeter') => {
        router.patch(`/admin/dons/${donation.id}/${action}`, {}, { preserveScroll: true });
    };

    const destroy = (donation: AdminDonation) => {
        if (window.confirm(`Supprimer ce don de ${fcfa(donation.amount)} ?`)) {
            router.delete(`/admin/dons/${donation.id}`, { preserveScroll: true });
        }
    };

    if (donations.length === 0) {
        return <p className="py-8 text-center text-sm text-forest-800/50">Aucun don pour le moment.</p>;
    }

    return (
        <div className="-mx-5 overflow-x-auto sm:-mx-6">
            <table className="w-full min-w-[46rem] text-left text-sm">
                <thead className="border-b border-forest-100 text-[0.7rem] uppercase tracking-wider text-forest-800/55">
                    <tr>
                        <th className="px-5 py-2.5 font-medium sm:px-6">Date</th>
                        {showCampaign && <th className="px-3 py-2.5 font-medium">Campagne</th>}
                        <th className="px-3 py-2.5 font-medium">Donateur</th>
                        <th className="px-3 py-2.5 text-right font-medium">Montant</th>
                        <th className="px-3 py-2.5 font-medium">Paiement</th>
                        <th className="px-3 py-2.5 font-medium">Statut</th>
                        <th className="px-5 py-2.5 text-right font-medium sm:px-6">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {donations.map((donation) => (
                        <tr key={donation.id} className={`border-b border-forest-50 align-top last:border-0 ${donation.status === 'pending' ? 'bg-gold-50/60' : ''}`}>
                            <td className="whitespace-nowrap px-5 py-3 text-forest-800/70 sm:px-6">
                                {shortDate(donation.donatedAt)}
                                <span className="mt-1 flex items-center gap-1 text-[0.7rem] text-forest-800/45">
                                    {donation.source === 'site' ? <Globe className="h-3 w-3" /> : <UserRound className="h-3 w-3" />}
                                    {donation.source === 'site' ? 'Déclaré sur le site' : 'Saisi par l’admin'}
                                </span>
                            </td>
                            {showCampaign && (
                                <td className="px-3 py-3">
                                    <Link href={`/admin/campagnes/${donation.campaignId}?onglet=dons`} className="font-medium text-forest-800 hover:underline">
                                        {donation.campaignTitle}
                                    </Link>
                                </td>
                            )}
                            <td className="px-3 py-3">
                                <p className="font-medium text-forest-900">
                                    {donation.donorName || 'Non renseigné'}
                                    {donation.anonymous && <span className="ml-1.5 text-[0.7rem] font-normal text-forest-800/50">(anonyme sur le site)</span>}
                                </p>
                                {(donation.donorPhone || donation.donorEmail) && (
                                    <p className="text-[0.75rem] text-forest-800/55">{[donation.donorPhone, donation.donorEmail].filter(Boolean).join(' · ')}</p>
                                )}
                                {donation.message && <p className="mt-1 max-w-xs text-[0.75rem] italic text-forest-800/60">« {donation.message} »</p>}
                            </td>
                            <td className="whitespace-nowrap px-3 py-3 text-right font-semibold tabular-nums text-forest-900">{fcfa(donation.amount)}</td>
                            <td className="px-3 py-3 text-[0.8125rem]">
                                {methods[donation.method] ?? donation.method}
                                {donation.reference && <p className="text-[0.7rem] text-forest-800/55">Réf. {donation.reference}</p>}
                            </td>
                            <td className="px-3 py-3">
                                <StatusBadge status={donation.status} />
                                {donation.confirmedBy && <p className="mt-1 text-[0.7rem] text-forest-800/45">par {donation.confirmedBy}</p>}
                            </td>
                            <td className="px-5 py-3 sm:px-6">
                                <div className="flex justify-end gap-1.5">
                                    {donation.status !== 'confirmed' && (
                                        <button
                                            type="button"
                                            onClick={() => act(donation, 'confirmer')}
                                            className="inline-flex items-center gap-1 rounded-full bg-forest-700 px-3 py-1.5 text-[0.75rem] font-semibold text-white hover:bg-forest-600"
                                            title="J’ai bien reçu ce montant : le créditer à la campagne"
                                        >
                                            <Check className="h-3.5 w-3.5" />
                                            Confirmer
                                        </button>
                                    )}
                                    {donation.status !== 'rejected' && (
                                        <button
                                            type="button"
                                            onClick={() => act(donation, 'rejeter')}
                                            className="admin-icon-button h-8 w-8"
                                            title={donation.status === 'confirmed' ? 'Annuler le crédit (non reçu)' : 'Non reçu'}
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => destroy(donation)}
                                        className="admin-icon-button h-8 w-8 hover:border-rose-brand-300 hover:text-rose-brand-700"
                                        title="Supprimer"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
