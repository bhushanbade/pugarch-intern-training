<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Employee extends Model
{
    protected $fillable = [
        'department_id',
        'name',
        'email',
        'position',
        'salary',
        'hired_on',
    ];

    protected function casts(): array
    {
        return [
            'salary' => 'decimal:2',
            'hired_on' => 'date',
        ];
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }
}
