<?php

use App\Http\Controllers\ProductsController;
use Illuminate\Support\Facades\Route;

Route::get('/products/get', [ProductsController::class, 'index']);
Route::get('/products/get/{id}', [ProductsController::class, 'show']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/products/create', [ProductsController::class, 'store']);
    Route::post('/products/bulk-create', [ProductsController::class, 'storeMultiple']);
    Route::patch('/products/update/{id}', [ProductsController::class, 'update']);
    Route::delete('/products/delete/{id}', [ProductsController::class, 'destroy']);
});
