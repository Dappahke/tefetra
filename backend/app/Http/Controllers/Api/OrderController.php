<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\Payments\MpesaPaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use RuntimeException;

class OrderController extends Controller
{
    public function status(string $token, MpesaPaymentService $mpesaPaymentService)
    {
        $order = Order::with(['product', 'selectedAddOns'])
            ->where('download_token', $token)
            ->firstOrFail();

        if ($order->payment_provider === 'mpesa' && $order->status === 'pending') {
            try {
                $order = $mpesaPaymentService->refreshOrderStatus($order);
            } catch (RuntimeException) {
                $order = $order->fresh(['product', 'selectedAddOns']);
            }
        }

        return $order;
    }

    public function download(string $token)
    {
        $order = Order::where('download_token', $token)->firstOrFail();

        if ($order->status !== 'paid') {
            return response()->json([
                'message' => 'This drawing pack is available after payment is confirmed.',
            ], 403);
        }

        $product = $order->product()->firstOrFail();

        if (! $product->file_url || ! Storage::disk('public')->exists($product->file_url)) {
            return response()->json(['error' => 'File not found'], 404);
        }

        return Storage::disk('public')->download($product->file_url);
    }
}
