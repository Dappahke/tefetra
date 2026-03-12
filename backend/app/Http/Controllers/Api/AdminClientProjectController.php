<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClientProject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdminClientProjectController extends Controller
{
    public function index()
    {
        return ClientProject::with('projectUpdates')
            ->latest()
            ->take(100)
            ->get();
    }

    public function store(Request $request)
    {
        $data = $this->validateProject($request);

        if ($request->hasFile('cover_image')) {
            $data['cover_image'] = $request->file('cover_image')->store('client-projects', 'public');
        }

        $data['portal_token'] = (string) Str::uuid();

        $project = ClientProject::create($data);

        return response()->json($project->load('projectUpdates'), 201);
    }

    public function show(ClientProject $clientProject)
    {
        return $clientProject->load('projectUpdates');
    }

    public function update(Request $request, ClientProject $clientProject)
    {
        $data = $this->validateProject($request, true);

        if ($request->hasFile('cover_image')) {
            if ($clientProject->cover_image) {
                Storage::disk('public')->delete($clientProject->cover_image);
            }

            $data['cover_image'] = $request->file('cover_image')->store('client-projects', 'public');
        }

        $clientProject->update($data);

        return $clientProject->fresh('projectUpdates');
    }

    public function destroy(ClientProject $clientProject)
    {
        if ($clientProject->cover_image) {
            Storage::disk('public')->delete($clientProject->cover_image);
        }

        $clientProject->projectUpdates->each(function ($projectUpdate): void {
            if ($projectUpdate->photo_url) {
                Storage::disk('public')->delete($projectUpdate->photo_url);
            }
        });

        $clientProject->delete();

        return response()->noContent();
    }

    /**
     * @return array<string, mixed>
     */
    private function validateProject(Request $request, bool $isUpdate = false): array
    {
        return $request->validate([
            'client_name' => [$isUpdate ? 'sometimes' : 'required', 'string', 'max:255'],
            'client_email' => [$isUpdate ? 'sometimes' : 'required', 'email', 'max:255'],
            'title' => [$isUpdate ? 'sometimes' : 'required', 'string', 'max:255'],
            'location' => [$isUpdate ? 'sometimes' : 'required', 'string', 'max:255'],
            'status' => [$isUpdate ? 'sometimes' : 'required', 'string', 'max:255'],
            'summary' => 'nullable|string|max:4000',
            'cover_image' => [$isUpdate ? 'sometimes' : 'nullable', 'image', 'max:5120'],
        ]);
    }
}
