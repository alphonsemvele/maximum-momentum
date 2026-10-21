import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState, type ReactNode } from 'react';
import {
    BarChart3,
    CheckCircle2,
    ExternalLink,
    LayoutDashboard,
    LogOut,
    Megaphone,
    Menu,
    UserCog,
    Wallet,
    Users,
    X,
    type LucideIcon,
} from 'lucide-react';

type SharedProps = {
    auth: { user: { name: string; email: string } | null };
    flash: { success: string | null };
};

const navItems: { href: string; label: string; icon: LucideIcon; exact?: boolean }[] = [
    { href: '/admin', label: 'Tableau de bord', icon: LayoutDashboard, exact: true },
    { href: '/admin/statistiques', label: 'Statistiques', icon: BarChart3 },
    { href: '/admin/campagnes', label: 'Campagnes', icon: Megaphone },
    { href: '/admin/finances', label: 'Finances & dons', icon: Wallet },
    { href: '/admin/administrateurs', label: 'Administrateurs', icon: Users },
    { href: '/admin/compte', label: 'Mon compte', icon: UserCog },
];

export default function AdminLayout({ title, actions, children }: { title: string; actions?: ReactNode; children: ReactNode }) {
    const { auth, flash } = usePage<SharedProps>().props;
    const [notice, setNotice] = useState(flash.success);
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        setNotice(flash.success);
        if (!flash.success) return;
        const timer = window.setTimeout(() => setNotice(null), 4000);
        return () => window.clearTimeout(timer);
    }, [flash.success]);

    return (
        <div className="min-h-screen bg-cream-100 text-forest-900 lg:pl-64">
            <Head title={`${title} — Administration`} />

            {/* ---------------------- sidebar (desktop) ---------------------- */}
            <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">
                <Sidebar userName={auth.user?.name} userEmail={auth.user?.email} />
            </aside>

            {/* -------------------- top bar + drawer (mobile) -------------------- */}
            <header className="sticky top-0 z-30 flex h-14 items-center justify-between bg-forest-950 px-4 text-cream-100 lg:hidden">
                <Link href="/admin" className="flex items-center gap-2.5">
                    <img src="/images/brand/logo-light.png" alt="Maximum Momentum in Action" className="h-7 w-auto" />
                </Link>
                <button
                    type="button"
                    onClick={() => setDrawerOpen(true)}
                    aria-label="Ouvrir le menu"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20"
                >
                    <Menu className="h-5 w-5" />
                </button>
            </header>

            {drawerOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-forest-950/70" onClick={() => setDrawerOpen(false)} />
                    <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw]">
                        <Sidebar
                            userName={auth.user?.name}
                            userEmail={auth.user?.email}
                            onNavigate={() => setDrawerOpen(false)}
                            closeButton={
                                <button
                                    type="button"
                                    onClick={() => setDrawerOpen(false)}
                                    aria-label="Fermer le menu"
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-cream-100"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            }
                        />
                    </div>
                </div>
            )}

            {/* ---------------------------- content ---------------------------- */}
            <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-10">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <h1 className="font-display text-2xl font-semibold text-forest-900 sm:text-3xl">{title}</h1>
                    {actions}
                </div>

                {notice && (
                    <div className="mt-6 flex items-center gap-2.5 rounded-xl border border-forest-200 bg-forest-50 px-4 py-3 text-sm text-forest-800">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-forest-600" />
                        {notice}
                    </div>
                )}

                <div className="mt-8">{children}</div>
            </main>
        </div>
    );
}

function Sidebar({
    userName,
    userEmail,
    onNavigate,
    closeButton,
}: {
    userName?: string;
    userEmail?: string;
    onNavigate?: () => void;
    closeButton?: ReactNode;
}) {
    const path = usePage().url.split('?')[0];

    const isActive = (href: string, exact?: boolean) => (exact ? path === href : path === href || path.startsWith(`${href}/`));

    return (
        <div className="flex h-full flex-col bg-forest-950 px-4 py-6 text-cream-100">
            <div className="flex items-center justify-between px-2">
                <Link href="/admin" onClick={onNavigate}>
                    <img src="/images/brand/logo-light.png" alt="Maximum Momentum in Action" className="h-9 w-auto" />
                </Link>
                {closeButton}
            </div>
            <p className="mt-3 px-2 text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-cream-200/50">Administration</p>

            <nav className="mt-8 grid gap-1" aria-label="Menu d’administration">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href, item.exact);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onNavigate}
                            aria-current={active ? 'page' : undefined}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                                active ? 'bg-white/10 text-gold-300' : 'text-cream-100/75 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            <Icon className="h-4.5 w-4.5" strokeWidth={1.8} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto grid gap-1 border-t border-white/10 pt-5">
                <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-cream-100/75 hover:bg-white/5 hover:text-white"
                >
                    <ExternalLink className="h-4.5 w-4.5" strokeWidth={1.8} />
                    Voir le site
                </a>
                <button
                    type="button"
                    onClick={() => router.post('/admin/logout')}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-cream-100/75 hover:bg-white/5 hover:text-white"
                >
                    <LogOut className="h-4.5 w-4.5" strokeWidth={1.8} />
                    Déconnexion
                </button>

                {userName && (
                    <div className="mt-3 rounded-lg bg-white/5 px-3 py-2.5">
                        <p className="truncate text-sm font-medium text-white">{userName}</p>
                        <p className="truncate text-[0.75rem] text-cream-100/50">{userEmail}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
