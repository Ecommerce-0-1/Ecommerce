<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('billings', function (Blueprint $table) {
            $table->id();

            // Customer Information
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email');
            $table->string('phone');

            // Shipping Address
            $table->string('shipping_address');
            $table->string('shipping_city');
            $table->string('shipping_state')->nullable();
            $table->string('shipping_postal_code');
            $table->string('shipping_country')->default('US');

            // Billing Address (can be same as shipping)
            $table->string('billing_address');
            $table->string('billing_city');
            $table->string('billing_state')->nullable();
            $table->string('billing_postal_code');
            $table->string('billing_country')->default('US');

            // Payment Information (encrypted)
            $table->string('payment_method')->default('card'); // card, paypal, etc.
            $table->string('card_last_four')->nullable(); // Last 4 digits of card
            $table->string('card_brand')->nullable(); // visa, mastercard, amex, etc.
            $table->string('card_expiry_month')->nullable();
            $table->string('card_expiry_year')->nullable();

            // Payment Status
            $table->enum('payment_status', ['pending', 'processing', 'completed', 'failed', 'refunded'])->default('pending');
            $table->string('payment_intent_id')->nullable(); // Payment processor ID
            $table->string('payment_method_id')->nullable(); // Saved payment method ID

            // Additional Fields
            $table->text('notes')->nullable();
            $table->boolean('same_as_shipping')->default(true);

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('billings');
    }
};
