import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import Reveal from '@/components/Reveal';
import { gallery, galleryCategories, galleryCopy, ui, type GalleryCategory } from '@/lib/content';
import { useLanguage } from '@/lib/i18n';

type Filter = GalleryCategory | 'all';

export default function Gallery() {
    const { t } = useLanguage();
    const [filter, setFilter] = useState<Filter>('all');
    const [lightbox, setLightbox] = useState<number | null>(null);

    const items = useMemo(
        () => (filter === 'all' ? gallery : gallery.filter((item) => item.category === filter)),
        [filter],
    );

    const step = useCallback(
        (delta: number) =>
            setLightbox((current) => (current === null ? null : (current + delta + items.length) % items.length)),
        [items.length],
    );

    useEffect(() => {
        if (lightbox === null) return;

        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setLightbox(null);
            if (event.key === 'ArrowRight') step(1);
            if (event.key === 'ArrowLeft') step(-1);
        };

        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', onKey);

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', onKey);
        };
    }, [lightbox, step]);

    const filters: { id: Filter; label: string }[] = [
        { id: 'all', label: t(ui.all) },
        ...galleryCategories.map((category) => ({ id: category.id as Filter, label: t(category.label) })),
    ];

    return (
        <section id="galerie" className="relative bg-cream-50 py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
                <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-xl">
                        <Reveal>
                            <span className="eyebrow text-forest-600">{t(galleryCopy.eyebrow)}</span>
                        </Reveal>

                        <Reveal delay={0.08}>
                            <h2 className="mt-6 font-display text-[clamp(2rem,4.2vw,3.4rem)] font-semibold leading-[1.08] tracking-[-0.02em] text-forest-900 text-balance">
                                {t(galleryCopy.title)}
                            </h2>
                        </Reveal>

                        <Reveal delay={0.14}>
                            <p className="mt-5 text-[0.975rem] leading-relaxed text-forest-800/70 text-pretty">
                                {t(galleryCopy.intro)}
                            </p>
                        </Reveal>
                    </div>

                    <Reveal delay={0.18} from="left">
                        <div className="flex flex-wrap gap-2">
                            {filters.map((entry) => (
                                <button
                                    key={entry.id}
                                    type="button"
                                    onClick={() => setFilter(entry.id)}
                                    aria-pressed={filter === entry.id}
                                    className={`relative rounded-full px-4 py-2 text-[0.8125rem] font-medium transition-colors duration-300 ${
                                        filter === entry.id
                                            ? 'text-cream-50'
                                            : 'text-forest-700 hover:text-forest-900'
                                    }`}
                                >
                                    {filter === entry.id && (
                                        <motion.span
                                            layoutId="gallery-filter"
                                            className="absolute inset-0 -z-10 rounded-full bg-forest-800"
                                            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                                        />
                                    )}
                                    <span
                                        className={`absolute inset-0 -z-20 rounded-full border ${
                                            filter === entry.id ? 'border-transparent' : 'border-forest-300/70'
                                        }`}
                                    />
                                    {entry.label}
                                </button>
                            ))}
                        </div>
                    </Reveal>
                </div>

                {/* ---------------------- masonry grid ---------------------- */}
                <motion.div layout className="mt-14 grid auto-rows-[13rem] grid-cols-2 gap-4 sm:auto-rows-[15rem] lg:grid-cols-4">
                    <AnimatePresence mode="popLayout">
                        {items.map((item, index) => (
                            <motion.button
                                key={item.src}
                                type="button"
                                layout
                                onClick={() => setLightbox(index)}
                                initial={{ opacity: 0, scale: 0.94 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.94 }}
                                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                                className={`group relative overflow-hidden rounded-xl bg-forest-900 text-left ${
                                    item.portrait ? 'row-span-2' : ''
                                }`}
                            >
                                <img
                                    src={item.thumb}
                                    alt={t(item.caption)}
                                    loading="lazy"
                                    className="h-full w-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-110"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                                <span className="absolute right-3 top-3 flex h-8 w-8 translate-y-2 items-center justify-center rounded-full bg-cream-50/90 text-forest-900 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                                    <Expand className="h-3.5 w-3.5" />
                                </span>

                                <p className="absolute inset-x-4 bottom-4 translate-y-3 text-[0.72rem] font-medium leading-snug text-cream-50 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                                    {t(item.caption)}
                                </p>
                            </motion.button>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* ------------------------- lightbox ------------------------- */}
            <AnimatePresence>
                {lightbox !== null && items[lightbox] && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[90] flex items-center justify-center bg-forest-950/97 p-4 sm:p-8"
                        onClick={() => setLightbox(null)}
                        role="dialog"
                        aria-modal="true"
                    >
                        <button
                            type="button"
                            onClick={() => setLightbox(null)}
                            aria-label={t(ui.close)}
                            className="absolute right-5 top-5 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-gold-400/60 hover:text-gold-300"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <LightboxArrow side="left" onClick={() => step(-1)} label={t(ui.previous)} />
                        <LightboxArrow side="right" onClick={() => step(1)} label={t(ui.next)} />

                        <motion.figure
                            key={items[lightbox].src}
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                            onClick={(event) => event.stopPropagation()}
                            className="flex max-h-full w-full max-w-4xl flex-col items-center gap-5"
                        >
                            <img
                                src={items[lightbox].src}
                                alt={t(items[lightbox].caption)}
                                className="max-h-[74svh] w-auto rounded-lg object-contain shadow-[0_40px_100px_-30px_rgb(0_0_0_/_0.9)]"
                            />

                            <figcaption className="max-w-2xl text-center text-sm leading-relaxed text-cream-100/75">
                                {t(items[lightbox].caption)}
                                <span className="mt-2 block text-[0.7rem] uppercase tracking-[0.2em] text-cream-100/40">
                                    {lightbox + 1} / {items.length}
                                </span>
                            </figcaption>
                        </motion.figure>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}

function LightboxArrow({
    side,
    onClick,
    label,
}: {
    side: 'left' | 'right';
    onClick: () => void;
    label: string;
}) {
    const Icon = side === 'left' ? ChevronLeft : ChevronRight;

    return (
        <button
            type="button"
            aria-label={label}
            onClick={(event) => {
                event.stopPropagation();
                onClick();
            }}
            className={`absolute top-1/2 z-10 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 text-white transition-all duration-300 hover:border-gold-400/60 hover:bg-white/5 hover:text-gold-300 ${
                side === 'left' ? 'left-3 sm:left-6' : 'right-3 sm:right-6'
            }`}
        >
            <Icon className="h-6 w-6" />
        </button>
    );
}
