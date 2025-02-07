<?php

use App\Http\Controllers\DiscountsController;
use Illuminate\Support\Facades\Route;

Route::get('/discounts/get', [DiscountsController::class, 'index']);
Route::get('/discounts/get/{id}', [DiscountsController::class, 'show']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::patch('/discounts/update/{id}', [DiscountsController::class, 'update']);
    Route::delete('/discounts/delete/{id}', [DiscountsController::class, 'destroy']);
});
