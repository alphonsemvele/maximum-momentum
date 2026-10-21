import { Link, router } from '@inertiajs/react';
import { Eye, EyeOff, ExternalLink, FileText, HandCoins, Images, LayoutDashboard, Pencil, Receipt, Wallet } from 'lucide-react';
import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, StatTile, formatNumber } from '@/components/admin/Charts';
import DonationsTab from '@/components/admin/campaign/DonationsTab';
import DocumentsTab from '@/components/admin/campaign/DocumentsTab';
import ExpensesTab from '@/components/admin/campaign/ExpensesTab';
import ImagesTab from '@/components/admin/campaign/ImagesTab';
import DonationsTable from '@/components/admin/DonationsTable';
import { fcfa, type AdminDocument, type AdminDonation, type AdminExpense, type AdminImage, type FinanceSummary, type Options } from '@/components/admin/types';
import { domainLabels } from '@/lib/content';
import type { AdminCampaign } from './types';

type Tab = 'apercu' | 'dons' | 'depenses' | 'images' | 'documents';

type Props = {
    campaign: AdminCampaign;
    summary: FinanceSummary & { views: number; viewsMonth: number };
    donations: AdminDonation[];
    expenses: AdminExpense[];
    images: AdminImage[];
    documents: AdminDocument[];
    options: Options;
};

const tabIds: Tab[] = ['apercu', 'dons', 'depenses', 'images', 'documents'];

function initialTab(): Tab {
    if (typeof window === 'undefined') return 'apercu';
    const requested = new URLSearchParams(window.location.search).get('onglet') as Tab | null;
    return requested && tabIds.includes(requested) ? requested : 'apercu';
}

