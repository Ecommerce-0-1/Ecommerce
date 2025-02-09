<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;


Route::post('/user/register', [UserController::class, 'register'])->name('register');
Route::post('/user/login', [UserController::class, 'login'])->name('login');
Route::post('/user/googlelogin', [UserController::class, 'GoogleLogin'])->name('GoogleLogin');

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user/get', [UserController::class, 'show']);
    Route::post('/user/update', [UserController::class, 'update']);
    Route::delete('/user/delete', [UserController::class, 'destroy']);
});
