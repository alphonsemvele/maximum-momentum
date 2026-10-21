import CountUp from '@/components/CountUp';
import { RevealGroup, RevealItem } from '@/components/Reveal';
import { stats } from '@/lib/content';
import { useLanguage } from '@/lib/i18n';

export default function Stats() {
    const { lang, t } = useLanguage();

    return (
        <section className="relative bg-forest-950 py-20 sm:py-24">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />

            <div className="mx-auto max-w-7xl px-5 sm:px-8">
                <RevealGroup className="grid gap-px overflow-hidden rounded-3xl bg-white/8 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => (
                        <RevealItem key={t(stat.label)} className="group bg-forest-950 p-8 transition-colors duration-500 hover:bg-forest-900 sm:p-9">
                            <div className="flex items-baseline gap-1 font-display text-[2.75rem] font-semibold leading-none tracking-tight text-gold-300 sm:text-[3.25rem]">
                                <CountUp
                                    to={stat.value}
                                    prefix={stat.prefix}
                                    suffix={stat.suffix}
                                    locale={lang === 'fr' ? 'fr-FR' : 'en-US'}
                                />
                            </div>

                            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.14em] text-cream-100">
                                {t(stat.label)}
                            </p>

                            <p className="mt-3 text-[0.8125rem] leading-relaxed text-cream-100/55 text-pretty">
                                {t(stat.detail)}
                            </p>

                            <span className="mt-6 block h-px w-0 bg-gold-400/60 transition-all duration-700 group-hover:w-14" />
                        </RevealItem>
                    ))}
                </RevealGroup>
            </div>
        </section>
    );
}
