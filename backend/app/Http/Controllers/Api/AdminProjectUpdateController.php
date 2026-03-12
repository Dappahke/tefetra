<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClientProject;
use App\Models\ProjectUpdate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminProjectUpdateController extends Controller
{
    public function store(Request $request, ClientProject $clientProject)
    {
        $data = $this->validateUpdate($request);

        if ($request->hasFile('photo')) {
            $data['photo_url'] = $request->file('photo')->store('project-updates', 'public');
        }

        $projectUpdate = $clientProject->projectUpdates()->create($data);

        return response()->json($projectUpdate, 201);
    }

    public function update(Request $request, ProjectUpdate $projectUpdate)
    {
        $data = $this->validateUpdate($request, true);

        if ($request->hasFile('photo')) {
            if ($projectUpdate->photo_url) {
                Storage::disk('public')->delete($projectUpdate->photo_url);
            }

            $data['photo_url'] = $request->file('photo')->store('project-updates', 'public');
        }

        $projectUpdate->update($data);

        return $projectUpdate->fresh();
    }

    public function destroy(ProjectUpdate $projectUpdate)
    {
        if ($projectUpdate->photo_url) {
            Storage::disk('public')->delete($projectUpdate->photo_url);
        }

        $projectUpdate->delete();

        return response()->noContent();
    }

    /**
     * @return array<string, mixed>
     */
    private function validateUpdate(Request $request, bool $isUpdate = false): array
    {
        return $request->validate([
            'title' => [$isUpdate ? 'sometimes' : 'required', 'string', 'max:255'],
            'milestone' => 'nullable|string|max:255',
            'body' => [$isUpdate ? 'sometimes' : 'required', 'string', 'max:4000'],
            'published_at' => 'nullable|date',
            'photo' => [$isUpdate ? 'sometimes' : 'nullable', 'image', 'max:5120'],
        ]);
    }
}
