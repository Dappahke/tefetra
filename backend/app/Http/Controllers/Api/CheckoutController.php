<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Services\OrderCheckoutService;
use App\Services\Payments\MpesaPaymentService;
use App\Services\Payments\StripePaymentService;
use Illuminate\Http\Request;
use RuntimeException;

class CheckoutController extends Controller
{
    public function __construct(
        private readonly OrderCheckoutService $orderCheckoutService,
    ) {
    }

    public function stripe(Request $request, StripePaymentService $stripePaymentService)
    {
        if (! $stripePaymentService->enabled()) {
            return response()->json([
                'message' => 'Stripe checkout is not configured.',
            ], 503);
        }

        $data = $this->validateCheckout($request);
        $product = Product::findOrFail($data['product_id']);
        $checkout = $this->orderCheckoutService->resolveCheckout($product, $data['addon_ids'] ?? []);
        $order = $this->orderCheckoutService->createPendingOrder([
            'customer_email' => $data['customer_email'],
            'project_notes' => $data['project_notes'] ?? null,
            'payment_provider' => 'stripe',
        ], $checkout);

        try {
            $session = $stripePaymentService->createCheckoutSession($order);
        } catch (RuntimeException $exception) {
            return response()->json([
                'message' => $exception->getMessage(),
            ], 422);
        }

        return response()->json([
            'order' => $order->fresh(['product', 'selectedAddOns']),
            'checkout_url' => $session['url'],
            'session_id' => $session['id'],
        ], 201);
    }

    public function stripeSessionStatus(Request $request, StripePaymentService $stripePaymentService)
    {
        $data = $request->validate([
            'session_id' => 'required|string',
        ]);

        try {
            $order = $stripePaymentService->syncOrderFromSessionId($data['session_id']);
        } catch (RuntimeException $exception) {
            return response()->json([
                'message' => $exception->getMessage(),
            ], 422);
        }

        if (! $order) {
            return response()->json([
                'message' => 'Order not found for the supplied Stripe session.',
            ], 404);
        }

        return $order;
    }

    public function mpesa(Request $request, MpesaPaymentService $mpesaPaymentService)
    {
        if (! $mpesaPaymentService->enabled()) {
            return response()->json([
                'message' => 'M-Pesa checkout is not configured.',
            ], 503);
        }

        $data = $request->validate([
            'customer_email' => 'required|email',
            'product_id' => 'required|exists:products,id',
            'addon_ids' => 'sometimes|array',
            'addon_ids.*' => 'integer|distinct|exists:add_ons,id',
            'project_notes' => 'nullable|string|max:2000',
            'phone_number' => 'required|string|min:10|max:20',
        ]);

        $product = Product::findOrFail($data['product_id']);
        $checkout = $this->orderCheckoutService->resolveCheckout($product, $data['addon_ids'] ?? []);
        $order = $this->orderCheckoutService->createPendingOrder([
            'customer_email' => $data['customer_email'],
            'project_notes' => $data['project_notes'] ?? null,
            'payment_provider' => 'mpesa',
        ], $checkout);

        try {
            $payment = $mpesaPaymentService->requestPayment($order, $data['phone_number']);
        } catch (RuntimeException $exception) {
            return response()->json([
                'message' => $exception->getMessage(),
            ], 422);
        }

        return response()->json([
            'order' => $order->fresh(['product', 'selectedAddOns']),
            'customer_message' => $payment['CustomerMessage'] ?? 'M-Pesa prompt sent to your phone.',
            'checkout_request_id' => $payment['CheckoutRequestID'] ?? null,
        ], 201);
    }

    public function mpesaCallback(Request $request, MpesaPaymentService $mpesaPaymentService)
    {
        $mpesaPaymentService->handleCallback($request->all());

        return response()->json([
            'message' => 'Callback received.',
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function validateCheckout(Request $request): array
    {
        return $request->validate([
            'customer_email' => 'required|email',
            'product_id' => 'required|exists:products,id',
            'addon_ids' => 'sometimes|array',
            'addon_ids.*' => 'integer|distinct|exists:add_ons,id',
            'project_notes' => 'nullable|string|max:2000',
        ]);
    }
}
