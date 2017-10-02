<?php

use App\OfficeLocation;
use Illuminate\Database\Seeder;

class OfficeLocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        OfficeLocation::create(['name' => 'Silverdale']);
        OfficeLocation::create(['name' => 'Sandringham']);
    }
}
