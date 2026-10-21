import { Link, router } from '@inertiajs/react';
import { BarChart3, Settings2, Eye, EyeOff, ExternalLink, Pencil, Plus, Star, Trash2 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { domainLabels } from '@/lib/content';
import { formatFcfa, progressPercent } from '@/lib/format';
import type { AdminCampaign } from './types';

export default function Index({ campaigns }: { campaigns: AdminCampaign[] }) {
    const destroy = (campaign: AdminCampaign) => {
        if (window.confirm(`Supprimer définitivement la campagne « ${campaign.titleFr} » ?`)) {
            router.delete(`/admin/campagnes/${campaign.id}`, { preserveScroll: true });
        }
    };

    const toggle = (campaign: AdminCampaign) => {
        router.patch(`/admin/campagnes/${campaign.id}/statut`, {}, { preserveScroll: true });
    };

    return (
        <AdminLayout
            title="Campagnes"
            actions={
                <Link
                    href="/admin/campagnes/nouvelle"
                    className="inline-flex items-center gap-2 rounded-full bg-forest-800 px-5 py-2.5 text-sm font-semibold text-cream-50 transition-colors hover:bg-forest-700"
                >
                    <Plus className="h-4 w-4" />
                    Nouvelle campagne
                </Link>
            }
        >
            {campaigns.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-forest-300 bg-white p-12 text-center">
                    <p className="text-forest-800/70">Aucune campagne pour le moment.</p>
                    <Link href="/admin/campagnes/nouvelle" className="mt-4 inline-block font-semibold text-forest-700 underline">
                        Créer la première campagne
                    </Link>
                </div>
            ) : (
                <ul className="grid gap-4">
                    {campaigns.map((campaign) => {
                        const percent = progressPercent(campaign.raisedAmount, campaign.goalAmount);
                        const published = campaign.status === 'published';

                        return (
                            <li
                                key={campaign.id}
                                className="flex flex-col gap-5 rounded-2xl border border-forest-200/70 bg-white p-4 sm:flex-row sm:items-center sm:p-5"
                            >
                                <div className="h-36 w-full shrink-0 overflow-hidden rounded-xl bg-forest-100 sm:h-24 sm:w-36">
                                    {campaign.image && <img src={campaign.image} alt="" className="h-full w-full object-cover" />}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span
                                            className={`rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider ${
                                                published ? 'bg-forest-100 text-forest-700' : 'bg-cream-200 text-gold-800'
                                            }`}
                                        >
                                            {published ? 'Publiée' : 'Brouillon'}
                                        </span>
                                        <span className="text-[0.75rem] text-forest-800/55">{domainLabels[campaign.domain]?.fr}</span>
                                        {campaign.featured && (
                                            <span className="inline-flex items-center gap-1 text-[0.75rem] font-medium text-gold-700">
                                                <Star className="h-3.5 w-3.5 fill-current" />À la une
                                            </span>
                                        )}
                                    </div>

                                    <h2 className="mt-1.5 truncate font-display text-lg font-semibold text-forest-900">
                                        <Link href={`/admin/campagnes/${campaign.id}`} className="hover:underline">
                                            {campaign.titleFr}
                                        </Link>
                                    </h2>

                                    <p className="mt-1 text-[0.8125rem] text-forest-800/60">
                                        {campaign.goalAmount !== null
                                            ? `${formatFcfa(campaign.raisedAmount, 'fr')} / ${formatFcfa(campaign.goalAmount, 'fr')} (${percent} %)`
                                            : 'Pas d’objectif financier'}
                                        {campaign.location && ` · ${campaign.location}`}
                                    </p>
                                    <p className="mt-1 inline-flex items-center gap-1.5 text-[0.75rem] text-forest-800/55">
                                        <BarChart3 className="h-3.5 w-3.5" />
                                        <strong className="font-semibold text-forest-900">{campaign.views.toLocaleString('fr-FR')}</strong> vue(s) au total
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    <Link
                                        href={`/admin/campagnes/${campaign.id}`}
                                        className="inline-flex items-center gap-1.5 rounded-full bg-forest-800 px-4 py-2 text-[0.8125rem] font-semibold text-cream-50 hover:bg-forest-700"
                                    >
                                        <Settings2 className="h-4 w-4" />
                                        Gérer
                                    </Link>
                                    {published && (
                                        <a
                                            href={`/campagnes/${campaign.slug}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="admin-icon-button"
                                            title="Voir sur le site"
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => toggle(campaign)}
                                        className="admin-icon-button"
                                        title={published ? 'Repasser en brouillon' : 'Publier'}
                                    >
                                        {published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                    <Link href={`/admin/campagnes/${campaign.id}/modifier`} className="admin-icon-button" title="Modifier">
                                        <Pencil className="h-4 w-4" />
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => destroy(campaign)}
                                        className="admin-icon-button hover:border-rose-brand-300 hover:text-rose-brand-700"
                                        title="Supprimer"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </AdminLayout>
    );
}
