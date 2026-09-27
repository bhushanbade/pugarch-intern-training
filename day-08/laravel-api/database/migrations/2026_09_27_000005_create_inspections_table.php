<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inspections', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('facility_id')->constrained()->restrictOnDelete()->cascadeOnUpdate();
            $table->foreignId('inspector_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete()
                ->cascadeOnUpdate();
            $table->unsignedTinyInteger('rating');
            $table->timestamp('inspected_at');
            $table->text('findings');
            $table->index(['facility_id', 'inspected_at'], 'inspections_facility_inspected_at_idx');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inspections');
    }
};
