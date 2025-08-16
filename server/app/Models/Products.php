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
        'units_sold',
        'category_id',
        'qty',
        'img',
        'rating',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Categories::class);
    }

    public function discount()
    {
        return $this->hasOne(Discounts::class, 'product_id');
    }

    public function best_selling(): HasOne
    {
        return $this->hasOne(Best_Selling_Products::class, 'product_id');
    }

    public function order_items(): HasMany
    {
        return $this->hasMany(Order_Items::class);
    }

    // CRUD Operation For Products table
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
            return self::with('category')->findorfail($id);
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
    // End CRUD Operation For Products table

    // Discount Logic for Products
    public function ApplyDiscount()
    {
        Products::chunk(100, function ($products) {
            foreach ($products as $product) {
                $discount = static::CalculateDiscount(
                    $product->price,
                    $product->units_sold,
                    $product->qty
                );
                $this->SaveDiscount($product, $discount);
            }
        });
    }

    public static function CalculateDiscount($price, $unitsSold, $inventory)
    {
        $BaseDiscount = 0;

        // Expensive & High Demand
        if ($price >= 1000) {
            if ($unitsSold >= 500) {
                if ($price <= 2000) {
                    $BaseDiscount = 20;
                } elseif ($price <= 5000) {
                    $BaseDiscount = 25;
                } else {
                    $BaseDiscount = 35;
                }
            }
            // Expensive & Low Demand
            elseif ($unitsSold < 100) {
                if ($price <= 2000 && $unitsSold < 50) {
                    $BaseDiscount = 25;
                } elseif ($price <= 5000 && $unitsSold < 50) {
                    $BaseDiscount = 30;
                } elseif ($price > 5000 && $unitsSold < 100) {
                    $BaseDiscount = 40;
                }
            }
        }

        // Cheap & High Demand
        if ($price < 100 && $unitsSold >= 500) {
            if ($price >= 50) {
                $BaseDiscount = 5;
            } elseif ($price >= 20) {
                $BaseDiscount = 10;
            } else {
                $BaseDiscount = 15;
            }
        }

        // Inventory-Based 
        if ($inventory > 500) {
            $BaseDiscount += 10;
        } elseif ($inventory < 20) {
            $BaseDiscount += 15;
        }

        // Set a maximum discount, between 0% and 70%
        return max(0, min($BaseDiscount, 70));
    }

    public static function SaveDiscount(Products $product, $discountPercentage)
    {
        $discount = $product->discount()->first();

        // Calculate the final price of the product based on the discount
        $OriginalPrice = $product->price;
        $FinalPrice = $OriginalPrice - (($discountPercentage / 100) * $OriginalPrice);

        // If there is a Discount for the product : update it, else : create it
        if ($discount) {
            $discount->update([
                'discount_percentage' => $discountPercentage,
                'final_price'         => $FinalPrice
            ]);
        } else {
            $product->discount()->create([
                'discount_percentage' => $discountPercentage,
                'final_price'         => $FinalPrice
            ]);
        }
    }
    // End discount Logic for Products

}
