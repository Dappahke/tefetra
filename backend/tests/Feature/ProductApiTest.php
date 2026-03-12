<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProductApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_api_key_is_required_to_create_a_product(): void
    {
        $response = $this->postJson('/api/admin/products', [
            'title' => 'Modern Villa',
            'slug' => 'modern-villa',
            'price' => 850,
            'bedrooms' => 4,
            'bathrooms' => 3,
            'area_sqm' => 320,
        ]);

        $response->assertUnauthorized();
    }

    public function test_an_admin_can_create_a_product_with_a_downloadable_plan_file(): void
    {
        Storage::fake('public');
        config([
            'tefetro.admin_api_key' => 'test-admin-key',
        ]);

        $response = $this->post('/api/admin/products', [
            'title' => 'Modern Villa',
            'slug' => 'modern-villa',
            'description' => 'Four-bedroom architectural drawing.',
            'price' => 850,
            'bedrooms' => 4,
            'bathrooms' => 3,
            'area_sqm' => 320,
            'plan_file' => UploadedFile::fake()->create('modern-villa.pdf', 500, 'application/pdf'),
        ], [
            'Accept' => 'application/json',
            'X-Admin-Key' => 'test-admin-key',
        ]);

        $response->assertCreated()
            ->assertJsonPath('title', 'Modern Villa')
            ->assertJsonPath('slug', 'modern-villa');

        $this->assertDatabaseHas('products', [
            'slug' => 'modern-villa',
            'price' => 850,
        ]);

        Storage::disk('public')->assertExists($response->json('file_url'));
    }

    public function test_it_requires_a_plan_file_when_creating_a_product(): void
    {
        config([
            'tefetro.admin_api_key' => 'test-admin-key',
        ]);

        $response = $this->postJson('/api/admin/products', [
            'title' => 'Modern Villa',
            'slug' => 'modern-villa',
            'price' => 850,
            'bedrooms' => 4,
            'bathrooms' => 3,
            'area_sqm' => 320,
        ], [
            'X-Admin-Key' => 'test-admin-key',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['plan_file']);
    }
}
