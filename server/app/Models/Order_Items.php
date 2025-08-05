<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order_Items extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'order_items';
    protected $fillable = [
        'order_id',
        'product_id',
        'qty',
        'price'
    ];

    public function products(): BelongsTo
    {
        return $this->belongsTo(Products::class, 'product_id');
    }

    public function orders(): BelongsTo
    {
        return $this->belongsTo(Orders::class, 'order_id');
    }

    protected static function GetOrderByID($id)
    {
        return self::with(['products', 'orders'])->where('order_id', $id)->get();
    }

    protected static function GetOrderItemByID($id)
    {
        return self::with(['products', 'orders'])->findOrFail($id);
    }

    protected static function GetAllOrderItems()
    {
        return self::with(['products', 'orders'])->latest()->get();
    }

    protected static function GetOrderItemsByUser($userId)
    {
        return self::with(['products', 'orders'])
            ->whereHas('orders', function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })
            ->latest()
            ->get();
    }
}
