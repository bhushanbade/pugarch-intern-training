<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ComplaintResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'facility_id' => $this->facility_id,
            'submitted_by' => $this->submitted_by,
            'subject' => $this->subject,
            'description' => $this->description,
            'priority' => $this->priority,
            'status' => $this->status,
            'reported_at' => $this->reported_at,
            'facility' => $this->whenLoaded('facility', fn (): array => [
                'id' => $this->facility->id,
                'name' => $this->facility->name,
            ]),
            'submitter' => $this->whenLoaded('submittedBy', fn () => $this->submittedBy ? [
                'id' => $this->submittedBy->id,
                'name' => $this->submittedBy->name,
            ] : null),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
