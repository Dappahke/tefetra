<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AddOn;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class AddOnController extends Controller
{
    public function index(Request $request)
    {
        return AddOn::query()
            ->when(! $request->boolean('include_inactive'), fn ($query) => $query->where('is_active', true))
            ->orderBy('name')
            ->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:add_ons,slug',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'is_active' => 'sometimes|boolean',
        ]);

        $addOn = AddOn::create($data);

        return response()->json($addOn, 201);
    }

    public function show(Request $request, AddOn $addon)
    {
        if (! $request->boolean('include_inactive') && ! $addon->is_active) {
            throw new NotFoundHttpException();
        }

        return $addon;
    }

    public function update(Request $request, AddOn $addon)
    {
        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string|max:255|unique:add_ons,slug,' . $addon->id,
            'description' => 'nullable|string',
            'price' => 'sometimes|numeric|min:0',
            'is_active' => 'sometimes|boolean',
        ]);

        $addon->update($data);

        return $addon->fresh();
    }

    public function destroy(AddOn $addon)
    {
        $addon->delete();

        return response()->noContent();
    }
}
