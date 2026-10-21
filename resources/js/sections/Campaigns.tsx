import CampaignCard from '@/components/CampaignCard';
import Reveal, { RevealGroup, RevealItem } from '@/components/Reveal';
import { campaignsCopy, type Campaign } from '@/lib/content';
import { useLanguage } from '@/lib/i18n';

export default function Campaigns({ campaigns }: { campaigns: Campaign[] }) {
    const { t } = useLanguage();

    return (
        <section id="campagnes" className="relative overflow-hidden bg-forest-900 py-24 text-cream-100 sm:py-32">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />
            <div className="bloom-gold pointer-events-none absolute -right-40 top-1/3 h-[28rem] w-[28rem] rounded-full" />

            <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
                <div className="max-w-2xl">
                    <Reveal>
                        <span className="eyebrow text-gold-300">{t(campaignsCopy.eyebrow)}</span>
                    </Reveal>

                    <Reveal delay={0.08}>
                        <h2 className="mt-6 font-display text-[clamp(2rem,4.4vw,3.6rem)] font-semibold leading-[1.06] tracking-[-0.02em] text-white text-balance">
                            {t(campaignsCopy.title)}
                        </h2>
                    </Reveal>

                    <Reveal delay={0.14}>
                        <p className="mt-6 text-[0.975rem] leading-relaxed text-cream-100/70 text-pretty sm:text-base">
                            {t(campaignsCopy.intro)}
                        </p>
                    </Reveal>
                </div>

                {campaigns.length === 0 ? (
                    <Reveal delay={0.18}>
                        <p className="mt-16 rounded-2xl border border-white/12 bg-forest-950/40 p-10 text-center text-cream-100/70">
                            {t(campaignsCopy.empty)}
                        </p>
                    </Reveal>
                ) : (
                    <RevealGroup className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3" stagger={0.1}>
                        {campaigns.map((campaign) => (
                            <RevealItem key={campaign.slug} className="h-full">
                                <CampaignCard campaign={campaign} />
                            </RevealItem>
                        ))}
                    </RevealGroup>
                )}
            </div>
        </section>
    );
}
