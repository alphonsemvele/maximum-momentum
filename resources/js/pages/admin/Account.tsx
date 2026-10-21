import { useForm, usePage } from '@inertiajs/react';
import { KeyRound, Save } from 'lucide-react';
import type { FormEvent } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card } from '@/components/admin/Charts';
import { Input } from './Users';

export default function Account() {
    const { auth } = usePage<{ auth: { user: { name: string; email: string } } }>().props;

    const profile = useForm({ name: auth.user.name, email: auth.user.email });
    const password = useForm({ current_password: '', password: '', password_confirmation: '' });

    const saveProfile = (event: FormEvent) => {
        event.preventDefault();
        profile.put('/admin/compte', { preserveScroll: true });
    };

    const savePassword = (event: FormEvent) => {
        event.preventDefault();
        password.put('/admin/compte/mot-de-passe', { preserveScroll: true, onSuccess: () => password.reset() });
    };

    return (
        <AdminLayout title="Mon compte">
            <div className="grid gap-6 lg:grid-cols-2">
                <Card title="Profil">
                    <form onSubmit={saveProfile} className="grid gap-4">
                        <Input label="Nom" value={profile.data.name} onChange={(value) => profile.setData('name', value)} error={profile.errors.name} />
                        <Input
                            label="E-mail de connexion"
                            type="email"
                            value={profile.data.email}
                            onChange={(value) => profile.setData('email', value)}
                            error={profile.errors.email}
                        />
                        <button
                            type="submit"
                            disabled={profile.processing}
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-forest-800 px-6 py-3 text-sm font-semibold text-cream-50 hover:bg-forest-700 disabled:opacity-60"
                        >
                            <Save className="h-4 w-4" />
                            Enregistrer
                        </button>
                    </form>
                </Card>

                <Card title="Changer le mot de passe">
                    <form onSubmit={savePassword} className="grid gap-4">
                        <Input
                            label="Mot de passe actuel"
                            type="password"
                            value={password.data.current_password}
                            onChange={(value) => password.setData('current_password', value)}
                            error={password.errors.current_password}
                        />
                        <Input
                            label="Nouveau mot de passe (8 caractères min.)"
                            type="password"
                            value={password.data.password}
                            onChange={(value) => password.setData('password', value)}
                            error={password.errors.password}
                        />
                        <Input
                            label="Confirmer le nouveau mot de passe"
                            type="password"
                            value={password.data.password_confirmation}
                            onChange={(value) => password.setData('password_confirmation', value)}
                        />
                        <button
                            type="submit"
                            disabled={password.processing}
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-forest-800 px-6 py-3 text-sm font-semibold text-cream-50 hover:bg-forest-700 disabled:opacity-60"
                        >
                            <KeyRound className="h-4 w-4" />
                            Modifier le mot de passe
                        </button>
                    </form>
                </Card>
            </div>
        </AdminLayout>
    );
}
