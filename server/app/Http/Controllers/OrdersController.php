<?php

namespace App\Http\Controllers;

use App\Models\Orders;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

/**
 * @OA\Tag(
 *     name="Orders",
 *     description="API Endpoints for Order management"
 * )
 */
class OrdersController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/orders/get",
     *     summary="Get all orders",
     *     description="Retrieve all orders from the system",
     *     tags={"Orders"},
     *     @OA\Response(
     *         response=200,
     *         description="Orders retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Orders retrieved successfully"),
     *             @OA\Property(property="orders", type="array", @OA\Items(type="object"))
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Internal server error",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="error", type="string", example="Failed to retrieve orders"),
     *             @OA\Property(property="message", type="string", example="Internal Server Error")
     *         )
     *     )
     * )
     */
    public function index()
    {
        try {
            $orders = Orders::GetAllOrders();

            return response()->json([
                'success' => true,
                'message' => 'Orders retrieved successfully',
                'orders' => $orders
            ], 200);
        } catch (Exception $e) {
            Log::error('Orders retrieval error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to retrieve orders',
                'message' => config('app.debug') ? $e->getMessage() : 'Internal Server Error'
            ], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/api/orders/get/{id}",
     *     summary="Get order by ID",
     *     description="Retrieve a specific order by its ID",
     *     tags={"Orders"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Order ID",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Order retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Order retrieved successfully"),
     *             @OA\Property(property="order", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Order not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="error", type="string", example="Order not found")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Internal server error",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="error", type="string", example="Failed to retrieve order"),
     *             @OA\Property(property="message", type="string", example="Internal Server Error")
     *         )
     *     )
     * )
     */
    public function show($id)
    {
        try {
            $order = Orders::GetOrderByID($id);

            return response()->json([
                'success' => true,
                'message' => 'Order retrieved successfully',
                'order' => $order
            ], 200);
        } catch (Exception $e) {
            Log::error('Order retrieval error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to retrieve order',
                'message' => config('app.debug') ? $e->getMessage() : 'Internal Server Error'
            ], 500);
        }
    }

    /**
     * @OA\Post(
     *     path="/api/orders/create",
     *     summary="Create a new order",
     *     description="Create a new order with items",
     *     tags={"Orders"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"billing_id","items"},
     *             @OA\Property(property="billing_id", type="integer", example=1, description="Billing ID"),
     *             @OA\Property(
     *                 property="items",
     *                 type="array",
     *                 @OA\Items(
     *                     @OA\Property(property="product_id", type="integer", example=1),
     *                     @OA\Property(property="quantity", type="integer", example=2)
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Order created successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Order created successfully"),
     *             @OA\Property(property="order", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="error", type="string", example="Validation failed"),
     *             @OA\Property(property="message", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Internal server error",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="error", type="string", example="Failed to create order"),
     *             @OA\Property(property="message", type="string", example="Internal Server Error")
     *         )
     *     )
     * )
     */
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'billing_id' => 'required|integer|exists:billings,id',
                'items' => 'required|array|min:1',
                'items.*.product_id' => 'required|integer|exists:products,id',
                'items.*.quantity' => 'required|integer|min:1',
            ]);

            $order = DB::transaction(function () use ($validatedData) {
                $user = auth()->user();
                $userId = $user ? $user->id : 14;

                $order = Orders::create([
                    'user_id' => $userId,
                    'billing_id' => $validatedData['billing_id'],
                    'status' => 'pending',
                    'total_amount' => 0
                ]);

                $totalAmount = $order->AddItems($validatedData['items']);

                $order->update(['total_amount' => $totalAmount]);

                return $order;
            });

            return response()->json([
                'success' => true,
                'message' => 'Order created successfully',
                'order' => $order,
            ], 201);
        } catch (Exception $e) {
            Log::error('Order creation error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to create order',
                'message' => config('app.debug') ? $e->getMessage() : 'Internal Server Error'
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $request->validate([
                'status' => 'required|in:pending,completed,rejected',
            ]);

            $order = Orders::UpdateOrderStatus($id, $request->status);

            return response()->json([
                'success' => true,
                'message' => 'Order status updated successfully',
                'order' => $order
            ], 200);
        } catch (Exception $e) {
            Log::error('Order status update error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to update order status',
                'message' => config('app.debug') ? $e->getMessage() : 'Internal Server Error'
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $order = Orders::findOrFail($id);
            $order->delete();

            return response()->json([
                'success' => true,
                'message' => 'Order deleted successfully'
            ], 200);
        } catch (Exception $e) {
            Log::error('Order deletion error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to delete order',
                'message' => config('app.debug') ? $e->getMessage() : 'Internal Server Error'
            ], 500);
        }
    }

    public function getUserOrders()
    {
        try {
            $user = auth()->user();
            $orders = Orders::GetOrdersByUser($user->id);

            return response()->json([
                'success' => true,
                'message' => 'User orders retrieved successfully',
                'orders' => $orders
            ], 200);
        } catch (Exception $e) {
            Log::error('User orders retrieval error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to retrieve user orders',
                'message' => config('app.debug') ? $e->getMessage() : 'Internal Server Error'
            ], 500);
        }
    }

    public function getOrdersByStatus($status)
    {
        try {
            $orders = Orders::GetOrdersByStatus($status);

            return response()->json([
                'success' => true,
                'message' => 'Orders by status retrieved successfully',
                'orders' => $orders
            ], 200);
        } catch (Exception $e) {
            Log::error('Orders by status retrieval error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to retrieve orders by status',
                'message' => config('app.debug') ? $e->getMessage() : 'Internal Server Error'
            ], 500);
        }
    }

    public function getStats()
    {
        try {
            $stats = Orders::GetOrderStats();

            return response()->json([
                'success' => true,
                'message' => 'Order statistics retrieved successfully',
                'stats' => $stats
            ], 200);
        } catch (Exception $e) {
            Log::error('Order statistics retrieval error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to retrieve order statistics',
                'message' => config('app.debug') ? $e->getMessage() : 'Internal Server Error'
            ], 500);
        }
    }
}
