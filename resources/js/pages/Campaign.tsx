import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ArrowUpRight, CalendarDays, Download, FileText, Heart, MapPin, MessageCircle, Users } from 'lucide-react';
import CampaignCard from '@/components/CampaignCard';
import CampaignGallery from '@/components/CampaignGallery';
import CampaignProgress from '@/components/CampaignProgress';
import Header from '@/components/Header';
import MomoCard from '@/components/MomoCard';
import Reveal, { RevealGroup, RevealItem } from '@/components/Reveal';
import Contact from '@/sections/Contact';
import { campaignsCopy, domainLabels, org, type Campaign, type CampaignDetail } from '@/lib/content';
import { formatDate } from '@/lib/format';
import { useLanguage } from '@/lib/i18n';

const FALLBACK_IMAGE = '/images/gallery/outreach-team-wide.webp';

export default function CampaignPage({ campaign, others }: { campaign: CampaignDetail; others: Campaign[] }) {
    const { lang, t } = useLanguage();
    const title = t(campaign.title);
    const image = campaign.image ?? FALLBACK_IMAGE;
    const paragraphs = t(campaign.description)
        .split(/\n{2,}/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean);

    const supportMessage = t({
        fr: `Bonjour Maximum Momentum in Action, je souhaite soutenir la campagne « ${title} ».`,
        en: `Hello Maximum Momentum in Action, I would like to support the “${title}” campaign.`,
    });

    const donatedMessage = t({
        fr: `Bonjour Maximum Momentum in Action, je viens de faire un don pour la campagne « ${title} ». Voici la capture de mon transfert :`,
        en: `Hello Maximum Momentum in Action, I have just made a donation to the “${title}” campaign. Here is the screenshot of my transfer:`,
    });

    return (
        <>
            <Head title={`${title} — ${org.name}`}>
                <meta name="description" content={t(campaign.summary)} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={t(campaign.summary)} />
                <meta property="og:image" content={image} />
                <meta property="og:type" content="article" />
            </Head>

            <Header />

            <main>
                {/* ---------------------------- banner ---------------------------- */}
                <section id="top" className="relative overflow-hidden bg-forest-950">
                    <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-forest-950/70" />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/40 to-forest-950/70" />

                    <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-36 sm:px-8 sm:pb-24 sm:pt-44">
                        <Link
                            href="/#campagnes"
                            className="animate-enter-up inline-flex items-center gap-2 text-[0.8125rem] font-medium text-cream-100/70 transition-colors hover:text-gold-300"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            {t(campaignsCopy.back)}
                        </Link>

                        <div className="animate-enter-up mt-8 flex flex-wrap gap-2" style={{ animationDelay: '0.05s' }}>
                            <span className="rounded-full bg-forest-950/70 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-gold-300 ring-1 ring-gold-400/30">
                                {t(domainLabels[campaign.domain] ?? domainLabels.autre)}
                            </span>
                        </div>

                        <h1
                            className="animate-enter-up mt-6 max-w-4xl font-display text-[clamp(2.2rem,5.6vw,4.4rem)] font-semibold leading-[1.04] tracking-[-0.02em] text-white text-balance"
                            style={{ animationDelay: '0.12s' }}
                        >
                            {title}
                        </h1>

                        <p
                            className="animate-enter-up mt-6 max-w-2xl text-base leading-relaxed text-cream-100/85 text-pretty sm:text-lg"
                            style={{ animationDelay: '0.2s' }}
                        >
                            {t(campaign.summary)}
                        </p>

                        <div
                            className="animate-enter-up mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[0.8125rem] text-cream-100/65"
                            style={{ animationDelay: '0.28s' }}
                        >
                            {campaign.location && (
                                <span className="inline-flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-gold-300" />
                                    {campaign.location}
                                </span>
                            )}
                            {campaign.startsAt && (
                                <span className="inline-flex items-center gap-2">
                                    <CalendarDays className="h-4 w-4 text-gold-300" />
                                    {formatDate(campaign.startsAt, lang)}
                                    {campaign.endsAt && ` → ${formatDate(campaign.endsAt, lang)}`}
                                </span>
                            )}
                            {campaign.beneficiaries !== null && (
                                <span className="inline-flex items-center gap-2">
                                    <Users className="h-4 w-4 text-gold-300" />
                                    {campaign.beneficiaries.toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US')}{' '}
                                    {t(campaignsCopy.beneficiaries)}
                                </span>
                            )}
                        </div>
                    </div>
                </section>

                {/* -------------------------- body + give -------------------------- */}
                <section className="paper-grain bg-cream-50 py-20 sm:py-28">
                    <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
                        <div className="min-w-0">
                        <Reveal>
                            <div className="space-y-5 text-[1rem] leading-relaxed text-forest-800/80 text-pretty sm:text-[1.0625rem]">
                                {paragraphs.length > 0 ? (
                                    paragraphs.map((paragraph, index) => (
                                        <p key={index} className="whitespace-pre-line">
                                            {paragraph}
                                        </p>
                                    ))
                                ) : (
                                    <p>{t(campaign.summary)}</p>
                                )}
                            </div>
                        </Reveal>

                        {campaign.gallery.length > 0 && (
                            <Reveal className="mt-14">
                                <span className="eyebrow text-forest-600">{t(campaignsCopy.gallery)}</span>
                                <div className="mt-6">
                                    <CampaignGallery images={campaign.gallery} layout={campaign.galleryLayout} />
                                </div>
                            </Reveal>
                        )}

                        {campaign.documents.length > 0 && (
                            <Reveal className="mt-14">
                                <span className="eyebrow text-forest-600">{t(campaignsCopy.documents)}</span>
                                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                                    {campaign.documents.map((document) => (
                                        <li key={document.id}>
                                            <a
                                                href={document.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group flex items-center gap-4 rounded-xl border border-forest-200/70 bg-white p-4 transition-colors hover:border-forest-400"
                                            >
                                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-forest-50 text-forest-600">
                                                    <FileText className="h-5 w-5" />
                                                </span>
                                                <span className="min-w-0 flex-1">
                                                    <span className="block truncate text-[0.9rem] font-medium text-forest-900">{document.title}</span>
                                                    <span className="text-[0.75rem] uppercase text-forest-800/50">
                                                        {document.extension} · {Math.max(1, Math.round(document.size / 1024)).toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US')} Ko
                                                    </span>
                                                </span>
                                                <Download className="h-4 w-4 text-forest-500 transition-transform group-hover:translate-y-0.5" />
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </Reveal>
                        )}

                        {campaign.recentDonors.length > 0 && (
                            <Reveal className="mt-14">
                                <span className="eyebrow text-forest-600">{t(campaignsCopy.donors)}</span>
                                <p className="mt-4 text-sm text-forest-800/60">
                                    {campaign.donorsCount.toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US')} {t(campaignsCopy.donorsCount)}
                                </p>
                                <ul className="mt-4 flex flex-wrap gap-2">
                                    {campaign.recentDonors.map((donor, index) => (
                                        <li
                                            key={`${donor.name}-${index}`}
                                            className="inline-flex items-center gap-1.5 rounded-full border border-forest-200 bg-white px-3 py-1.5 text-[0.8125rem] text-forest-800"
                                        >
                                            <Heart className="h-3.5 w-3.5 fill-rose-brand-400 text-rose-brand-400" />
                                            {donor.name === 'Anonyme' ? t({ fr: 'Anonyme', en: 'Anonymous' }) : donor.name}
                                        </li>
                                    ))}
                                </ul>
                            </Reveal>
                        )}
                        </div>

                        <Reveal from="left" delay={0.08}>
                            <aside className="rounded-2xl bg-forest-900 p-8 text-cream-100 shadow-lift sm:p-9">
                                <h2 className="font-display text-2xl font-semibold text-white">{t(campaignsCopy.support)}</h2>

                                {campaign.goalAmount !== null && (
                                    <div className="mt-6">
                                        <CampaignProgress campaign={campaign} />
                                    </div>
                                )}

                                <p className="mt-6 text-[0.875rem] leading-relaxed text-cream-100/65">
                                    {t(campaignsCopy.momoNote)}
                                </p>

                                <div className="mt-6 grid gap-4">
                                    <MomoCard
                                        provider="MTN Mobile Money"
                                        number={org.momo.mtn}
                                        className="from-gold-400/20 ring-gold-400/25"
                                        dot="bg-gold-400"
                                    />
                                    <MomoCard
                                        provider="Orange Money"
                                        number={org.momo.orange}
                                        className="from-orange-500/20 ring-orange-500/25"
                                        dot="bg-orange-500"
                                    />
                                </div>

                                <a
                                    href={org.whatsapp(supportMessage)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group mt-7 inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-gold-400 px-6 py-3.5 text-sm font-semibold text-forest-950 transition-colors hover:bg-gold-300"
                                >
                                    <MessageCircle className="h-4 w-4" />
                                    {t(campaignsCopy.donateCta)}
                                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </a>

                                <div className="mt-8 border-t border-white/10 pt-7">
                                    <h3 className="font-display text-lg font-semibold text-white">{t(campaignsCopy.declare.title)}</h3>
                                    <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-cream-100/60">{t(campaignsCopy.declare.intro)}</p>
                                    <a
                                        href={org.whatsapp(donatedMessage)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-gold-400/60 px-6 py-3 text-sm font-semibold text-gold-200 transition-colors hover:bg-gold-400 hover:text-forest-950"
                                    >
                                        <MessageCircle className="h-4 w-4" />
                                        {t(campaignsCopy.declare.cta)}
                                    </a>
                                </div>
                            </aside>
                        </Reveal>
                    </div>
                </section>

                {/* ------------------------- other campaigns ------------------------ */}
                {others.length > 0 && (
                    <section className="bg-forest-900 py-20 sm:py-24">
                        <div className="mx-auto max-w-7xl px-5 sm:px-8">
                            <Reveal>
                                <span className="eyebrow text-gold-300">{t(campaignsCopy.others)}</span>
                            </Reveal>

                            <RevealGroup className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3" stagger={0.1}>
                                {others.map((other) => (
                                    <RevealItem key={other.slug} className="h-full">
                                        <CampaignCard campaign={other} />
                                    </RevealItem>
                                ))}
                            </RevealGroup>
                        </div>
                    </section>
                )}

                <Contact />
            </main>
        </>
    );
}
