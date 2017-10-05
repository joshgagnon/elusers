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
        OfficeLocation::create(['name' => 'Silverdale', 'organisation_id' => 2]);
        OfficeLocation::create(['name' => 'Sandringham', 'organisation_id' => 1]);
    }
}
