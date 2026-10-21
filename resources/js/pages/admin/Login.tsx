import { Head, useForm } from '@inertiajs/react';
import { LogIn } from 'lucide-react';
import type { FormEvent } from 'react';

export default function Login() {
    const form = useForm({ email: '', password: '', remember: false });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.post('/admin/login', { onFinish: () => form.reset('password') });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-forest-950 px-5 py-16">
            <Head title="Connexion — Administration" />

            <div className="w-full max-w-sm">
                <img src="/images/brand/logo-light.png" alt="Maximum Momentum in Action" className="mx-auto h-12 w-auto" />

                <form onSubmit={submit} className="mt-10 rounded-2xl bg-cream-50 p-8 shadow-lift">
                    <h1 className="font-display text-2xl font-semibold text-forest-900">Administration</h1>
                    <p className="mt-1.5 text-sm text-forest-800/60">Connectez-vous pour gérer les campagnes.</p>

                    <label className="mt-7 block text-sm font-medium text-forest-800" htmlFor="email">
                        E-mail
                    </label>
                    <input
                        id="email"
                        type="email"
                        autoComplete="username"
                        autoFocus
                        value={form.data.email}
                        onChange={(event) => form.setData('email', event.target.value)}
                        className="admin-input mt-1.5"
                    />
                    {form.errors.email && <p className="mt-1.5 text-sm text-rose-brand-700">{form.errors.email}</p>}

                    <label className="mt-5 block text-sm font-medium text-forest-800" htmlFor="password">
                        Mot de passe
                    </label>
                    <input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        value={form.data.password}
                        onChange={(event) => form.setData('password', event.target.value)}
                        className="admin-input mt-1.5"
                    />
                    {form.errors.password && <p className="mt-1.5 text-sm text-rose-brand-700">{form.errors.password}</p>}

                    <label className="mt-5 flex items-center gap-2 text-sm text-forest-800/75">
                        <input
                            type="checkbox"
                            checked={form.data.remember}
                            onChange={(event) => form.setData('remember', event.target.checked)}
                            className="h-4 w-4 accent-forest-700"
                        />
                        Rester connecté
                    </label>

                    <button
                        type="submit"
                        disabled={form.processing}
                        className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest-800 px-6 py-3 text-sm font-semibold text-cream-50 transition-colors hover:bg-forest-700 disabled:opacity-60"
                    >
                        <LogIn className="h-4 w-4" />
                        Se connecter
                    </button>
                </form>
            </div>
        </div>
    );
}
