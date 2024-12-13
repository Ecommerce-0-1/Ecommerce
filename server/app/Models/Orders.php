<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Orders extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'orders';
    protected $fillable = [
        'name',
        'email',
    ];

    public function users()
    {
        return $this->belongsTo(User::class);
    }

    public function billing()
    {
        return $this->belongsTo(Billing::class);
    }

    public function order_items()
    {
        return $this->hasOne(Order_Items::class);
    }
}
