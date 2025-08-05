<?php

use App\Http\Controllers\BestSellingProductsController;
use Illuminate\Support\Facades\Route;

Route::get('/bsp/get', [BestSellingProductsController::class, 'index'])->name('index');
Route::get('/bsp/get/{id}', [BestSellingProductsController::class, 'show'])->name('show');
Route::get('/bsp/month', [BestSellingProductsController::class, 'GetBestSellingProductsByMonth']);

Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::post('/ctgy/create', [BestSellingProductsController::class, 'store']);
    Route::post('/ctgy/update/{id}', [BestSellingProductsController::class, 'update']);
    Route::delete('/ctgy/delete/{id}', [BestSellingProductsController::class, 'destroy']);
});
