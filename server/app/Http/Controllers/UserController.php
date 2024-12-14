<?php

namespace App\Http\Controllers;

use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    protected $firebaseUpload;

    public function __construct()
    {
        $this->firebaseUpload = app('firebase.upload');
    }

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
