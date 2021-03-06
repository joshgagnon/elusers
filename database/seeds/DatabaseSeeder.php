<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->call(OrganisationSeeder::class);
        $this->call(UserSeeder::class);

        $this->call(ContactSeeder::class);
        $this->call(OfficeLocationSeeder::class);
        $this->call(DeedPacketSeeder::class);

        $this->call(ProfessionalDevelopmentRecordSeeder::class);
    }
}
