<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ConsultationRequestTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_creates_a_consultation_request(): void
    {
        $response = $this->postJson('/api/consultations', [
            'name' => 'Amina Otieno',
            'email' => 'amina@example.com',
            'country' => 'United Kingdom',
            'plot_location' => 'Kitengela, Kajiado County',
            'plot_size' => '50 x 100 ft',
            'budget_range' => 'KES 8M - 12M',
            'project_timeline' => 'Within 6 months',
            'service_type' => 'Custom architectural design',
            'description' => 'Need a climate-responsive family home with future rental wing.',
        ]);

        $response->assertCreated()
            ->assertJsonPath('message', 'Consultation request submitted successfully.')
            ->assertJsonPath('consultation_request.email', 'amina@example.com')
            ->assertJsonPath('consultation_request.service_type', 'Custom architectural design');

        $this->assertDatabaseHas('consultation_requests', [
            'email' => 'amina@example.com',
            'country' => 'United Kingdom',
            'status' => 'new',
        ]);
    }

    public function test_it_validates_required_consultation_fields(): void
    {
        $response = $this->postJson('/api/consultations', []);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors([
                'name',
                'email',
                'country',
                'plot_location',
                'plot_size',
                'budget_range',
                'project_timeline',
                'description',
            ]);
    }
}
