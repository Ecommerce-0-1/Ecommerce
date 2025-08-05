<?php

namespace App\Http\Controllers;

use App\Models\Order_Items;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class OrderItemsController extends Controller
{
    public function index()
    {
        try {
            $orderItems = Order_Items::GetAllOrderItems();

            return response()->json([
                'success' => true,
                'message' => 'Order items retrieved successfully',
                'order_items' => $orderItems
            ], 200);
        } catch (Exception $e) {
            Log::error('Order items retrieval error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to retrieve order items',
                'message' => config('app.debug') ? $e->getMessage() : 'Internal Server Error'
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $orderItem = Order_Items::GetOrderItemByID($id);

            return response()->json([
                'success' => true,
                'message' => 'Order item retrieved successfully',
                'order_item' => $orderItem
            ], 200);
        } catch (Exception $e) {
            Log::error('Order item retrieval error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to retrieve order item',
                'message' => config('app.debug') ? $e->getMessage() : 'Internal Server Error'
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'order_id' => 'required|exists:orders,id',
                'product_id' => 'required|exists:products,id',
                'qty' => 'required|integer|min:1',
                'price' => 'required|numeric|min:0',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'error' => 'Validation failed',
                    'message' => $validator->errors()
                ], 422);
            }

            $orderItem = Order_Items::create($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Order item created successfully',
                'order_item' => $orderItem
            ], 201);
        } catch (Exception $e) {
            Log::error('Order item creation error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to create order item',
                'message' => config('app.debug') ? $e->getMessage() : 'Internal Server Error'
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'qty' => 'sometimes|required|integer|min:1',
                'price' => 'sometimes|required|numeric|min:0',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'error' => 'Validation failed',
                    'message' => $validator->errors()
                ], 422);
            }

            $orderItem = Order_Items::findOrFail($id);
            $orderItem->update($request->only(['qty', 'price']));

            return response()->json([
                'success' => true,
                'message' => 'Order item updated successfully',
                'order_item' => $orderItem
            ], 200);
        } catch (Exception $e) {
            Log::error('Order item update error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to update order item',
                'message' => config('app.debug') ? $e->getMessage() : 'Internal Server Error'
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $orderItem = Order_Items::findOrFail($id);
            $orderItem->delete();

            return response()->json([
                'success' => true,
                'message' => 'Order item deleted successfully'
            ], 200);
        } catch (Exception $e) {
            Log::error('Order item deletion error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to delete order item',
                'message' => config('app.debug') ? $e->getMessage() : 'Internal Server Error'
            ], 500);
        }
    }

    public function getByOrder($orderId)
    {
        try {
            $orderItems = Order_Items::GetOrderByID($orderId);

            return response()->json([
                'success' => true,
                'message' => 'Order items retrieved successfully',
                'order_items' => $orderItems
            ], 200);
        } catch (Exception $e) {
            Log::error('Order items retrieval error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to retrieve order items',
                'message' => config('app.debug') ? $e->getMessage() : 'Internal Server Error'
            ], 500);
        }
    }

    public function getUserOrderItems()
    {
        try {
            $user = auth()->user();
            $orderItems = Order_Items::GetOrderItemsByUser($user->id);

            return response()->json([
                'success' => true,
                'message' => 'User order items retrieved successfully',
                'order_items' => $orderItems
            ], 200);
        } catch (Exception $e) {
            Log::error('User order items retrieval error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to retrieve user order items',
                'message' => config('app.debug') ? $e->getMessage() : 'Internal Server Error'
            ], 500);
        }
    }
}
