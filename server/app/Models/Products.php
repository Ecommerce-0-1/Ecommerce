<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Products extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'products';
    protected $fillable = [
        'name',
        'email',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Categories::class);
    }

    public function discount(): HasOne
    {
        return $this->hasOne(Discounts::class);
    }

    public function best_selling(): HasOne
    {
        return $this->hasOne(Best_Selling_Products::class);
    }

    public function order_items(): HasMany
    {
        return $this->hasMany(Order_Items::class);
    }
}
