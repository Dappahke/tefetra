<?php

namespace Tests\Feature;

use App\Models\AddOn;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class OrderCheckoutTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_creates_a_pending_stripe_checkout_session(): void
    {
        config([
            'services.stripe.secret_key' => 'sk_test_123',
            'tefetro.frontend_url' => 'http://localhost:3000',
        ]);

        Http::fake([
            'https://api.stripe.com/v1/checkout/sessions' => Http::response([
                'id' => 'cs_test_123',
                'url' => 'https://checkout.stripe.com/c/pay/cs_test_123',
                'payment_status' => 'unpaid',
                'status' => 'open',
            ], 200),
        ]);

        $product = Product::create([
            'title' => 'Family Bungalow',
            'slug' => 'family-bungalow',
            'description' => 'Base architectural drawing package.',
            'price' => 1200,
            'bedrooms' => 3,
            'bathrooms' => 2,
            'area_sqm' => 210,
            'file_url' => 'plans/family-bungalow.pdf',
        ]);

        $landscape = AddOn::create([
            'name' => 'Landscape Drawings',
            'slug' => 'landscape-drawings',
            'description' => 'Outdoor and site detailing package.',
            'price' => 250,
            'is_active' => true,
        ]);

        $response = $this->postJson('/api/checkouts/stripe', [
            'customer_email' => 'buyer@example.com',
            'product_id' => $product->id,
            'addon_ids' => [$landscape->id],
            'project_notes' => 'Adapt the plan for a sloped plot.',
        ]);

        $response->assertCreated()
            ->assertJsonPath('checkout_url', 'https://checkout.stripe.com/c/pay/cs_test_123')
            ->assertJsonPath('session_id', 'cs_test_123')
            ->assertJsonPath('order.status', 'pending')
            ->assertJsonPath('order.payment_provider', 'stripe')
            ->assertJsonPath('order.base_amount', '1200.00')
            ->assertJsonPath('order.addons_amount', '250.00')
            ->assertJsonPath('order.total_amount', '1450.00')
            ->assertJsonPath('order.amount_paid', '0.00');

        $this->assertDatabaseHas('orders', [
            'customer_email' => 'buyer@example.com',
            'product_id' => $product->id,
            'status' => 'pending',
            'payment_provider' => 'stripe',
            'payment_reference' => 'cs_test_123',
        ]);
    }

    public function test_it_initiates_an_mpesa_stk_push_for_a_pending_order(): void
    {
        config([
            'services.mpesa.base_url' => 'https://sandbox.safaricom.co.ke',
            'services.mpesa.consumer_key' => 'consumer-key',
            'services.mpesa.consumer_secret' => 'consumer-secret',
            'services.mpesa.shortcode' => '174379',
            'services.mpesa.passkey' => 'passkey',
            'services.mpesa.callback_url' => 'https://example.com/api/payments/mpesa/callback',
        ]);

        Http::fake([
            'https://sandbox.safaricom.co.ke/oauth/v1/generate*' => Http::response([
                'access_token' => 'token-123',
            ], 200),
            'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest' => Http::response([
                'MerchantRequestID' => 'merchant-123',
                'CheckoutRequestID' => 'checkout-123',
                'CustomerMessage' => 'Success. Request accepted for processing',
            ], 200),
        ]);

        $product = Product::create([
            'title' => 'Compact Duplex',
            'slug' => 'compact-duplex',
            'description' => 'Base duplex drawing package.',
            'price' => 980,
            'bedrooms' => 4,
            'bathrooms' => 4,
            'area_sqm' => 240,
            'file_url' => 'plans/compact-duplex.pdf',
        ]);

        $response = $this->postJson('/api/checkouts/mpesa', [
            'customer_email' => 'buyer@example.com',
            'product_id' => $product->id,
            'phone_number' => '0712345678',
        ]);

        $response->assertCreated()
            ->assertJsonPath('order.status', 'pending')
            ->assertJsonPath('order.payment_provider', 'mpesa')
            ->assertJsonPath('customer_message', 'Success. Request accepted for processing')
            ->assertJsonPath('checkout_request_id', 'checkout-123');

        $this->assertDatabaseHas('orders', [
            'customer_email' => 'buyer@example.com',
            'payment_provider' => 'mpesa',
            'payment_reference' => 'checkout-123',
        ]);
    }

    public function test_it_requires_payment_before_a_download_is_available(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('plans/family-bungalow.pdf', 'pdf-content');

        $product = Product::create([
            'title' => 'Family Bungalow',
            'slug' => 'family-bungalow',
            'description' => 'Base architectural drawing package.',
            'price' => 1200,
            'bedrooms' => 3,
            'bathrooms' => 2,
            'area_sqm' => 210,
            'file_url' => 'plans/family-bungalow.pdf',
        ]);

        $order = Order::create([
            'customer_email' => 'buyer@example.com',
            'product_id' => $product->id,
            'base_amount' => 1200,
            'addons_amount' => 0,
            'amount_paid' => 0,
            'download_token' => (string) fake()->uuid(),
            'status' => 'pending',
            'payment_provider' => 'stripe',
        ]);

        $this->getJson("/api/download/{$order->download_token}")
            ->assertForbidden()
            ->assertJsonPath('message', 'This drawing pack is available after payment is confirmed.');
    }

    public function test_a_paid_order_can_download_the_plan_file(): void
    {
        Storage::fake('public');
        Storage::disk('public')->put('plans/family-bungalow.pdf', 'pdf-content');

        $product = Product::create([
            'title' => 'Family Bungalow',
            'slug' => 'family-bungalow',
            'description' => 'Base architectural drawing package.',
            'price' => 1200,
            'bedrooms' => 3,
            'bathrooms' => 2,
            'area_sqm' => 210,
            'file_url' => 'plans/family-bungalow.pdf',
        ]);

        $order = Order::create([
            'customer_email' => 'buyer@example.com',
            'product_id' => $product->id,
            'base_amount' => 1200,
            'addons_amount' => 0,
            'amount_paid' => 1200,
            'download_token' => (string) fake()->uuid(),
            'status' => 'paid',
            'payment_provider' => 'stripe',
            'paid_at' => now(),
        ]);

        $this->get("/api/download/{$order->download_token}")
            ->assertOk()
            ->assertDownload('family-bungalow.pdf');
    }

    public function test_stripe_webhooks_mark_the_order_as_paid_when_the_signature_is_valid(): void
    {
        config([
            'services.stripe.webhook_secret' => 'whsec_test_123',
        ]);

        $product = Product::create([
            'title' => 'Family Bungalow',
            'slug' => 'family-bungalow',
            'description' => 'Base architectural drawing package.',
            'price' => 1200,
            'bedrooms' => 3,
            'bathrooms' => 2,
            'area_sqm' => 210,
            'file_url' => 'plans/family-bungalow.pdf',
        ]);

        $order = Order::create([
            'customer_email' => 'buyer@example.com',
            'product_id' => $product->id,
            'base_amount' => 1200,
            'addons_amount' => 250,
            'amount_paid' => 0,
            'download_token' => (string) fake()->uuid(),
            'status' => 'pending',
            'payment_provider' => 'stripe',
            'payment_reference' => 'cs_test_123',
        ]);

        $payload = json_encode([
            'type' => 'checkout.session.completed',
            'data' => [
                'object' => [
                    'id' => 'cs_test_123',
                    'status' => 'complete',
                    'payment_status' => 'paid',
                    'amount_total' => 145000,
                    'payment_intent' => 'pi_test_123',
                    'metadata' => [
                        'order_id' => (string) $order->id,
                    ],
                ],
            ],
        ], JSON_THROW_ON_ERROR);

        $timestamp = time();
        $signature = hash_hmac('sha256', $timestamp.'.'.$payload, 'whsec_test_123');

        $this->call(
            'POST',
            '/api/payments/stripe/webhook',
            server: [
                'CONTENT_TYPE' => 'application/json',
                'HTTP_Stripe-Signature' => "t={$timestamp},v1={$signature}",
            ],
            content: $payload,
        )->assertOk();

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => 'paid',
            'amount_paid' => 1450,
        ]);
    }
}
