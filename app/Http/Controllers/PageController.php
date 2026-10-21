<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function home(): Response
    {
        return Inertia::render('Home', [
            'campaigns' => Campaign::published()->forDisplay()->get()
                ->map(fn (Campaign $campaign) => $campaign->toPublicArray()),
        ]);
    }

    public function campaign(string $slug): Response
    {
        $campaign = Campaign::published()->where('slug', $slug)->with(['images', 'documents'])->firstOrFail();

        return Inertia::render('Campaign', [
            'campaign' => $campaign->toPublicDetailArray(),
            'others' => Campaign::published()->forDisplay()->whereKeyNot($campaign->id)->limit(3)->get()
                ->map(fn (Campaign $other) => $other->toPublicArray()),
        ]);
    }
}
