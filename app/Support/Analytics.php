<?php

namespace App\Support;

use App\Models\Campaign;
use App\Models\PageView;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * Aggregates over page_views for a [from, to) window. Visitor hashes rotate
 * daily, so "visitors" means distinct visitors per day, summed over the window.
 */
class Analytics
{
    public function __construct(
        public readonly Carbon $from,
        public readonly Carbon $to,
    ) {}

    /** The last $days days, today included. */
    public static function lastDays(int $days): self
    {
        $to = now()->addDay()->startOfDay();

        return new self($to->copy()->subDays($days), $to);
    }

    /** The window of the same length immediately before this one. */
    public function previous(): self
    {
        $length = $this->from->diffInDays($this->to);

        return new self($this->from->copy()->subDays($length), $this->from->copy());
    }

    /**
     * @return array{views: int, visitors: int}
     */
    public function totals(): array
    {
        $daily = $this->dailyRows();

        return [
            'views' => (int) $daily->sum('views'),
            'visitors' => (int) $daily->sum('visitors'),
        ];
    }

    /**
     * One entry per day, zero-filled.
     *
     * @return list<array{date: string, views: int, visitors: int}>
     */
    public function daily(): array
    {
        $rows = $this->dailyRows()->keyBy('day');
        $series = [];

        for ($day = $this->from->copy(); $day < $this->to; $day->addDay()) {
            $key = $day->toDateString();
            $series[] = [
                'date' => $key,
                'views' => (int) ($rows[$key]->views ?? 0),
                'visitors' => (int) ($rows[$key]->visitors ?? 0),
            ];
        }

        return $series;
    }

    /**
     * @return list<array{label: string, value: int}>
     */
    public function topPages(int $limit = 8): array
    {
        return $this->query()
            ->select('path', DB::raw('COUNT(*) as views'))
            ->groupBy('path')
            ->orderByDesc('views')
            ->limit($limit)
            ->get()
            ->map(fn ($row) => ['label' => $row->path, 'value' => (int) $row->views])
            ->all();
    }

    /**
     * Every campaign with its views in the window, most viewed first.
     *
     * @return list<array{id: int, slug: string, title: string, status: string, views: int, visitors: int}>
     */
    public function campaigns(?int $limit = null): array
    {
        $stats = $this->query()
            ->whereNotNull('campaign_id')
            ->select('campaign_id', DB::raw('COUNT(*) as views'), DB::raw('COUNT(DISTINCT visitor) as visitors'))
            ->groupBy('campaign_id')
            ->get()
            ->keyBy('campaign_id');

        return Campaign::query()
            ->get(['id', 'slug', 'title_fr', 'status'])
            ->map(fn (Campaign $campaign) => [
                'id' => $campaign->id,
                'slug' => $campaign->slug,
                'title' => $campaign->title_fr,
                'status' => $campaign->status,
                'views' => (int) ($stats[$campaign->id]->views ?? 0),
                'visitors' => (int) ($stats[$campaign->id]->visitors ?? 0),
            ])
            ->sortByDesc('views')
            ->when($limit, fn ($collection) => $collection->take($limit))
            ->values()
            ->all();
    }

    /**
     * Where visitors came from; direct visits are grouped under "Accès direct".
     *
     * @return list<array{label: string, value: int}>
     */
    public function referrers(int $limit = 8): array
    {
        return $this->query()
            ->select('referrer_host', DB::raw('COUNT(*) as views'))
            ->groupBy('referrer_host')
            ->orderByDesc('views')
            ->limit($limit)
            ->get()
            ->map(fn ($row) => ['label' => $row->referrer_host ?? 'Accès direct', 'value' => (int) $row->views])
            ->all();
    }

    /**
     * @return list<array{label: string, value: int}>
     */
    public function devices(): array
    {
        $labels = ['mobile' => 'Mobile', 'desktop' => 'Ordinateur', 'tablet' => 'Tablette'];
        $counts = $this->query()
            ->select('device', DB::raw('COUNT(*) as views'))
            ->groupBy('device')
            ->pluck('views', 'device');

        return collect($labels)
            ->map(fn (string $label, string $key) => ['label' => $label, 'value' => (int) ($counts[$key] ?? 0)])
            ->sortByDesc('value')
            ->values()
            ->all();
    }

    private function query()
    {
        return PageView::query()->between($this->from, $this->to);
    }

    private function dailyRows()
    {
        return $this->query()
            ->select(
                DB::raw('DATE(created_at) as day'),
                DB::raw('COUNT(*) as views'),
                DB::raw('COUNT(DISTINCT visitor) as visitors'),
            )
            ->groupBy('day')
            ->get();
    }
}
