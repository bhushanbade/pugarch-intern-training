<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FacilityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $required = $this->isMethod('PATCH') ? ['sometimes', 'required'] : ['required'];

        return [
            'department_id' => [...$required, 'integer', 'exists:departments,id'],
            'name' => [...$required, 'string', 'max:150'],
            'category' => [...$required, 'string', 'max:100'],
            'location' => [...$required, 'string', 'max:255'],
            'condition_score' => ['sometimes', 'integer', 'between:1,5'],
            'is_operational' => ['sometimes', 'boolean'],
            'notes' => ['sometimes', 'nullable', 'string', 'max:16000'],
        ];
    }
}
