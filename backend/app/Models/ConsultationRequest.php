<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConsultationRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'country',
        'plot_location',
        'plot_size',
        'budget_range',
        'project_timeline',
        'service_type',
        'description',
        'status',
    ];
}
