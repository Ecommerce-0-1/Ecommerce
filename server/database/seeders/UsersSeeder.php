<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Ehab',
            'role_id' => 1, // role_id 1 is for admin
            'email' => 'ehab@gmail.com',
            'password' => Hash::make('ASas@@1234'),
            'phone' => '0000',
            'img' => 'https://www.pngall.com/wp-content/uploads/5/Profile-PNG-File.png',
        ]);

        User::factory(10)->create();
    }
}
