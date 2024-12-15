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
        'name',
        'email',
    ];

    public function products(): BelongsTo
    {
        return $this->belongsTo(Products::class);
    }

    public function orders(): BelongsTo
    {
        return $this->belongsTo(Orders::class);
    }
}
