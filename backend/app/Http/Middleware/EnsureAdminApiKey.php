<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdminApiKey
{
    public function handle(Request $request, Closure $next): Response
    {
        $configuredKey = (string) config('tefetro.admin_api_key');
        $providedKey = (string) $request->header('X-Admin-Key');

        if ($configuredKey === '' || ! hash_equals($configuredKey, $providedKey)) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 401);
        }

        return $next($request);
    }
}
