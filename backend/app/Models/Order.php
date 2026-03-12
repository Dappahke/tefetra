<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_email',
        'product_id',
        'base_amount',
        'addons_amount',
        'amount_paid',
        'download_token',
        'project_notes',
        'status',
        'payment_provider',
        'payment_reference',
        'payment_metadata',
        'paid_at',
    ];

    protected $appends = [
        'total_amount',
        'can_download',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'base_amount' => 'decimal:2',
            'addons_amount' => 'decimal:2',
            'amount_paid' => 'decimal:2',
            'payment_metadata' => 'array',
            'paid_at' => 'datetime',
        ];
    }

    public function getTotalAmountAttribute(): string
    {
        return number_format(
            (float) $this->base_amount + (float) $this->addons_amount,
            2,
            '.',
            ''
        );
    }

    public function getCanDownloadAttribute(): bool
    {
        return $this->status === 'paid';
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function selectedAddOns(): HasMany
    {
        return $this->hasMany(OrderAddOn::class);
    }
}
