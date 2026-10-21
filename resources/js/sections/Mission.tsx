import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { Brain, HeartPulse, ShieldCheck } from 'lucide-react';
import Reveal, { RevealGroup, RevealItem } from '@/components/Reveal';
import { mission, org, pillars } from '@/lib/content';
import { useLanguage } from '@/lib/i18n';

const icons = {
    heart: HeartPulse,
    brain: Brain,
    shield: ShieldCheck,
};

export default function Mission() {
    const { t } = useLanguage();
    const ref = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });

    // The two stacked photos drift at different speeds for depth.
    const frontY = useTransform(scrollYProgress, [0, 1], ['8%', '-8%']);
    const backY = useTransform(scrollYProgress, [0, 1], ['-6%', '10%']);

    return (
        <section id="mission" className="paper-grain relative overflow-hidden bg-cream-50 py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
                <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
                    {/* ------------------------- copy ------------------------- */}
                    <div>
                        <Reveal>
                            <span className="eyebrow text-forest-600">{t(mission.eyebrow)}</span>
                        </Reveal>

                        <Reveal delay={0.08}>
                            <h2 className="mt-6 font-display text-[clamp(2rem,4.2vw,3.4rem)] font-semibold leading-[1.08] tracking-[-0.02em] text-forest-900 text-balance">
                                {t(mission.title)}
                            </h2>
                        </Reveal>

                        <Reveal delay={0.14}>
                            <div className="mt-8 space-y-5 text-[0.975rem] leading-relaxed text-forest-800/75 text-pretty sm:text-base">
                                {mission.body.map((paragraph, index) => (
                                    <p key={index}>{t(paragraph)}</p>
                                ))}
                            </div>
                        </Reveal>

                        <Reveal delay={0.2}>
                            <div className="mt-10 flex items-center gap-4 rounded-2xl border border-forest-200/70 bg-white/70 p-5">
                                <img src="/images/brand/logo-dark.png" alt="" className="h-11 w-auto shrink-0" />
                                <p className="font-display text-[0.9375rem] italic leading-snug text-forest-800">
                                    « {t(org.tagline)} »
                                </p>
                            </div>
                        </Reveal>
                    </div>

                    {/* ------------------------ imagery ------------------------ */}
                    <div ref={ref} className="relative mx-auto w-full max-w-md lg:max-w-none">
                        <motion.div style={{ y: backY }} className="relative">
                            <div className="overflow-hidden rounded-[1.75rem] shadow-lift">
                                <img
                                    src="/images/gallery/classroom-teaching.webp"
                                    alt={t({
                                        fr: 'Animatrice conduisant un atelier devant une classe',
                                        en: 'Facilitator running a workshop in front of a class',
                                    })}
                                    loading="lazy"
                                    className="aspect-[4/3] w-full object-cover"
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            style={{ y: frontY }}
                            className="absolute -bottom-12 -left-4 w-[58%] sm:-left-10 sm:-bottom-16"
                        >
                            <div className="overflow-hidden rounded-[1.5rem] border-[6px] border-cream-50 shadow-lift">
                                <img
                                    src="/images/gallery/health-screening.webp"
                                    alt={t({
                                        fr: 'Bénévole réalisant un dépistage lors d’une journée de santé',
                                        en: 'Volunteer running a screening during a health day',
                                    })}
                                    loading="lazy"
                                    className="aspect-[3/4] w-full object-cover"
                                />
                            </div>
                        </motion.div>

                        <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full border border-gold-400/40" />
                        <div className="pointer-events-none absolute -right-2 -top-2 h-16 w-16 rounded-full bg-gold-400/15 blur-2xl" />
                    </div>
                </div>

                {/* ------------------------- pillars ------------------------- */}
                <RevealGroup className="mt-32 grid gap-6 sm:mt-36 md:grid-cols-3" stagger={0.12}>
                    {pillars.map((pillar) => {
                        const Icon = icons[pillar.icon];

                        return (
                            <RevealItem key={t(pillar.title)}>
                                <article className="group relative h-full overflow-hidden rounded-2xl border border-forest-200/60 bg-white p-8 transition-all duration-500 hover:-translate-y-1.5 hover:border-forest-300 hover:shadow-lift">
                                    <span className="absolute inset-x-0 top-0 h-0.5 w-0 bg-gradient-to-r from-gold-400 to-gold-300 transition-all duration-700 group-hover:w-full" />

                                    <span className="inline-flex h-13 w-13 items-center justify-center rounded-xl bg-forest-800 p-3.5 text-gold-300 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                                        <Icon className="h-6 w-6" strokeWidth={1.6} />
                                    </span>

                                    <h3 className="mt-6 font-display text-xl font-semibold text-forest-900">
                                        {t(pillar.title)}
                                    </h3>

                                    <p className="mt-3 text-[0.9rem] leading-relaxed text-forest-800/70 text-pretty">
                                        {t(pillar.body)}
                                    </p>
                                </article>
                            </RevealItem>
                        );
                    })}
                </RevealGroup>
            </div>
        </section>
    );
}
