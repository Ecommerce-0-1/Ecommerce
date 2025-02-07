<?php

namespace Database\Seeders;

use App\Models\Categories;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategoriesSeeder extends Seeder
{

    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $categories = [
            ['category' => 'Phones'],
            ['category' => 'Computers'],
            ['category' => 'SmartWatch'],
            ['category' => 'Camera'],
            ['category' => 'HeadPhones'],
            ['category' => 'Gaming'],
        ];

        foreach ($categories as $category) {
            Categories::create($category);
        }

    }
}
