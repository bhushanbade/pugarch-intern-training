<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Complaint extends Model
{
    protected $fillable = [
        'facility_id',
        'submitted_by',
        'subject',
        'description',
        'priority',
        'status',
        'reported_at',
    ];

    protected function casts(): array
    {
        return [
            'reported_at' => 'datetime',
        ];
    }

    public function facility(): BelongsTo
    {
        return $this->belongsTo(Facility::class);
    }

    public function submittedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'submitted_by');
    }
}
