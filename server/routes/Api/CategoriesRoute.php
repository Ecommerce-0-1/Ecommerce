<?php

use App\Http\Controllers\CategoriesController;
use Illuminate\Support\Facades\Route;

Route::get('/ctgy/get', [CategoriesController::class, 'index'])->name('index');
Route::get('/ctgy/get/{id}', [CategoriesController::class, 'show'])->name('show');

Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::post('/ctgy/create', [CategoriesController::class, 'store']);
    Route::post('/ctgy/update/{id}', [CategoriesController::class, 'update']);
    Route::delete('/ctgy/delete/{id}', [CategoriesController::class, 'destroy']);
});
