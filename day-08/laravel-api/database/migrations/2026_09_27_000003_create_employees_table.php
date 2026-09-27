<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('department_id')->constrained()->restrictOnDelete()->cascadeOnUpdate();
            $table->string('name', 150);
            $table->string('email')->unique();
            $table->string('position', 100);
            $table->decimal('salary', 10, 2);
            $table->date('hired_on');
            $table->index(['department_id', 'salary'], 'employees_department_salary_idx');
            $table->index('salary', 'employees_salary_idx');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
