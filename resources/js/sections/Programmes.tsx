import Reveal, { RevealGroup, RevealItem } from '@/components/Reveal';
import { programmeCards, programmes } from '@/lib/content';
import { useLanguage } from '@/lib/i18n';

export default function Programmes() {
    const { t } = useLanguage();

    return (
        <section id="domaines" className="paper-grain relative bg-cream-100 py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
                <div className="max-w-2xl">
                    <Reveal>
                        <span className="eyebrow text-forest-600">{t(programmes.eyebrow)}</span>
                    </Reveal>

                    <Reveal delay={0.08}>
                        <h2 className="mt-6 font-display text-[clamp(2rem,4.2vw,3.4rem)] font-semibold leading-[1.08] tracking-[-0.02em] text-forest-900 text-balance">
                            {t(programmes.title)}
                        </h2>
                    </Reveal>

                    <Reveal delay={0.14}>
                        <p className="mt-6 text-[0.975rem] leading-relaxed text-forest-800/70 text-pretty sm:text-base">
                            {t(programmes.intro)}
                        </p>
                    </Reveal>
                </div>

                <RevealGroup className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3" stagger={0.09}>
                    {programmeCards.map((card, index) => (
                        <RevealItem key={card.domain}>
                            <article className="group relative h-full overflow-hidden rounded-2xl bg-forest-950 shadow-lift">
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <img
                                        src={card.image}
                                        alt={t(card.alt)}
                                        loading="lazy"
                                        className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.07]"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/50 to-transparent" />

                                    <span className="absolute left-6 top-6 font-display text-sm font-semibold text-gold-300/80">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                </div>

                                <div className="relative -mt-16 p-7 sm:p-8">
                                    <h3 className="font-display text-2xl font-semibold text-white">{t(card.title)}</h3>

                                    <span className="mt-4 block h-px w-10 bg-gold-400/70 transition-all duration-700 group-hover:w-20" />

                                    <p className="mt-5 text-[0.9rem] leading-relaxed text-cream-100/70 text-pretty">
                                        {t(card.body)}
                                    </p>
                                </div>
                            </article>
                        </RevealItem>
                    ))}
                </RevealGroup>
            </div>
        </section>
    );
}
