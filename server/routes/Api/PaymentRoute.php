<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\WebhookController;

// Payment routes - all require authentication
Route::middleware(['auth:sanctum'])->group(function () {
    // Create Stripe Checkout session (NEW - Secure approach)
    Route::post('/payments/create-checkout-session', [PaymentController::class, 'createCheckoutSession']);

    // Get checkout session status (NEW)
    Route::get('/payments/session-status/{sessionId}', [PaymentController::class, 'getSessionStatus']);

    // Process payment for an order (DEPRECATED - Keep for backward compatibility)
    Route::post('/payments/process', [PaymentController::class, 'processPayment']);

    // Get user's saved payment methods
    Route::get('/payments/saved-cards', [PaymentController::class, 'getSavedPaymentMethods']);

    // Delete saved payment method
    Route::delete('/payments/saved-cards/{id}', [PaymentController::class, 'deleteSavedPaymentMethod']);
});

// Webhook routes - no authentication required
Route::post('/webhooks/stripe', [WebhookController::class, 'handleStripeWebhook']);
