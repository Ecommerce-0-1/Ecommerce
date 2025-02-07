<?php

use App\Http\Controllers\CategoriesController;
use Illuminate\Support\Facades\Route;

Route::get('get_categories', [CategoriesController::class, 'index'])->name('index');
Route::get('get_category/{id}', [CategoriesController::class, 'show'])->name('show');

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('create_category', [CategoriesController::class, 'store']);
    Route::post('update_category/{id}', [CategoriesController::class, 'update']);
    Route::delete('delete_category/{id}', [CategoriesController::class, 'destroy']);
});
