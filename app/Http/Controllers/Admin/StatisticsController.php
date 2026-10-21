<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Support\Analytics;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StatisticsController extends Controller
{
    public const PERIODS = [7, 30, 90, 365];

    public function __invoke(Request $request): Response
    {
        $period = (int) $request->query('periode', 30);
        $period = in_array($period, self::PERIODS, true) ? $period : 30;

        $window = Analytics::lastDays($period);

        return Inertia::render('admin/Statistics', [
            'period' => $period,
            'periods' => self::PERIODS,
            'totals' => $window->totals(),
            'previousTotals' => $window->previous()->totals(),
            'daily' => $window->daily(),
            'pages' => $window->topPages(),
            'campaigns' => $window->campaigns(),
            'referrers' => $window->referrers(),
            'devices' => $window->devices(),
        ]);
    }
}
