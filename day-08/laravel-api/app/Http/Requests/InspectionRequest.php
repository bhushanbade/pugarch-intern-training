<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InspectionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $required = $this->isMethod('PATCH') ? ['sometimes', 'required'] : ['required'];

        return [
            'facility_id' => [...$required, 'integer', 'exists:facilities,id'],
            'inspector_id' => ['sometimes', 'nullable', 'integer', 'exists:users,id'],
            'rating' => [...$required, 'integer', 'between:1,5'],
            'inspected_at' => [...$required, 'date'],
            'findings' => [...$required, 'string', 'max:16000'],
        ];
    }
}
