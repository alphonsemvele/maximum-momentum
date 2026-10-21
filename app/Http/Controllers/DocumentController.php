<?php

namespace App\Http\Controllers;

use App\Models\CampaignDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DocumentController extends Controller
{
    /** Public documents of published campaigns are open to all; everything else needs an admin session. */
    public function show(Request $request, CampaignDocument $document): StreamedResponse
    {
        $visible = $document->is_public && $document->campaign->status === 'published';

        abort_unless($visible || $request->user(), 404);
        abort_unless(Storage::disk('local')->exists($document->path), 404);

        return Storage::disk('local')->response($document->path, $document->original_name);
    }
}
