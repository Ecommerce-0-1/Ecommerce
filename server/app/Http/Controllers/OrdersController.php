<?php

namespace App\Http\Controllers;

use App\Models\Orders;
use App\Models\Billing;
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
     *             required={"items","billing_data"},
     *             @OA\Property(
     *                 property="items",
     *                 type="array",
     *                 @OA\Items(
     *                     @OA\Property(property="product_id", type="integer", example=1),
     *                     @OA\Property(property="quantity", type="integer", example=2)
     *                 )
     *             ),
     *             @OA\Property(
     *                 property="billing_data",
     *                 type="object",
     *                 @OA\Property(property="first_name", type="string", example="John"),
     *                 @OA\Property(property="last_name", type="string", example="Doe"),
     *                 @OA\Property(property="email", type="string", example="john@example.com"),
     *                 @OA\Property(property="phone", type="string", example="+1234567890"),
     *                 @OA\Property(property="shipping_address", type="string", example="123 Main St"),
     *                 @OA\Property(property="shipping_city", type="string", example="New York"),
     *                 @OA\Property(property="shipping_state", type="string", example="NY"),
     *                 @OA\Property(property="shipping_postal_code", type="string", example="10001"),
     *                 @OA\Property(property="billing_address", type="string", example="123 Main St"),
     *                 @OA\Property(property="billing_city", type="string", example="New York"),
     *                 @OA\Property(property="billing_state", type="string", example="NY"),
     *                 @OA\Property(property="billing_postal_code", type="string", example="10001"),
     *                 @OA\Property(property="same_as_shipping", type="boolean", example=true)
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
                'items' => 'required|array|min:1',
                'items.*.product_id' => 'required|integer|exists:products,id',
                'items.*.quantity' => 'required|integer|min:1',
                'billing_data' => 'required|array',
                'billing_data.first_name' => 'required|string|max:255',
                'billing_data.last_name' => 'required|string|max:255',
                'billing_data.email' => 'required|email',
                'billing_data.phone' => 'required|string|max:20',
                'billing_data.shipping_address' => 'required|string|max:500',
                'billing_data.shipping_city' => 'required|string|max:255',
                'billing_data.shipping_state' => 'nullable|string|max:255',
                'billing_data.shipping_postal_code' => 'required|string|max:20',
                'billing_data.billing_address' => 'required|string|max:500',
                'billing_data.billing_city' => 'required|string|max:255',
                'billing_data.billing_state' => 'nullable|string|max:255',
                'billing_data.billing_postal_code' => 'required|string|max:20',
                'billing_data.same_as_shipping' => 'boolean',
            ]);

            $order = DB::transaction(function () use ($validatedData) {
                $user = auth()->user();
                $userId = $user ? $user->id : 14;

                // Create billing information first
                $billingData = $validatedData['billing_data'];
                $billing = Billing::create([
                    'first_name' => $billingData['first_name'],
                    'last_name' => $billingData['last_name'],
                    'email' => $billingData['email'],
                    'phone' => $billingData['phone'],
                    'shipping_address' => $billingData['shipping_address'],
                    'shipping_city' => $billingData['shipping_city'],
                    'shipping_state' => $billingData['shipping_state'] ?? null,
                    'shipping_postal_code' => $billingData['shipping_postal_code'],
                    'shipping_country' => $billingData['shipping_country'] ?? 'US',
                    'billing_address' => $billingData['billing_address'],
                    'billing_city' => $billingData['billing_city'],
                    'billing_state' => $billingData['billing_state'] ?? null,
                    'billing_postal_code' => $billingData['billing_postal_code'],
                    'billing_country' => $billingData['billing_country'] ?? 'US',
                    'payment_method' => 'card',
                    'payment_status' => 'pending',
                    'same_as_shipping' => $billingData['same_as_shipping'] ?? true,
                ]);

                $order = Orders::create([
                    'user_id' => $userId,
                    'billing_id' => $billing->id,
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
