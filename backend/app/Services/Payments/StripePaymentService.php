<?php

namespace App\Services\Payments;

use App\Models\Order;
use App\Services\OrderCheckoutService;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Http;
use JsonException;
use RuntimeException;

class StripePaymentService
{
    public function __construct(
        private readonly OrderCheckoutService $orderCheckoutService,
    ) {
    }

    public function enabled(): bool
    {
        return filled(config('services.stripe.secret_key'));
    }

    /**
     * @return array{id: string, url: string, payment_status?: string, status?: string}
     */
    public function createCheckoutSession(Order $order): array
    {
        $secretKey = (string) config('services.stripe.secret_key');

        if ($secretKey === '') {
            throw new RuntimeException('Stripe checkout is not configured.');
        }

        $order->loadMissing(['product', 'selectedAddOns']);

        $payload = [
            'mode' => 'payment',
            'success_url' => config('tefetro.frontend_url').'/checkout/stripe/success?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => config('tefetro.frontend_url').'/checkout/stripe/cancel?order='.$order->download_token,
            'customer_email' => $order->customer_email,
            'client_reference_id' => (string) $order->id,
            'metadata[order_id]' => (string) $order->id,
            'metadata[download_token]' => $order->download_token,
        ];

        $lineItems = [
            [
                'name' => $order->product->title,
                'description' => 'Ready-made architectural plan',
                'amount' => (int) round((float) $order->base_amount * 100),
            ],
        ];

        foreach ($order->selectedAddOns as $addOn) {
            $lineItems[] = [
                'name' => $addOn->name,
                'description' => $addOn->slug,
                'amount' => (int) round((float) $addOn->price * 100),
            ];
        }

        foreach ($lineItems as $index => $lineItem) {
            $payload["line_items[{$index}][quantity]"] = 1;
            $payload["line_items[{$index}][price_data][currency]"] = (string) config('services.stripe.currency', 'kes');
            $payload["line_items[{$index}][price_data][unit_amount]"] = $lineItem['amount'];
            $payload["line_items[{$index}][price_data][product_data][name]"] = $lineItem['name'];
            $payload["line_items[{$index}][price_data][product_data][description]"] = $lineItem['description'];
        }

        try {
            $response = Http::withToken($secretKey)
                ->asForm()
                ->acceptJson()
                ->post('https://api.stripe.com/v1/checkout/sessions', $payload)
                ->throw();
        } catch (RequestException $exception) {
            $message = Arr::get($exception->response?->json(), 'error.message', 'Unable to create Stripe checkout session.');

            throw new RuntimeException($message, previous: $exception);
        }

        /** @var array{id: string, url: string, payment_status?: string, status?: string} $session */
        $session = $response->json();

        $order->update([
            'payment_reference' => $session['id'],
            'payment_metadata' => array_merge($order->payment_metadata ?? [], [
                'stripe_session_id' => $session['id'],
            ]),
        ]);

        return $session;
    }

    /**
     * @return array<string, mixed>
     */
    public function retrieveSession(string $sessionId): array
    {
        $secretKey = (string) config('services.stripe.secret_key');

        if ($secretKey === '') {
            throw new RuntimeException('Stripe checkout is not configured.');
        }

        return Http::withToken($secretKey)
            ->acceptJson()
            ->get("https://api.stripe.com/v1/checkout/sessions/{$sessionId}")
            ->throw()
            ->json();
    }

    public function syncOrderFromSessionId(string $sessionId): ?Order
    {
        $session = $this->retrieveSession($sessionId);

        return $this->syncOrderFromSession($session);
    }

    /**
     * @param array<string, mixed> $session
     */
    public function syncOrderFromSession(array $session): ?Order
    {
        $orderId = Arr::get($session, 'metadata.order_id');

        $order = $orderId
            ? Order::with(['product', 'selectedAddOns'])->find($orderId)
            : Order::with(['product', 'selectedAddOns'])->where('payment_reference', Arr::get($session, 'id'))->first();

        if (! $order) {
            return null;
        }

        $metadata = [
            'stripe_session_id' => Arr::get($session, 'id'),
            'stripe_payment_intent' => Arr::get($session, 'payment_intent'),
            'stripe_status' => Arr::get($session, 'status'),
            'stripe_payment_status' => Arr::get($session, 'payment_status'),
        ];

        if (Arr::get($session, 'payment_status') === 'paid') {
            return $this->orderCheckoutService->markPaid(
                $order,
                Arr::get($session, 'id'),
                $metadata,
                ((int) Arr::get($session, 'amount_total', 0)) / 100
            );
        }

        if (in_array(Arr::get($session, 'status'), ['expired', 'complete'], true) || Arr::get($session, 'payment_status') === 'unpaid') {
            return $this->orderCheckoutService->markFailed($order, $metadata);
        }

        return $this->orderCheckoutService->markPending($order, $metadata);
    }

    /**
     * @return array<string, mixed>
     */
    public function parseWebhook(string $payload, ?string $signatureHeader): array
    {
        $webhookSecret = (string) config('services.stripe.webhook_secret');

        if ($webhookSecret === '') {
            throw new RuntimeException('Stripe webhook secret is not configured.');
        }

        if (! $signatureHeader || ! $this->isValidSignature($payload, $signatureHeader, $webhookSecret)) {
            throw new RuntimeException('Invalid Stripe signature.');
        }

        try {
            /** @var array<string, mixed> $event */
            $event = json_decode($payload, true, flags: JSON_THROW_ON_ERROR);
        } catch (JsonException $exception) {
            throw new RuntimeException('Stripe webhook payload could not be parsed.', previous: $exception);
        }

        return $event;
    }

    private function isValidSignature(string $payload, string $signatureHeader, string $webhookSecret): bool
    {
        $parts = collect(explode(',', $signatureHeader))
            ->mapWithKeys(function (string $part): array {
                [$key, $value] = array_pad(explode('=', $part, 2), 2, null);

                return [$key => $value];
            });

        $timestamp = $parts->get('t');
        $signature = $parts->get('v1');

        if (! $timestamp || ! $signature) {
            return false;
        }

        if (abs(time() - (int) $timestamp) > 300) {
            return false;
        }

        $expected = hash_hmac('sha256', $timestamp.'.'.$payload, $webhookSecret);

        return hash_equals($expected, $signature);
    }
}
