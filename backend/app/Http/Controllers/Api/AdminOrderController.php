<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\OrderCheckoutService;
use Illuminate\Http\Request;

class AdminOrderController extends Controller
{
    public function __construct(
        private readonly OrderCheckoutService $orderCheckoutService,
    ) {
    }

    public function index(Request $request)
    {
        $data = $request->validate([
            'status' => 'sometimes|in:pending,paid,failed',
            'payment_provider' => 'sometimes|string|max:50',
        ]);

        return Order::with(['product', 'selectedAddOns'])
            ->when(isset($data['status']), fn ($query) => $query->where('status', $data['status']))
            ->when(isset($data['payment_provider']), fn ($query) => $query->where('payment_provider', $data['payment_provider']))
            ->latest()
            ->take(100)
            ->get();
    }

    public function show(Order $order)
    {
        return $order->load(['product', 'selectedAddOns']);
    }

    public function update(Request $request, Order $order)
    {
        $data = $request->validate([
            'status' => 'sometimes|in:pending,paid,failed',
            'payment_provider' => 'sometimes|nullable|string|max:50',
            'payment_reference' => 'sometimes|nullable|string|max:255',
            'amount_paid' => 'sometimes|numeric|min:0',
        ]);

        $order->fill([
            'payment_provider' => $data['payment_provider'] ?? $order->payment_provider,
            'payment_reference' => $data['payment_reference'] ?? $order->payment_reference,
        ])->save();

        $status = $data['status'] ?? $order->status;

        if ($status === 'paid') {
            return $this->orderCheckoutService->markPaid(
                $order,
                $order->payment_reference,
                ['manually_updated' => true],
                isset($data['amount_paid']) ? (float) $data['amount_paid'] : null
            );
        }

        if ($status === 'failed') {
            return $this->orderCheckoutService->markFailed($order, ['manually_updated' => true]);
        }

        return $this->orderCheckoutService->markPending($order, ['manually_updated' => true]);
    }
}
