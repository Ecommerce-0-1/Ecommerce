<?php

namespace App\Http\Controllers;

use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
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
}
