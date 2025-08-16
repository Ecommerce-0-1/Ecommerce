<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Test route to verify API is working
Route::get('/test', function () {
    return response()->json([
        'message' => 'API is working!',
        'timestamp' => now(),
        'version' => '1.0.0'
    ]);
});

// Include all API route files
require __DIR__ . '/Api/OrdersRoute.php';
require __DIR__ . '/Api/OrderItemsRoute.php';
require __DIR__ . '/Api/ProductsRoute.php';
require __DIR__ . '/Api/UsersRoute.php';
require __DIR__ . '/Api/DiscountsRoute.php';
require __DIR__ . '/Api/CategoriesRoute.php';
require __DIR__ . '/Api/PaymentRoute.php';
require __DIR__ . '/Api/WishlistRoute.php';
