<?php

namespace App\Services\Payments;

use App\Models\Order;
use App\Services\OrderCheckoutService;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use RuntimeException;

class MpesaPaymentService
{
    public function __construct(
        private readonly OrderCheckoutService $orderCheckoutService,
    ) {
    }

    public function enabled(): bool
    {
        return filled(config('services.mpesa.consumer_key'))
            && filled(config('services.mpesa.consumer_secret'))
            && filled(config('services.mpesa.shortcode'))
            && filled(config('services.mpesa.passkey'))
            && filled(config('services.mpesa.callback_url'));
    }

    /**
     * @return array<string, mixed>
     */
    public function requestPayment(Order $order, string $phoneNumber): array
    {
        if (! $this->enabled()) {
            throw new RuntimeException('M-Pesa checkout is not configured.');
        }

        $token = $this->getAccessToken();
        $timestamp = now()->format('YmdHis');
        $shortcode = (string) config('services.mpesa.shortcode');
        $formattedPhone = $this->formatPhoneNumber($phoneNumber);

        try {
            $response = Http::withToken($token)
                ->acceptJson()
                ->post(config('services.mpesa.base_url').'/mpesa/stkpush/v1/processrequest', [
                    'BusinessShortCode' => $shortcode,
                    'Password' => base64_encode($shortcode.(string) config('services.mpesa.passkey').$timestamp),
                    'Timestamp' => $timestamp,
                    'TransactionType' => (string) config('services.mpesa.transaction_type'),
                    'Amount' => max(1, (int) round($this->orderCheckoutService->getTotalAmount($order))),
                    'PartyA' => $formattedPhone,
                    'PartyB' => $shortcode,
                    'PhoneNumber' => $formattedPhone,
                    'CallBackURL' => (string) config('services.mpesa.callback_url'),
                    'AccountReference' => 'ORDER-'.$order->id,
                    'TransactionDesc' => Str::limit($order->product->title, 40, ''),
                ])
                ->throw();
        } catch (RequestException $exception) {
            $message = Arr::get($exception->response?->json(), 'errorMessage', 'Unable to initiate M-Pesa STK push.');

            throw new RuntimeException($message, previous: $exception);
        }

        $data = $response->json();

        $order->update([
            'payment_reference' => Arr::get($data, 'CheckoutRequestID'),
            'payment_metadata' => array_merge($order->payment_metadata ?? [], [
                'checkout_request_id' => Arr::get($data, 'CheckoutRequestID'),
                'merchant_request_id' => Arr::get($data, 'MerchantRequestID'),
                'customer_message' => Arr::get($data, 'CustomerMessage'),
                'phone_number' => $formattedPhone,
            ]),
        ]);

        return $data;
    }

    public function refreshOrderStatus(Order $order): Order
    {
        if ($order->payment_provider !== 'mpesa' || $order->status !== 'pending' || ! $this->enabled()) {
            return $order;
        }

        $checkoutRequestId = Arr::get($order->payment_metadata, 'checkout_request_id');

        if (! $checkoutRequestId) {
            return $order;
        }

        $token = $this->getAccessToken();
        $timestamp = now()->format('YmdHis');
        $shortcode = (string) config('services.mpesa.shortcode');

        try {
            $response = Http::withToken($token)
                ->acceptJson()
                ->post(config('services.mpesa.base_url').'/mpesa/stkpushquery/v1/query', [
                    'BusinessShortCode' => $shortcode,
                    'Password' => base64_encode($shortcode.(string) config('services.mpesa.passkey').$timestamp),
                    'Timestamp' => $timestamp,
                    'CheckoutRequestID' => $checkoutRequestId,
                ])
                ->throw()
                ->json();
        } catch (RequestException $exception) {
            throw new RuntimeException('Unable to verify M-Pesa payment status.', previous: $exception);
        }

        $metadata = [
            'mpesa_query_result_code' => Arr::get($response, 'ResultCode'),
            'mpesa_query_result_desc' => Arr::get($response, 'ResultDesc'),
        ];

        if ((int) Arr::get($response, 'ResultCode') === 0) {
            return $this->orderCheckoutService->markPaid($order, $order->payment_reference, $metadata);
        }

        if (in_array((int) Arr::get($response, 'ResultCode'), [1, 1032, 1037, 2001], true)) {
            return $this->orderCheckoutService->markFailed($order, $metadata);
        }

        return $this->orderCheckoutService->markPending($order, $metadata);
    }

    /**
     * @param array<string, mixed> $payload
     */
    public function handleCallback(array $payload): ?Order
    {
        $callback = Arr::get($payload, 'Body.stkCallback');
        $checkoutRequestId = Arr::get($callback, 'CheckoutRequestID');

        if (! $checkoutRequestId) {
            return null;
        }

        $order = Order::with(['product', 'selectedAddOns'])
            ->where('payment_reference', $checkoutRequestId)
            ->first();

        if (! $order) {
            return null;
        }

        $resultCode = (int) Arr::get($callback, 'ResultCode', 1);
        $metadata = collect(Arr::get($callback, 'CallbackMetadata.Item', []))
            ->mapWithKeys(fn (array $item): array => [$item['Name'] => $item['Value'] ?? null])
            ->all();

        $payloadMetadata = [
            'mpesa_callback_result_code' => $resultCode,
            'mpesa_callback_result_desc' => Arr::get($callback, 'ResultDesc'),
            'mpesa_receipt_number' => Arr::get($metadata, 'MpesaReceiptNumber'),
            'mpesa_transaction_date' => Arr::get($metadata, 'TransactionDate'),
            'mpesa_phone_number' => Arr::get($metadata, 'PhoneNumber'),
        ];

        if ($resultCode === 0) {
            return $this->orderCheckoutService->markPaid(
                $order,
                $checkoutRequestId,
                $payloadMetadata,
                (float) Arr::get($metadata, 'Amount', $this->orderCheckoutService->getTotalAmount($order))
            );
        }

        return $this->orderCheckoutService->markFailed($order, $payloadMetadata);
    }

    private function getAccessToken(): string
    {
        try {
            $response = Http::withBasicAuth(
                (string) config('services.mpesa.consumer_key'),
                (string) config('services.mpesa.consumer_secret'),
            )
                ->acceptJson()
                ->get(config('services.mpesa.base_url').'/oauth/v1/generate', [
                    'grant_type' => 'client_credentials',
                ])
                ->throw();
        } catch (RequestException $exception) {
            throw new RuntimeException('Unable to authenticate with M-Pesa.', previous: $exception);
        }

        $accessToken = Arr::get($response->json(), 'access_token');

        if (! is_string($accessToken) || $accessToken === '') {
            throw new RuntimeException('M-Pesa access token was not returned.');
        }

        return $accessToken;
    }

    private function formatPhoneNumber(string $phoneNumber): string
    {
        $digits = preg_replace('/\D+/', '', $phoneNumber) ?? '';

        if (Str::startsWith($digits, '0')) {
            return '254'.substr($digits, 1);
        }

        if (Str::startsWith($digits, '7')) {
            return '254'.$digits;
        }

        if (Str::startsWith($digits, '254')) {
            return $digits;
        }

        throw new RuntimeException('Use a valid Kenyan mobile number for M-Pesa checkout.');
    }
}
