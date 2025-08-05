<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OrdersController;

// Authenticated users (user or admin)
Route::middleware(['auth:sanctum', 'role:user,admin'])->group(function () {
    Route::get('/orders/user', [OrdersController::class, 'getUserOrders']);
    Route::post('/orders/create', [OrdersController::class, 'store']);
});

// Admin-only
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('/orders/all', [OrdersController::class, 'index']);
    Route::get('/orders/{id}', [OrdersController::class, 'show']);
    Route::get('/orders/status/{status}', [OrdersController::class, 'getOrdersByStatus']);
    Route::get('/orders/statistics', [OrdersController::class, 'getStats']);
    Route::put('/orders/update/{id}', [OrdersController::class, 'update']);
    Route::delete('/orders/delete/{id}', [OrdersController::class, 'destroy']);
});
