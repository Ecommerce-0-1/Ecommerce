<?php

namespace App\Services;

use App\Models\Billing;
use App\Models\Orders;
use Exception;
use Illuminate\Support\Facades\Log;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use Stripe\PaymentMethod;
use Stripe\Customer;
use Stripe\Exception\CardException;
use Stripe\Exception\InvalidRequestException;
use Stripe\Exception\AuthenticationException;
use Stripe\Exception\ApiConnectionException;
use Stripe\Exception\ApiErrorException;

class StripeService
{
    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    /**
     * Process payment with Stripe
     */
    public function processPayment($request, $amount): array
    {
        try {
            // Create or get customer
            $customer = $this->createOrGetCustomer($request->billing_data);

            // Create payment method
            $paymentMethod = $this->createPaymentMethod($request);

            // Attach payment method to customer
            $paymentMethod->attach(['customer' => $customer->id]);

            // Create payment intent
            $paymentIntent = PaymentIntent::create([
                'amount' => $this->convertToStripeAmount($amount),
                'currency' => config('services.stripe.currency', 'usd'),
                'customer' => $customer->id,
                'payment_method' => $paymentMethod->id,
                'confirmation_method' => 'manual',
                'confirm' => true,
                'return_url' => config('app.url') . '/payment/success',
                'metadata' => [
                    'order_id' => $request->order_id,
                    'user_id' => auth()->id(),
                ],
            ]);

            if ($paymentIntent->status === 'succeeded') {
                return [
                    'success' => true,
                    'payment_intent_id' => $paymentIntent->id,
                    'payment_method_id' => $request->save_card ? $paymentMethod->id : null,
                    'status' => $paymentIntent->status,
                ];
            } elseif ($paymentIntent->status === 'requires_action') {
                return [
                    'success' => true,
                    'payment_intent_id' => $paymentIntent->id,
                    'payment_method_id' => $request->save_card ? $paymentMethod->id : null,
                    'status' => $paymentIntent->status,
                    'requires_action' => true,
                    'client_secret' => $paymentIntent->client_secret,
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Payment failed: ' . $paymentIntent->last_payment_error->message ?? 'Unknown error',
                ];
            }
        } catch (CardException $e) {
            Log::error('Stripe card error: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        } catch (InvalidRequestException $e) {
            Log::error('Stripe invalid request: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Invalid payment information',
            ];
        } catch (AuthenticationException $e) {
            Log::error('Stripe authentication error: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Payment service configuration error',
            ];
        } catch (ApiConnectionException $e) {
            Log::error('Stripe API connection error: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Payment service temporarily unavailable',
            ];
        } catch (ApiErrorException $e) {
            Log::error('Stripe API error: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Payment processing error',
            ];
        } catch (Exception $e) {
            Log::error('Stripe general error: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Payment processing failed',
            ];
        }
    }

    /**
     * Create or get Stripe customer
     */
    private function createOrGetCustomer($billingData): Customer
    {
         /** @var \App\Models\User $user */
        $user = auth()->user();

        // Check if user already has a Stripe customer ID
        if ($user->stripe_customer_id) {
            try {
                return Customer::retrieve($user->stripe_customer_id);
            } catch (\Exception $e) {
                Log::warning("Stripe customer retrieval failed: " . $e->getMessage());
            }
        }

        // Create new customer
        $customer = Customer::create([
            'email' => $billingData['email'],
            'name' => $billingData['first_name'] . ' ' . $billingData['last_name'],
            'phone' => $billingData['phone'],
            'metadata' => [
                'user_id' => $user->id,
            ],
        ]);

        // Save customer ID to user
        $user->update(['stripe_customer_id' => $customer->id]);

        return $customer;
    }

    /**
     * Create payment method
     */
    private function createPaymentMethod($request): PaymentMethod
    {
        return PaymentMethod::create([
            'type' => 'card',
            'card' => [
                'number' => $request->card_number,
                'exp_month' => (int) $request->expiry_month,
                'exp_year' => (int) $request->expiry_year,
                'cvc' => $request->cvv,
            ],
            'billing_details' => [
                'name' => $request->billing_data['first_name'] . ' ' . $request->billing_data['last_name'],
                'email' => $request->billing_data['email'],
                'phone' => $request->billing_data['phone'],
                'address' => [
                    'line1' => $request->billing_data['billing_address'],
                    'city' => $request->billing_data['billing_city'],
                    'state' => $request->billing_data['billing_state'] ?? null,
                    'postal_code' => $request->billing_data['billing_postal_code'],
                    'country' => $request->billing_data['billing_country'] ?? 'US',
                ],
            ],
        ]);
    }

    /**
     * Confirm payment intent
     */
    public function confirmPayment($paymentIntentId): array
    {
        try {
            $paymentIntent = PaymentIntent::retrieve($paymentIntentId);

            if ($paymentIntent->status === 'succeeded') {
                return [
                    'success' => true,
                    'status' => $paymentIntent->status,
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Payment not completed',
                    'status' => $paymentIntent->status,
                ];
            }
        } catch (Exception $e) {
            Log::error('Payment confirmation error: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Payment confirmation failed',
            ];
        }
    }

    /**
     * Get saved payment methods for user
     */
    public function getSavedPaymentMethods(): array
    {
        try {
            $user = auth()->user();

            if (!$user->stripe_customer_id) {
                return [];
            }

            $customer = Customer::retrieve($user->stripe_customer_id);
            $paymentMethods = PaymentMethod::all([
                'customer' => $customer->id,
                'type' => 'card',
            ]);

            return $paymentMethods->data;
        } catch (Exception $e) {
            Log::error('Get saved payment methods error: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Delete saved payment method
     */
    public function deletePaymentMethod($paymentMethodId): bool
    {
        try {
            $paymentMethod = PaymentMethod::retrieve($paymentMethodId);
            $paymentMethod->detach();
            return true;
        } catch (Exception $e) {
            Log::error('Delete payment method error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Process payment with saved card
     */
    public function processPaymentWithSavedCard($request, $amount): array
    {
        try {
            $user = auth()->user();

            if (!$user->stripe_customer_id) {
                return [
                    'success' => false,
                    'message' => 'No saved payment methods found',
                ];
            }

            $customer = Customer::retrieve($user->stripe_customer_id);

            // Create payment intent with saved payment method
            $paymentIntent = PaymentIntent::create([
                'amount' => $this->convertToStripeAmount($amount),
                'currency' => config('services.stripe.currency', 'usd'),
                'customer' => $customer->id,
                'payment_method' => $request->payment_method_id,
                'confirmation_method' => 'manual',
                'confirm' => true,
                'return_url' => config('app.url') . '/payment/success',
                'metadata' => [
                    'order_id' => $request->order_id,
                    'user_id' => $user->id,
                ],
            ]);

            if ($paymentIntent->status === 'succeeded') {
                return [
                    'success' => true,
                    'payment_intent_id' => $paymentIntent->id,
                    'status' => $paymentIntent->status,
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Payment failed',
                    'status' => $paymentIntent->status,
                ];
            }
        } catch (Exception $e) {
            Log::error('Saved card payment error: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Payment processing failed',
            ];
        }
    }

    /**
     * Create refund
     */
    public function createRefund($paymentIntentId, $amount = null): array
    {
        try {
            $refundData = [
                'payment_intent' => $paymentIntentId,
            ];

            if ($amount) {
                $refundData['amount'] = $this->convertToStripeAmount($amount);
            }

            $refund = \Stripe\Refund::create($refundData);

            return [
                'success' => true,
                'refund_id' => $refund->id,
                'status' => $refund->status,
            ];
        } catch (Exception $e) {
            Log::error('Refund error: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Refund failed',
            ];
        }
    }

    /**
     * Handle webhook events
     */
    public function handleWebhook($payload, $signature): array
    {
        try {
            $event = \Stripe\Webhook::constructEvent(
                $payload,
                $signature,
                config('services.stripe.webhook_secret')
            );

            switch ($event->type) {
                case 'checkout.session.completed':
                    return $this->handleCheckoutSessionCompleted($event->data->object);

                case 'checkout.session.expired':
                    return $this->handleCheckoutSessionExpired($event->data->object);

                case 'payment_intent.succeeded':
                    return $this->handlePaymentSucceeded($event->data->object);

                case 'payment_intent.payment_failed':
                    return $this->handlePaymentFailed($event->data->object);

                case 'payment_intent.canceled':
                    return $this->handlePaymentCanceled($event->data->object);

                default:
                    return [
                        'success' => true,
                        'message' => 'Event handled: ' . $event->type,
                    ];
            }
        } catch (Exception $e) {
            Log::error('Webhook error: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Webhook processing failed',
            ];
        }
    }

    /**
     * Handle payment succeeded webhook
     */
    private function handlePaymentSucceeded($paymentIntent): array
    {
        try {
            $orderId = $paymentIntent->metadata->order_id ?? null;

            if ($orderId) {
                $order = Orders::find($orderId);
                if ($order) {
                    $order->update(['status' => 'processing']);

                    // Update billing payment status
                    $billing = Billing::where('payment_intent_id', $paymentIntent->id)->first();
                    if ($billing) {
                        $billing->update(['payment_status' => 'completed']);
                    }
                }
            }

            return [
                'success' => true,
                'message' => 'Payment succeeded',
            ];
        } catch (Exception $e) {
            Log::error('Payment succeeded webhook error: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Failed to process payment succeeded',
            ];
        }
    }

    /**
     * Handle payment failed webhook
     */
    private function handlePaymentFailed($paymentIntent): array
    {
        try {
            $billing = Billing::where('payment_intent_id', $paymentIntent->id)->first();
            if ($billing) {
                $billing->update(['payment_status' => 'failed']);
            }

            return [
                'success' => true,
                'message' => 'Payment failed',
            ];
        } catch (Exception $e) {
            Log::error('Payment failed webhook error: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Failed to process payment failed',
            ];
        }
    }

    /**
     * Handle checkout session completed webhook
     */
    private function handleCheckoutSessionCompleted($session): array
    {
        try {
            $orderId = $session->metadata->order_id ?? null;
            $billingId = $session->metadata->billing_id ?? null;

            if ($orderId && $billingId) {
                $order = Orders::find($orderId);
                $billing = Billing::find($billingId);

                if ($order && $billing) {
                    // Update order status
                    $order->update(['status' => 'processing']);

                    // Update billing with payment details
                    $billing->update([
                        'payment_status' => 'completed',
                        'payment_intent_id' => $session->payment_intent,
                        'payment_method_id' => $session->payment_method_types[0] ?? null,
                    ]);
                }
            }

            return [
                'success' => true,
                'message' => 'Checkout session completed',
            ];
        } catch (Exception $e) {
            Log::error('Checkout session completed webhook error: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Failed to process checkout session completed',
            ];
        }
    }

    /**
     * Handle checkout session expired webhook
     */
    private function handleCheckoutSessionExpired($session): array
    {
        try {
            $billingId = $session->metadata->billing_id ?? null;

            if ($billingId) {
                $billing = Billing::find($billingId);
                if ($billing) {
                    $billing->update(['payment_status' => 'failed']);
                }
            }

            return [
                'success' => true,
                'message' => 'Checkout session expired',
            ];
        } catch (Exception $e) {
            Log::error('Checkout session expired webhook error: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Failed to process checkout session expired',
            ];
        }
    }

    /**
     * Handle payment canceled webhook
     */
    private function handlePaymentCanceled($paymentIntent): array
    {
        try {
            $billing = Billing::where('payment_intent_id', $paymentIntent->id)->first();
            if ($billing) {
                $billing->update(['payment_status' => 'failed']);
            }

            return [
                'success' => true,
                'message' => 'Payment canceled',
            ];
        } catch (Exception $e) {
            Log::error('Payment canceled webhook error: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Failed to process payment canceled',
            ];
        }
    }

    /**
     * Convert amount to Stripe format (cents)
     */
    private function convertToStripeAmount($amount): int
    {
        return (int) ($amount * 100);
    }

    /**
     * Convert Stripe amount from cents
     */
    public function convertFromStripeAmount($amount): float
    {
        return $amount / 100;
    }

    /**
     * Create Stripe Checkout session
     */
    public function createCheckoutSession($order, $billing): array
    {
        try {
            // Get order items to create line items
            $orderItems = $order->order_items;
            $lineItems = [];

            foreach ($orderItems as $item) {
                $lineItems[] = [
                    'price_data' => [
                        'currency' => config('services.stripe.currency', 'usd'),
                        'product_data' => [
                            'name' => $item->products->name,
                            'description' => $item->products->description ?? null,
                        ],
                        'unit_amount' => $this->convertToStripeAmount($item->price),
                    ],
                    'quantity' => $item->qty,
                ];
            }

            // Create or get customer
            $customer = $this->createOrGetCustomer([
                'email' => $billing->email,
                'first_name' => $billing->first_name,
                'last_name' => $billing->last_name,
                'phone' => $billing->phone,
            ]);

            // Create checkout session
            $session = \Stripe\Checkout\Session::create([
                'payment_method_types' => ['card'],
                'line_items' => $lineItems,
                'mode' => 'payment',
                'success_url' => config('app.url') . '/payment/success?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => config('app.url') . '/payment/cancel',
                'customer' => $customer->id,
                'metadata' => [
                    'order_id' => $order->id,
                    'billing_id' => $billing->id,
                    'user_id' => auth()->id(),
                ],
                'billing_address_collection' => 'required',
                'shipping_address_collection' => [
                    'allowed_countries' => ['US', 'CA', 'GB', 'AU'], // Add more countries as needed
                ],
                'customer_update' => [
                    'address' => 'auto',
                    'name' => 'auto',
                ],
            ]);

            return [
                'success' => true,
                'checkout_url' => $session->url,
                'session_id' => $session->id,
            ];
        } catch (Exception $e) {
            Log::error('Create checkout session error: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Failed to create checkout session: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Get checkout session status
     */
    public function getCheckoutSessionStatus($sessionId): array
    {
        try {
            $session = \Stripe\Checkout\Session::retrieve($sessionId);

            return [
                'success' => true,
                'status' => $session->status,
                'payment_status' => $session->payment_status,
                'session_id' => $session->id,
            ];
        } catch (Exception $e) {
            Log::error('Get checkout session status error: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Failed to get session status: ' . $e->getMessage(),
            ];
        }
    }
}
