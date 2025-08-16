<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Billing;

class BillingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Billing::create([
            'company_name' => 'Test Company 1',
            'address' => '123 Main Street',
            'floor' => '1st Floor',
            'city' => 'New York',
            'phone' => 1234567890,
            'email' => 'test1@example.com',
        ]);

        Billing::create([
            'company_name' => 'Test Company 2',
            'address' => '456 Oak Avenue',
            'floor' => '2nd Floor',
            'city' => 'Los Angeles',
            'phone' => 9876543210,
            'email' => 'test2@example.com',
        ]);

        Billing::create([
            'company_name' => 'Test Company 3',
            'address' => '789 Pine Street',
            'floor' => '3rd Floor',
            'city' => 'Chicago',
            'phone' => 5551234567,
            'email' => 'test3@example.com',
        ]);
    }
}
