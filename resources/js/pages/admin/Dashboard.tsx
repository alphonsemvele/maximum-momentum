import { Link } from '@inertiajs/react';
import { ArrowRight, Eye, HandCoins, Megaphone, Plus, Users } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { BarList, Card, DailyChart, StatTile, formatNumber, type DailyPoint } from '@/components/admin/Charts';
import { formatFcfa } from '@/lib/format';

type Totals = { views: number; visitors: number };

type Props = {
    traffic: { today: Totals; month: Totals; previousMonth: Totals; daily: DailyPoint[] };
    campaigns: { published: number; drafts: number; raised: number; goal: number };
    topCampaigns: { id: number; slug: string; title: string; status: string; views: number }[];
};

export default function Dashboard({ traffic, campaigns, topCampaigns }: Props) {
    return (
        <AdminLayout
            title="Tableau de bord"
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
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatTile
                    label="Vues aujourd’hui"
                    value={formatNumber(traffic.today.views)}
                    hint={`${formatNumber(traffic.today.visitors)} visiteur(s)`}
                    icon={<Eye className="h-4 w-4" />}
                />
                <StatTile
                    label="Vues — 30 jours"
                    value={formatNumber(traffic.month.views)}
                    previous={{ current: traffic.month.views, previous: traffic.previousMonth.views }}
                    icon={<Eye className="h-4 w-4" />}
                />
                <StatTile
                    label="Visiteurs — 30 jours"
                    value={formatNumber(traffic.month.visitors)}
                    previous={{ current: traffic.month.visitors, previous: traffic.previousMonth.visitors }}
                    icon={<Users className="h-4 w-4" />}
                />
                <StatTile
                    label="Campagnes publiées"
                    value={formatNumber(campaigns.published)}
                    hint={`${formatNumber(campaigns.drafts)} en brouillon`}
                    icon={<Megaphone className="h-4 w-4" />}
                />
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
                <Card
                    title="Vues par jour — 30 derniers jours"
                    action={
                        <Link href="/admin/statistiques" className="inline-flex items-center gap-1.5 text-sm font-medium text-forest-700 hover:text-forest-900">
                            Statistiques détaillées
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    }
                >
                    <DailyChart data={traffic.daily} metric="views" label="Vues" />
                </Card>

                <div className="grid content-start gap-6">
                    <Card title="Campagnes les plus vues">
                        <BarList
                            items={topCampaigns.map((campaign) => ({
                                label: campaign.title,
                                value: campaign.views,
                                note: campaign.status === 'draft' ? 'brouillon' : undefined,
                            }))}
                            empty="Aucune vue de campagne sur 30 jours."
                        />
                    </Card>

                    <Card title="Collecte (toutes campagnes)">
                        <div className="flex items-start gap-4">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest-50 text-forest-600">
                                <HandCoins className="h-5 w-5" />
                            </span>
                            <div>
                                <p className="font-display text-2xl font-semibold text-forest-900">{formatFcfa(campaigns.raised, 'fr')}</p>
                                <p className="mt-1 text-[0.8125rem] text-forest-800/60">
                                    {campaigns.goal > 0
                                        ? `collectés sur ${formatFcfa(campaigns.goal, 'fr')} d’objectifs`
                                        : 'Aucun objectif chiffré pour le moment'}
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
