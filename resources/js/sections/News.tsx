import { ArrowUpRight, CalendarDays, MessageCircle } from 'lucide-react';
import Reveal, { RevealGroup, RevealItem } from '@/components/Reveal';
import { news, newsCategoryLabels, newsCopy, org, whatsappIntro, type NewsItem } from '@/lib/content';
import { useLanguage, type Lang } from '@/lib/i18n';

function formatDate(iso: string, lang: Lang) {
    return new Date(`${iso}T00:00:00`).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export default function News() {
    const { lang, t } = useLanguage();

    const featured = news.find((item) => item.featured) ?? news[0];
    const rest = news.filter((item) => item !== featured);

    return (
        <section id="actualites" className="paper-grain relative bg-cream-100 py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
                <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-xl">
                        <Reveal>
                            <span className="eyebrow text-forest-600">{t(newsCopy.eyebrow)}</span>
                        </Reveal>

                        <Reveal delay={0.08}>
                            <h2 className="mt-6 font-display text-[clamp(2rem,4.2vw,3.4rem)] font-semibold leading-[1.08] tracking-[-0.02em] text-forest-900 text-balance">
                                {t(newsCopy.title)}
                            </h2>
                        </Reveal>

                        <Reveal delay={0.14}>
                            <p className="mt-5 text-[0.975rem] leading-relaxed text-forest-800/70 text-pretty">
                                {t(newsCopy.intro)}
                            </p>
                        </Reveal>
                    </div>

                    <Reveal delay={0.18} from="left">
                        <a
                            href={org.whatsapp(t(whatsappIntro))}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex shrink-0 items-center gap-2.5 rounded-full border border-forest-300/70 px-6 py-3 text-[0.8125rem] font-semibold text-forest-800 transition-all duration-300 hover:border-forest-800 hover:bg-forest-800 hover:text-cream-50"
                        >
                            <MessageCircle className="h-4 w-4" />
                            {t(newsCopy.allNews)}
                            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </a>
                    </Reveal>
                </div>

                <div className="mt-16 grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:gap-8">
                    {/* ---------------------- featured story ---------------------- */}
                    <Reveal from="right">
                        <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-forest-950 shadow-lift">
                            <div className="relative aspect-[16/11] overflow-hidden">
                                <img
                                    src={featured.image}
                                    alt={t(featured.alt)}
                                    loading="lazy"
                                    className="h-full w-full object-cover transition-transform duration-[1300ms] ease-out group-hover:scale-[1.06]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/35 to-transparent" />

                                <span className="absolute left-6 top-6 rounded-full bg-gold-400 px-3 py-1 text-[0.625rem] font-bold uppercase tracking-[0.14em] text-forest-950">
                                    {t(newsCopy.featured)}
                                </span>
                            </div>

                            <div className="relative -mt-20 flex flex-1 flex-col p-7 sm:p-9">
                                <Meta item={featured} lang={lang} tone="dark" />

                                <h3 className="mt-4 font-display text-[1.6rem] font-semibold leading-tight text-white text-balance sm:text-[1.9rem]">
                                    {t(featured.title)}
                                </h3>

                                <p className="mt-4 flex-1 text-[0.9rem] leading-relaxed text-cream-100/70 text-pretty">
                                    {t(featured.excerpt)}
                                </p>

                                <span className="mt-7 inline-flex items-center gap-2 text-[0.8125rem] font-semibold text-gold-300">
                                    {t(newsCopy.readMore)}
                                    <span className="block h-px w-6 bg-gold-400 transition-all duration-500 group-hover:w-12" />
                                </span>
                            </div>
                        </article>
                    </Reveal>

                    {/* ------------------------ story list ------------------------ */}
                    <RevealGroup className="flex flex-col gap-4" stagger={0.1}>
                        {rest.map((item) => (
                            <RevealItem key={t(item.title)} className="flex-1">
                                <article className="group flex h-full gap-5 overflow-hidden rounded-2xl border border-forest-200/70 bg-white p-4 transition-all duration-500 hover:-translate-y-1 hover:border-forest-300 hover:shadow-lift sm:gap-6 sm:p-5">
                                    <div className="relative w-28 shrink-0 overflow-hidden rounded-xl sm:w-36">
                                        <img
                                            src={item.image}
                                            alt={t(item.alt)}
                                            loading="lazy"
                                            className="h-full w-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-110"
                                        />
                                    </div>

                                    <div className="flex min-w-0 flex-col py-1">
                                        <Meta item={item} lang={lang} tone="light" />

                                        <h3 className="mt-2.5 font-display text-[1.0625rem] font-semibold leading-snug text-forest-900 text-balance sm:text-lg">
                                            {t(item.title)}
                                        </h3>

                                        <p className="mt-2 line-clamp-2 text-[0.8125rem] leading-relaxed text-forest-800/65 text-pretty sm:line-clamp-3">
                                            {t(item.excerpt)}
                                        </p>

                                        <span className="mt-auto flex items-center gap-2 pt-3 text-[0.75rem] font-semibold text-forest-700">
                                            {t(newsCopy.readMore)}
                                            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                        </span>
                                    </div>
                                </article>
                            </RevealItem>
                        ))}
                    </RevealGroup>
                </div>
            </div>
        </section>
    );
}

function Meta({ item, lang, tone }: { item: NewsItem; lang: Lang; tone: 'dark' | 'light' }) {
    const { t } = useLanguage();
    const dark = tone === 'dark';

    return (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span
                className={`rounded-full px-2.5 py-1 text-[0.625rem] font-bold uppercase tracking-[0.12em] ${
                    dark ? 'bg-white/12 text-gold-300' : 'bg-forest-100 text-forest-700'
                }`}
            >
                {t(newsCategoryLabels[item.category])}
            </span>

            <span
                className={`inline-flex items-center gap-1.5 text-[0.7rem] font-medium ${
                    dark ? 'text-cream-100/55' : 'text-forest-800/50'
                }`}
            >
                <CalendarDays className="h-3.5 w-3.5" />
                <time dateTime={item.date}>{formatDate(item.date, lang)}</time>
            </span>
        </div>
    );
}
