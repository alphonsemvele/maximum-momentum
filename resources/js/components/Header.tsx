import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import { useEffect, useState } from 'react';
import { Menu, X, HeartHandshake, LockKeyhole } from 'lucide-react';
import { navLinks, org, ui, whatsappIntro } from '@/lib/content';
import { useLanguage } from '@/lib/i18n';
import { useSectionHref } from '@/lib/useSectionHref';

export default function Header() {
    const { lang, setLang, t } = useLanguage();
    const { scrollY } = useScroll();
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const [activeId, setActiveId] = useState<string>('');
    const sectionHref = useSectionHref();

    useMotionValueEvent(scrollY, 'change', (latest) => setScrolled(latest > 40));

    // Highlight the section currently filling the viewport.
    useEffect(() => {
        const sections = navLinks
            .map((link) => document.getElementById(link.id))
            .filter((element): element is HTMLElement => element !== null);

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

                if (visible) setActiveId(visible.target.id);
            },
            { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] },
        );

        sections.forEach((section) => observer.observe(section));
        return () => observer.disconnect();
    }, []);

    // Lock body scroll while the mobile drawer is open.
    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    return (
        <>
            <header
                className={`animate-enter-down fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-500 ${
                    scrolled
                        ? 'bg-forest-950/92 shadow-[0_1px_0_0_rgb(245_185_32_/_0.16),0_18px_40px_-24px_rgb(6_27_21_/_0.8)]'
                        : 'bg-transparent'
                }`}
            >
                <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
                    <a href={sectionHref('top')} className="group flex shrink-0 items-center gap-3" aria-label={org.name}>
                        <img
                            src="/images/brand/logo-light.png"
                            alt=""
                            className="h-9 w-auto transition-transform duration-500 group-hover:scale-105 sm:h-10"
                        />
                        <span className="hidden border-l border-white/20 pl-3 text-[0.65rem] font-semibold uppercase leading-tight tracking-[0.18em] text-cream-200/80 lg:block">
                            {t({ fr: 'Yaoundé', en: 'Yaoundé' })}
                            <br />
                            {t({ fr: 'Cameroun', en: 'Cameroon' })}
                        </span>
                    </a>

                    <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigation">
                        {navLinks.map((link) => (
                            <a
                                key={link.id}
                                href={sectionHref(link.id)}
                                className={`relative rounded-full px-3.5 py-2 text-[0.8125rem] font-medium transition-colors duration-300 ${
                                    activeId === link.id ? 'text-gold-300' : 'text-cream-100/80 hover:text-white'
                                }`}
                            >
                                {t(link.label)}
                                {activeId === link.id && (
                                    <motion.span
                                        layoutId="nav-active"
                                        className="absolute inset-x-3 -bottom-0.5 h-px bg-gold-400"
                                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                                    />
                                )}
                            </a>
                        ))}
                    </nav>

                    <div className="flex items-center gap-3">
                        <LanguageSwitch lang={lang} setLang={setLang} />

                        <a
                            href="/admin"
                            className="hidden items-center gap-1.5 rounded-full border border-white/20 px-3.5 py-2 text-[0.75rem] font-semibold text-cream-100/85 transition-colors duration-300 hover:border-gold-400/60 hover:text-white sm:inline-flex"
                        >
                            <LockKeyhole className="h-3.5 w-3.5" />
                            {t(ui.admin)}
                        </a>

                        <a
                            href={org.whatsapp(t(whatsappIntro))}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group hidden items-center gap-2 rounded-full bg-gold-400 px-5 py-2.5 text-[0.8125rem] font-semibold text-forest-950 shadow-[0_8px_24px_-10px_rgb(245_185_32_/_0.8)] transition-all duration-300 hover:bg-gold-300 hover:shadow-[0_12px_32px_-10px_rgb(245_185_32_/_0.9)] sm:inline-flex"
                        >
                            <HeartHandshake className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                            {t(ui.sponsorCta)}
                        </a>

                        <button
                            type="button"
                            onClick={() => setOpen(true)}
                            aria-label={t(ui.menu)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-gold-400/60 hover:text-gold-300 lg:hidden"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </header>

            <MobileDrawer open={open} onClose={() => setOpen(false)} activeId={activeId} />
        </>
    );
}

function LanguageSwitch({ lang, setLang }: { lang: 'fr' | 'en'; setLang: (l: 'fr' | 'en') => void }) {
    return (
        <div className="relative flex items-center rounded-full border border-white/20 bg-forest-950/50 p-0.5">
            {(['fr', 'en'] as const).map((code) => (
                <button
                    key={code}
                    type="button"
                    onClick={() => setLang(code)}
                    aria-pressed={lang === code}
                    className={`relative z-10 rounded-full px-2.5 py-1 text-[0.6875rem] font-bold uppercase tracking-wider transition-colors duration-300 ${
                        lang === code ? 'text-forest-950' : 'text-cream-100/70 hover:text-white'
                    }`}
                >
                    {lang === code && (
                        <motion.span
                            layoutId="lang-pill"
                            className="absolute inset-0 -z-10 rounded-full bg-cream-100"
                            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                        />
                    )}
                    {code}
                </button>
            ))}
        </div>
    );
}

function MobileDrawer({ open, onClose, activeId }: { open: boolean; onClose: () => void; activeId: string }) {
    const { t } = useLanguage();
    const sectionHref = useSectionHref();

    useEffect(() => {
        const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[60] bg-forest-950/80 lg:hidden"
                    />

                    <motion.aside
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed inset-y-0 right-0 z-[70] flex w-[min(21rem,86vw)] flex-col bg-forest-900 px-7 py-7 lg:hidden"
                    >
                        <div className="flex items-center justify-between">
                            <img src="/images/brand/logo-light.png" alt={org.name} className="h-9 w-auto" />
                            <button
                                type="button"
                                onClick={onClose}
                                aria-label={t(ui.close)}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <nav className="mt-12 flex flex-col gap-1">
                            {navLinks.map((link, index) => (
                                <motion.a
                                    key={link.id}
                                    href={sectionHref(link.id)}
                                    onClick={onClose}
                                    initial={{ opacity: 0, x: 24 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 + index * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                    className={`border-b border-white/10 py-4 font-display text-2xl transition-colors ${
                                        activeId === link.id ? 'text-gold-300' : 'text-cream-100'
                                    }`}
                                >
                                    {t(link.label)}
                                </motion.a>
                            ))}
                        </nav>

                        <a
                            href="/admin"
                            className="mt-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-semibold text-cream-100"
                        >
                            <LockKeyhole className="h-4 w-4" />
                            {t(ui.admin)}
                        </a>

                        <a
                            href={org.whatsapp(t(whatsappIntro))}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={onClose}
                            className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-gold-400 px-6 py-4 text-sm font-semibold text-forest-950"
                        >
                            <HeartHandshake className="h-4 w-4" />
                            {t(ui.sponsorCta)}
                        </a>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}
