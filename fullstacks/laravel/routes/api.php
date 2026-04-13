<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\CapsuleController;
use App\Http\Controllers\Api\HealthController;
use Illuminate\Support\Facades\Route;

Route::get('/health', [HealthController::class, 'show']);

Route::post('/capsules', [CapsuleController::class, 'store']);
Route::get('/capsules/{code}', [CapsuleController::class, 'show']);

Route::post('/admin/login', [AdminController::class, 'login']);

Route::middleware('jwt.auth')->group(function () {
    Route::get('/admin/capsules', [AdminController::class, 'index']);
    Route::delete('/admin/capsules/{code}', [AdminController::class, 'destroy']);
});
