<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\CampaignRequest;
use App\Models\Campaign;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class CampaignController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/campaigns/Index', [
            'campaigns' => Campaign::forDisplay()->withCount('views')->get()->map(fn (Campaign $campaign) => $campaign->toAdminArray()),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/campaigns/Form', [
            'campaign' => null,
        ]);
    }

    public function store(CampaignRequest $request): RedirectResponse
    {
        $campaign = new Campaign($request->columns());
        $this->syncImage($campaign, $request);
        $campaign->save();

        return redirect()->route('admin.campaigns.show', $campaign)
            ->with('success', 'Campagne « '.$campaign->title_fr.' » créée. Ajoutez maintenant ses images, documents et dons.');
    }

    public function edit(Campaign $campaign): Response
    {
        return Inertia::render('admin/campaigns/Form', [
            'campaign' => $campaign->toAdminArray(),
        ]);
    }

    public function update(CampaignRequest $request, Campaign $campaign): RedirectResponse
    {
        $campaign->fill($request->columns());
        $this->syncImage($campaign, $request);
        $campaign->save();

        return redirect()->route('admin.campaigns.show', $campaign)->with('success', 'Campagne « '.$campaign->title_fr.' » mise à jour.');
    }

    public function toggle(Campaign $campaign): RedirectResponse
    {
        $campaign->update(['status' => $campaign->status === 'published' ? 'draft' : 'published']);

        return back()->with('success', $campaign->status === 'published' ? 'Campagne publiée.' : 'Campagne repassée en brouillon.');
    }

    public function destroy(Campaign $campaign): RedirectResponse
    {
        $campaign->delete();
        // Gallery, documents and receipts all live under the campaign's own folder.
        Storage::disk('public')->deleteDirectory("campaigns/{$campaign->id}");
        Storage::disk('local')->deleteDirectory("campaigns/{$campaign->id}");
        if ($campaign->image_path && ! str_starts_with($campaign->image_path, '/')) {
            Storage::disk('public')->delete($campaign->image_path);
        }

        return redirect()->route('admin.campaigns.index')->with('success', 'Campagne supprimée.');
    }

    private function syncImage(Campaign $campaign, CampaignRequest $request): void
    {
        $previous = $campaign->image_path;

        if ($request->hasFile('image')) {
            $campaign->image_path = $request->file('image')->store('campaigns', 'public');
        } elseif ($request->boolean('removeImage')) {
            $campaign->image_path = null;
        } else {
            return;
        }

        if ($campaign->exists && $previous !== $campaign->image_path) {
            // Saved first so the "still in use?" check sees the new cover.
            $campaign->save();
            CampaignMediaController::deleteIfUnused($campaign, $previous);
        }
    }
}
