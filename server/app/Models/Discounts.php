<?php

namespace App\Models;

use Exception;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Discounts extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'discounts';
    protected $fillable = ['discount_percentage', 'final_price'];

    public function products(): BelongsTo
    {
        return $this->belongsTo(Products::class, 'product_id');
    }

    protected static function GetDiscountedProducts()
    {
        try {
            $DiscountedProducts = self::with('products')->get();

            return $DiscountedProducts;
        } catch (Exception $e) {
            throw $e;
        }
    }

    protected static function GetDiscountById($id)
    {
        try {
            $discount = self::with('products')->findOrFail($id);
            return $discount;
        } catch (Exception $e) {
            throw $e;
        }
    }

    protected static function UpdateDiscount($id, $data)
    {
        try {
            $discount = self::findorfail($id);

            $discount->update($data);

            return $discount;
        } catch (Exception $e) {
            throw $e;
        }
    }

    protected static function DeleteDiscount($id)
    {
        try {
            return self::findorfail($id)->delete();
        } catch (Exception $e) {
            throw $e;
        }
    }
}
