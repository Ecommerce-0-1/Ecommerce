<?php

namespace App\Models;

use Exception;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $table = 'users';
    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
        'phone',
        'img',
        'email_verified_at',
    ];

    protected static function checkEmail($email)
    {
        try {
            return self::where('email', $email)
                ->first();
        } catch (Exception $e) {
            throw $e;
        }
    }

    protected static function checkPassword($pass, $hashedpass)
    {
        try {
            return Hash::check($pass, $hashedpass);
        } catch (Exception $e) {
            throw $e;
        }
    }

    protected static function register($user)
    {
        try {
            return self::create($user);
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];
}
