import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';
import { ArrowRight, MapPin, Sparkles } from 'lucide-react';
import { hero, heroSlides, ui } from '@/lib/content';
import { useLanguage } from '@/lib/i18n';

const SLIDE_DURATION = 6500;

/**
 * Everything above the fold enters through CSS keyframes rather than
 * scroll- or JS-driven values: mobile WebKit will happily leave a
 * composited layer unpainted until a scroll invalidates it, which used to
 * leave the whole hero blank on opening.
 */
export default function Hero() {
    const { t } = useLanguage();
    const reduceMotion = useReducedMotion();
    const [index, setIndex] = useState(0);

    const goTo = useCallback((next: number) => {
        setIndex(((next % heroSlides.length) + heroSlides.length) % heroSlides.length);
    }, []);

    useEffect(() => {
        const timer = window.setInterval(() => setIndex((current) => (current + 1) % heroSlides.length), SLIDE_DURATION);
        return () => window.clearInterval(timer);
    }, []);

    // Warm the next image so the crossfade never shows a blank frame.
    useEffect(() => {
        const next = new Image();
        next.src = heroSlides[(index + 1) % heroSlides.length].image;
    }, [index]);

    const slide = heroSlides[index];

    return (
        <section id="top" className="relative min-h-[100svh] overflow-hidden bg-forest-950">
            {/* -------- rotating background -------- */}
            <div className="absolute inset-0">
                <AnimatePresence initial={false}>
                    <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.6, ease: 'easeInOut' }}
                        className="absolute inset-0"
                    >
                        <img
                            src={slide.image}
                            alt={t(slide.alt)}
                            fetchPriority={index === 0 ? 'high' : 'auto'}
                            className={`h-full w-full object-cover ${reduceMotion ? '' : 'animate-kenburns'}`}
                            style={{ animationDuration: `${SLIDE_DURATION * 2.4}ms` }}
                        />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* -------- overlays: green wash + vertical depth + vignette -------- */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-forest-950/55" />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/40 to-forest-950/70" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_28%_45%,transparent_0%,rgb(6_27_21_/_0.55)_75%)]" />
            </div>

            {/* soft gold bloom behind the headline */}
            <div className="bloom-gold animate-soft-pulse pointer-events-none absolute left-[8%] top-[28%] h-[26rem] w-[26rem] rounded-full" />

            {/* -------- content -------- */}
            <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-5 pb-32 pt-32 sm:px-8">
                <div
                    className="animate-enter-up mb-7 inline-flex w-fit items-center gap-2.5 rounded-full border border-gold-400/30 bg-forest-950/60 py-2 pl-3 pr-5"
                    style={{ animationDelay: '0.05s' }}
                >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold-400/20">
                        <MapPin className="h-3.5 w-3.5 text-gold-300" />
                    </span>
                    <span className="text-[0.7rem] font-medium uppercase tracking-[0.16em] text-cream-100/90">
                        {t(hero.eyebrow)}
                    </span>
                </div>

                <h1 className="max-w-4xl font-display text-[clamp(2.35rem,6.4vw,5rem)] font-semibold leading-[1.02] tracking-[-0.02em] text-white text-balance">
                    <AnimatedLine delay={0.14}>{t(hero.titleLead)}</AnimatedLine>{' '}
                    <AnimatedLine delay={0.22}>
                        <span className="relative inline-block italic text-gold-300">
                            {t(hero.titleAccent)}
                            <svg
                                viewBox="0 0 300 12"
                                preserveAspectRatio="none"
                                className="absolute -bottom-1 left-0 h-2.5 w-full text-gold-400/70"
                                aria-hidden="true"
                            >
                                <path
                                    d="M2 8C60 3 120 2 180 5c40 2 78 4 118 2"
                                    pathLength="1"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    className="animate-draw-underline"
                                />
                            </svg>
                        </span>
                    </AnimatedLine>{' '}
                    <AnimatedLine delay={0.3}>{t(hero.titleTail)}</AnimatedLine>
                </h1>

                <p
                    className="animate-enter-up mt-8 max-w-xl text-base leading-relaxed text-cream-100/85 text-pretty sm:text-lg"
                    style={{ animationDelay: '0.4s' }}
                >
                    {t(hero.subtitle)}
                </p>

                <div className="animate-enter-up mt-10 flex flex-wrap items-center gap-4" style={{ animationDelay: '0.5s' }}>
                    <a
                        href="#campagnes"
                        className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gold-400 px-8 py-4 text-sm font-semibold text-forest-950 shadow-[0_16px_40px_-14px_rgb(245_185_32_/_0.85)] transition-all duration-500 hover:shadow-[0_20px_54px_-14px_rgb(245_185_32_/_0.95)]"
                    >
                        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/45 to-transparent transition-transform duration-[900ms] group-hover:translate-x-full" />
                        <span className="relative">{t(ui.campaignsCta)}</span>
                        <ArrowRight className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </a>

                    <a
                        href="#domaines"
                        className="group inline-flex items-center gap-3 rounded-full border border-white/25 bg-forest-950/40 px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:border-gold-400/60 hover:bg-forest-950/60"
                    >
                        <Sparkles className="h-4 w-4 text-gold-300" />
                        {t(ui.discoverCta)}
                    </a>
                </div>
            </div>

            {/* -------- slide controls + caption -------- */}
            <div
                className="animate-enter-fade absolute inset-x-0 bottom-0 z-10 border-t border-white/10 bg-gradient-to-t from-forest-950/90 to-transparent"
                style={{ animationDelay: '0.6s' }}
            >
                <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={index}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.45 }}
                            className="max-w-md text-xs leading-relaxed text-cream-100/70 sm:text-[0.8125rem]"
                        >
                            {t(slide.caption)}
                        </motion.p>
                    </AnimatePresence>

                    <div className="flex items-center gap-3">
                        {heroSlides.map((_, slideIndex) => (
                            <button
                                key={slideIndex}
                                type="button"
                                onClick={() => goTo(slideIndex)}
                                aria-label={`${t({ fr: 'Image', en: 'Slide' })} ${slideIndex + 1}`}
                                aria-current={slideIndex === index}
                                className="group relative h-6 overflow-hidden py-2.5"
                            >
                                <span
                                    className={`block h-1 rounded-full transition-all duration-500 ${
                                        slideIndex === index ? 'w-12 bg-white/25' : 'w-5 bg-white/25 group-hover:bg-white/45'
                                    }`}
                                >
                                    {slideIndex === index && (
                                        <motion.span
                                            key={index}
                                            className="block h-full rounded-full bg-gold-400"
                                            initial={{ width: '0%' }}
                                            animate={{ width: '100%' }}
                                            transition={{ duration: SLIDE_DURATION / 1000, ease: 'linear' }}
                                        />
                                    )}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* -------- scroll cue -------- */}
            <div
                className="animate-enter-fade absolute bottom-24 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 lg:flex"
                style={{ animationDelay: '0.8s' }}
            >
                <span className="text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-cream-100/50">
                    {t(ui.scroll)}
                </span>
                <span className="relative h-10 w-px overflow-hidden bg-white/15">
                    <span className="animate-scroll-cue absolute inset-x-0 top-0 h-4 bg-gold-400" />
                </span>
            </div>
        </section>
    );
}

function AnimatedLine({ children, delay }: { children: React.ReactNode; delay: number }) {
    return (
        <span className="animate-enter-up inline-block" style={{ animationDelay: `${delay}s` }}>
            {children}
        </span>
    );
}
