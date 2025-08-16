<?php

namespace App\Http\Controllers;

use App\Models\Billing;
use App\Models\Orders;
use App\Services\StripeService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

/**
 * @OA\Tag(
 *     name="Payments",
 *     description="API Endpoints for Payment processing"
 * )
 */
class PaymentController extends Controller
{
    protected $stripeService;

    public function __construct(StripeService $stripeService)
    {
        $this->stripeService = $stripeService;
    }

    /**
     * @OA\Post(
     *     path="/api/payments/create-checkout-session",
     *     summary="Create Stripe Checkout session",
     *     description="Create a secure Stripe Checkout session for order payment",
     *     tags={"Payments"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"order_id"},
     *             @OA\Property(property="order_id", type="integer", example=1, description="Order ID"),
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Checkout session created successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Checkout session created successfully"),
     *             @OA\Property(property="checkout_url", type="string", example="https://checkout.stripe.com/pay/cs_test_..."),
     *             @OA\Property(property="session_id", type="string", example="cs_test_...")
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
     *         description="Checkout session creation error",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="error", type="string", example="Failed to create checkout session"),
     *             @OA\Property(property="message", type="string", example="Internal Server Error")
     *         )
     *     )
     * )
     */
    public function createCheckoutSession(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'order_id' => 'required|integer|exists:orders,id',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'error' => 'Validation failed',
                    'message' => $validator->errors()
                ], 422);
            }

            $order = Orders::with('billing')->findOrFail($request->order_id);

            if ($order->user_id !== auth()->id()) {
                return response()->json([
                    'success' => false,
                    'error' => 'Unauthorized',
                    'message' => 'You can only process payments for your own orders'
                ], 403);
            }

            if (!$order->billing) {
                return response()->json([
                    'success' => false,
                    'error' => 'Missing billing information',
                    'message' => 'Order must have billing info before creating checkout session'
                ], 400);
            }

            // Call Stripe with existing billing data
            $checkoutResult = $this->stripeService->createCheckoutSession($order, $order->billing);

            if ($checkoutResult['success']) {
                return response()->json([
                    'success' => true,
                    'message' => 'Checkout session created successfully',
                    'checkout_url' => $checkoutResult['checkout_url'],
                    'session_id' => $checkoutResult['session_id']
                ], 200);
            } else {
                return response()->json([
                    'success' => false,
                    'error' => 'Failed to create checkout session',
                    'message' => $checkoutResult['message']
                ], 500);
            }
        } catch (Exception $e) {
            Log::error('Checkout session creation error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Checkout session creation failed',
                'message' => config('app.debug') ? $e->getMessage() : 'Internal Server Error'
            ], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/api/payments/session-status/{sessionId}",
     *     summary="Get checkout session status",
     *     description="Get the status of a Stripe Checkout session",
     *     tags={"Payments"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="sessionId",
     *         in="path",
     *         required=true,
     *         description="Stripe Checkout session ID",
     *         @OA\Schema(type="string", example="cs_test_...")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Session status retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="status", type="string", example="complete"),
     *             @OA\Property(property="payment_status", type="string", example="completed")
     *         )
     *     )
     * )
     */
    public function getSessionStatus($sessionId)
    {
        try {
            $sessionStatus = $this->stripeService->getCheckoutSessionStatus($sessionId);

            return response()->json([
                'success' => true,
                'status' => $sessionStatus['status'],
                'payment_status' => $sessionStatus['payment_status']
            ], 200);
        } catch (Exception $e) {
            Log::error('Session status check error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to get session status',
                'message' => config('app.debug') ? $e->getMessage() : 'Internal Server Error'
            ], 500);
        }
    }

    /**
     * @OA\Post(
     *     path="/api/payments/process",
     *     summary="Process payment for an order",
     *     description="Process bank card payment for an order",
     *     tags={"Payments"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"order_id","card_number","expiry_month","expiry_year","cvv","billing_data"},
     *             @OA\Property(property="order_id", type="integer", example=1, description="Order ID"),
     *             @OA\Property(property="card_number", type="string", example="4242424242424242", description="Card number"),
     *             @OA\Property(property="expiry_month", type="string", example="12", description="Expiry month"),
     *             @OA\Property(property="expiry_year", type="string", example="2025", description="Expiry year"),
     *             @OA\Property(property="cvv", type="string", example="123", description="CVV"),
     *             @OA\Property(property="save_card", type="boolean", example=false, description="Save card for future use"),
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
     *         response=200,
     *         description="Payment processed successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Payment processed successfully"),
     *             @OA\Property(property="payment_intent_id", type="string", example="pi_1234567890"),
     *             @OA\Property(property="billing_id", type="integer", example=1)
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
     *         description="Payment processing error",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="error", type="string", example="Payment processing failed"),
     *             @OA\Property(property="message", type="string", example="Card declined")
     *         )
     *     )
     * )
     */
    public function processPayment(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'order_id' => 'required|integer|exists:orders,id',
                'card_number' => 'required|string|regex:/^\d{13,19}$/',
                'expiry_month' => 'required|string|regex:/^(0[1-9]|1[0-2])$/',
                'expiry_year' => 'required|string|regex:/^\d{4}$/',
                'cvv' => 'required|string|regex:/^\d{3,4}$/',
                'save_card' => 'boolean',
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

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'error' => 'Validation failed',
                    'message' => $validator->errors()
                ], 422);
            }

            // Get the order
            $order = Orders::findOrFail($request->order_id);

            // Check if order belongs to authenticated user
            if ($order->user_id !== auth()->id()) {
                return response()->json([
                    'success' => false,
                    'error' => 'Unauthorized',
                    'message' => 'You can only process payments for your own orders'
                ], 403);
            }

            // Create or update billing information
            $billingData = $request->billing_data;
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
                'card_last_four' => substr($request->card_number, -4),
                'card_brand' => $this->detectCardBrand($request->card_number),
                'card_expiry_month' => $request->expiry_month,
                'card_expiry_year' => $request->expiry_year,
                'payment_status' => 'processing',
                'same_as_shipping' => $billingData['same_as_shipping'] ?? true,
            ]);

            // Process payment through Stripe
            $paymentResult = $this->stripeService->processPayment($request, $order->total_amount);

            if ($paymentResult['success']) {
                // Update billing with payment details
                $billing->update([
                    'payment_status' => 'completed',
                    'payment_intent_id' => $paymentResult['payment_intent_id'],
                    'payment_method_id' => $paymentResult['payment_method_id'] ?? null,
                ]);

                // Update order billing_id
                $order->update(['billing_id' => $billing->id]);

                return response()->json([
                    'success' => true,
                    'message' => 'Payment processed successfully',
                    'payment_intent_id' => $paymentResult['payment_intent_id'],
                    'billing_id' => $billing->id
                ], 200);
            } else {
                // Update billing with failed status
                $billing->update([
                    'payment_status' => 'failed',
                ]);

                return response()->json([
                    'success' => false,
                    'error' => 'Payment processing failed',
                    'message' => $paymentResult['message']
                ], 500);
            }
        } catch (Exception $e) {
            Log::error('Payment processing error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Payment processing failed',
                'message' => config('app.debug') ? $e->getMessage() : 'Internal Server Error'
            ], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/api/payments/saved-cards",
     *     summary="Get user's saved payment methods",
     *     description="Retrieve saved payment methods for the authenticated user",
     *     tags={"Payments"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Saved payment methods retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Saved payment methods retrieved successfully"),
     *             @OA\Property(property="payment_methods", type="array", @OA\Items(type="object"))
     *         )
     *     )
     * )
     */
    public function getSavedPaymentMethods()
    {
        try {
            $savedMethods = $this->stripeService->getSavedPaymentMethods();

            return response()->json([
                'success' => true,
                'message' => 'Saved payment methods retrieved successfully',
                'payment_methods' => $savedMethods
            ], 200);
        } catch (Exception $e) {
            Log::error('Get saved payment methods error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to retrieve saved payment methods',
                'message' => config('app.debug') ? $e->getMessage() : 'Internal Server Error'
            ], 500);
        }
    }

    /**
     * @OA\Delete(
     *     path="/api/payments/saved-cards/{id}",
     *     summary="Delete saved payment method",
     *     description="Delete a saved payment method",
     *     tags={"Payments"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Payment method ID",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Payment method deleted successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Payment method deleted successfully")
     *         )
     *     )
     * )
     */
    public function deleteSavedPaymentMethod($id)
    {
        try {
            $user = auth()->user();
            $paymentMethod = Billing::where('id', $id)
                ->where('user_id', $user->id)
                ->whereNotNull('payment_method_id')
                ->first();

            if (!$paymentMethod) {
                return response()->json([
                    'success' => false,
                    'error' => 'Payment method not found'
                ], 404);
            }

            // Delete from Stripe
            $this->stripeService->deletePaymentMethod($paymentMethod->payment_method_id);

            // Soft delete the billing record
            $paymentMethod->delete();

            return response()->json([
                'success' => true,
                'message' => 'Payment method deleted successfully'
            ], 200);
        } catch (Exception $e) {
            Log::error('Delete payment method error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to delete payment method',
                'message' => config('app.debug') ? $e->getMessage() : 'Internal Server Error'
            ], 500);
        }
    }
}
