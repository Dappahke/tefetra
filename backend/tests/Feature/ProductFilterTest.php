<?php

namespace Tests\Feature;

use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductFilterTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_filters_products_by_bedrooms_price_and_area(): void
    {
        Product::create([
            'title' => 'Diaspora Bungalow',
            'slug' => 'diaspora-bungalow',
            'description' => 'Three-bedroom bungalow.',
            'price' => 850,
            'bedrooms' => 3,
            'bathrooms' => 2,
            'area_sqm' => 180,
            'file_url' => 'plans/diaspora-bungalow.pdf',
        ]);

        Product::create([
            'title' => 'Green Courtyard Home',
            'slug' => 'green-courtyard-home',
            'description' => 'Four-bedroom courtyard home.',
            'price' => 1100,
            'bedrooms' => 4,
            'bathrooms' => 3,
            'area_sqm' => 220,
            'file_url' => 'plans/green-courtyard-home.pdf',
        ]);

        Product::create([
            'title' => 'Executive Maisonette',
            'slug' => 'executive-maisonette',
            'description' => 'Five-bedroom maisonette.',
            'price' => 1650,
            'bedrooms' => 5,
            'bathrooms' => 4,
            'area_sqm' => 340,
            'file_url' => 'plans/executive-maisonette.pdf',
        ]);

        $response = $this->getJson('/api/products?bedrooms=3,4&min_price=800&max_price=1200&max_area=250&sort=price_desc');

        $response->assertOk()
            ->assertJsonCount(2)
            ->assertJsonPath('0.slug', 'green-courtyard-home')
            ->assertJsonPath('1.slug', 'diaspora-bungalow');
    }
}
