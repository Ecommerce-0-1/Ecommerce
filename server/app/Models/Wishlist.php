<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Wishlist extends Model
{
    use HasFactory;

    protected $table = 'wishlists';

    protected $fillable = [
        'user_id',
        'product_id',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user that owns the wishlist item
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the product in the wishlist
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Products::class, 'product_id');
    }

    /**
     * Check if a product is in user's wishlist
     */
    public static function isInWishlist($userId, $productId): bool
    {
        return self::where('user_id', $userId)
            ->where('product_id', $productId)
            ->exists();
    }

    /**
     * Get user's wishlist items
     */
    public static function getUserWishlist($userId)
    {
        return self::with('product.category')
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Add product to wishlist
     */
    public static function addToWishlist($userId, $productId)
    {
        // Check if already in wishlist
        if (self::isInWishlist($userId, $productId)) {
            throw new \Exception('Product is already in wishlist');
        }

        return self::create([
            'user_id' => $userId,
            'product_id' => $productId,
        ]);
    }

    /**
     * Remove product from wishlist
     */
    public static function removeFromWishlist($userId, $productId)
    {
        return self::where('user_id', $userId)
            ->where('product_id', $productId)
            ->delete();
    }

    /**
     * Clear user's wishlist
     */
    public static function clearWishlist($userId)
    {
        return self::where('user_id', $userId)->delete();
    }

    /**
     * Get wishlist count for user
     */
    public static function getWishlistCount($userId): int
    {
        return self::where('user_id', $userId)->count();
    }
}
