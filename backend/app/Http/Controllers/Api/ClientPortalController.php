<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClientProject;

class ClientPortalController extends Controller
{
    public function show(string $token)
    {
        $project = ClientProject::query()
            ->where('portal_token', $token)
            ->firstOrFail();

        $project->load([
            'projectUpdates' => fn ($query) => $query
                ->whereNotNull('published_at')
                ->latest('published_at')
                ->latest(),
        ]);

        return $project;
    }
}
