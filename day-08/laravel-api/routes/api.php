<?php

use App\Http\Controllers\ComplaintController;
use App\Http\Controllers\FacilityController;
use App\Http\Controllers\InspectionController;
use Illuminate\Support\Facades\Route;

Route::middleware('throttle:60,1')->group(function (): void {
    Route::apiResource('facilities', FacilityController::class);
    Route::apiResource('inspections', InspectionController::class);
    Route::apiResource('complaints', ComplaintController::class);
});
