<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Models\CampaignDocument;
use App\Models\CampaignImage;
use App\Models\Donation;
use App\Models\Expense;
use App\Support\Analytics;
use Inertia\Inertia;
use Inertia\Response;

/**
 * One screen per campaign: overview, donations, expenses, images, documents.
 */
class CampaignManageController extends Controller
{
    public function show(Campaign $campaign): Response
    {
        $campaign->loadCount('views');
        $donations = $campaign->donations()->with('confirmer')->latest('donated_at')->latest('id')->get();
        $expenses = $campaign->expenses()->latest('spent_at')->latest('id')->get();
        $month = Analytics::lastDays(30)->campaigns();
        $monthViews = collect($month)->firstWhere('id', $campaign->id)['views'] ?? 0;

        return Inertia::render('admin/campaigns/Show', [
            'campaign' => $campaign->toAdminArray(),
            'summary' => [
                ...self::finances($campaign, $donations, $expenses),
                'views' => (int) $campaign->views_count,
                'viewsMonth' => $monthViews,
            ],
            'donations' => $donations->map(fn (Donation $donation) => $donation->toAdminArray()),
            'expenses' => $expenses->map(fn (Expense $expense) => $expense->toAdminArray()),
            'images' => $campaign->images->map(fn (CampaignImage $image) => [
                'id' => $image->id,
                'url' => $image->url(),
                'captionFr' => $image->caption_fr ?? '',
                'captionEn' => $image->caption_en ?? '',
                'isCover' => $image->path === $campaign->image_path,
            ]),
            'documents' => $campaign->documents->map(fn (CampaignDocument $document) => [
                'id' => $document->id,
                'title' => $document->title,
                'originalName' => $document->original_name,
                'extension' => $document->extension(),
                'size' => $document->size,
                'public' => $document->is_public,
                'url' => route('documents.show', $document),
                'createdAt' => $document->created_at?->toDateString(),
            ]),
            'options' => self::options(),
        ]);
    }

    /**
     * @return array<string, int>
     */
    public static function finances(Campaign $campaign, $donations = null, $expenses = null): array
    {
        $donations ??= $campaign->donations()->get(['amount', 'status']);
        $expenses ??= $campaign->expenses()->get(['amount']);

        $confirmed = (int) $donations->where('status', 'confirmed')->sum('amount');
        $spent = (int) $expenses->sum('amount');

        return [
            'raised' => $confirmed,
            'goal' => (int) ($campaign->goal_amount ?? 0),
            'pendingAmount' => (int) $donations->where('status', 'pending')->sum('amount'),
            'pendingCount' => $donations->where('status', 'pending')->count(),
            'donorsCount' => $donations->where('status', 'confirmed')->count(),
            'spent' => $spent,
            'balance' => $confirmed - $spent,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function options(): array
    {
        return [
            'methods' => Donation::METHODS,
            'categories' => Expense::CATEGORIES,
        ];
    }
}
