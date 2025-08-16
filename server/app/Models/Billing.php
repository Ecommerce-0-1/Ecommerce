<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Billing extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'billings';

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'shipping_address',
        'shipping_city',
        'shipping_state',
        'shipping_postal_code',
        'shipping_country',
        'billing_address',
        'billing_city',
        'billing_state',
        'billing_postal_code',
        'billing_country',
        'payment_method',
        'card_last_four',
        'card_brand',
        'card_expiry_month',
        'card_expiry_year',
        'payment_status',
        'payment_intent_id',
        'payment_method_id',
        'notes',
        'same_as_shipping'
    ];

    protected $casts = [
        'same_as_shipping' => 'boolean',
    ];

    protected $hidden = [
        'card_last_four',
        'card_brand',
        'card_expiry_month',
        'card_expiry_year',
        'payment_intent_id',
        'payment_method_id',
    ];

    public function orders(): HasMany
    {
        return $this->hasMany(Orders::class);
    }

    /**
     * Get full name attribute
     */
    public function getFullNameAttribute(): string
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    /**
     * Get formatted shipping address
     */
    public function getFormattedShippingAddressAttribute(): string
    {
        $address = $this->shipping_address . ', ' . $this->shipping_city;
        if ($this->shipping_state) {
            $address .= ', ' . $this->shipping_state;
        }
        $address .= ' ' . $this->shipping_postal_code . ', ' . $this->shipping_country;
        return $address;
    }

    /**
     * Get formatted billing address
     */
    public function getFormattedBillingAddressAttribute(): string
    {
        $address = $this->billing_address . ', ' . $this->billing_city;
        if ($this->billing_state) {
            $address .= ', ' . $this->billing_state;
        }
        $address .= ' ' . $this->billing_postal_code . ', ' . $this->billing_country;
        return $address;
    }

    /**
     * Check if payment is completed
     */
    public function isPaymentCompleted(): bool
    {
        return $this->payment_status === 'completed';
    }

    /**
     * Check if payment is pending
     */
    public function isPaymentPending(): bool
    {
        return $this->payment_status === 'pending';
    }

    /**
     * Check if payment failed
     */
    public function isPaymentFailed(): bool
    {
        return $this->payment_status === 'failed';
    }

    /**
     * Get masked card number for display
     */
    public function getMaskedCardNumberAttribute(): string
    {
        if ($this->card_last_four) {
            return '**** **** **** ' . $this->card_last_four;
        }
        return 'Card not saved';
    }
}
