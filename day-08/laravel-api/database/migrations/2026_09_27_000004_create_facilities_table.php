<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('facilities', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('department_id')->constrained()->restrictOnDelete()->cascadeOnUpdate();
            $table->string('name', 150);
            $table->string('category', 100);
            $table->string('location', 255);
            $table->unsignedTinyInteger('condition_score')->default(3);
            $table->boolean('is_operational')->default(true);
            $table->text('notes')->nullable();
            $table->index('condition_score', 'facilities_condition_score_idx');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('facilities');
    }
};
