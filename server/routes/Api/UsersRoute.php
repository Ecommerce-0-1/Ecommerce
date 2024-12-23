<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;


Route::post('/register', [UserController::class, 'register'])->name('register');
Route::post('/login', [UserController::class, 'login'])->name('login');
Route::post('/googlelogin', [UserController::class, 'GoogleLogin'])->name('GoogleLogin');

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/getuser', [UserController::class, 'show']);
    Route::post('/update_user', [UserController::class, 'update']);
    Route::delete('/delete_user', [UserController::class, 'destroy']);
});
