<?php

namespace App\Http\Controllers;

use App\Http\Requests\InspectionRequest;
use App\Http\Resources\InspectionResource;
use App\Models\Inspection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class InspectionController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return InspectionResource::collection(
            Inspection::query()
                ->with(['facility', 'inspector'])
                ->orderByDesc('inspected_at')
                ->paginate(15),
        );
    }

    public function store(InspectionRequest $request): JsonResponse
    {
        $inspection = Inspection::create($request->validated());

        return (new InspectionResource($inspection->load(['facility', 'inspector'])))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Inspection $inspection): InspectionResource
    {
        return new InspectionResource($inspection->load(['facility', 'inspector']));
    }

    public function update(InspectionRequest $request, Inspection $inspection): InspectionResource
    {
        $inspection->update($request->validated());

        return new InspectionResource($inspection->load(['facility', 'inspector']));
    }

    public function destroy(Inspection $inspection): JsonResponse
    {
        $inspection->delete();

        return response()->json(['message' => 'Inspection deleted successfully.']);
    }
}
