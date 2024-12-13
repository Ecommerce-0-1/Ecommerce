<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Best_Selling_Products extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'best_selling_products';
    protected $fillable = [
        'name',
        'email',
    ];
}
