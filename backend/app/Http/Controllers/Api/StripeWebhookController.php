<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Payments\StripePaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use RuntimeException;

class StripeWebhookController extends Controller
{
    public function __invoke(Request $request, StripePaymentService $stripePaymentService)
    {
        try {
            $event = $stripePaymentService->parseWebhook(
                $request->getContent(),
                $request->header('Stripe-Signature')
            );
        } catch (RuntimeException $exception) {
            return response()->json([
                'message' => $exception->getMessage(),
            ], 400);
        }

        $session = Arr::get($event, 'data.object');
        $type = Arr::get($event, 'type');

        if (is_array($session) && in_array($type, [
            'checkout.session.completed',
            'checkout.session.async_payment_succeeded',
            'checkout.session.async_payment_failed',
            'checkout.session.expired',
        ], true)) {
            $stripePaymentService->syncOrderFromSession($session);
        }

        return response()->json([
            'received' => true,
        ]);
    }
}
