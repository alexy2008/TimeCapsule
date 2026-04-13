<?php

use App\Http\Controllers\WebController;
use Illuminate\Support\Facades\Route;

Route::get('/', [WebController::class, 'home']);

Route::get('/create', [WebController::class, 'createForm']);
Route::post('/create', [WebController::class, 'createSubmit']);

Route::get('/open', [WebController::class, 'openSearch']);
Route::get('/open/{code}', [WebController::class, 'openByCode'])->where('code', '[A-Za-z0-9]{1,8}');

Route::get('/about', [WebController::class, 'about']);

Route::get('/admin', [WebController::class, 'admin']);
Route::post('/admin/login', [WebController::class, 'adminLogin']);
Route::post('/admin/logout', [WebController::class, 'adminLogout']);
Route::post('/admin/capsules/{code}/delete', [WebController::class, 'adminDelete']);
