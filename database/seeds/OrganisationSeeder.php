<?php

use App\Organisation;
use Illuminate\Database\Seeder;

class OrganisationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Organisation::create([
            'legal_name' => 'Evolution Lawyers Limited',
            'trading_name' => 'Evolution Lawyers',
        ]);
    }
}
