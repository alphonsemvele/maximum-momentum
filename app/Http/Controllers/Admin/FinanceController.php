<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Models\Donation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Money across every campaign: totals, per-campaign balance sheet and the
 * donation ledger (pending ones first so they get confirmed quickly).
 */
class FinanceController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $status = in_array($request->query('statut'), Donation::STATUSES, true) ? $request->query('statut') : null;
        $campaignId = $request->integer('campagne') ?: null;

        $campaigns = Campaign::with(['donations:id,campaign_id,amount,status', 'expenses:id,campaign_id,amount'])
            ->forDisplay()
            ->get();

        $rows = $campaigns->map(fn (Campaign $campaign) => [
            'id' => $campaign->id,
            'title' => $campaign->title_fr,
            'status' => $campaign->status,
            ...CampaignManageController::finances($campaign, $campaign->donations, $campaign->expenses),
        ]);

        $donations = Donation::with(['campaign:id,title_fr', 'confirmer:id,name'])
            ->when($status, fn ($query) => $query->where('status', $status))
            ->when($campaignId, fn ($query) => $query->where('campaign_id', $campaignId))
            ->orderByRaw("CASE status WHEN 'pending' THEN 0 ELSE 1 END")
            ->latest('donated_at')
            ->latest('id')
            ->limit(200)
            ->get();

        return Inertia::render('admin/Finances', [
            'totals' => [
                'raised' => $rows->sum('raised'),
                'pendingAmount' => $rows->sum('pendingAmount'),
                'pendingCount' => $rows->sum('pendingCount'),
                'spent' => $rows->sum('spent'),
                'balance' => $rows->sum('balance'),
                'goal' => $rows->sum('goal'),
            ],
            'campaigns' => $rows->values(),
            'donations' => $donations->map(fn (Donation $donation) => $donation->toAdminArray()),
            'filters' => ['status' => $status, 'campaign' => $campaignId],
            'options' => CampaignManageController::options(),
        ]);
    }
}