export default function Show({ campaign, summary, donations, expenses, images, documents, options }: Props) {
    const [tab, setTab] = useState<Tab>(initialTab);
    const published = campaign.status === 'published';
    const percent = summary.goal > 0 ? Math.min(100, Math.round((summary.raised / summary.goal) * 100)) : null;

    // Keep the tab in the URL so redirects after an action land back on it.
    const selectTab = (next: Tab) => {
        setTab(next);
        const url = new URL(window.location.href);
        url.searchParams.set('onglet', next);
        window.history.replaceState(window.history.state, '', url);
    };

    const tabs: { id: Tab; label: string; icon: typeof Eye; count?: number; alert?: boolean }[] = [
        { id: 'apercu', label: 'Aperçu', icon: LayoutDashboard },
        { id: 'dons', label: 'Dons', icon: HandCoins, count: donations.length, alert: summary.pendingCount > 0 },
        { id: 'depenses', label: 'Dépenses', icon: Receipt, count: expenses.length },
        { id: 'images', label: 'Images', icon: Images, count: images.length },
        { id: 'documents', label: 'Documents', icon: FileText, count: documents.length },
    ];

    return (
        <AdminLayout
            title={campaign.titleFr}
            actions={
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={() => router.patch(`/admin/campagnes/${campaign.id}/statut`, {}, { preserveScroll: true })}
                        className="inline-flex items-center gap-2 rounded-full border border-forest-300 px-4 py-2 text-[0.8125rem] font-semibold text-forest-800 hover:border-forest-600"
                    >
                        {published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        {published ? 'Repasser en brouillon' : 'Publier'}
                    </button>
                    {published && (
                        <a
                            href={`/campagnes/${campaign.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full border border-forest-300 px-4 py-2 text-[0.8125rem] font-semibold text-forest-800 hover:border-forest-600"
                        >
                            <ExternalLink className="h-4 w-4" />
                            Voir sur le site
                        </a>
                    )}
                    <Link
                        href={`/admin/campagnes/${campaign.id}/modifier`}
                        className="inline-flex items-center gap-2 rounded-full bg-forest-800 px-4 py-2 text-[0.8125rem] font-semibold text-cream-50 hover:bg-forest-700"
                    >
                        <Pencil className="h-4 w-4" />
                        Modifier les infos
                    </Link>
                </div>
            }
        >
            <div className="-mt-4 mb-6 flex flex-wrap items-center gap-2 text-[0.8125rem] text-forest-800/60">
                <span className={`rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider ${published ? 'bg-forest-100 text-forest-700' : 'bg-cream-200 text-gold-800'}`}>
                    {published ? 'Publiée' : 'Brouillon'}
                </span>
                <span>{domainLabels[campaign.domain]?.fr}</span>
                {campaign.location && <span>· {campaign.location}</span>}
                <Link href="/admin/campagnes" className="ml-auto text-forest-700 hover:underline">
                    ← Toutes les campagnes
                </Link>
            </div>

            {/* ------------------------------ summary ------------------------------ */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatTile
                    label="Collecté (confirmé)"
                    value={fcfa(summary.raised)}
                    hint={summary.goal > 0 ? `${percent} % de l’objectif de ${fcfa(summary.goal)}` : 'Pas d’objectif chiffré'}
                    icon={<HandCoins className="h-4 w-4" />}
                />
                <StatTile
                    label="En attente"
                    value={fcfa(summary.pendingAmount)}
                    hint={summary.pendingCount > 0 ? `${summary.pendingCount} don(s) à vérifier` : 'Rien à vérifier'}
                    icon={<HandCoins className="h-4 w-4" />}
                />
                <StatTile
                    label="Solde disponible"
                    value={fcfa(summary.balance)}
                    hint={`Après ${fcfa(summary.spent)} de dépenses`}
                    icon={<Wallet className="h-4 w-4" />}
                />
                <StatTile
                    label="Vues de la page"
                    value={formatNumber(summary.views)}
                    hint={`${formatNumber(summary.viewsMonth)} sur les 30 derniers jours`}
                    icon={<Eye className="h-4 w-4" />}
                />
            </div>

            {percent !== null && (
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-forest-100" title={`${percent} %`}>
                    <div className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-300" style={{ width: `${Math.max(percent, 1)}%` }} />
                </div>
            )}

            {/* -------------------------------- tabs -------------------------------- */}
            <div className="mt-8 flex gap-1 overflow-x-auto border-b border-forest-200" role="tablist">
                {tabs.map((item) => {
                    const Icon = item.icon;
                    const active = tab === item.id;

                    return (
                        <button
                            key={item.id}
                            type="button"
                            role="tab"
                            aria-selected={active}
                            onClick={() => selectTab(item.id)}
                            className={`-mb-px inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                                active ? 'border-forest-700 text-forest-900' : 'border-transparent text-forest-800/60 hover:text-forest-900'
                            }`}
                        >
                            <Icon className="h-4 w-4" />
                            {item.label}
                            {item.count !== undefined && (
                                <span className={`rounded-full px-1.5 text-[0.7rem] ${item.alert ? 'bg-gold-400 text-forest-950' : 'bg-forest-100 text-forest-700'}`}>
                                    {item.count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            <div className="mt-6">
                {tab === 'apercu' && (
                    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                        <Card title="Dons à vérifier">
                            <DonationsTable donations={donations.filter((donation) => donation.status === 'pending')} methods={options.methods} />
                        </Card>
                        <Card title="Résumé financier">
                            <dl className="grid gap-3 text-sm">
                                <Row label="Dons confirmés" value={`${fcfa(summary.raised)} (${summary.donorsCount})`} />
                                <Row label="Dons en attente" value={fcfa(summary.pendingAmount)} />
                                <Row label="Dépenses" value={`− ${fcfa(summary.spent)}`} />
                                <div className="border-t border-forest-100 pt-3">
                                    <Row label="Solde" value={fcfa(summary.balance)} strong />
                                </div>
                                {summary.goal > 0 && <Row label="Reste à collecter" value={fcfa(Math.max(0, summary.goal - summary.raised))} />}
                            </dl>
                            <div className="mt-6 grid grid-cols-2 gap-2 text-[0.8125rem]">
                                <button type="button" onClick={() => selectTab('images')} className="rounded-lg border border-forest-200 px-3 py-2 text-left hover:border-forest-500">
                                    <span className="font-semibold text-forest-900">{images.length}</span> image(s)
                                </button>
                                <button type="button" onClick={() => selectTab('documents')} className="rounded-lg border border-forest-200 px-3 py-2 text-left hover:border-forest-500">
                                    <span className="font-semibold text-forest-900">{documents.length}</span> document(s)
                                </button>
                            </div>
                        </Card>
                    </div>
                )}
                {tab === 'dons' && <DonationsTab campaignId={campaign.id} donations={donations} options={options} />}
                {tab === 'depenses' && <ExpensesTab campaignId={campaign.id} expenses={expenses} options={options} />}
                {tab === 'images' && <ImagesTab campaignId={campaign.id} images={images} layout={campaign.galleryLayout} />}
                {tab === 'documents' && <DocumentsTab campaignId={campaign.id} documents={documents} />}
            </div>
        </AdminLayout>
    );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
    return (
        <div className="flex items-baseline justify-between gap-4">
            <dt className="text-forest-800/65">{label}</dt>
            <dd className={`tabular-nums ${strong ? 'font-display text-lg font-semibold text-forest-900' : 'font-medium text-forest-900'}`}>{value}</dd>
        </div>
    );
}
