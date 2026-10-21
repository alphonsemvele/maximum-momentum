import { router, useForm } from '@inertiajs/react';
import { ArrowDown, ArrowUp, Check, GalleryHorizontal, ImagePlus, LayoutGrid, LayoutPanelLeft, Star, Trash2, type LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { Card } from '@/components/admin/Charts';
import type { AdminImage } from '@/components/admin/types';

type Layout = 'grid' | 'carousel' | 'mosaic';

const layouts: { id: Layout; label: string; description: string; icon: LucideIcon }[] = [
    { id: 'grid', label: 'Grille', description: 'Photos de même taille, alignées en colonnes.', icon: LayoutGrid },
    { id: 'carousel', label: 'Carrousel', description: 'Une grande photo à la fois, avec flèches et miniatures.', icon: GalleryHorizontal },
    { id: 'mosaic', label: 'Mosaïque', description: 'La première photo en grand, les suivantes autour.', icon: LayoutPanelLeft },
];

export default function ImagesTab({ campaignId, images, layout }: { campaignId: number; images: AdminImage[]; layout: Layout }) {
    const upload = useForm<{ images: File[] }>({ images: [] });

    const pick = (files: FileList | null) => {
        if (!files || files.length === 0) return;
        const selected = Array.from(files);
        upload.transform(() => ({ images: selected }));
        upload.post(`/admin/campagnes/${campaignId}/images`, { forceFormData: true, preserveScroll: true });
    };

    const setLayout = (next: Layout) => {
        router.patch(`/admin/campagnes/${campaignId}/galerie`, { layout: next }, { preserveScroll: true });
    };

    const uploadErrors = Object.entries(upload.errors).map(([, message]) => message);

    return (
        <div className="grid gap-6">
            <Card title="Affichage de la galerie sur le site">
                <div className="grid gap-3 sm:grid-cols-3">
                    {layouts.map((option) => {
                        const Icon = option.icon;
                        const active = option.id === layout;

                        return (
                            <button
                                key={option.id}
                                type="button"
                                onClick={() => setLayout(option.id)}
                                aria-pressed={active}
                                className={`relative rounded-xl border p-4 text-left transition-colors ${
                                    active ? 'border-forest-600 bg-forest-50 ring-1 ring-forest-600' : 'border-forest-200 hover:border-forest-400'
                                }`}
                            >
                                {active && <Check className="absolute right-3 top-3 h-4 w-4 text-forest-700" />}
                                <LayoutPreview layout={option.id} />
                                <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-forest-900">
                                    <Icon className="h-4 w-4 text-forest-600" />
                                    {option.label}
                                </p>
                                <p className="mt-1 text-[0.75rem] leading-snug text-forest-800/60">{option.description}</p>
                            </button>
                        );
                    })}
                </div>
            </Card>

            <Card
                title={`Images (${images.length})`}
                action={
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-forest-800 px-4 py-2 text-[0.8125rem] font-semibold text-cream-50 hover:bg-forest-700">
                        <ImagePlus className="h-4 w-4" />
                        {upload.processing ? 'Envoi en cours…' : 'Ajouter des images'}
                        <input type="file" accept="image/*" multiple className="sr-only" disabled={upload.processing} onChange={(event) => {
                                pick(event.target.files);
                                event.target.value = '';
                            }}
                        />
                    </label>
                }
            >
                <p className="-mt-2 mb-5 text-[0.75rem] text-forest-800/55">
                    Sélectionnez plusieurs photos d’un coup (8 Mo max. chacune). L’ordre ci-dessous est celui du site ; l’étoile désigne l’image de couverture.
                </p>

                {upload.progress && (
                    <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-forest-100">
                        <div className="h-full bg-forest-600" style={{ width: `${upload.progress.percentage ?? 0}%` }} />
                    </div>
                )}
                {uploadErrors.length > 0 && <p className="mb-4 text-sm text-rose-brand-700">{uploadErrors[0]}</p>}

                {images.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-forest-300 py-10 text-center text-sm text-forest-800/50">
                        Aucune image dans la galerie.
                    </p>
                ) : (
                    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {images.map((image, index) => (
                            <ImageItem key={image.id} image={image} first={index === 0} last={index === images.length - 1} />
                        ))}
                    </ul>
                )}
            </Card>
        </div>
    );
}

