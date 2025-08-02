<?php

namespace App\Http\Controllers;

use App\Models\Best_Selling_Products;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class BestSellingProductsController extends Controller
{
    function index()
    {
        try {
            $products = Best_Selling_Products::GetBestSellingProducts();

            return response()->json([
                'success' => true,
                'message' => 'Best Selling Products retrieved successfully',
                'products' => $products
            ], 200);
        } catch (Exception $e) {
            Log::error('Best Selling Products retrieval error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to retrieve Best Selling Products',
                'message' => config('app.debug') ? $e->getMessage() : 'Internal Server Error'
            ], 500);
        }
    }

    function show($id)
    {
        try {
            validator(['id' => $id], [
                'id' => 'required|integer|exists:best_selling_products,id'
            ])->validate();

            $product = Best_Selling_Products::GetBestSellingProductById($id);
            return response()->json([
                'success' => true,
                'message' => 'Best Selling Product retrieved By ID successfully',
                'category' => $product
            ], 200);
        } catch (Exception $e) {
            Log::error('Best Selling Product retrieval by id error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to retrieve Best Selling Product by id',
                'message' => config('app.debug') ? $e->getMessage() : 'Internal Server Error'
            ], 500);
        }
    }
    function GetBestSellingProductsByMonth(Request $request)
    {
        try {
            $month = $request->query('month');
            $products = Best_Selling_Products::GetBestSellingProductsByMonth($month);
            return response()->json([
                'success' => true,
                'message' => 'Best Selling Products retrieved successfully',
                'products' => $products
            ], 200);
        } catch (Exception $e) {
            Log::error('Best Selling Product retrieval error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to retrieve Best Selling Product',
                'message' => config('app.debug') ? $e->getMessage() : 'Internal Server Error'
            ], 500);
        }
    }
}
