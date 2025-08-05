<?php

namespace App\Http\Controllers;

use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

/**
 * @OA\Tag(
 *     name="Authentication",
 *     description="API Endpoints for user authentication and management"
 * )
 */
class UserController extends Controller
{
    protected $firebaseUpload;

    public function __construct()
    {
        $this->firebaseUpload = app('firebase.upload');
    }

    /**
     * @OA\Post(
     *     path="/api/user/register",
     *     summary="Register a new user",
     *     description="Create a new user account",
     *     tags={"Authentication"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name","email","password","phone"},
     *             @OA\Property(property="name", type="string", example="John Doe", description="User's full name"),
     *             @OA\Property(property="email", type="string", format="email", example="john@example.com", description="User's email address"),
     *             @OA\Property(property="password", type="string", example="password123", description="User's password"),
     *             @OA\Property(property="phone", type="string", example="+1234567890", description="User's phone number")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="User registered successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="User Added Successfully"),
     *             @OA\Property(property="access_token", type="string", example="1|abc123...")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Email already exists",
     *         @OA\JsonContent(
     *             @OA\Property(property="error", type="string", example="Email Already Exists")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="errors", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Internal server error",
     *         @OA\JsonContent(
     *             @OA\Property(property="error", type="string", example="Internal Server Error"),
     *             @OA\Property(property="message", type="string")
     *         )
     *     )
     * )
     */
    public function register(Request $req)
    {
        try {
            $validated = $req->validate([
                'name' => 'required|min:3|max:30',
                'email' => 'required|email|min:3|max:40',
                'password' => 'required|min:6|max:30',
                'phone' => 'required|min:6|max:30',
            ]);

            if (User::checkEmail($validated['email'])) {
                return response()->json(['Email Already Exists'], 400);
            }
            $user = User::register($validated);
            $token = $user->createToken('token', ['*'], now()->addHours(6))->plainTextToken;

            return response()->json(['message' => 'User Added Successfully', 'access_token' => $token], 201);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['error' => 'Internal Server Error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * @OA\Post(
     *     path="/api/user/login",
     *     summary="User login",
     *     description="Authenticate user and return access token",
     *     tags={"Authentication"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"email","password"},
     *             @OA\Property(property="email", type="string", format="email", example="john@example.com", description="User's email address"),
     *             @OA\Property(property="password", type="string", example="password123", description="User's password")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Login successful",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Loggedin Successfully"),
     *             @OA\Property(property="access_token", type="string", example="1|abc123...")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Invalid credentials",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Invalid Email or Password")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="errors", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Internal server error",
     *         @OA\JsonContent(
     *             @OA\Property(property="error", type="string", example="Internal Server Error"),
     *             @OA\Property(property="message", type="string")
     *         )
     *     )
     * )
     */
    public function login(Request $req)
    {
        try {
            $validated = $req->validate([
                'email' => 'required|email|min:3|max:40',
                'password' => 'required|min:6|max:30',
            ]);

            $user = User::checkEmail($validated['email']);
            if (!$user || !User::checkPassword($validated['password'], $user->password)) {
                return response()->json(['message' => 'Invalid Email or Password'], 400);
            }

            $user->tokens->each->delete();
            $token = $user->createToken('token', ['*'], now()->addHours(6))->plainTextToken;

            return response()->json(['message' => 'Loggedin Successfully', 'access_token' => $token], 200);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['error' => 'Internal Server Error', 'message' => $e->getMessage()], 500);
        }
    }

    public function GoogleLogin(Request $req)
    {
        try {
            $user = User::checkEmail($req->email);
            if ($user) {
                $user->tokens->each->delete();
                $token = $user->createToken('token', ['*'], now()->addHours(6))->plainTextToken;
                return response()->json(['message' => 'Loggedin Successfully', 'access_token' => $token], 200);
            } else {
                $register = User::GoogleLogin(['name' => $req->name, 'email' => $req->email, 'img' => $req->picture]);
                $token = $register->createToken('token', ['*'], now()->addHours(6))->plainTextToken;
                return response()->json(['message' => 'User Added Successfully', 'access_token' => $token], 201);
            }
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['error' => 'Internal Server Error', 'message' => $e->getMessage()], 500);
        }
    }

    public function show()
    {
        try {
            $user = Auth::user();
            return User::show($user->id);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['error' => 'Internal Server Error', 'message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $req)
    {
        try {
            $user = Auth::user();
            $validated = $req->validate([
                'name' => 'min:3|max:30',
                'email' => 'email|min:3|max:40',
                'phone' => 'min:6|max:30',
            ]);
            $updateData = $validated;

            if ($req->hasFile('img')) {
                $img = $this->firebaseUpload->upload($req->file('img'));
                $updateData['img'] = $img;
            }
            $view = User::UpdateUser($user->id, $updateData);

            return response()->json(['message' => 'User Updated Successfully', 'view' => $view], 200);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['error' => 'Internal Server Error', 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy()
    {
        try {
            $user = Auth::user();
            if ($user) {
                User::DeleteUser($user->id);
                return response()->json(['message' => 'User Deleted Successfully'], 200);
            } else {
                return response()->json(['message' => 'Unauthorized'], 401);
            }
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['error' => 'Internal Server Error', 'message' => $e->getMessage()], 500);
        }
    }
}
