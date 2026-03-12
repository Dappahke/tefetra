<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ConsultationRequest;
use Illuminate\Http\Request;

class AdminConsultationRequestController extends Controller
{
    public function index()
    {
        return ConsultationRequest::query()
            ->latest()
            ->take(100)
            ->get();
    }

    public function show(ConsultationRequest $consultation)
    {
        return $consultation;
    }

    public function update(Request $request, ConsultationRequest $consultation)
    {
        $data = $request->validate([
            'status' => 'required|in:new,contacted,qualified,closed',
        ]);

        $consultation->update($data);

        return $consultation->fresh();
    }
}
