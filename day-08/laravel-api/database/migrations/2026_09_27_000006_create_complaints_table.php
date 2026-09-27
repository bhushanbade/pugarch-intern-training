<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('complaints', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('facility_id')->constrained()->restrictOnDelete()->cascadeOnUpdate();
            $table->foreignId('submitted_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete()
                ->cascadeOnUpdate();
            $table->string('subject', 180);
            $table->text('description');
            $table->string('priority', 20)->default('medium');
            $table->string('status', 20)->default('open');
            $table->timestamp('reported_at');
            $table->index(['facility_id', 'status'], 'complaints_facility_status_idx');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('complaints');
    }
};
