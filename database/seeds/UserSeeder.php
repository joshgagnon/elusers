<?php

use App\EmergencyContact;
use App\Organisation;
use App\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $evolutionLawyers = Organisation::where('legal_name', 'Evolution Lawyers Limited')->first();

        $thomas = User::create([
            'title' => 'Mr',
            'first_name' => 'Thomas',
            'middle_name' => 'David',
            'surname' => 'Bloy',
            'preferred_name' => 'Tom',
            'email' => 'thomas@evolutionlawyers.nz',
            'password' => Hash::make('password'),
            'organisation_id' => $evolutionLawyers->id,
            'law_admission_date' => '30 Sep 2011',
            'ird_number' => '07441122',
            'bank_account_number' => '0905219955005000',
        ]);

        $thomas->emergencyContact()->create(['name' => 'Sophie Bloy', 'email' => 'sophie@evolutionlawyers.nz', 'phone' => '02102439766']);

        $thomas->addresses()->create([
            'address_type' => 'Physical Address',
            'address_name' => 'Office Address',
            'address_one' => '19 Halberg Street',
            'address_two' => 'Glenfield',
            'address_three' => 'Auckland',
            'address_type' => 'physical_address',
            'post_code' => '0629',
            'country_code' => 'NZ',
        ]);

        $thomas->addresses()->create([
            'address_type' => 'Physical Address',
            'address_name' => 'Postal Address',
            'address_one' => '110 Harbour Terrace',
            'address_two' => 'North Dunedin',
            'address_three' => 'Dunedin',
            'address_type' => 'physical_address',
            'post_code' => '9016',
            'country_code' => 'NZ',
        ]);

        $tamina = User::create([
            'title' => 'Ms',
            'first_name' => 'Tamina',
            'middle_name' => 'Kelly',
            'surname' => 'Cunningham-Adams',
            'email' => 'tamina@evolutionlawyers.nz',
            'password' => Hash::make('password'),
            'organisation_id' => $evolutionLawyers->id,
        ]);

        $tamina->emergencyContact()->create(['name' => 'John Williamson', 'email' => 'john@williamson.com', 'phone' => '0211515850']);

        $paddy = User::create([
            'title' => 'Mr',
            'first_name' => 'Patrick',
            'middle_name' => 'Daniel',
            'surname' => 'Moran',
            'email' => 'paddy@catalex.nz',
            'preferred_name' => 'Paddy',
            'password' => Hash::make('password'),
            'organisation_id' => $evolutionLawyers->id,
        ]);

        $paddy->emergencyContact()->create(['name' => 'Terry Wilson', 'email' => 'terry@wilson.com', 'phone' => '0204458477']);

        $josh = User::create([
            'title' => 'Mr',
            'first_name' => 'Joshua',
            'middle_name' => 'Normand',
            'surname' => 'Gagnon',
            'email' => 'josh@catalex.nz',
            'preferred_name' => 'Josh',
            'password' => Hash::make('password'),
            'organisation_id' => $evolutionLawyers->id,
        ]);

        $paddy->emergencyContact()->create(['name' => 'Kiri Pullar', 'email' => 'kiri@pullar.com', 'phone' => '0200050044']);

        $sarah = User::create([
            'title' => 'Ms',
            'first_name' => 'Sarah',
            'surname' => 'Thompson',
            'email' => 'me@no-middle-name.nz',
            'password' => Hash::make('password'),
            'organisation_id' => $evolutionLawyers->id,
        ]);

        $sarah->emergencyContact()->create(['name' => 'John Cena', 'email' => 'john@cena.com', 'phone' => '0274258876']);
    }
}
