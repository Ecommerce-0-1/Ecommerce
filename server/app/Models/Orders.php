<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Orders extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'orders';
    protected $fillable = [
        'user_id',
        'total_amount',
        'billing_id',
        'status',
        'order_date',
    ];

    public function users(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function billing(): BelongsTo
    {
        return $this->belongsTo(Billing::class);
    }

    public function order_items(): HasMany
    {
        return $this->hasMany(Order_Items::class, 'order_id');
    }

    public function AddItems(array $items)
    {
        $total = 0;

        foreach ($items as $item) {
            $product = Products::findOrFail($item['product_id']);
            $subtotal = $product->price * $item['quantity'];

            $this->order_items()->create([
                'product_id' => $product->id,
                'qty' => $item['quantity'],
                'price' => $product->price,
            ]);

            $total += $subtotal;
        }
        return $total;
    }

    protected static function GetAllOrders()
    {
        return self::with(['order_items.products', 'users', 'billing'])->latest()->get();
    }

    protected static function GetOrderByID($id)
    {
        return self::with(['order_items.products', 'users', 'billing'])->findOrFail($id);
    }

    protected static function GetOrdersByUser($userId)
    {
        return self::with(['order_items.products', 'billing'])
            ->where('user_id', $userId)
            ->latest()
            ->get();
    }

    protected static function GetOrdersByStatus($status)
    {
        return self::with(['order_items.products', 'users', 'billing'])
            ->where('status', $status)
            ->latest()
            ->get();
    }

    protected static function UpdateOrderStatus($orderId, $status)
    {
        $order = self::findOrFail($orderId);
        $order->update(['status' => $status]);
        return $order;
    }

    protected static function GetOrderStats()
    {
        return [
            'total_orders' => self::count(),
            'pending_orders' => self::where('status', 'pending')->count(),
            'completed_orders' => self::where('status', 'completed')->count(),
            'rejected_orders' => self::where('status', 'rejected')->count(),
            'total_revenue' => self::where('status', 'completed')->sum('total_amount'),
        ];
    }
}
