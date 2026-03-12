<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ConsultationRequest;
use Illuminate\Http\Request;

class ConsultationRequestController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'country' => 'required|string|max:255',
            'plot_location' => 'required|string|max:255',
            'plot_size' => 'required|string|max:255',
            'budget_range' => 'required|string|max:255',
            'project_timeline' => 'required|string|max:255',
            'service_type' => 'nullable|string|max:255',
            'description' => 'required|string|max:3000',
        ]);

        $consultationRequest = ConsultationRequest::create($data);

        return response()->json([
            'message' => 'Consultation request submitted successfully.',
            'consultation_request' => $consultationRequest,
        ], 201);
    }
}
