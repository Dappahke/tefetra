<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClientProject;
use App\Models\ConsultationRequest;
use App\Models\Order;
use App\Models\Product;

class AdminDashboardController extends Controller
{
    public function __invoke()
    {
        return [
            'metrics' => [
                'products' => Product::count(),
                'orders' => Order::count(),
                'paid_orders' => Order::where('status', 'paid')->count(),
                'consultations' => ConsultationRequest::count(),
                'client_projects' => ClientProject::count(),
            ],
            'recent_orders' => Order::with('product')->latest()->take(5)->get(),
            'recent_consultations' => ConsultationRequest::latest()->take(5)->get(),
            'recent_projects' => ClientProject::with('projectUpdates')->latest()->take(5)->get(),
        ];
    }
}
