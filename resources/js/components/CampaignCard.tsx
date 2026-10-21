import { Link } from '@inertiajs/react';
import { ArrowUpRight, CalendarDays, HeartHandshake, MapPin } from 'lucide-react';
import CampaignProgress from '@/components/CampaignProgress';
import { campaignsCopy, domainLabels, org, type Campaign } from '@/lib/content';
import { formatDate } from '@/lib/format';
import { useLanguage } from '@/lib/i18n';

const FALLBACK_IMAGE = '/images/gallery/outreach-team.webp';

export default function CampaignCard({ campaign }: { campaign: Campaign }) {
    const { lang, t } = useLanguage();
    const href = `/campagnes/${campaign.slug}`;
    const title = t(campaign.title);
    const donateMessage = t({
        fr: `Bonjour Maximum Momentum in Action, je souhaite faire un don pour la campagne « ${title} ».`,
        en: `Hello Maximum Momentum in Action, I would like to donate to the “${title}” campaign.`,
    });

    return (
        <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-forest-950 shadow-lift">
            <Link href={href} className="relative block aspect-[16/10] overflow-hidden" tabIndex={-1} aria-hidden="true">
                <img
                    src={campaign.image ?? FALLBACK_IMAGE}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.07]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/40 to-transparent" />

                <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                    <span className="rounded-full bg-forest-950/70 px-3 py-1 text-[0.625rem] font-bold uppercase tracking-[0.14em] text-gold-300 ring-1 ring-gold-400/30">
                        {t(domainLabels[campaign.domain] ?? domainLabels.autre)}
                    </span>
                    {campaign.featured && (
                        <span className="rounded-full bg-gold-400 px-3 py-1 text-[0.625rem] font-bold uppercase tracking-[0.14em] text-forest-950">
                            {t(campaignsCopy.featured)}
                        </span>
                    )}
                </div>
            </Link>

            <div className="relative -mt-10 flex flex-1 flex-col p-7">
                <h3 className="font-display text-[1.45rem] font-semibold leading-tight text-white text-balance">
                    <Link href={href} className="transition-colors hover:text-gold-200">
                        {title}
                    </Link>
                </h3>

                {(campaign.location || campaign.startsAt) && (
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[0.75rem] text-cream-100/55">
                        {campaign.location && (
                            <span className="inline-flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5" />
                                {campaign.location}
                            </span>
                        )}
                        {campaign.startsAt && (
                            <span className="inline-flex items-center gap-1.5">
                                <CalendarDays className="h-3.5 w-3.5" />
                                {formatDate(campaign.startsAt, lang)}
                            </span>
                        )}
                    </div>
                )}

                <p className="mt-4 flex-1 text-[0.875rem] leading-relaxed text-cream-100/70 text-pretty">
                    {t(campaign.summary)}
                </p>

                <div className="mt-6">
                    <CampaignProgress campaign={campaign} />
                </div>

                <div className="mt-7 grid grid-cols-2 gap-3">
                    <Link
                        href={href}
                        className="inline-flex items-center justify-center gap-1.5 rounded-full border border-white/20 px-4 py-2.5 text-[0.8125rem] font-semibold text-white transition-colors hover:border-gold-400/60 hover:bg-white/5"
                    >
                        {t(campaignsCopy.details)}
                        <ArrowUpRight className="h-4 w-4" />
                    </Link>
                    <a
                        href={org.whatsapp(donateMessage)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 rounded-full bg-gold-400 px-4 py-2.5 text-[0.8125rem] font-semibold text-forest-950 transition-colors hover:bg-gold-300"
                    >
                        <HeartHandshake className="h-4 w-4" />
                        {t(campaignsCopy.donate)}
                    </a>
                </div>
            </div>
        </article>
    );
}
