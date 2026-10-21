export type DonationStatus = 'pending' | 'confirmed' | 'rejected';

export type AdminDonation = {
    id: number;
    campaignId: number;
    campaignTitle: string | null;
    donorName: string | null;
    donorPhone: string | null;
    donorEmail: string | null;
    anonymous: boolean;
    amount: number;
    method: string;
    reference: string | null;
    message: string | null;
    status: DonationStatus;
    source: 'site' | 'admin';
    donatedAt: string;
    confirmedAt: string | null;
    confirmedBy: string | null;
};

export type AdminExpense = {
    id: number;
    label: string;
    category: string;
    amount: number;
    spentAt: string;
    receiptName: string | null;
    receiptUrl: string | null;
    notes: string | null;
};

export type AdminImage = { id: number; url: string; captionFr: string; captionEn: string; isCover: boolean };

export type AdminDocument = {
    id: number;
    title: string;
    originalName: string;
    extension: string;
    size: number;
    public: boolean;
    url: string;
    createdAt: string | null;
};

export type FinanceSummary = {
    raised: number;
    goal: number;
    pendingAmount: number;
    pendingCount: number;
    donorsCount: number;
    spent: number;
    balance: number;
};

export type Options = { methods: Record<string, string>; categories: Record<string, string> };

export const fcfa = (amount: number) => `${amount.toLocaleString('fr-FR')} FCFA`;

export const shortDate = (iso: string) =>
    new Date(`${iso.slice(0, 10)}T00:00:00`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

export const fileSize = (bytes: number) =>
    bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1).replace('.', ',')} Mo` : `${Math.max(1, Math.round(bytes / 1024))} Ko`;

export const today = () => new Date().toISOString().slice(0, 10);
