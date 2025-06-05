<?php

namespace App\Http\Controllers;

use App\Models\Products;
use Illuminate\Http\Request;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class ProductsController extends Controller
{
    function store(Request $request)
    {
        try {
            $validateData = $request->validate([
                'name' => 'required|string|max:255|unique:products,name',
                'description' => 'required|string',
                'price' => 'required|numeric',
                'units_sold' => 'nullable|integer|mine:0',
                'category_id' => 'required|exists:categories,id',
                'qty' => 'required|integer',
                'img' => 'required|string',
                'rating' => 'nullable|numeric',
            ]);
            $product = Products::CreateProduct($validateData);

            return response()->json([
                'success' => true,
                'message' => 'Product created successfully',
                'product' => $product,
            ], 201);
        } catch (Exception $e) {
            Log::error('Product creation error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to create Products',
                'message' => config('app.debug') ? $e->getMessage() : 'Internal Server Error'
            ], 500);
        }
    }

    function storeMultiple(Request $request)
    {
        DB::beginTransaction();

        try {
            $validateData = $request->validate([
                'products' => 'required|array',
                'products.*.name' => 'required|string|max:255|unique:products,name',
                'products.*.description' => 'required|string',
                'products.*.price' => 'required|numeric',
                'products.*.units_sold' => 'nullable|integer|min:0',
                'products.*.category_id' => 'required|exists:categories,id',
                'products.*.qty' => 'required|integer',
                'products.*.img' => 'required|string',
                'products.*.rating' => 'nullable|numeric',
            ]);


            $createdProducts = Products::CreateMultipleProducts($validateData['products']);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Products created successfully',
                'products' => $createdProducts,
            ], 201);
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Multiple Products creation error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to create Multiple Products',
                'message' => config('app.debug') ? $e->getMessage() : 'Internal Server Error'
            ], 500);
        }
    }

    function index()
    {
        try {
            $products = Products::GetProducts();

            return response()->json([
                'success' => true,
                'message' => 'Products retrieved successfully',
                'products' => $products
            ], 200);
        } catch (Exception $e) {
            Log::error('Products retrieval error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to retrieve Products',
                'message' => config('app.debug') ? $e->getMessage() : 'Internal Server Error'
            ], 500);
        }
    }

    function show($id)
    {
        try {
            validator(['id' => $id], [
                'id' => 'required|integer|exists:categories,id'
            ])->validate();

            $product = Products::GetProductById($id);
            return response()->json([
                'success' => true,
                'message' => 'Product retrieved By ID successfully',
                'category' => $product
            ], 200);
        } catch (Exception $e) {
            Log::error('Product retrieval by id error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to retrieve Product by id',
                'message' => config('app.debug') ? $e->getMessage() : 'Internal Server Error'
            ], 500);
        }
    }

    function update(Request $request, $id)
    {
        try {
            validator(['id' => $id], [
                'id' => 'required|integer|exists:products,id'
            ])->validate();

            $validateData = $request->validate([
                'name' => 'nullable|string|max:255|unique:products,name',
                'description' => 'nullable|string',
                'price' => 'nullable|numeric',
                'units_sold' => 'nullable|integer|mine:0',
                'category_id' => 'nullable|exists:categories,id',
                'qty' => 'nullable|integer',
                'img' => 'nullable|string',
                'rating' => 'nullable|numeric',
            ]);

            $updatedProduct = Products::UpdateProduct($id, $validateData);
            return response()->json([
                'success' => true,
                'message' => 'Product Updated successfully',
                'product' => $updatedProduct
            ], 200);
        } catch (Exception $e) {
            Log::error('Product Update error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to Update Product',
                'message' => config('app.debug') ? $e->getMessage() : 'Internal Server Error'
            ], 500);
        }
    }

    function destroy($id)
    {
        try {
            validator(['id' => $id], [
                'id' => 'required|integer|exists:categories,id'
            ])->validate();

            Products::DeleteProduct($id);

            return response()->json([
                'success' => true,
                'message' => 'Product deleted successfully',
            ], 200);
        } catch (Exception $e) {
            Log::error('Product delete error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to delete Product',
                'message' => config('app.debug') ? $e->getMessage() : 'Internal Server Error'
            ], 500);
        }
    }
}
