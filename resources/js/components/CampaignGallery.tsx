import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { ui, type CampaignDetail } from '@/lib/content';
import { useLanguage } from '@/lib/i18n';

type Image = CampaignDetail['gallery'][number];

/**
 * Campaign photos in the layout chosen in the admin: an even grid, a
 * one-at-a-time carousel with thumbnails, or a mosaic led by the first photo.
 * Grid and mosaic open a full-screen viewer.
 */
export default function CampaignGallery({ images, layout }: { images: Image[]; layout: CampaignDetail['galleryLayout'] }) {
    const [viewer, setViewer] = useState<number | null>(null);

    if (images.length === 0) return null;

    return (
        <>
            {layout === 'carousel' ? (
                <Carousel images={images} />
            ) : layout === 'mosaic' ? (
                <div className="grid auto-rows-[9rem] grid-cols-2 gap-2 sm:auto-rows-[11rem] sm:grid-cols-4">
                    {images.map((image, index) => (
                        <Tile
                            key={image.id}
                            image={image}
                            onOpen={() => setViewer(index)}
                            className={index === 0 ? 'col-span-2 row-span-2' : index % 5 === 3 ? 'sm:col-span-2' : ''}
                        />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {images.map((image, index) => (
                        <Tile key={image.id} image={image} onOpen={() => setViewer(index)} className="aspect-[4/3]" />
                    ))}
                </div>
            )}

            <Viewer images={images} index={viewer} onChange={setViewer} />
        </>
    );
}

function Tile({ image, onOpen, className }: { image: Image; onOpen: () => void; className: string }) {
    const { t } = useLanguage();
    const caption = t(image.caption);

    return (
        <button type="button" onClick={onOpen} className={`group relative overflow-hidden rounded-xl bg-forest-100 ${className}`}>
            <img
                src={image.url}
                alt={caption}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-forest-950/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <Expand className="absolute right-3 top-3 h-4 w-4 text-white opacity-0 transition-opacity group-hover:opacity-100" />
            {caption && (
                <span className="absolute inset-x-3 bottom-3 line-clamp-2 text-left text-[0.75rem] text-white opacity-0 transition-opacity group-hover:opacity-100">
                    {caption}
                </span>
            )}
        </button>
    );
}

function Carousel({ images }: { images: Image[] }) {
    const { t } = useLanguage();
    const [index, setIndex] = useState(0);
    const go = (next: number) => setIndex((next + images.length) % images.length);
    const image = images[index];

    return (
        <div>
            <div className="relative overflow-hidden rounded-2xl bg-forest-950">
                <AnimatePresence mode="wait" initial={false}>
                    <motion.img
                        key={image.id}
                        src={image.url}
                        alt={t(image.caption)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35 }}
                        className="aspect-[16/10] w-full object-cover"
                    />
                </AnimatePresence>

                {images.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={() => go(index - 1)}
                            aria-label={t(ui.previous)}
                            className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-forest-950/60 text-white hover:bg-forest-950/80"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => go(index + 1)}
                            aria-label={t(ui.next)}
                            className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-forest-950/60 text-white hover:bg-forest-950/80"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                        <span className="absolute right-3 top-3 rounded-full bg-forest-950/60 px-2.5 py-1 text-[0.7rem] font-medium text-white">
                            {index + 1} / {images.length}
                        </span>
                    </>
                )}
            </div>

            {t(image.caption) && <p className="mt-3 text-[0.875rem] text-forest-800/70">{t(image.caption)}</p>}

            {images.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                    {images.map((thumb, thumbIndex) => (
                        <button
                            key={thumb.id}
                            type="button"
                            onClick={() => setIndex(thumbIndex)}
                            aria-label={`${t({ fr: 'Image', en: 'Image' })} ${thumbIndex + 1}`}
                            aria-current={thumbIndex === index}
                            className={`h-14 w-20 shrink-0 overflow-hidden rounded-lg ring-2 transition ${
                                thumbIndex === index ? 'ring-gold-400' : 'opacity-60 ring-transparent hover:opacity-100'
                            }`}
                        >
                            <img src={thumb.url} alt="" loading="lazy" className="h-full w-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

function Viewer({ images, index, onChange }: { images: Image[]; index: number | null; onChange: (index: number | null) => void }) {
    const { t } = useLanguage();
    const open = index !== null;

    const step = useCallback(
        (delta: number) => {
            if (index === null) return;
            onChange((index + delta + images.length) % images.length);
        },
        [index, images.length, onChange],
    );

    useEffect(() => {
        if (!open) return;
        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onChange(null);
            if (event.key === 'ArrowRight') step(1);
            if (event.key === 'ArrowLeft') step(-1);
        };
        window.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [open, onChange, step]);

    return (
        <AnimatePresence>
            {index !== null && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[90] flex flex-col bg-forest-950/95 p-4 sm:p-8"
                    onClick={() => onChange(null)}
                >
                    <div className="flex justify-end">
                        <button type="button" aria-label={t(ui.close)} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white">
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="relative flex min-h-0 flex-1 items-center justify-center" onClick={(event) => event.stopPropagation()}>
                        <img src={images[index].url} alt={t(images[index].caption)} className="max-h-full max-w-full rounded-lg object-contain" />
                        {images.length > 1 && (
                            <>
                                <button type="button" onClick={() => step(-1)} aria-label={t(ui.previous)} className="absolute left-0 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20">
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                <button type="button" onClick={() => step(1)} aria-label={t(ui.next)} className="absolute right-0 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20">
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </>
                        )}
                    </div>
                    <p className="mt-4 text-center text-sm text-cream-100/75" onClick={(event) => event.stopPropagation()}>
                        {t(images[index].caption)} <span className="text-cream-100/40">· {index + 1} / {images.length}</span>
                    </p>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
