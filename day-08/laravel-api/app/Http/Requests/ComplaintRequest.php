<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ComplaintRequest extends FormRequest
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
            'submitted_by' => ['sometimes', 'nullable', 'integer', 'exists:users,id'],
            'subject' => [...$required, 'string', 'max:180'],
            'description' => [...$required, 'string', 'max:16000'],
            'priority' => [...$required, 'in:low,medium,high,urgent'],
            'status' => [...$required, 'in:open,in_progress,resolved,closed'],
            'reported_at' => [...$required, 'date'],
        ];
    }
}
