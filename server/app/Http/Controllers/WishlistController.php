<?php

namespace App\Http\Controllers;

use App\Models\Wishlist;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * @OA\Tag(
 *     name="Wishlist",
 *     description="API Endpoints for Wishlist management"
 * )
 */
class WishlistController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/wishlist",
     *     summary="Get user's wishlist",
     *     description="Retrieve all items in the authenticated user's wishlist",
     *     tags={"Wishlist"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Wishlist retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Wishlist retrieved successfully"),
     *             @OA\Property(property="wishlist", type="array", @OA\Items(type="object"))
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Internal server error",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="error", type="string", example="Failed to retrieve wishlist"),
     *             @OA\Property(property="message", type="string", example="Internal Server Error")
     *         )
     *     )
     * )
     */
    public function index()
    {
        try {
            $user = auth()->user();
            $wishlist = Wishlist::getUserWishlist($user->id);

            return response()->json([
                'success' => true,
                'message' => 'Wishlist retrieved successfully',
                'wishlist' => $wishlist
            ], 200);
        } catch (Exception $e) {
            Log::error('Wishlist retrieval error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to retrieve wishlist',
                'message' => config('app.debug') ? $e->getMessage() : 'Internal Server Error'
            ], 500);
        }
    }

    /**
     * @OA\Post(
     *     path="/api/wishlist/add",
     *     summary="Add product to wishlist",
     *     description="Add a product to the authenticated user's wishlist",
     *     tags={"Wishlist"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"product_id"},
     *             @OA\Property(property="product_id", type="integer", example=1, description="Product ID")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Product added to wishlist successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Product added to wishlist successfully")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="error", type="string", example="Validation failed"),
     *             @OA\Property(property="message", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Internal server error",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="error", type="string", example="Failed to add product to wishlist"),
     *             @OA\Property(property="message", type="string", example="Internal Server Error")
     *         )
     *     )
     * )
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'product_id' => 'required|integer|exists:products,id',
            ]);

            $user = auth()->user();
            Wishlist::addToWishlist($user->id, $request->product_id);

            return response()->json([
                'success' => true,
                'message' => 'Product added to wishlist successfully'
            ], 201);
        } catch (Exception $e) {
            Log::error('Add to wishlist error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to add product to wishlist',
                'message' => config('app.debug') ? $e->getMessage() : 'Internal Server Error'
            ], 500);
        }
    }

    /**
     * @OA\Delete(
     *     path="/api/wishlist/remove/{productId}",
     *     summary="Remove product from wishlist",
     *     description="Remove a product from the authenticated user's wishlist",
     *     tags={"Wishlist"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="productId",
     *         in="path",
     *         required=true,
     *         description="Product ID",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Product removed from wishlist successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Product removed from wishlist successfully")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Internal server error",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="error", type="string", example="Failed to remove product from wishlist"),
     *             @OA\Property(property="message", type="string", example="Internal Server Error")
     *         )
     *     )
     * )
     */
    public function destroy($productId)
    {
        try {
            $user = auth()->user();
            Wishlist::removeFromWishlist($user->id, $productId);

            return response()->json([
                'success' => true,
                'message' => 'Product removed from wishlist successfully'
            ], 200);
        } catch (Exception $e) {
            Log::error('Remove from wishlist error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to remove product from wishlist',
                'message' => config('app.debug') ? $e->getMessage() : 'Internal Server Error'
            ], 500);
        }
    }

    /**
     * @OA\Delete(
     *     path="/api/wishlist/clear",
     *     summary="Clear user's wishlist",
     *     description="Remove all items from the authenticated user's wishlist",
     *     tags={"Wishlist"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Wishlist cleared successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Wishlist cleared successfully")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Internal server error",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="error", type="string", example="Failed to clear wishlist"),
     *             @OA\Property(property="message", type="string", example="Internal Server Error")
     *         )
     *     )
     * )
     */
    public function clear()
    {
        try {
            $user = auth()->user();
            Wishlist::clearWishlist($user->id);

            return response()->json([
                'success' => true,
                'message' => 'Wishlist cleared successfully'
            ], 200);
        } catch (Exception $e) {
            Log::error('Clear wishlist error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to clear wishlist',
                'message' => config('app.debug') ? $e->getMessage() : 'Internal Server Error'
            ], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/api/wishlist/count",
     *     summary="Get wishlist count",
     *     description="Get the number of items in the authenticated user's wishlist",
     *     tags={"Wishlist"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Wishlist count retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="count", type="integer", example=5)
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Internal server error",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="error", type="string", example="Failed to get wishlist count"),
     *             @OA\Property(property="message", type="string", example="Internal Server Error")
     *         )
     *     )
     * )
     */
    public function count()
    {
        try {
            $user = auth()->user();
            $count = Wishlist::getWishlistCount($user->id);

            return response()->json([
                'success' => true,
                'count' => $count
            ], 200);
        } catch (Exception $e) {
            Log::error('Get wishlist count error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to get wishlist count',
                'message' => config('app.debug') ? $e->getMessage() : 'Internal Server Error'
            ], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/api/wishlist/check/{productId}",
     *     summary="Check if product is in wishlist",
     *     description="Check if a product is in the authenticated user's wishlist",
     *     tags={"Wishlist"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="productId",
     *         in="path",
     *         required=true,
     *         description="Product ID",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Check completed successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="in_wishlist", type="boolean", example=true)
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Internal server error",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="error", type="string", example="Failed to check wishlist status"),
     *             @OA\Property(property="message", type="string", example="Internal Server Error")
     *         )
     *     )
     * )
     */
    public function check($productId)
    {
        try {
            $user = auth()->user();
            $inWishlist = Wishlist::isInWishlist($user->id, $productId);

            return response()->json([
                'success' => true,
                'in_wishlist' => $inWishlist
            ], 200);
        } catch (Exception $e) {
            Log::error('Check wishlist status error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to check wishlist status',
                'message' => config('app.debug') ? $e->getMessage() : 'Internal Server Error'
            ], 500);
        }
    }
}
