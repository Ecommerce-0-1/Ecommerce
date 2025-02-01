<?php

namespace App\Http\Controllers;

use App\Models\Discounts;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class DiscountsController extends Controller
{
    function index()
    {
        try {
            $DiscountedProducts = Discounts::GetDiscountedProducts();

            return response()->json([
                'success' => true,
                'message' => 'Discounted Products retrieved successfully',
                'Discounted_Products' => $DiscountedProducts
            ], 200);
        } catch (Exception $e) {
            Log::error('Discounted Products retrieval error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to retrieve Discounted Products',
                'message' => config('app.debug') ? $e->getMessage() : 'Internal Server Error'
            ], 500);
        }
    }

    function show($id)
    {
        try {
            $discount = Discounts::GetDiscountById($id);

            return response()->json([
                'success' => true,
                'message' => 'Discount retrieved successfully',
                'discount' => $discount
            ], 200);
        } catch (Exception $e) {
            Log::error('Discount retrieval error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to retrieve discount',
                'message' => config('app.debug') ? $e->getMessage() : 'Internal Server Error'
            ], 500);
        }
    }
    function update(Request $request, $id)
    {
        try {
            $validatedData = $request->validate([
                'discount_percentage' => 'sometimes|numeric|between:0,100',
                'final_price' => 'sometimes|numeric|min:0',
            ]);

            $discount = Discounts::UpdateDiscount($id, $validatedData);

            return response()->json([
                'success' => true,
                'message' => 'Discount updated successfully',
                'discount' => $discount
            ], 200);
        } catch (Exception $e) {
            Log::error('Discount update error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to update discount',
                'message' => config('app.debug') ? $e->getMessage() : 'Internal Server Error'
            ], 500);
        }
    }

    function destroy($id)
    {
        try {
           Discounts::DeleteDiscount($id);

            return response()->json([
                'success' => true,
                'message' => "Discount deleted successfully with id {$id}",
            ], 200);
        } catch (Exception $e) {
            Log::error('Discount deletion error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => "Failed to delete discount with id {$id}",
                'message' => config('app.debug') ? $e->getMessage() : 'Internal Server Error'
            ], 500);
        }
    }
}
