<?php

namespace App\Http\Middleware;

use App\Models\Campaign;
use App\Models\PageView;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

/**
 * Records one row per public page displayed. Admins, bots, prefetches and
 * partial reloads are skipped so the numbers reflect real visitors.
 */
class TrackPageView
{
    private const BOT_PATTERN = '/bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|curl|wget|python|headless|lighthouse/i';

    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if ($this->shouldTrack($request, $response)) {
            try {
                $this->record($request);
            } catch (Throwable $exception) {
                // Analytics must never break the page.
                report($exception);
            }
        }

        return $response;
    }

    private function shouldTrack(Request $request, Response $response): bool
    {
        return $request->isMethod('GET')
            && $response->getStatusCode() === 200
            && $request->user() === null
            && ! $request->is('admin', 'admin/*')
            && ! $request->header('X-Inertia-Partial-Data')
            && $request->header('Purpose') !== 'prefetch'
            && $request->header('Sec-Purpose') !== 'prefetch'
            && ! preg_match(self::BOT_PATTERN, (string) $request->userAgent());
    }

    private function record(Request $request): void
    {
        $route = $request->route();
        $campaignId = $route?->getName() === 'campaigns.show'
            ? Campaign::where('slug', $route->parameter('slug'))->value('id')
            : null;

        PageView::create([
            'path' => '/'.ltrim($request->path(), '/'),
            'campaign_id' => $campaignId,
            'visitor' => hash('sha256', implode('|', [
                $request->ip(),
                $request->userAgent(),
                now()->toDateString(),
                config('app.key'),
            ])),
            'referrer_host' => $this->referrerHost($request),
            'device' => $this->device((string) $request->userAgent()),
        ]);
    }

    private function referrerHost(Request $request): ?string
    {
        $host = parse_url((string) $request->headers->get('referer'), PHP_URL_HOST);

        if (! $host || $host === $request->getHost()) {
            return null;
        }

        return preg_replace('/^(www\.|m\.|l\.|lm\.)/', '', strtolower($host));
    }

    private function device(string $userAgent): string
    {
        if (preg_match('/ipad|tablet/i', $userAgent)) {
            return 'tablet';
        }

        return preg_match('/mobi|android|iphone/i', $userAgent) ? 'mobile' : 'desktop';
    }
}
