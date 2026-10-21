import { router } from '@inertiajs/react';
import { Eye, Users } from 'lucide-react';
import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { BarList, Card, DailyChart, StatTile, formatNumber, type BarItem, type DailyPoint } from '@/components/admin/Charts';

type Totals = { views: number; visitors: number };

type Props = {
    period: number;
    periods: number[];
    totals: Totals;
    previousTotals: Totals;
    daily: DailyPoint[];
    pages: BarItem[];
    campaigns: { id: number; slug: string; title: string; status: string; views: number; visitors: number }[];
    referrers: BarItem[];
    devices: BarItem[];
};

const periodLabel = (days: number) => (days === 365 ? '12 mois' : `${days} jours`);

export default function Statistics({ period, periods, totals, previousTotals, daily, pages, campaigns, referrers, devices }: Props) {
    const [metric, setMetric] = useState<'views' | 'visitors'>('views');
    const viewsPerVisitor = totals.visitors > 0 ? (totals.views / totals.visitors).toFixed(1).replace('.', ',') : '0';

    const changePeriod = (days: number) => {
        router.get('/admin/statistiques', { periode: days }, { preserveScroll: true, preserveState: true });
    };

    return (
        <AdminLayout
            title="Statistiques"
            actions={
                <div className="flex rounded-full border border-forest-200 bg-white p-1" role="group" aria-label="Période">
                    {periods.map((days) => (
                        <button
                            key={days}
                            type="button"
                            onClick={() => changePeriod(days)}
                            aria-pressed={period === days}
                            className={`rounded-full px-3.5 py-1.5 text-[0.8125rem] font-medium transition-colors ${
                                period === days ? 'bg-forest-800 text-cream-50' : 'text-forest-800/70 hover:text-forest-900'
                            }`}
                        >
                            {periodLabel(days)}
                        </button>
                    ))}
                </div>
            }
        >
            <div className="grid gap-4 sm:grid-cols-3">
                <StatTile
                    label="Pages vues"
                    value={formatNumber(totals.views)}
                    previous={{ current: totals.views, previous: previousTotals.views }}
                    icon={<Eye className="h-4 w-4" />}
                />
                <StatTile
                    label="Visiteurs"
                    value={formatNumber(totals.visitors)}
                    previous={{ current: totals.visitors, previous: previousTotals.visitors }}
                    icon={<Users className="h-4 w-4" />}
                />
                <StatTile label="Pages par visiteur" value={viewsPerVisitor} hint="Moyenne sur la période" />
            </div>

            <div className="mt-6">
                <Card
                    title={`Évolution — ${periodLabel(period)}`}
                    action={
                        <div className="flex rounded-full border border-forest-200 p-0.5" role="group" aria-label="Mesure">
                            {(['views', 'visitors'] as const).map((key) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => setMetric(key)}
                                    aria-pressed={metric === key}
                                    className={`rounded-full px-3 py-1 text-[0.75rem] font-medium ${
                                        metric === key ? 'bg-forest-100 text-forest-900' : 'text-forest-800/60'
                                    }`}
                                >
                                    {key === 'views' ? 'Vues' : 'Visiteurs'}
                                </button>
                            ))}
                        </div>
                    }
                >
                    <DailyChart data={daily} metric={metric} label={metric === 'views' ? 'Vues' : 'Visiteurs'} />
                </Card>
            </div>

            <div className="mt-6">
                <Card title="Vues par campagne">
                    {campaigns.length === 0 ? (
                        <p className="py-6 text-center text-sm text-forest-800/50">Aucune campagne.</p>
                    ) : (
                        <div className="-mx-5 overflow-x-auto sm:-mx-6">
                            <table className="w-full min-w-[32rem] text-left text-sm">
                                <thead className="border-b border-forest-100 text-[0.75rem] uppercase tracking-wider text-forest-800/55">
                                    <tr>
                                        <th className="px-5 py-2.5 font-medium sm:px-6">Campagne</th>
                                        <th className="px-3 py-2.5 text-right font-medium">Vues</th>
                                        <th className="px-5 py-2.5 text-right font-medium sm:px-6">Visiteurs</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {campaigns.map((campaign) => (
                                        <tr key={campaign.id} className="border-b border-forest-50 last:border-0">
                                            <td className="px-5 py-3 sm:px-6">
                                                <span className="font-medium text-forest-900">{campaign.title}</span>
                                                {campaign.status === 'draft' && (
                                                    <span className="ml-2 rounded-full bg-cream-200 px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wider text-gold-800">
                                                        Brouillon
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-3 py-3 text-right font-semibold tabular-nums">{formatNumber(campaign.views)}</td>
                                            <td className="px-5 py-3 text-right tabular-nums text-forest-800/70 sm:px-6">
                                                {formatNumber(campaign.visitors)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-3">
                <Card title="Pages les plus vues">
                    <BarList items={pages.map((page) => ({ ...page, href: page.label }))} />
                </Card>
                <Card title="Provenance des visiteurs">
                    <BarList items={referrers} />
                </Card>
                <Card title="Appareils">
                    <BarList items={devices} />
                </Card>
            </div>

            <p className="mt-6 text-[0.75rem] leading-relaxed text-forest-800/50">
                Les visites des administrateurs connectés et des robots ne sont pas comptées. Un visiteur est compté une fois par jour ;
                aucune adresse IP n’est conservée.
            </p>
        </AdminLayout>
    );
}
