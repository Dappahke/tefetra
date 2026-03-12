<?php

namespace Tests\Feature;

use App\Models\ClientProject;
use App\Models\ProjectUpdate;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClientPortalTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_returns_a_client_project_with_only_published_updates(): void
    {
        $project = ClientProject::create([
            'client_name' => 'Amina Otieno',
            'client_email' => 'amina@example.com',
            'title' => 'Family Home in Syokimau',
            'location' => 'Syokimau, Machakos County',
            'status' => 'on-site',
            'summary' => 'Contemporary courtyard house for a diaspora family.',
            'portal_token' => (string) fake()->uuid(),
        ]);

        ProjectUpdate::create([
            'client_project_id' => $project->id,
            'title' => 'Foundation complete',
            'milestone' => 'Groundworks',
            'body' => 'The strip foundation and slab preparation are complete.',
            'published_at' => now()->subDay(),
        ]);

        ProjectUpdate::create([
            'client_project_id' => $project->id,
            'title' => 'Roofing next',
            'milestone' => 'Pending',
            'body' => 'Waiting on truss delivery before roofing starts.',
            'published_at' => null,
        ]);

        $response = $this->getJson("/api/client-portal/{$project->portal_token}");

        $response->assertOk()
            ->assertJsonPath('title', 'Family Home in Syokimau')
            ->assertJsonCount(1, 'project_updates')
            ->assertJsonPath('project_updates.0.title', 'Foundation complete');
    }
}
