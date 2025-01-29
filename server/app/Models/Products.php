<?php

namespace App\Models;

use Exception;
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
        'description',
        'price',
        'category_id',
        'qty',
        'img',
        'rating',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Categories::class);
    }

    protected static function CreateProduct($product)
    {
        try {
            return self::create($product);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public static function CreateMultipleProducts(array $products)
    {
        try {
            foreach ($products as &$product) {
                $product['created_at'] = now();
                $product['updated_at'] = now();
            }
            self::insert($products);
            
            $names = array_column($products, 'name');
        
            return self::whereIn('name', $names)->get();
        } catch (Exception $e) {
            throw $e;
        }
    }

    protected static function GetProducts()
    {
        try {
            return self::with('category')->get();
        } catch (Exception $e) {
            throw $e;
        }
    }

    protected static function GetProductById($id)
    {
        try {
            return self::findorfail($id);
        } catch (Exception $e) {
            throw $e;
        }
    }

    protected static function UpdateProduct($id, $data)
    {
        try {
            $product = self::findorfail($id);
            $product->update($data);
            return $product;
        } catch (Exception $e) {
            throw $e;
        }
    }

    protected static function DeleteProduct($id)
    {
        try {
            return self::findorfail($id)->delete();
        } catch (Exception $e) {
            throw $e;
        }
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
