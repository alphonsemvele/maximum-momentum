<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Models\CampaignImage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

/**
 * Gallery images of a campaign. A gallery image may also be the cover, in
 * which case both rows point at the same file and it is only deleted once
 * nothing references it any more.
 */
class CampaignMediaController extends Controller
{
    public function store(Request $request, Campaign $campaign): RedirectResponse
    {
        $request->validate([
            'images' => ['required', 'array', 'max:30'],
            'images.*' => ['image', 'max:8192'],
        ], attributes: ['images' => 'images', 'images.*' => 'image']);

        $position = (int) $campaign->images()->max('position');

        foreach ($request->file('images') as $file) {
            $campaign->images()->create([
                'path' => $file->store("campaigns/{$campaign->id}/images", 'public'),
                'position' => ++$position,
            ]);
        }

        if (blank($campaign->image_path)) {
            $campaign->update(['image_path' => $campaign->images()->first()->path]);
        }

        $count = count($request->file('images'));

        return back()->with('success', $count > 1 ? "{$count} images ajoutées." : 'Image ajoutée.');
    }

    public function update(Request $request, CampaignImage $image): RedirectResponse
    {
        $data = $request->validate([
            'captionFr' => ['nullable', 'string', 'max:255'],
            'captionEn' => ['nullable', 'string', 'max:255'],
        ]);

        $image->update(['caption_fr' => $data['captionFr'] ?? null, 'caption_en' => $data['captionEn'] ?? null]);

        return back()->with('success', 'Légende enregistrée.');
    }

    public function move(Request $request, CampaignImage $image): RedirectResponse
    {
        $direction = $request->validate(['direction' => ['required', Rule::in(['up', 'down'])]])['direction'];

        $images = $image->campaign->images()->get()->values();
        $index = $images->search(fn (CampaignImage $candidate) => $candidate->is($image));
        $swapWith = $direction === 'up' ? $index - 1 : $index + 1;

        if ($swapWith >= 0 && $swapWith < $images->count()) {
            DB::transaction(function () use ($images, $index, $swapWith) {
                $ordered = $images->all();
                [$ordered[$index], $ordered[$swapWith]] = [$ordered[$swapWith], $ordered[$index]];

                foreach (array_values($ordered) as $position => $item) {
                    $item->update(['position' => $position + 1]);
                }
            });
        }

        return back();
    }

    public function cover(CampaignImage $image): RedirectResponse
    {
        $campaign = $image->campaign;
        $previous = $campaign->image_path;

        $campaign->update(['image_path' => $image->path]);
        self::deleteIfUnused($campaign, $previous);

        return back()->with('success', 'Image de couverture mise à jour.');
    }

    public function destroy(CampaignImage $image): RedirectResponse
    {
        $campaign = $image->campaign;
        $image->delete();
        self::deleteIfUnused($campaign, $image->path);

        return back()->with('success', 'Image supprimée.');
    }

    public function layout(Request $request, Campaign $campaign): RedirectResponse
    {
        $data = $request->validate(['layout' => ['required', Rule::in(Campaign::GALLERY_LAYOUTS)]]);

        $campaign->update(['gallery_layout' => $data['layout']]);

        return back()->with('success', 'Affichage de la galerie mis à jour.');
    }

    /** Deletes an uploaded file unless the cover or a gallery image still uses it. Seeded /images paths are never touched. */
    public static function deleteIfUnused(Campaign $campaign, ?string $path): void
    {
        if (blank($path) || str_starts_with($path, '/')) {
            return;
        }

        $inUse = $campaign->fresh()->image_path === $path || CampaignImage::where('path', $path)->exists();

        if (! $inUse) {
            Storage::disk('public')->delete($path);
        }
    }
}
