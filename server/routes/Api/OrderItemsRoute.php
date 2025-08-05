<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OrderItemsController;



// Protected routes for authenticated users
Route::middleware(['auth:sanctum', 'role:user,admin'])->group(function () {
    Route::get('/order-items/user', [OrderItemsController::class, 'getUserOrderItems']);
    Route::post('/order-items/create', [OrderItemsController::class, 'store']);
    Route::put('/order-items/update/{id}', [OrderItemsController::class, 'update']);
    Route::delete('/order-items/delete/{id}', [OrderItemsController::class, 'destroy']);
});

// Admin only routes
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('/order-items/get/{id}', [OrderItemsController::class, 'show']);
    Route::get('/order-items/order/{orderId}', [OrderItemsController::class, 'getByOrder']);
    Route::get('/order-items/all', [OrderItemsController::class, 'index']);
});
