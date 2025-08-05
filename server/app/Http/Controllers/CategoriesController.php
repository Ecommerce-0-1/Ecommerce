<?php

namespace App\Http\Controllers;

use App\Models\Categories;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

/**
 * @OA\Tag(
 *     name="Categories",
 *     description="API Endpoints for Category management"
 * )
 */
class CategoriesController extends Controller
{
    function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'category' => 'required|string|min:3|max:50|unique:categories,category'
            ]);

            $category = Categories::CreateCategory($validated);

            return response()->json([
                'success' => true,
                'message' => 'Category created successfully',
                'category' => $category
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Validation Error',
                'message' => $e->errors()
            ], 422);
        } catch (Exception $e) {
            Log::error('Category creation error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to create category',
                'message' => config('app.debug') ? $e->getMessage() : 'Internal Server Error'
            ], 500);
        }
    }

    function index()
    {
        try {
            $categories = Categories::GetCategories();

            return response()->json([
                'success' => true,
                'message' => 'Categories retrieved successfully',
                'categories' => $categories
            ], 200);
        } catch (Exception $e) {
            Log::error('Categories retrieval error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to retrieve categories',
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

            $category = Categories::GetCategoryById($id);

            return response()->json([
                'success' => true,
                'message' => 'Category retrieved By ID successfully',
                'category' => $category
            ], 200);
        } catch (Exception $e) {
            Log::error('Category retrieval by id error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to retrieve category by id',
                'message' => config('app.debug') ? $e->getMessage() : 'Internal Server Error'
            ], 500);
        }
    }

    function update(Request $request, $id)
    {
        try {
            validator(['id' => $id], [
                'id' => 'required|integer|exists:categories,id'
            ])->validate();

            $validated = $request->validate([
                'category' => 'required|string|min:3|max:50'
            ]);

            $updatedData = $validated;
            $view = Categories::UpdateCategory($id, $updatedData);

            return response()->json([
                'success' => true,
                'message' => 'Category Updated successfully',
                'category' => $view
            ], 200);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Validation Error',
                'message' => $e->errors()
            ], 422);
        } catch (Exception $e) {
            Log::error('Category Update error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to Update category',
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

            $category = Categories::DeleteCategory($id);

            return response()->json([
                'success' => true,
                'message' => 'Category deleted successfully',
                'category' => $category
            ], 200);
        } catch (Exception $e) {
            Log::error('Category delete error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to delete category',
                'message' => config('app.debug') ? $e->getMessage() : 'Internal Server Error'
            ], 500);
        }
    }
}
