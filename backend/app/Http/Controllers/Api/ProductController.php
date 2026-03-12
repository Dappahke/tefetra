<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'bedrooms' => 'sometimes',
            'min_price' => 'sometimes|numeric|min:0',
            'max_price' => 'sometimes|numeric|min:0',
            'min_area' => 'sometimes|integer|min:0',
            'max_area' => 'sometimes|integer|min:0',
            'sort' => 'sometimes|in:latest,price_asc,price_desc,area_asc,area_desc',
        ]);

        $bedrooms = collect();

        if ($request->filled('bedrooms')) {
            $rawBedrooms = $request->query('bedrooms');

            if (is_array($rawBedrooms)) {
                $bedrooms = collect($rawBedrooms);
            } else {
                $bedrooms = collect(explode(',', (string) $rawBedrooms));
            }

            $bedrooms = $bedrooms
                ->map(fn (mixed $value) => trim((string) $value))
                ->filter(fn (string $value) => $value !== '' && is_numeric($value))
                ->map(fn (string $value) => (int) $value)
                ->filter(fn (int $value) => $value >= 0)
                ->unique()
                ->values();
        }

        $products = Product::query()
            ->when($bedrooms->isNotEmpty(), fn ($query) => $query->whereIn('bedrooms', $bedrooms))
            ->when(array_key_exists('min_price', $validated), fn ($query) => $query->where('price', '>=', $validated['min_price']))
            ->when(array_key_exists('max_price', $validated), fn ($query) => $query->where('price', '<=', $validated['max_price']))
            ->when(array_key_exists('min_area', $validated), fn ($query) => $query->where('area_sqm', '>=', $validated['min_area']))
            ->when(array_key_exists('max_area', $validated), fn ($query) => $query->where('area_sqm', '<=', $validated['max_area']))
            ->when(
                ($validated['sort'] ?? 'latest') === 'price_asc',
                fn ($query) => $query->orderBy('price')
            )
            ->when(
                ($validated['sort'] ?? 'latest') === 'price_desc',
                fn ($query) => $query->orderByDesc('price')
            )
            ->when(
                ($validated['sort'] ?? 'latest') === 'area_asc',
                fn ($query) => $query->orderBy('area_sqm')
            )
            ->when(
                ($validated['sort'] ?? 'latest') === 'area_desc',
                fn ($query) => $query->orderByDesc('area_sqm')
            )
            ->when(
                ($validated['sort'] ?? 'latest') === 'latest',
                fn ($query) => $query->latest()
            )
            ->get();

        return $products;
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:products,slug',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'bedrooms' => 'required|integer|min:0',
            'bathrooms' => 'required|integer|min:0',
            'area_sqm' => 'required|integer|min:0',
            'preview_image' => 'nullable|image|max:5120',
            'plan_file' => 'required|file|max:20480',
        ]);

        if ($request->hasFile('preview_image')) {
            $data['preview_image'] = $request->file('preview_image')
                ->store('images', 'public');
        }

        if ($request->hasFile('plan_file')) {
            $data['file_url'] = $request->file('plan_file')
             ->store('plans', 'public');
        }

        unset($data['plan_file']);

        $product = Product::create($data);

        return response()->json($product, 201);
    }

    public function show(Product $product)
    {
        return $product;
    }

    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'title' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string|max:255|unique:products,slug,' . $product->id,
            'description' => 'nullable|string',
            'price' => 'sometimes|numeric|min:0',
            'bedrooms' => 'sometimes|integer|min:0',
            'bathrooms' => 'sometimes|integer|min:0',
            'area_sqm' => 'sometimes|integer|min:0',
            'preview_image' => 'sometimes|image|max:5120',
            'plan_file' => 'sometimes|file|max:20480',
        ]);

        if ($request->hasFile('preview_image')) {
            if ($product->preview_image) {
                Storage::disk('public')->delete($product->preview_image);
            }

            $data['preview_image'] = $request->file('preview_image')->store('images', 'public');
        }

        if ($request->hasFile('plan_file')) {
            if ($product->file_url) {
                Storage::disk('public')->delete($product->file_url);
            }

            $data['file_url'] = $request->file('plan_file')->store('plans', 'public');
        }

        unset($data['plan_file']);

        $product->update($data);

        return $product->fresh();
    }

    public function destroy(Product $product)
    {
        if ($product->preview_image) {
            Storage::disk('public')->delete($product->preview_image);
        }

        if ($product->file_url) {
            Storage::disk('public')->delete($product->file_url);
        }

        $product->delete();

        return response()->noContent();
    }
}
