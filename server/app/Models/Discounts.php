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
    protected $fillable = ['product_id', 'discount_percentage', 'final_price'];

    public function products(): BelongsTo
    {
        return $this->belongsTo(Products::class, 'product_id');
    }
}
