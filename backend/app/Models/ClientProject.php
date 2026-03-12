<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ClientProject extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_name',
        'client_email',
        'title',
        'location',
        'status',
        'summary',
        'cover_image',
        'portal_token',
    ];

    public function projectUpdates(): HasMany
    {
        return $this->hasMany(ProjectUpdate::class)->latest('published_at')->latest();
    }
}
