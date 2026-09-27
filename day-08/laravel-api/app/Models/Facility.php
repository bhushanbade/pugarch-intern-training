<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Facility extends Model
{
    protected $fillable = [
        'department_id',
        'name',
        'category',
        'location',
        'condition_score',
        'is_operational',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'condition_score' => 'integer',
            'is_operational' => 'boolean',
        ];
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function inspections(): HasMany
    {
        return $this->hasMany(Inspection::class);
    }

    public function complaints(): HasMany
    {
        return $this->hasMany(Complaint::class);
    }
}
