<?php

namespace App\Http\Controllers;

use App\Http\Requests\ComplaintRequest;
use App\Http\Resources\ComplaintResource;
use App\Models\Complaint;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ComplaintController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return ComplaintResource::collection(
            Complaint::query()
                ->with(['facility', 'submittedBy'])
                ->orderByDesc('reported_at')
                ->paginate(15),
        );
    }

    public function store(ComplaintRequest $request): JsonResponse
    {
        $complaint = Complaint::create($request->validated());

        return (new ComplaintResource($complaint->load(['facility', 'submittedBy'])))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Complaint $complaint): ComplaintResource
    {
        return new ComplaintResource($complaint->load(['facility', 'submittedBy']));
    }

    public function update(ComplaintRequest $request, Complaint $complaint): ComplaintResource
    {
        $complaint->update($request->validated());

        return new ComplaintResource($complaint->load(['facility', 'submittedBy']));
    }

    public function destroy(Complaint $complaint): JsonResponse
    {
        $complaint->delete();

        return response()->json(['message' => 'Complaint deleted successfully.']);
    }
}
