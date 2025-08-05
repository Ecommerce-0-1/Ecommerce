<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Best_Selling_Products extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'best_selling_products';
    protected $fillable = [
        'month',
        'product_id',
    ];

    public function products(): BelongsTo
    {
        return $this->belongsTo(Products::class, 'product_id');
    }

    protected static function GetBestSellingProducts()
    {
        return self::with('products')->get();
    }

    protected static function GetBestSellingProductById($id)
    {
        return self::with('products')->findOrFail($id);
    }

    protected static function GetBestSellingProductsByMonth($month = null)
    {
        $month = $month ?? Carbon::now()->startOfMonth()->toDateString();

        return self::with('products')->where('month', $month)->get();
    }
}