function ImageItem({ image, first, last }: { image: AdminImage; first: boolean; last: boolean }) {
    const [captionFr, setCaptionFr] = useState(image.captionFr);
    const [captionEn, setCaptionEn] = useState(image.captionEn);
    const dirty = captionFr !== image.captionFr || captionEn !== image.captionEn;

    const patch = (url: string, data: Record<string, string> = {}) => router.patch(url, data, { preserveScroll: true });

    const destroy = () => {
        if (window.confirm('Supprimer cette image ?')) {
            router.delete(`/admin/images/${image.id}`, { preserveScroll: true });
        }
    };

    return (
        <li className="overflow-hidden rounded-xl border border-forest-200/70 bg-white">
            <div className="relative">
                <img src={image.url} alt="" className="aspect-[4/3] w-full object-cover" />
                {image.isCover && (
                    <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-gold-400 px-2.5 py-1 text-[0.625rem] font-bold uppercase tracking-wider text-forest-950">
                        <Star className="h-3 w-3 fill-current" />
                        Couverture
                    </span>
                )}
                <div className="absolute right-2 top-2 flex gap-1">
                    <IconButton title="Monter" disabled={first} onClick={() => patch(`/admin/images/${image.id}/deplacer`, { direction: 'up' })}>
                        <ArrowUp className="h-3.5 w-3.5" />
                    </IconButton>
                    <IconButton title="Descendre" disabled={last} onClick={() => patch(`/admin/images/${image.id}/deplacer`, { direction: 'down' })}>
                        <ArrowDown className="h-3.5 w-3.5" />
                    </IconButton>
                </div>
            </div>

            <div className="grid gap-2 p-3">
                <input value={captionFr} onChange={(e) => setCaptionFr(e.target.value)} placeholder="Légende (FR)" className="admin-input py-1.5" />
                <input value={captionEn} onChange={(e) => setCaptionEn(e.target.value)} placeholder="Caption (EN, facultatif)" className="admin-input py-1.5" />

                <div className="flex flex-wrap items-center gap-2 pt-1">
                    {dirty && (
                        <button
                            type="button"
                            onClick={() => patch(`/admin/images/${image.id}`, { captionFr, captionEn })}
                            className="rounded-full bg-forest-800 px-3 py-1.5 text-[0.75rem] font-semibold text-white"
                        >
                            Enregistrer la légende
                        </button>
                    )}
                    {!image.isCover && (
                        <button
                            type="button"
                            onClick={() => patch(`/admin/images/${image.id}/couverture`)}
                            className="inline-flex items-center gap-1 rounded-full border border-forest-200 px-3 py-1.5 text-[0.75rem] font-medium text-forest-800 hover:border-forest-500"
                        >
                            <Star className="h-3.5 w-3.5" />
                            Couverture
                        </button>
                    )}
                    <button type="button" onClick={destroy} className="admin-icon-button ml-auto h-8 w-8 hover:border-rose-brand-300 hover:text-rose-brand-700" title="Supprimer">
                        <Trash2 className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>
        </li>
    );
}

function IconButton({ title, disabled, onClick, children }: { title: string; disabled?: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
        <button
            type="button"
            title={title}
            disabled={disabled}
            onClick={onClick}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-forest-950/70 text-white hover:bg-forest-950 disabled:opacity-30"
        >
            {children}
        </button>
    );
}

/** Tiny schematic of each layout so the choice reads at a glance. */
function LayoutPreview({ layout }: { layout: Layout }) {
    const block = 'rounded-[3px] bg-forest-300/70';

    if (layout === 'grid') {
        return (
            <div className="grid h-16 grid-cols-3 gap-1">
                {Array.from({ length: 6 }, (_, index) => (
                    <span key={index} className={block} />
                ))}
            </div>
        );
    }

    if (layout === 'carousel') {
        return (
            <div className="grid h-16 gap-1" style={{ gridTemplateRows: '1fr auto' }}>
                <span className={block} />
                <div className="grid grid-cols-5 gap-1">
                    {Array.from({ length: 5 }, (_, index) => (
                        <span key={index} className={`h-2.5 ${block} ${index === 0 ? 'bg-forest-600' : ''}`} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="grid h-16 grid-cols-4 grid-rows-2 gap-1">
            <span className={`col-span-2 row-span-2 ${block}`} />
            <span className={block} />
            <span className={block} />
            <span className={block} />
            <span className={block} />
        </div>
    );
}
