import { router, useForm, usePage } from '@inertiajs/react';
import { Trash2, UserPlus } from 'lucide-react';
import type { FormEvent } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card } from '@/components/admin/Charts';

type AdminUser = { id: number; name: string; email: string; createdAt: string | null; isSelf: boolean };

export default function Users({ users }: { users: AdminUser[] }) {
    const { errors: pageErrors } = usePage<{ errors: Record<string, string> }>().props;
    const form = useForm({ name: '', email: '', password: '', password_confirmation: '' });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.post('/admin/administrateurs', { preserveScroll: true, onSuccess: () => form.reset() });
    };

    const destroy = (user: AdminUser) => {
        if (window.confirm(`Retirer l’accès de ${user.name} (${user.email}) ?`)) {
            router.delete(`/admin/administrateurs/${user.id}`, { preserveScroll: true });
        }
    };

    return (
        <AdminLayout title="Administrateurs">
            <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
                <Card title={`${users.length} compte(s) avec accès`}>
                    {pageErrors.user && <p className="mb-4 text-sm text-rose-brand-700">{pageErrors.user}</p>}
                    <ul className="divide-y divide-forest-100">
                        {users.map((user) => (
                            <li key={user.id} className="flex items-center justify-between gap-4 py-3">
                                <div className="min-w-0">
                                    <p className="truncate font-medium text-forest-900">
                                        {user.name}
                                        {user.isSelf && <span className="ml-2 text-[0.75rem] font-normal text-forest-800/50">(vous)</span>}
                                    </p>
                                    <p className="truncate text-[0.8125rem] text-forest-800/60">{user.email}</p>
                                </div>
                                {!user.isSelf && (
                                    <button
                                        type="button"
                                        onClick={() => destroy(user)}
                                        className="admin-icon-button shrink-0 hover:border-rose-brand-300 hover:text-rose-brand-700"
                                        title="Retirer l’accès"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </Card>

                <Card title="Ajouter un administrateur">
                    <form onSubmit={submit} className="grid gap-4">
                        <Input label="Nom" value={form.data.name} onChange={(value) => form.setData('name', value)} error={form.errors.name} />
                        <Input
                            label="E-mail"
                            type="email"
                            value={form.data.email}
                            onChange={(value) => form.setData('email', value)}
                            error={form.errors.email}
                        />
                        <Input
                            label="Mot de passe (8 caractères min.)"
                            type="password"
                            value={form.data.password}
                            onChange={(value) => form.setData('password', value)}
                            error={form.errors.password}
                        />
                        <Input
                            label="Confirmer le mot de passe"
                            type="password"
                            value={form.data.password_confirmation}
                            onChange={(value) => form.setData('password_confirmation', value)}
                        />
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-forest-800 px-6 py-3 text-sm font-semibold text-cream-50 hover:bg-forest-700 disabled:opacity-60"
                        >
                            <UserPlus className="h-4 w-4" />
                            Ajouter
                        </button>
                    </form>
                </Card>
            </div>
        </AdminLayout>
    );
}

export function Input({
    label,
    value,
    onChange,
    error,
    type = 'text',
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    type?: string;
}) {
    return (
        <label className="grid gap-1.5">
            <span className="text-sm font-medium text-forest-800">{label}</span>
            <input
                type={type}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                autoComplete={type === 'password' ? 'new-password' : undefined}
                className="admin-input"
            />
            {error && <span className="text-sm text-rose-brand-700">{error}</span>}
        </label>
    );
}
