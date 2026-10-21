import { ArrowUpRight, Globe, LockKeyhole, Mail, MapPin, MessageCircle } from 'lucide-react';
import Reveal, { RevealGroup, RevealItem } from '@/components/Reveal';
import { contact, footer, navLinks, org, ui, whatsappIntro } from '@/lib/content';
import { useLanguage } from '@/lib/i18n';
import { useSectionHref } from '@/lib/useSectionHref';

export default function Contact() {
    const { t } = useLanguage();

    const channels = [
        {
            icon: MessageCircle,
            label: t(contact.whatsappLabel),
            value: org.phoneDisplay,
            href: org.whatsapp(t(whatsappIntro)),
            featured: true,
        },
        {
            icon: Mail,
            label: t(contact.emailLabel),
            value: org.email,
            href: `mailto:${org.email}`,
        },
        {
            icon: Globe,
            label: t(contact.socialLabel),
            value: org.social,
            href: org.socialUrl,
        },
        {
            icon: MapPin,
            label: t(contact.locationLabel),
            value: t(org.location),
        },
    ];

    return (
        <section id="contact" className="relative overflow-hidden bg-forest-950 pt-24 text-cream-100 sm:pt-32">
            <div className="bloom-forest pointer-events-none absolute -left-32 top-0 h-[26rem] w-[26rem] rounded-full" />

            <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
                <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
                    <div>
                        <Reveal>
                            <span className="eyebrow text-gold-300">{t(contact.eyebrow)}</span>
                        </Reveal>

                        <Reveal delay={0.08}>
                            <h2 className="mt-6 font-display text-[clamp(2.2rem,5vw,4rem)] font-semibold leading-[1.04] tracking-[-0.025em] text-white">
                                {t(contact.title)}
                            </h2>
                        </Reveal>

                        <Reveal delay={0.14}>
                            <p className="mt-6 max-w-md text-[0.975rem] leading-relaxed text-cream-100/70 text-pretty">
                                {t(contact.intro)}
                            </p>
                        </Reveal>

                        <Reveal delay={0.2}>
                            <a
                                href={org.whatsapp(t(whatsappIntro))}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group mt-10 inline-flex items-center gap-3 rounded-full bg-gold-400 px-7 py-4 text-sm font-semibold text-forest-950 shadow-[0_16px_40px_-14px_rgb(245_185_32_/_0.8)] transition-all duration-300 hover:bg-gold-300"
                            >
                                <MessageCircle className="h-4 w-4" />
                                {t(ui.sponsorCta)}
                                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </a>
                        </Reveal>
                    </div>

                    <RevealGroup className="grid gap-4 sm:grid-cols-2" stagger={0.09}>
                        {channels.map((channel) => {
                            const Icon = channel.icon;
                            const inner = (
                                <>
                                    <span
                                        className={`inline-flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-500 group-hover:scale-110 ${
                                            channel.featured ? 'bg-gold-400 text-forest-950' : 'bg-forest-800 text-gold-300'
                                        }`}
                                    >
                                        <Icon className="h-5 w-5" strokeWidth={1.7} />
                                    </span>

                                    <p className="mt-6 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-cream-100/50">
                                        {channel.label}
                                    </p>

                                    <p className="mt-2 break-words font-display text-[1.0625rem] font-medium text-white">
                                        {channel.value}
                                    </p>

                                    {channel.href && (
                                        <ArrowUpRight className="absolute right-6 top-6 h-4 w-4 text-cream-100/25 transition-all duration-300 group-hover:right-5 group-hover:top-5 group-hover:text-gold-300" />
                                    )}
                                </>
                            );

                            const classes =
                                'group relative block h-full rounded-2xl border border-white/12 bg-forest-900/70 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-white/25 hover:bg-forest-900/70';

                            return (
                                <RevealItem key={channel.label}>
                                    {channel.href ? (
                                        <a
                                            href={channel.href}
                                            target={channel.href.startsWith('http') ? '_blank' : undefined}
                                            rel="noopener noreferrer"
                                            className={classes}
                                        >
                                            {inner}
                                        </a>
                                    ) : (
                                        <div className={classes}>{inner}</div>
                                    )}
                                </RevealItem>
                            );
                        })}
                    </RevealGroup>
                </div>

                <Footer />
            </div>
        </section>
    );
}

function Footer() {
    const { t } = useLanguage();
    const sectionHref = useSectionHref();
    const year = new Date().getFullYear();

    return (
        <footer className="mt-24 border-t border-white/10 py-12 sm:mt-32">
            <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-sm">
                    <img src="/images/brand/logo-light.png" alt={org.name} className="h-11 w-auto" />
                    <p className="mt-5 font-display text-sm italic text-cream-100/60">« {t(org.tagline)} »</p>
                    <p className="mt-4 text-[0.8125rem] leading-relaxed text-cream-100/40">{t(footer.builtLine)}</p>
                </div>

                <div>
                    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-gold-300/80">
                        {t(footer.nav)}
                    </p>
                    <ul className="mt-5 grid grid-cols-2 gap-x-10 gap-y-2.5">
                        {navLinks.map((link) => (
                            <li key={link.id}>
                                <a
                                    href={sectionHref(link.id)}
                                    className="text-[0.8125rem] text-cream-100/60 transition-colors hover:text-gold-300"
                                >
                                    {t(link.label)}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="text-[0.8125rem] text-cream-100/50">
                    <p>{org.phoneDisplay}</p>
                    <a href={`mailto:${org.email}`} className="mt-1.5 block break-all transition-colors hover:text-gold-300">
                        {org.email}
                    </a>
                    <p className="mt-1.5">{t(org.location)}</p>
                </div>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-8 text-[0.75rem] text-cream-100/35">
                <p>
                    © {year} {org.name}. {t(footer.rights)}
                </p>
                <a href="/admin" className="inline-flex items-center gap-1.5 transition-colors hover:text-gold-300">
                    <LockKeyhole className="h-3.5 w-3.5" />
                    {t(footer.admin)}
                </a>
            </div>
        </footer>
    );
}
