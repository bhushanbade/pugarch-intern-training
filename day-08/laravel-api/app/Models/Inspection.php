<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Inspection extends Model
{
    protected $fillable = [
        'facility_id',
        'inspector_id',
        'rating',
        'inspected_at',
        'findings',
    ];

    protected function casts(): array
    {
        return [
            'rating' => 'integer',
            'inspected_at' => 'datetime',
        ];
    }

    public function facility(): BelongsTo
    {
        return $this->belongsTo(Facility::class);
    }

    public function inspector(): BelongsTo
    {
        return $this->belongsTo(User::class, 'inspector_id');
    }
}
