<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Support\Analytics;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $month = Analytics::lastDays(30);
        $today = Analytics::lastDays(1);

        return Inertia::render('admin/Dashboard', [
            'traffic' => [
                'today' => $today->totals(),
                'month' => $month->totals(),
                'previousMonth' => $month->previous()->totals(),
                'daily' => $month->daily(),
            ],
            'campaigns' => [
                'published' => Campaign::published()->count(),
                'drafts' => Campaign::where('status', 'draft')->count(),
                'raised' => (int) Campaign::sum('raised_amount'),
                'goal' => (int) Campaign::whereNotNull('goal_amount')->sum('goal_amount'),
            ],
            'topCampaigns' => $month->campaigns(5),
        ]);
    }
}
