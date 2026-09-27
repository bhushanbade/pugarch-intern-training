<?php

namespace App\Http\Controllers;

use App\Http\Requests\FacilityRequest;
use App\Http\Resources\FacilityResource;
use App\Models\Facility;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class FacilityController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return FacilityResource::collection(
            Facility::query()->with('department')->orderBy('name')->paginate(15),
        );
    }

    public function store(FacilityRequest $request): JsonResponse
    {
        $facility = Facility::create($request->validated());

        return (new FacilityResource($facility->load('department')))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Facility $facility): FacilityResource
    {
        return new FacilityResource($facility->load('department'));
    }

    public function update(FacilityRequest $request, Facility $facility): FacilityResource
    {
        $facility->update($request->validated());

        return new FacilityResource($facility->load('department'));
    }

    public function destroy(Facility $facility): JsonResponse
    {
        if ($facility->inspections()->exists() || $facility->complaints()->exists()) {
            return response()->json([
                'message' => 'A facility with inspection or complaint history cannot be deleted.',
            ], 409);
        }

        $facility->delete();

        return response()->json(['message' => 'Facility deleted successfully.']);
    }
}
