<?php

namespace App\Http\Controllers;

use App\Services\StripeService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WebhookController extends Controller
{
    protected $stripeService;

    public function __construct(StripeService $stripeService)
    {
        $this->stripeService = $stripeService;
    }

    /**
     * Handle Stripe webhook events
     */
    public function handleStripeWebhook(Request $request)
    {
        try {
            $payload = $request->getContent();
            $signature = $request->header('Stripe-Signature');

            $result = $this->stripeService->handleWebhook($payload, $signature);

            if ($result['success']) {
                return response()->json(['status' => 'success'], 200);
            } else {
                Log::error('Webhook processing failed: ' . $result['message']);
                return response()->json(['status' => 'error'], 400);
            }
        } catch (Exception $e) {
            Log::error('Webhook error: ' . $e->getMessage());
            return response()->json(['status' => 'error'], 400);
        }
    }
}
