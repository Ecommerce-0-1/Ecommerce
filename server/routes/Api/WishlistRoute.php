<?php

use App\Http\Controllers\WishlistController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->group(function () {
    // Get user's wishlist
    Route::get('/wishlist', [WishlistController::class, 'index']);

    // Add product to wishlist
    Route::post('/wishlist/add', [WishlistController::class, 'store']);

    // Remove product from wishlist
    Route::delete('/wishlist/remove/{productId}', [WishlistController::class, 'destroy']);

    // Clear user's wishlist
    Route::delete('/wishlist/clear', [WishlistController::class, 'clear']);

    // Get wishlist count
    Route::get('/wishlist/count', [WishlistController::class, 'count']);

    // Check if product is in wishlist
    Route::get('/wishlist/check/{productId}', [WishlistController::class, 'check']);
});
