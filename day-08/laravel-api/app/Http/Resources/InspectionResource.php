<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InspectionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'facility_id' => $this->facility_id,
            'inspector_id' => $this->inspector_id,
            'rating' => (int) $this->rating,
            'inspected_at' => $this->inspected_at,
            'findings' => $this->findings,
            'facility' => $this->whenLoaded('facility', fn (): array => [
                'id' => $this->facility->id,
                'name' => $this->facility->name,
            ]),
            'inspector' => $this->whenLoaded('inspector', fn () => $this->inspector ? [
                'id' => $this->inspector->id,
                'name' => $this->inspector->name,
            ] : null),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
