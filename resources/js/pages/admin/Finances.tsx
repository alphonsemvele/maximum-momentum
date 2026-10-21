import { Link, router } from '@inertiajs/react';
import { HandCoins, Hourglass, Receipt, Wallet } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, StatTile } from '@/components/admin/Charts';
import DonationsTable from '@/components/admin/DonationsTable';
import { fcfa, type AdminDonation, type DonationStatus, type FinanceSummary, type Options } from '@/components/admin/types';

type CampaignRow = FinanceSummary & { id: number; title: string; status: string };

type Props = {
    totals: { raised: number; pendingAmount: number; pendingCount: number; spent: number; balance: number; goal: number };
    campaigns: CampaignRow[];
    donations: AdminDonation[];
    filters: { status: DonationStatus | null; campaign: number | null };
    options: Options;
};

const statusFilters: { id: DonationStatus | null; label: string }[] = [
    { id: null, label: 'Tous' },
    { id: 'pending', label: 'En attente' },
    { id: 'confirmed', label: 'Confirmés' },
    { id: 'rejected', label: 'Non reçus' },
];

export default function Finances({ totals, campaigns, donations, filters, options }: Props) {
    const applyFilters = (next: Partial<Props['filters']>) => {
        const merged = { ...filters, ...next };
        router.get(
            '/admin/finances',
            { statut: merged.status ?? undefined, campagne: merged.campaign ?? undefined },
            { preserveScroll: true, preserveState: true },
        );
    };

    return (
        <AdminLayout title="Finances">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatTile label="Total collecté" value={fcfa(totals.raised)} hint="Dons confirmés, toutes campagnes" icon={<HandCoins className="h-4 w-4" />} />
                <StatTile
                    label="À vérifier"
                    value={fcfa(totals.pendingAmount)}
                    hint={`${totals.pendingCount} don(s) en attente de confirmation`}
                    icon={<Hourglass className="h-4 w-4" />}
                />
                <StatTile label="Dépenses" value={fcfa(totals.spent)} hint="Toutes campagnes" icon={<Receipt className="h-4 w-4" />} />
                <StatTile label="Solde" value={fcfa(totals.balance)} hint="Collecté − dépenses" icon={<Wallet className="h-4 w-4" />} />
            </div>

            <div className="mt-6">
                <Card title="Bilan par campagne">
                    <div className="-mx-5 overflow-x-auto sm:-mx-6">
                        <table className="w-full min-w-[44rem] text-left text-sm">
                            <thead className="border-b border-forest-100 text-[0.7rem] uppercase tracking-wider text-forest-800/55">
                                <tr>
                                    <th className="px-5 py-2.5 font-medium sm:px-6">Campagne</th>
                                    <th className="px-3 py-2.5 text-right font-medium">Objectif</th>
                                    <th className="px-3 py-2.5 text-right font-medium">Collecté</th>
                                    <th className="px-3 py-2.5 text-right font-medium">En attente</th>
                                    <th className="px-3 py-2.5 text-right font-medium">Dépenses</th>
                                    <th className="px-5 py-2.5 text-right font-medium sm:px-6">Solde</th>
                                </tr>
                            </thead>
                            <tbody>
                                {campaigns.map((campaign) => (
                                    <tr key={campaign.id} className="border-b border-forest-50 last:border-0">
                                        <td className="px-5 py-3 sm:px-6">
                                            <Link href={`/admin/campagnes/${campaign.id}`} className="font-medium text-forest-900 hover:underline">
                                                {campaign.title}
                                            </Link>
                                            {campaign.goal > 0 && (
                                                <div className="mt-1.5 h-1 w-32 overflow-hidden rounded-full bg-forest-100">
                                                    <div className="h-full bg-gold-500" style={{ width: `${Math.min(100, (campaign.raised / campaign.goal) * 100)}%` }} />
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-3 py-3 text-right tabular-nums text-forest-800/70">{campaign.goal > 0 ? fcfa(campaign.goal) : '—'}</td>
                                        <td className="px-3 py-3 text-right font-semibold tabular-nums">{fcfa(campaign.raised)}</td>
                                        <td className="px-3 py-3 text-right tabular-nums text-forest-800/70">
                                            {campaign.pendingCount > 0 ? `${fcfa(campaign.pendingAmount)} (${campaign.pendingCount})` : '—'}
                                        </td>
                                        <td className="px-3 py-3 text-right tabular-nums text-forest-800/70">{fcfa(campaign.spent)}</td>
                                        <td className="px-5 py-3 text-right font-semibold tabular-nums sm:px-6">{fcfa(campaign.balance)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            <div className="mt-6">
                <Card
                    title="Registre des dons"
                    action={
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="flex rounded-full border border-forest-200 p-0.5" role="group" aria-label="Statut">
                                {statusFilters.map((option) => (
                                    <button
                                        key={option.label}
                                        type="button"
                                        onClick={() => applyFilters({ status: option.id })}
                                        aria-pressed={filters.status === option.id}
                                        className={`rounded-full px-3 py-1 text-[0.75rem] font-medium ${
                                            filters.status === option.id ? 'bg-forest-800 text-cream-50' : 'text-forest-800/65'
                                        }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                            <select
                                value={filters.campaign ?? ''}
                                onChange={(event) => applyFilters({ campaign: event.target.value ? Number(event.target.value) : null })}
                                className="admin-input w-auto py-1.5"
                                aria-label="Campagne"
                            >
                                <option value="">Toutes les campagnes</option>
                                {campaigns.map((campaign) => (
                                    <option key={campaign.id} value={campaign.id}>
                                        {campaign.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    }
                >
                    <DonationsTable donations={donations} methods={options.methods} showCampaign />
                </Card>
            </div>
        </AdminLayout>
    );
}
