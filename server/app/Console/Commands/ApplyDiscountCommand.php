<?php

namespace App\Console\Commands;

use App\Models\Products;
use Illuminate\Console\Command;

class ApplyDiscountCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'discount:apply';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Apply discounts to products based on predefined logic';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        (new Products)->ApplyDiscount();

        $this->info('Discounts applied successfully.');

        return 0;
    }
}
