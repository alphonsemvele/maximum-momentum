<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Throwable;

/**
 * Post-deploy hook for hosting reachable only by FTP: the CI pipeline calls
 * it after uploading files so migrations and caches run on the server.
 * Disabled unless DEPLOY_TOKEN is set in the server's .env.
 */
class DeployController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $token = (string) config('app.deploy_token');

        abort_if($token === '' || ! hash_equals($token, (string) $request->header('X-Deploy-Token')), 404);

        $output = [];

        try {
            // Caches from the previous release would point at stale config/routes.
            $output['optimize:clear'] = $this->call('optimize:clear');
            $output['migrate'] = $this->call('migrate', ['--force' => true]);

            // First deployment only (needs ADMIN_EMAIL / ADMIN_PASSWORD in .env):
            // creates the admin account and starter campaigns.
            if (User::query()->doesntExist()) {
                $output['db:seed'] = $this->call('db:seed', ['--force' => true]);
            }

            if (! File::exists(public_path('storage'))) {
                $output['storage:link'] = $this->call('storage:link');
            }

            $output['optimize'] = $this->call('optimize');
        } catch (Throwable $exception) {
            report($exception);

            return response()->json(['ok' => false, 'error' => $exception->getMessage(), 'output' => $output], 500);
        }

        return response()->json(['ok' => true, 'output' => $output]);
    }

    private function call(string $command, array $parameters = []): string
    {
        Artisan::call($command, $parameters);

        return trim(Artisan::output());
    }
}
