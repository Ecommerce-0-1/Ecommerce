<?php

namespace App\Models;

use Exception;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Categories extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'categories';
    protected $fillable = [
        'category',
    ];

    public function products(): HasMany
    {
        return $this->hasMany(Products::class);
    }

    protected static function CreateCategory($category)
    {
        try {
            return self::create($category);
        } catch (Exception $e) {
            throw $e;
        }
    }

    protected static function GetCategories()
    {
        try {
            return self::all();
        } catch (Exception $e) {
            throw $e;
        }
    }

    protected static function GetCategoryById($id)
    {
        try {
            return self::findorfail($id);
        } catch (Exception $e) {
            throw $e;
        }
    }

    protected static function UpdateCategory($id, $data)
    {
        try {
            $category = self::findorfail($id);
            $category->update($data);
            return $category;
        } catch (Exception $e) {
            throw $e;
        }
    }

    protected static function DeleteCategory($id)
    {
        try {
            return self::findorfail($id)
                ->delete();
        } catch (Exception $e) {
            throw $e;
        }
    }
}
