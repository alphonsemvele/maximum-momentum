import type { Domain } from '@/lib/content';

/** A campaign as sent by `Campaign::toAdminArray()`. */
export type AdminCampaign = {
    id: number;
    slug: string;
    titleFr: string;
    titleEn: string;
    summaryFr: string;
    summaryEn: string;
    descriptionFr: string;
    descriptionEn: string;
    domain: Domain;
    location: string;
    startsAt: string;
    endsAt: string;
    goalAmount: number | null;
    raisedAmount: number;
    beneficiaries: number | null;
    image: string | null;
    status: 'draft' | 'published';
    featured: boolean;
    views: number;
    galleryLayout: 'grid' | 'carousel' | 'mosaic';
    updatedAt: string | null;
};
