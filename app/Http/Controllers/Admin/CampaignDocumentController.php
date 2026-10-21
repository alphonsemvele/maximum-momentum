<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Models\CampaignDocument;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CampaignDocumentController extends Controller
{
    public function store(Request $request, Campaign $campaign): RedirectResponse
    {
        $request->validate([
            'documents' => ['required', 'array', 'max:20'],
            'documents.*' => ['file', 'mimes:pdf,doc,docx,xls,xlsx,ppt,pptx,odt,ods,txt,csv,jpg,jpeg,png,webp,zip', 'max:20480'],
            'title' => ['nullable', 'string', 'max:160'],
            'public' => ['boolean'],
        ], attributes: ['documents' => 'documents', 'documents.*' => 'document']);

        $files = $request->file('documents');
        $sharedTitle = count($files) === 1 ? $request->input('title') : null;

        foreach ($files as $file) {
            $campaign->documents()->create([
                'title' => $sharedTitle ?: pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME),
                'path' => $file->store("campaigns/{$campaign->id}/documents", 'local'),
                'original_name' => $file->getClientOriginalName(),
                'mime' => $file->getClientMimeType(),
                'size' => $file->getSize(),
                'is_public' => $request->boolean('public'),
            ]);
        }

        return back()->with('success', count($files) > 1 ? count($files).' documents ajoutés.' : 'Document ajouté.');
    }

    public function update(Request $request, CampaignDocument $document): RedirectResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:160'],
            'public' => ['required', 'boolean'],
        ]);

        $document->update(['title' => $data['title'], 'is_public' => $data['public']]);

        return back()->with('success', $document->is_public ? 'Document visible sur le site.' : 'Document réservé à l’administration.');
    }

    public function destroy(CampaignDocument $document): RedirectResponse
    {
        Storage::disk('local')->delete($document->path);
        $document->delete();

        return back()->with('success', 'Document supprimé.');
    }
}
