<?php

namespace App\Console\Commands;

use App\Models\Best_Selling_Products;
use App\Models\Products;
use Carbon\Carbon;
use Illuminate\Console\Command;

class SnapshotBestPorudctSellers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'best-sellers:snapshot {--top=10}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Take a snapshot of top-selling products for the previous month';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $top = $this->option('top') ?? 10;

        $topProducts = Products::orderByDesc('units_sold')
            ->take($top)
            ->get();

        $month = Carbon::now()->startOfMonth()->toDateString(); 
        // $month = Carbon::now()->addMonth()->startOfMonth()->toDateString(); // Simulate next month


        foreach ($topProducts as $product) {
            Best_Selling_Products::firstOrCreate([
                'product_id' => $product->id,
                'month' => $month,
            ]);
        }

        $this->info("Top {$top} best-selling products snapshot saved for {$month}.");
    }
}
