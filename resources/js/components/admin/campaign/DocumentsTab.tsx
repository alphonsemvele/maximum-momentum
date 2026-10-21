import { router, useForm } from '@inertiajs/react';
import { Download, Eye, EyeOff, FilePlus2, FileText, Trash2 } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Card } from '@/components/admin/Charts';
import { Field, SubmitButton } from '@/components/admin/FormBits';
import { fileSize, shortDate, type AdminDocument } from '@/components/admin/types';

export default function DocumentsTab({ campaignId, documents }: { campaignId: number; documents: AdminDocument[] }) {
    const form = useForm<{ documents: File[]; title: string; public: boolean }>({ documents: [], title: '', public: false });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.post(`/admin/campagnes/${campaignId}/documents`, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    };

    const fileErrors = Object.entries(form.errors)
        .filter(([key]) => key.startsWith('documents'))
        .map(([, message]) => message);

    return (
        <div className="grid gap-6">
            <Card title="Ajouter des documents">
                <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
                    <Field label="Fichiers *" hint="PDF, Word, Excel, PowerPoint, images, ZIP… 20 Mo max. chacun. Plusieurs fichiers possibles.">
                        <input
                            type="file"
                            multiple
                            onChange={(event) => form.setData('documents', Array.from(event.target.files ?? []))}
                            className="text-sm"
                        />
                    </Field>
                    <Field label="Titre" error={form.errors.title} hint="Pour un seul fichier. Sinon, le nom de chaque fichier est utilisé.">
                        <input value={form.data.title} onChange={(e) => form.setData('title', e.target.value)} className="admin-input" placeholder="Ex. : Rapport d’activité" />
                    </Field>
                    <label className="flex items-center gap-2 text-sm text-forest-800">
                        <input type="checkbox" checked={form.data.public} onChange={(e) => form.setData('public', e.target.checked)} className="h-4 w-4 accent-forest-700" />
                        Visible sur la page publique de la campagne
                    </label>
                    <div className="flex justify-end">
                        <SubmitButton processing={form.processing || form.data.documents.length === 0}>
                            <FilePlus2 className="h-4 w-4" />
                            {form.data.documents.length > 1 ? `Ajouter ${form.data.documents.length} documents` : 'Ajouter'}
                        </SubmitButton>
                    </div>
                    {fileErrors.length > 0 && <p className="text-sm text-rose-brand-700 sm:col-span-2">{fileErrors[0]}</p>}
                </form>
            </Card>

            <Card title={`Documents (${documents.length})`}>
                {documents.length === 0 ? (
                    <p className="py-8 text-center text-sm text-forest-800/50">Aucun document.</p>
                ) : (
                    <ul className="divide-y divide-forest-100">
                        {documents.map((document) => (
                            <DocumentRow key={document.id} document={document} />
                        ))}
                    </ul>
                )}
            </Card>
        </div>
    );
}

function DocumentRow({ document }: { document: AdminDocument }) {
    const [title, setTitle] = useState(document.title);

    const save = (data: { title: string; public: boolean }) => router.patch(`/admin/documents/${document.id}`, data, { preserveScroll: true });

    const destroy = () => {
        if (window.confirm(`Supprimer « ${document.title} » ?`)) {
            router.delete(`/admin/documents/${document.id}`, { preserveScroll: true });
        }
    };

    return (
        <li className="flex flex-wrap items-center gap-4 py-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-forest-50 text-forest-600">
                <FileText className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={() => title.trim() && title !== document.title && save({ title, public: document.public })}
                    className="w-full rounded border border-transparent px-1 py-0.5 font-medium text-forest-900 hover:border-forest-200 focus:border-forest-400 focus:outline-none"
                    title="Cliquez pour renommer"
                />
                <p className="px-1 text-[0.75rem] text-forest-800/55">
                    {document.extension.toUpperCase()} · {fileSize(document.size)}
                    {document.createdAt && ` · ajouté le ${shortDate(document.createdAt)}`}
                </p>
            </div>
            <button
                type="button"
                onClick={() => save({ title: document.title, public: !document.public })}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.75rem] font-semibold ${
                    document.public ? 'bg-forest-100 text-forest-700' : 'bg-cream-200 text-forest-800/70'
                }`}
                title={document.public ? 'Rendre privé' : 'Afficher sur le site'}
            >
                {document.public ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                {document.public ? 'Public' : 'Privé'}
            </button>
            <a href={document.url} target="_blank" rel="noopener noreferrer" className="admin-icon-button h-8 w-8" title="Ouvrir">
                <Download className="h-3.5 w-3.5" />
            </a>
            <button type="button" onClick={destroy} className="admin-icon-button h-8 w-8 hover:border-rose-brand-300 hover:text-rose-brand-700" title="Supprimer">
                <Trash2 className="h-3.5 w-3.5" />
            </button>
        </li>
    );
}
