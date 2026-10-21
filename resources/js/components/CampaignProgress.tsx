import { campaignsCopy, type Campaign } from '@/lib/content';
import { formatFcfa, progressPercent } from '@/lib/format';
import { useLanguage } from '@/lib/i18n';

/** Raised-vs-goal bar. Renders nothing when the campaign has no goal. */
export default function CampaignProgress({ campaign, tone = 'dark' }: { campaign: Campaign; tone?: 'dark' | 'light' }) {
    const { lang, t } = useLanguage();
    const percent = progressPercent(campaign.raisedAmount, campaign.goalAmount);

    if (percent === null || campaign.goalAmount === null) return null;

    const dark = tone === 'dark';

    return (
        <div>
            <div className={`h-1.5 overflow-hidden rounded-full ${dark ? 'bg-white/12' : 'bg-forest-100'}`}>
                <div
                    className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-300"
                    style={{ width: `${Math.max(percent, 2)}%` }}
                />
            </div>
            <div className={`mt-2.5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-[0.75rem] ${dark ? 'text-cream-100/60' : 'text-forest-800/60'}`}>
                <span>
                    <strong className={`font-semibold ${dark ? 'text-white' : 'text-forest-900'}`}>
                        {formatFcfa(campaign.raisedAmount, lang)}
                    </strong>{' '}
                    {t(campaignsCopy.raised)} · {percent}%
                </span>
                <span>
                    {t(campaignsCopy.goal)} : {formatFcfa(campaign.goalAmount, lang)}
                </span>
            </div>
        </div>
    );
}
