<?php

namespace App\Services;

use App\Models\AddOn;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class OrderCheckoutService
{
    /**
     * @return array{
     *     product: Product,
     *     selected_add_ons: Collection<int, AddOn>,
     *     base_amount: float,
     *     addons_amount: float,
     *     total_amount: float
     * }
     */
    public function resolveCheckout(Product $product, array $addonIds = []): array
    {
        $uniqueAddOnIds = collect($addonIds)
            ->map(fn (mixed $value) => (int) $value)
            ->unique()
            ->values();

        $selectedAddOns = AddOn::query()
            ->whereIn('id', $uniqueAddOnIds)
            ->where('is_active', true)
            ->get();

        if ($selectedAddOns->count() !== $uniqueAddOnIds->count()) {
            throw ValidationException::withMessages([
                'addon_ids' => ['One or more selected add-ons are unavailable.'],
            ]);
        }

        $baseAmount = (float) $product->price;
        $addonsAmount = (float) $selectedAddOns->sum('price');

        return [
            'product' => $product,
            'selected_add_ons' => $selectedAddOns,
            'base_amount' => $baseAmount,
            'addons_amount' => $addonsAmount,
            'total_amount' => $baseAmount + $addonsAmount,
        ];
    }

    /**
     * @param array{
     *     customer_email: string,
     *     project_notes?: string|null,
     *     payment_provider?: string|null
     * } $data
     * @param array{
     *     product: Product,
     *     selected_add_ons: Collection<int, AddOn>,
     *     base_amount: float,
     *     addons_amount: float,
     *     total_amount: float
     * } $checkout
     */
    public function createPendingOrder(array $data, array $checkout): Order
    {
        /** @var Product $product */
        $product = $checkout['product'];
        /** @var Collection<int, AddOn> $selectedAddOns */
        $selectedAddOns = $checkout['selected_add_ons'];

        return DB::transaction(function () use ($data, $product, $selectedAddOns, $checkout) {
            $order = Order::create([
                'customer_email' => $data['customer_email'],
                'product_id' => $product->id,
                'base_amount' => $checkout['base_amount'],
                'addons_amount' => $checkout['addons_amount'],
                'amount_paid' => 0,
                'download_token' => (string) Str::uuid(),
                'project_notes' => $data['project_notes'] ?? null,
                'status' => 'pending',
                'payment_provider' => $data['payment_provider'] ?? null,
            ]);

            $order->selectedAddOns()->createMany(
                $selectedAddOns->map(fn (AddOn $addOn) => [
                    'add_on_id' => $addOn->id,
                    'name' => $addOn->name,
                    'slug' => $addOn->slug,
                    'price' => $addOn->price,
                ])->all()
            );

            return $order->load(['product', 'selectedAddOns']);
        });
    }

    public function markPaid(
        Order $order,
        ?string $reference = null,
        ?array $metadata = null,
        ?float $amountPaid = null,
    ): Order {
        $existingMetadata = $order->payment_metadata ?? [];

        $order->update([
            'status' => 'paid',
            'payment_reference' => $reference ?? $order->payment_reference,
            'payment_metadata' => $metadata ? array_merge($existingMetadata, $metadata) : $existingMetadata,
            'amount_paid' => $amountPaid ?? $this->getTotalAmount($order),
            'paid_at' => now(),
        ]);

        return $order->fresh(['product', 'selectedAddOns']);
    }

    public function markFailed(Order $order, ?array $metadata = null): Order
    {
        $existingMetadata = $order->payment_metadata ?? [];

        $order->update([
            'status' => 'failed',
            'payment_metadata' => $metadata ? array_merge($existingMetadata, $metadata) : $existingMetadata,
            'amount_paid' => 0,
            'paid_at' => null,
        ]);

        return $order->fresh(['product', 'selectedAddOns']);
    }

    public function markPending(Order $order, ?array $metadata = null): Order
    {
        $existingMetadata = $order->payment_metadata ?? [];

        $order->update([
            'status' => 'pending',
            'payment_metadata' => $metadata ? array_merge($existingMetadata, $metadata) : $existingMetadata,
            'amount_paid' => 0,
            'paid_at' => null,
        ]);

        return $order->fresh(['product', 'selectedAddOns']);
    }

    public function getTotalAmount(Order $order): float
    {
        return (float) $order->base_amount + (float) $order->addons_amount;
    }
}
